#!/usr/bin/env node
// 仅在临时目录和模拟 SDK 中运行，不访问平台、不实际发送消息。
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { renderReference } from '../authoring/scripts/generate-reference.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contract = JSON.parse(readFileSync(join(root, 'authoring/contract.json'), 'utf8'));
const temp = mkdtempSync(join(tmpdir(), 'mmd-authoring-'));
const fixture = name => readFileSync(join(root, 'authoring/fixtures', name), 'utf8');
const script = html => html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)[1];
let checks = 0;
function check(name, run) { run(); checks++; console.log(`PASS ${name}`); }
function validate(body) {
  const target = join(temp, 'sample.json');
  writeFileSync(target, JSON.stringify({ chatVersion: 1, pageDepth: 2, statusbar: '', beginning: '', regex_scripts: [{ id: -1, scriptName: '开发示例', findRegex: '{{sample}}', replaceString: body }] }));
  return spawnSync(process.execPath, [join(root, 'scripts/validate.mjs'), target], { encoding: 'utf8' });
}
try {
  check('契约与生成参考一致', () => {
    assert.equal(renderReference(contract), readFileSync(join(root, 'authoring/reference.md'), 'utf8'));
    assert.ok(contract.errors.includes('BUSY'));
    assert.ok(!Object.hasOwn(contract.capabilities, 'vars.get'));
    assert.equal(contract.cssVariables.chrome['--chat-input-text'], '输入框文字');
  });
  check('手册代码与夹具一致', () => {
    const result = spawnSync(process.execPath, [join(root, 'authoring/scripts/inject-fixtures.mjs'), '--check'], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
  check('完整底栏/弹窗样式可通过正则包检查', () => {
    const result = validate(fixture('style-host-theme.html'));
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /未列出主题变量/);
  });
  check('平台变量拼写错误提示且保留作者自定义变量', () => {
    const result = validate('<style>.author-panel{--my-color:pink;color:var(--chat-modla-text);background:var(--my-color)}</style>');
    assert.equal(result.status, 0);
    assert.match(result.stdout, /未列出主题变量 --chat-modla-text/);
    assert.doesNotMatch(result.stdout, /未列出主题变量 --my-color/);
  });
  check('内联样式同样识别已支持的输入框变量', () => {
    const result = validate('<span style="color:var(--chat-input-text)">输入</span>');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /未列出主题变量/);
  });
  check('防重复发送示例可通过正则包检查', () => {
    const result = validate(fixture('sdk-message-send-busy.html'));
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
  const calls = [], logs = [], controls = [];
  let synchronousError = null;
  const context = vm.createContext({ sdk: {
    message: { send(text) {
      if (synchronousError) throw synchronousError;
      calls.push(text);
      return new Promise((resolve, reject) => controls.push({ resolve, reject }));
    } },
    debug: { log(...args) { logs.push(args); } },
  } });
  vm.runInContext(script(fixture('sdk-message-send-busy.html')), context);
  check('发送在点击当次调用，未返回时的连续点击只调用一次', () => {
    vm.runInContext('sendOnce(); sendOnce();', context);
    assert.deepEqual(calls, ['我准备好了']);
  });
  controls[0].reject({ code: 'BUSY' });
  await new Promise(resolve => setImmediate(resolve));
  check('BUSY 拒绝后不自动重发', () => {
    assert.equal(calls.length, 1);
    assert.ok(logs.some(row => row[1] === 'BUSY'));
    assert.equal(context.authorSendPending, false);
  });
  vm.runInContext('sendOnce()', context);
  controls[1].resolve();
  await new Promise(resolve => setImmediate(resolve));
  check('玩家再次点击可发送，成功后解除本地等待', () => {
    assert.equal(calls.length, 2);
    assert.equal(context.authorSendPending, false);
  });
  synchronousError = { code: 'NOT_SUPPORTED' };
  vm.runInContext('sendOnce()', context);
  check('简化预览同步拒绝时不锁死按钮', () => {
    assert.equal(context.authorSendPending, false);
    assert.equal(calls.length, 2);
    assert.ok(logs.some(row => row[1] === 'NOT_SUPPORTED'));
  });
  console.log(`PASS ${checks} 项作者示例与资料一致性检查。`);
} finally { rmSync(temp, { recursive: true, force: true }); }
