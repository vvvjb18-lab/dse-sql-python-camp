#!/usr/bin/env python3
"""
自動化工具：將現有 lang.js 中的翻譯物件提取為獨立的 JSON 文件
使用方式：python3 scripts/extract-translations.py
"""

import re
import json
import os
from pathlib import Path

# 讀取現有的 lang.js 文件
script_dir = Path(__file__).parent
project_root = script_dir.parent
lang_js_path = project_root / 'lang.js'

if not lang_js_path.exists():
    print(f'❌ 找不到 lang.js 文件：{lang_js_path}')
    exit(1)

with open(lang_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 提取 i18nDict 物件
dict_match = re.search(r'const i18nDict = \{([\s\S]*?)\};', content)
if not dict_match:
    print('❌ 無法找到 i18nDict 物件')
    exit(1)

dict_str = dict_match.group(1)

# 初始化翻譯字典
translations = {
    'zh-Hant': {},  # 原 zh-TW
    'zh-Hans': {},  # 原 zh-CN
    'en': {}
}

# 使用正則表達式提取所有翻譯鍵和值
# 匹配模式：'key': { 'zh-TW': 'value1', 'zh-CN': 'value2', 'en': 'value3' }
pattern = r"'([^']+)':\s*\{[^}]*?'zh-TW':\s*'([^']*)'[^}]*?'zh-CN':\s*'([^']*)'[^}]*?'en':\s*'([^']*)'"

matches = re.finditer(pattern, dict_str, re.MULTILINE)

for match in matches:
    key = match.group(1)
    zh_tw = match.group(2)
    zh_cn = match.group(3)
    en = match.group(4)
    
    translations['zh-Hant'][key] = zh_tw
    translations['zh-Hans'][key] = zh_cn
    translations['en'][key] = en

# 如果上面的方法沒有提取到足夠的數據，使用更精細的方法
if len(translations['zh-Hant']) < 50:
    print('⚠️  使用備用解析方法...')
    
    # 備用方法：逐行解析
    lines = dict_str.split('\n')
    current_key = None
    current_values = {}
    brace_depth = 0
    
    for line in lines:
        # 匹配鍵定義
        key_match = re.search(r"'([^']+)':\s*\{", line)
        if key_match:
            if current_key and current_values:
                # 保存前一個鍵的翻譯
                if 'zh-TW' in current_values:
                    translations['zh-Hant'][current_key] = current_values['zh-TW']
                if 'zh-CN' in current_values:
                    translations['zh-Hans'][current_key] = current_values['zh-CN']
                if 'en' in current_values:
                    translations['en'][current_key] = current_values['en']
            
            current_key = key_match.group(1)
            current_values = {}
            brace_depth = 1
            continue
        
        # 匹配語言值
        lang_match = re.search(r"'(zh-TW|zh-CN|en)':\s*'([^']*)'", line)
        if lang_match and current_key:
            lang = lang_match.group(1)
            value = lang_match.group(2)
            current_values[lang] = value
        
        # 追蹤大括號深度
        brace_depth += line.count('{') - line.count('}')
        if brace_depth <= 0 and current_key:
            # 保存當前鍵的翻譯
            if 'zh-TW' in current_values:
                translations['zh-Hant'][current_key] = current_values['zh-TW']
            if 'zh-CN' in current_values:
                translations['zh-Hans'][current_key] = current_values['zh-CN']
            if 'en' in current_values:
                translations['en'][current_key] = current_values['en']
            
            current_key = None
            current_values = {}
            brace_depth = 0

# 確保 locales 目錄存在
locales_dir = project_root / 'locales'
locales_dir.mkdir(exist_ok=True)

# 寫入 JSON 文件
languages = {
    'zh-Hant': 'zh-Hant.json',
    'zh-Hans': 'zh-Hans.json',
    'en': 'en.json'
}

total_keys = 0
for lang, filename in languages.items():
    file_path = locales_dir / filename
    
    # 按鍵名排序以便閱讀
    sorted_translations = dict(sorted(translations[lang].items()))
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_translations, f, ensure_ascii=False, indent=2)
        f.write('\n')
    
    key_count = len(sorted_translations)
    total_keys += key_count
    print(f'✅ 已生成 {filename} ({key_count} 個翻譯鍵)')

print(f'\n🎉 完成！共提取 {total_keys} 個翻譯鍵')
print(f'📁 JSON 文件已保存至: {locales_dir}')

