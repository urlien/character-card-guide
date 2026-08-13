#!/usr/bin/env python3
"""
下载 Discord CDN 附件到本地仓库
跳过视频文件，只下载图片和代码文件
"""
import requests
import os
import re
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ATTACH_DIR = os.path.join(SCRIPT_DIR, "attachments")
PROXY = "http://127.0.0.1:7897"

# 要下载的文件扩展名
DOWNLOAD_EXTS = {'.txt', '.json', '.html', '.md', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.docx', '.css', '.js'}
# 跳过的扩展名
SKIP_EXTS = {'.mp4', '.mov', '.avi', '.mkv', '.webm', '.wav', '.mp3'}

def find_cdn_links():
    """扫描所有 md 文件，提取 Discord CDN 链接"""
    links = []
    pattern = re.compile(r'!\[([^\]]*)\]\((https://cdn\.discordapp\.com/attachments/[^\)]+)\)')
    
    for fname in os.listdir(SCRIPT_DIR):
        if not fname.endswith('.md'):
            continue
        filepath = os.path.join(SCRIPT_DIR, fname)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for match in pattern.finditer(content):
            filename = match.group(1)
            url = match.group(2)
            # 去掉 URL 参数
            clean_url = url.split('?')[0]
            ext = os.path.splitext(filename)[1].lower()
            
            if ext in SKIP_EXTS:
                continue
            if ext in DOWNLOAD_EXTS or ext == '':
                links.append({
                    'file': fname,
                    'filename': filename,
                    'url': url,
                    'clean_url': clean_url,
                    'ext': ext
                })
    
    return links

def download_file(url, save_path):
    """下载单个文件"""
    try:
        r = requests.get(url, proxies={"http": PROXY, "https": PROXY}, timeout=30, stream=True)
        r.raise_for_status()
        with open(save_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"    ⚠️ 下载失败: {e}")
        return False

def update_md_file(md_path, url_to_local):
    """更新 md 文件中的 CDN 链接为本地路径"""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    for url, local_rel in url_to_local.items():
        if url in content:
            content = content.replace(url, local_rel)
            changed = True
    
    if changed:
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    print("=" * 50)
    print("  Discord CDN 附件下载器")
    print("=" * 50)
    
    os.makedirs(ATTACH_DIR, exist_ok=True)
    
    # 扫描链接
    links = find_cdn_links()
    print(f"\n🔍 找到 {len(links)} 个可下载的附件链接")
    
    # 去重（同一个 URL 可能在多个 md 文件中出现）
    unique_urls = {}
    for link in links:
        url = link['url']
        if url not in unique_urls:
            unique_urls[url] = link
    
    print(f"   去重后: {len(unique_urls)} 个唯一文件")
    
    # 按类型统计
    by_ext = {}
    for link in unique_urls.values():
        ext = link['ext'] or '(无扩展名)'
        by_ext[ext] = by_ext.get(ext, 0) + 1
    for ext, count in sorted(by_ext.items()):
        print(f"   {ext}: {count} 个")
    
    # 下载
    print(f"\n📥 开始下载到 {ATTACH_DIR}...")
    downloaded = 0
    failed = 0
    url_to_local = {}
    
    for i, (url, link) in enumerate(unique_urls.items()):
        filename = link['filename']
        # 处理重名：加上帖子名前缀
        safe_name = re.sub(r'[<>:"/\\|?*]', '_', filename)
        save_path = os.path.join(ATTACH_DIR, safe_name)
        
        # 如果文件已存在，跳过
        if os.path.exists(save_path):
            print(f"  [{i+1}/{len(unique_urls)}] 已存在: {safe_name}")
            local_rel = f"attachments/{safe_name}"
            url_to_local[url] = local_rel
            downloaded += 1
            continue
        
        print(f"  [{i+1}/{len(unique_urls)}] 下载: {safe_name}")
        if download_file(url, save_path):
            local_rel = f"attachments/{safe_name}"
            url_to_local[url] = local_rel
            downloaded += 1
        else:
            failed += 1
        
        time.sleep(0.3)  # 限速
    
    # 更新 md 文件中的链接
    print(f"\n📝 更新 Markdown 文件中的链接...")
    updated_files = 0
    for fname in os.listdir(SCRIPT_DIR):
        if not fname.endswith('.md'):
            continue
        filepath = os.path.join(SCRIPT_DIR, fname)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for url, local_rel in url_to_local.items():
            if url in content:
                content = content.replace(url, local_rel)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_files += 1
            print(f"  ✅ {fname}")
    
    print(f"\n{'=' * 50}")
    print(f"✅ 完成！")
    print(f"   下载成功: {downloaded} 个文件")
    print(f"   下载失败: {failed} 个文件")
    print(f"   更新 md 文件: {updated_files} 个")
    print(f"{'=' * 50}")

if __name__ == "__main__":
    main()
