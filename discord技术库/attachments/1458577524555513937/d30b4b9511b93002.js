//Service Worker
const whitelist = ['sexyai.top'];
let fingerprint = null;
self.addEventListener('message', (event) => {
  if (event.data.type === 'SET_FINGERPRINT') {
    fingerprint = event.data.fingerprint;
  }
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (whitelist.some(domain => url.hostname.endsWith(domain))) {
    const headers = new Headers(event.request.headers);
    if (fingerprint)  headers.set('X-Fingerprint', fingerprint);
    const newRequest = new Request(event.request, {
      headers,
      credentials: 'include'
    });
    event.respondWith(fetch(newRequest));
  } else event.respondWith(fetch(event.request));
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

//主要功能
async function generateFingerprint() {
  const data = [
    navigator.userAgent,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.hardwareConcurrency,
    navigator.deviceMemory,
    navigator.maxTouchPoints,
    navigator.platform
  ].join('|');
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function init() {
  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  const fingerprint = await generateFingerprint();
  registration.active.postMessage({ type: 'SET_FINGERPRINT', fingerprint });
}

init();

//后端登录接口
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const fingerprint = req.headers['x-fingerprint'];
  const jwt = signJwt({ userId: user.id, fingerprint });
  res.setHeader('Set-Cookie', [
    `token=${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
    `fp=${fingerprint}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`
  ]);
  res.json({ success: true, user: { id: user.id, name: user.name } });
});

//后端中间件
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  const storedFp = req.cookies.fp;
  const currentFp = req.headers['x-fingerprint'];
  if (!token) return res.status(401).json({ error: 'no_token' });
  let payload;
  try {
    payload = verifyJwt(token);
  } catch (e) {
    res.clearCookie('token');
    res.clearCookie('fp');
    return res.status(401).json({ error: 'invalid_token' });
  }
  if (storedFp !== currentFp || payload.fingerprint !== currentFp) {
    res.clearCookie('token');
    res.clearCookie('fp');
    notifyUser(payload.userId, { type: 'security_alert', message: '异常设备登录已拦截', fingerprint: currentFp });
    return res.status(403).json({ error: 'fingerprint_mismatch' });
  }
  req.user = payload;
  next();
}

