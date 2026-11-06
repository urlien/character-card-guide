#!/usr/bin/env node
/**
 * 从 `contract.json` 生成 `reference.md`。
 *
 * 参考页是穷举表，手写必然漂：能力加了一个、事件改了一个名字，没人会记得回来补。
 * 本地契约按已核对的公开开发资料维护；这里只验证 JSON → 参考页一致，
 * 不声称运行了平台仓库的 SDK 回归测试。
 *
 * 用法：
 *   node <技能目录>/authoring/scripts/generate-reference.mjs
 *   node <技能目录>/authoring/scripts/generate-reference.mjs --stdout
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 导出成函数，测试直接调它比对，不必去 spawn 一个进程。 */
export function renderReference(contract) {
  const lines = [];
  const push = (s = '') => lines.push(s);
  /** 表格单元格里的竖线会把列切断，进表前先转义。 */
  const cell = (s) => String(s).replaceAll('|', '\\|');

  push('<!-- GENERATED. Do not edit. -->');
  push('<!-- 由 authoring/scripts/generate-reference.mjs 从 contract.json 生成。 -->');
  push();
  push('# 契约参考');
  push();
  push(`SDK 版本 \`${contract.version}\`。人话版在[手册](README.md)里，这一页是穷举表。`);
  push();
  if (contract.documentation?.url) {
    push(`资料来源：[官方新版开发文档](${contract.documentation.url})，核对时间 ${contract.documentation.checkedAt}。`);
    push();
  }
  push('「瘦预览」一列说的是创卡页里那个预览环境的待遇。');
  push();
  push('## 能力');
  push();
  push('| 能力 | 参数 | 返回 | 瘦预览 | 说明 |');
  push('| --- | --- | --- | --- | --- |');
  for (const [name, cap] of Object.entries(contract.capabilities)) {
    const args = cap.args.length === 0 ? '—' : cap.args.map((a) => `\`${cell(a)}\``).join(', ');
    push(`| \`${name}\` | ${args} | \`${cell(cap.returns)}\` | ${cap.slim} | ${cell(cap.desc)} |`);
  }
  push();
  push('### 别这么写');
  push();
  for (const [name, cap] of Object.entries(contract.capabilities)) {
    if (cap.antiPattern === '-') continue;
    push(`- \`${name}\`：${cap.antiPattern}`);
  }
  push();
  push('## 事件');
  push();
  push('订阅不存在的事件名不会报错，只是永远不触发。全部合法名字：');
  push();
  for (const event of contract.events) push(`- \`${event}\``);
  for (const [event, note] of Object.entries(contract.eventNotes ?? {})) push(`- \`${event}\`：${note}`);
  push();
  push('## 错误码');
  push();
  for (const code of contract.errors) push(`- \`${code}\`${contract.errorNotes?.[code] ? '：' + contract.errorNotes[code] : ''}`);
  push();
  push('## 限额');
  push();
  push('| 项 | 值 |');
  push('| --- | --- |');
  for (const [key, value] of Object.entries(contract.limits)) push(`| \`${key}\` | ${value} |`);
  push();
  push('## 限频');
  push();
  push('| 能力 | 次数 | 窗口 |');
  push('| --- | --- | --- |');
  for (const [name, limit] of Object.entries(contract.rateLimits)) {
    const window = limit.windowMs === null ? '整个会话' : `${limit.windowMs / 1000} 秒`;
    push(`| \`${name}\` | ${limit.count} | ${window} |`);
  }
  push();
  push('## 选择器');
  push();
  push('平台自己的 class 名会变，用这些 `data-*`。你自己的 HTML 用自己起的 class。');
  push();
  push('| 选择器 | 说明 |');
  push('| --- | --- |');
  for (const [value, desc] of Object.entries(contract.selectors['data-chat'])) {
    push(`| \`[data-chat="${value}"]\` | ${cell(desc)} |`);
  }
  push();
  push('槽位：');
  push();
  push('| 选择器 | 说明 |');
  push('| --- | --- |');
  for (const [value, desc] of Object.entries(contract.selectors['data-slot'])) {
    push(`| \`[data-slot="${value}"]\` | ${cell(desc)} |`);
  }
  push();
  push('消息上的属性：');
  push();
  push('| 属性 | 说明 |');
  push('| --- | --- |');
  for (const [value, desc] of Object.entries(contract.selectors.message)) {
    push(`| \`${value}\` | ${cell(desc)} |`);
  }
  push();
  push('根节点上的属性：');
  push();
  push('| 属性 | 说明 |');
  push('| --- | --- |');
  for (const [value, desc] of Object.entries(contract.selectors.root)) {
    push(`| \`${value}\` | ${cell(desc)} |`);
  }
  push();
  push('## CSS 变量');
  push();
  push('改配色改变量，别写死颜色，深浅色切换才会跟着变。');
  push();
  push('| 变量 | 说明 |');
  push('| --- | --- |');
  for (const [value, desc] of Object.entries(contract.cssVariables.semantic)) {
    push(`| \`${value}\` | ${cell(desc)} |`);
  }
  push();
  if (contract.cssVariables.chrome) {
    push('### 底栏和白名单弹窗');
    push();
    push('独立于气泡语义变量；只影响已开放的底栏和弹窗配色，不支持更换平台图标。');
    push();
    push('| 变量 | 说明 |');
    push('| --- | --- |');
    for (const [value, desc] of Object.entries(contract.cssVariables.chrome)) push(`| \`${value}\` | ${cell(desc)} |`);
    push();
  }
  push('## z-index 分段');
  push();
  push(contract.zIndex.note);
  push();
  push('| 段 | 归谁 |');
  push('| --- | --- |');
  push(`| ${contract.zIndex.author[0]}–${contract.zIndex.author[1]} | 作者内容 |`);
  push(`| ${contract.zIndex.stageContent} | 舞台 \`content\` |`);
  push(`| ${contract.zIndex.stageFull} | 舞台 \`full\` |`);
  push(`| ${contract.zIndex.chrome[0]}–${contract.zIndex.chrome[1]} | 平台 chrome |`);
  push(`| ${contract.zIndex.modal[0]}–${contract.zIndex.modal[1]} | 平台模态 |`);
  push();

  return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const contract = JSON.parse(readFileSync(join(root, 'contract.json'), 'utf8'));
  const text = renderReference(contract);
  if (process.argv.includes('--stdout')) process.stdout.write(text);
  else {
    writeFileSync(join(root, 'reference.md'), text);
    console.log('reference.md: 已生成');
  }
}
