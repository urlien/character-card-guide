// ==UserScript==
// @name         GC的小玩具，桀桀桀！
// @namespace    gc-local
// @version      0.1.0
// @description  全自动丢答辩脚本
// @author       GC
// @match        https://discord.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const GC_NAMES = [];

  const GC_IDS = [];

  const GC_RULES = [
    { emoji: '👀', test: (m) => GC_byName(m, GC_NAMES) },
  ];

  const GC_SKIP_SELF = true;
  const GC_SKIP_BOTS = false;
  const GC_ONLY_NEW = true;
  const GC_GAP_MS = 800;
  const GC_PENDING_MS = 1500;
  const GC_DEBUG = true;

  const GC_TAG = '[GC-react]';
  const GC_SEL = 'li[id^="chat-messages-"]';

  function GC_norm(value) {
    return String(value == null ? '' : value)
      .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
      .replace(/　/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  function GC_byName(msg, list) {
    if (!list || !list.length) return false;
    const author = GC_norm(msg.author);
    if (!author) return false;
    return list.some((name) => {
      const needle = GC_norm(name);
      return !!needle && author.indexOf(needle) !== -1;
    });
  }

  function GC_byExactName(msg, list) {
    if (!list || !list.length) return false;
    const author = GC_norm(msg.author);
    return !!author && list.some((name) => GC_norm(name) === author);
  }

  function GC_byId(msg, list) {
    return !!msg.authorId && !!list && list.indexOf(msg.authorId) !== -1;
  }

  function GC_checkRules() {
    for (const rule of GC_RULES) {
      const e = rule.emoji;
      if (/^:.*:$/.test(e)) {
        console.error(GC_TAG, 'bad emoji, shortcode not accepted:', e);
      } else if (/:/.test(e) && !/^[\w~]+:\d{17,20}$/.test(e)) {
        console.error(GC_TAG, 'bad custom emoji, expected "name:id":', e);
      }
    }
  }

  let GC_token = null;
  let GC_myId = null;
  const GC_fetch = window.fetch;

  const GC_origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
    if (!GC_token && String(key).toLowerCase() === 'authorization') {
      GC_token = value;
      GC_initIdentity();
    }
    return GC_origSetHeader.apply(this, arguments);
  };

  window.fetch = function (input, init) {
    try {
      const headers = new Headers((init && init.headers) || (input && input.headers) || {});
      const auth = headers.get('authorization');
      if (!GC_token && auth) {
        GC_token = auth;
        GC_initIdentity();
      }
    } catch (err) {
      void err;
    }
    return GC_fetch.apply(this, arguments);
  };

  async function GC_initIdentity() {
    if (GC_myId) return;
    try {
      const res = await GC_fetch('/api/v9/users/@me', { headers: { authorization: GC_token } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      GC_myId = (await res.json()).id;
      console.log(GC_TAG, 'identity resolved, user id =', GC_myId);
    } catch (err) {
      console.warn(GC_TAG, 'identity lookup failed:', err.message);
    }
  }

  const GC_queue = [];
  let GC_draining = false;
  const GC_sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function GC_enqueue(job) {
    GC_queue.push(job);
    if (!GC_draining) GC_drain();
  }

  async function GC_drain() {
    GC_draining = true;
    while (GC_queue.length) {
      try {
        await GC_queue.shift()();
      } catch (err) {
        console.warn(GC_TAG, err.message);
      }
      await GC_sleep(GC_GAP_MS);
    }
    GC_draining = false;
  }

  async function GC_react(channelId, messageId, emoji, author) {
    if (!GC_token) throw new Error('no token yet, switch channels once');
    const path = '/api/v9/channels/' + channelId + '/messages/' + messageId
      + '/reactions/' + encodeURIComponent(emoji) + '/@me';
    const where = ' [' + emoji + ' -> ' + (author || '?') + ' ' + messageId + ']';

    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await GC_fetch(path, { method: 'PUT', headers: { authorization: GC_token } });

      if (res.status === 204) {
        if (GC_DEBUG) console.log(GC_TAG, 'ok', emoji, messageId);
        return;
      }
      if (res.status === 429) {
        const body = await res.json().catch(() => ({ retry_after: 1 }));
        await GC_sleep((body.retry_after || 1) * 1000 + 250);
        continue;
      }
      const detail = await res.text().catch(() => '');
      throw new Error('react failed ' + res.status + where + ' ' + detail);
    }
    throw new Error('retries exhausted' + where);
  }

  const GC_seen = new Set();
  const GC_START_TS = Date.now();

  function GC_snowflakeTime(id) {
    return Number((BigInt(id) >> 22n) + 1420070400000n);
  }

  function GC_readText(root) {
    if (!root) return '';
    const clone = root.cloneNode(true);
    clone.querySelectorAll('img[alt]').forEach((img) => {
      img.replaceWith(document.createTextNode(img.alt));
    });
    return clone.textContent;
  }

  function GC_parse(li) {
    const parts = li.id.split('-');
    const messageId = parts[parts.length - 1];
    if (!/^\d{17,20}$/.test(messageId)) return null;

    let channelId = parts[parts.length - 2];
    if (!/^\d{17,20}$/.test(channelId)) {
      channelId = (location.pathname.match(/\/channels\/[^/]+\/(\d+)/) || [])[1];
    }
    if (!channelId) return null;

    const article = li.querySelector('div[role="article"]');
    const contentEl = li.querySelector('#message-content-' + messageId);

    let author = '';
    let authorId = null;
    let isBot = false;
    let node = li;
    while (node && !(author && authorId)) {
      if (!author) {
        const nameEl = node.querySelector('[id^="message-username-"] [data-text]');
        if (nameEl) {
          author = nameEl.dataset.text;
          isBot = !!node.querySelector('[class*="botTag"]');
        }
      }
      if (!authorId) {
        const avatar = node.querySelector('img[class*="avatar"]');
        const found = avatar && avatar.src.match(/\/avatars\/(\d+)\//);
        if (found) authorId = found[1];
      }
      node = node.previousElementSibling;
    }

    return {
      id: messageId,
      channelId: channelId,
      author: author,
      authorId: authorId,
      content: GC_readText(contentEl),
      el: li,
      isReply: !!article && /\bhasReply/.test(article.className),
      mentionsMe: !!article && /\bmentioned[_-]/.test(article.className),
      isSelf: !!GC_myId && !!authorId && authorId === GC_myId,
      isBot: isBot,
    };
  }

  function GC_handle(li) {
    if (!li.id || GC_seen.has(li.id)) return;
    GC_seen.add(li.id);

    const msg = GC_parse(li);
    if (!msg) return;
    if (GC_ONLY_NEW && GC_snowflakeTime(msg.id) < GC_START_TS) return;
    if (GC_SKIP_SELF && msg.isSelf) return;
    if (GC_SKIP_BOTS && msg.isBot) return;

    if (GC_DEBUG) {
      console.log(GC_TAG, 'seen', {
        author: msg.author,
        authorId: msg.authorId,
        isBot: msg.isBot,
        content: msg.content,
      });
    }

    const emojis = [];
    for (const rule of GC_RULES) {
      let hit = false;
      try {
        hit = rule.test(msg);
      } catch (err) {
        console.warn(GC_TAG, 'rule threw', err);
      }
      if (hit && emojis.indexOf(rule.emoji) === -1) emojis.push(rule.emoji);
    }
    if (!emojis.length) return;

    setTimeout(() => {
      if (!document.getElementById(li.id)) {
        if (GC_DEBUG) console.log(GC_TAG, 'dropped optimistic node', msg.id);
        return;
      }
      for (const emoji of emojis) {
        GC_enqueue(() => GC_react(msg.channelId, msg.id, emoji, msg.author));
      }
    }, GC_PENDING_MS);
  }

  function GC_boot() {
    GC_checkRules();
    document.querySelectorAll(GC_SEL).forEach((li) => GC_seen.add(li.id));

    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches(GC_SEL)) GC_handle(node);
          else if (node.querySelectorAll) node.querySelectorAll(GC_SEL).forEach(GC_handle);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });

    console.log(GC_TAG, 'armed');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', GC_boot, { once: true });
  } else {
    GC_boot();
  }
})();
