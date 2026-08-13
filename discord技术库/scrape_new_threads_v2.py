#!/usr/bin/env python3
"""
Discord「魅魔藏经阁」技术帖爬取脚本 v2
用法：python scrape_new_threads_v2.py
前提：需要有效的 Discord 用户 token
"""

import requests
import json
import time
import os
import re
from datetime import datetime, timezone

# ============ 配置 ============
TOKEN = os.environ.get("DISCORD_TOKEN", "你的Discord_Token")
SERVER_ID = "1205870897769095229"
CHANNEL_ID = "1261224189931556865"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
THREAD_LIST = os.path.join(SCRIPT_DIR, "thread-list.json")
PROXY = "http://127.0.0.1:7897"

# 上次爬取时间（2026-06-24），只爬取之后的新帖子
CUTOFF = datetime(2026, 6, 24, tzinfo=timezone.utc)

# ============ API 工具 ============
HEADERS = {
    "Authorization": TOKEN,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def api_get(url, params=None):
    try:
        r = requests.get(url, headers=HEADERS, params=params,
                        proxies={"http": PROXY, "https": PROXY}, timeout=15)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"  ⚠️ API错误: {e}")
        return None

def load_existing_threads():
    if os.path.exists(THREAD_LIST):
        with open(THREAD_LIST, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_threads(threads):
    with open(THREAD_LIST, 'w', encoding='utf-8') as f:
        json.dump(threads, f, ensure_ascii=False, indent=2)

def fetch_messages(channel_id, limit=100, before=None):
    url = f"https://discord.com/api/v9/channels/{channel_id}/messages"
    params = {"limit": limit}
    if before:
        params["before"] = before
    return api_get(url, params)

def fetch_all_messages(channel_id):
    all_messages = []
    before = None
    while True:
        msgs = fetch_messages(channel_id, limit=100, before=before)
        if not msgs or len(msgs) == 0:
            break
        all_messages.extend(msgs)
        before = msgs[-1]["id"]
        if len(msgs) < 100:
            break
        time.sleep(0.5)
    return all_messages

def sanitize_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    name = name.strip()
    if len(name) > 200:
        name = name[:200]
    return name

def format_message(msg):
    author = msg.get("author", {}).get("global_name") or msg.get("author", {}).get("username", "未知")
    content = msg.get("content", "")
    timestamp = msg.get("timestamp", "")
    try:
        dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        time_str = dt.strftime("%Y-%m-%d %H:%M:%S")
    except:
        time_str = timestamp

    attachments = []
    for att in msg.get("attachments", []):
        attachments.append(f"![{att.get('filename', '图片')}]({att.get('url', '')})")

    embeds = []
    for embed in msg.get("embeds", []):
        if embed.get("title"):
            embeds.append(f"[{embed['title']}]({embed.get('url', '')})")
        if embed.get("description"):
            embeds.append(embed["description"][:500])

    lines = [f"**{author}** ({time_str}):"]
    if content:
        lines.append(content)
    for att in attachments:
        lines.append(att)
    for emb in embeds:
        lines.append(emb)
    return "\n".join(lines)

def save_thread_as_md(thread_name, messages, created_at):
    filename = sanitize_filename(thread_name) + ".md"
    filepath = os.path.join(SCRIPT_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"# {thread_name}\n\n")
        f.write(f"创建时间: {created_at}\n")
        f.write(f"消息数: {len(messages)}\n\n")
        f.write("---\n\n")
        for msg in messages:
            f.write(format_message(msg) + "\n\n")
    return filepath

# ============ 主流程 ============
def main():
    print("=" * 50)
    print("  Discord 魅魔藏经阁 技术帖爬取 v2")
    print("=" * 50)

    existing = load_existing_threads()
    existing_ids = {t["id"] for t in existing}
    print(f"\n📂 已有帖子: {len(existing)} 个")

    # 获取所有归档帖子（分页）
    print(f"\n🔍 获取归档帖子列表...")
    all_threads = []
    before = None
    page = 0
    while True:
        page += 1
        url = f"https://discord.com/api/v9/channels/{CHANNEL_ID}/threads/archived/public"
        params = {"limit": 100}
        if before:
            params["before"] = before
        data = api_get(url, params)
        if not data or "threads" not in data or len(data["threads"]) == 0:
            break
        all_threads.extend(data["threads"])
        print(f"  第{page}页: {len(data['threads'])} 个帖子")
        if data.get("has_more"):
            before = data["threads"][-1]["id"]
            time.sleep(0.5)
        else:
            break

    print(f"  总归档帖子: {len(all_threads)} 个")

    # 筛选新帖子（ID不在已有列表中，且创建时间在cutoff之后）
    new_threads = []
    for t in all_threads:
        if t["id"] in existing_ids:
            continue
        try:
            created_str = t.get("thread_metadata", {}).get("create_timestamp", t.get("created_at", ""))
            if not created_str:
                new_threads.append(t)
                continue
            created = datetime.fromisoformat(created_str.replace("Z", "+00:00"))
            if created >= CUTOFF:
                new_threads.append(t)
        except:
            new_threads.append(t)

    print(f"\n🆕 新帖子: {len(new_threads)} 个")

    if not new_threads:
        print("\n✅ 没有新帖子需要爬取")
        return

    # 爬取新帖子
    saved_count = 0
    for i, thread in enumerate(new_threads):
        thread_id = thread["id"]
        thread_name = thread.get("name", "未知帖子")
        created_at = thread.get("thread_metadata", {}).get("create_timestamp", thread.get("created_at", ""))

        print(f"\n[{i+1}/{len(new_threads)}] {thread_name[:50]}")

        messages = fetch_all_messages(thread_id)
        if messages:
            filepath = save_thread_as_md(thread_name, messages, created_at)
            print(f"  ✅ 已保存: {os.path.basename(filepath)} ({len(messages)} 条消息)")
            saved_count += 1

            existing.append({
                "id": thread_id,
                "name": thread_name,
                "msgs": len(messages),
                "created": created_at,
                "archived": thread.get("thread_metadata", {}).get("archived", False),
                "tags": [str(t) for t in thread.get("applied_tags", [])]
            })

        time.sleep(1)

    save_threads(existing)
    print(f"\n{'=' * 50}")
    print(f"✅ 完成！新增 {saved_count} 个帖子")
    print(f"   总帖子数: {len(existing)}")
    print(f"{'=' * 50}")

if __name__ == "__main__":
    main()
