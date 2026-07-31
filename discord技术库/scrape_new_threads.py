#!/usr/bin/env python3
"""
Discord「魅魔藏经阁」技术帖爬取脚本
用法：python scrape_new_threads.py
前提：需要有效的 Discord 用户 token
"""

import requests
import json
import time
import os
import re
from datetime import datetime, timezone

# ============ 配置 ============
TOKEN = "你的Discord_Token"  # 替换为你的token
SERVER_ID = "1205870897769095229"
CHANNEL_ID = "1261224189931556865"  # 论坛频道
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
THREAD_LIST = os.path.join(SCRIPT_DIR, "thread-list.json")

# 代理配置（本地 Clash Verge）
PROXY = "http://127.0.0.1:7897"

# ============ API 工具 ============
HEADERS = {
    "Authorization": TOKEN,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def api_get(url, params=None):
    """带代理的 GET 请求"""
    try:
        r = requests.get(url, headers=HEADERS, params=params, 
                        proxies={"http": PROXY, "https": PROXY}, timeout=15)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"  ⚠️ API错误: {e}")
        return None

def load_existing_threads():
    """加载已有的帖子列表"""
    if os.path.exists(THREAD_LIST):
        with open(THREAD_LIST, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_threads(threads):
    """保存帖子列表"""
    with open(THREAD_LIST, 'w', encoding='utf-8') as f:
        json.dump(threads, f, ensure_ascii=False, indent=2)

def fetch_threads(channel_id, before=None):
    """获取频道的活跃帖子列表"""
    url = f"https://discord.com/api/v9/channels/{channel_id}/threads"
    params = {}
    if before:
        params["before"] = before
    return api_get(url, params)

def fetch_archived_threads(channel_id, before=None):
    """获取归档帖子列表"""
    url = f"https://discord.com/api/v9/channels/{channel_id}/threads/archived/public"
    params = {}
    if before:
        params["before"] = before
    return api_get(url, params)

def fetch_messages(channel_id, limit=100, before=None):
    """获取帖子内的消息"""
    url = f"https://discord.com/api/v9/channels/{channel_id}/messages"
    params = {"limit": limit}
    if before:
        params["before"] = before
    return api_get(url, params)

def fetch_all_messages(channel_id):
    """获取帖子的全部消息（分页）"""
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
        time.sleep(0.5)  # 限速
    return all_messages

def sanitize_filename(name):
    """清理文件名"""
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    name = name.strip()
    if len(name) > 200:
        name = name[:200]
    return name

def format_message(msg):
    """格式化单条消息为 Markdown"""
    author = msg.get("author", {}).get("global_name") or msg.get("author", {}).get("username", "未知")
    content = msg.get("content", "")
    timestamp = msg.get("timestamp", "")
    
    # 解析时间
    try:
        dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        time_str = dt.strftime("%Y-%m-%d %H:%M:%S")
    except:
        time_str = timestamp
    
    # 处理附件
    attachments = []
    for att in msg.get("attachments", []):
        attachments.append(f"![{att.get('filename', '图片')}]({att.get('url', '')})")
    
    # 处理embeds
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

def scrape_thread(thread_id, thread_name):
    """爬取单个帖子的全部消息"""
    print(f"  📥 爬取消息: {thread_name[:40]}...")
    messages = fetch_all_messages(thread_id)
    if not messages:
        print(f"  ⚠️ 无法获取消息")
        return None
    
    # 按时间排序（最早在前）
    messages.sort(key=lambda m: m.get("timestamp", ""))
    
    return messages

def save_thread_as_md(thread_name, messages, created_at):
    """将帖子保存为 Markdown 文件"""
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
    print("  Discord 魅魔藏经阁 技术帖爬取")
    print("=" * 50)
    
    # 加载已有帖子列表
    existing = load_existing_threads()
    existing_ids = {t["id"] for t in existing}
    print(f"\n📂 已有帖子: {len(existing)} 个")
    
    # 获取论坛频道的帖子
    print(f"\n🔍 获取频道 {CHANNEL_ID} 的帖子列表...")
    
    # 获取活跃帖子
    data = fetch_threads(CHANNEL_ID)
    all_threads = []
    if data and "threads" in data:
        all_threads.extend(data["threads"])
        print(f"  活跃帖子: {len(data['threads'])} 个")
    
    # 获取归档帖子
    print("  获取归档帖子...")
    before = None
    while True:
        data = fetch_archived_threads(CHANNEL_ID, before=before)
        if not data or "threads" not in data or len(data["threads"]) == 0:
            break
        all_threads.extend(data["threads"])
        if data.get("has_more"):
            before = data["threads"][-1]["id"]
            time.sleep(0.5)
        else:
            break
    print(f"  归档帖子: {len(all_threads) - len(data.get('threads', []))} 个")
    
    # 筛选新帖子
    new_threads = [t for t in all_threads if t["id"] not in existing_ids]
    # 只保留最近3周的（约2026-07-10之后）
    cutoff = datetime(2026, 7, 10, tzinfo=timezone.utc)
    new_threads_recent = []
    for t in new_threads:
        try:
            created = datetime.fromisoformat(t.get("thread_metadata", {}).get("create_timestamp", t.get("created_at", "2000-01-01")).replace("Z", "+00:00"))
            if created >= cutoff:
                new_threads_recent.append(t)
        except:
            new_threads_recent.append(t)  # 无法解析时间的也保留
    
    print(f"\n🆕 新帖子（3周内）: {len(new_threads_recent)} 个")
    
    if not new_threads_recent:
        print("\n✅ 没有新帖子需要爬取")
        return
    
    # 爬取新帖子
    saved_count = 0
    for i, thread in enumerate(new_threads_recent):
        thread_id = thread["id"]
        thread_name = thread.get("name", "未知帖子")
        created_at = thread.get("thread_metadata", {}).get("create_timestamp", thread.get("created_at", ""))
        
        print(f"\n[{i+1}/{len(new_threads_recent)}] {thread_name[:50]}")
        
        # 爬取消息
        messages = scrape_thread(thread_id, thread_name)
        if messages:
            # 保存为 Markdown
            filepath = save_thread_as_md(thread_name, messages, created_at)
            print(f"  ✅ 已保存: {os.path.basename(filepath)} ({len(messages)} 条消息)")
            saved_count += 1
            
            # 更新帖子列表
            existing.append({
                "id": thread_id,
                "name": thread_name,
                "msgs": len(messages),
                "created": created_at,
                "archived": thread.get("thread_metadata", {}).get("archived", False),
                "tags": [str(t) for t in thread.get("applied_tags", [])]
            })
        
        time.sleep(1)  # 限速，避免被封
    
    # 保存更新后的帖子列表
    save_threads(existing)
    print(f"\n{'=' * 50}")
    print(f"✅ 完成！新增 {saved_count} 个帖子")
    print(f"   总帖子数: {len(existing)}")
    print(f"{'=' * 50}")

if __name__ == "__main__":
    main()
