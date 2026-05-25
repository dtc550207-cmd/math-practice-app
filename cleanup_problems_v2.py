import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Comprehensive cleanup mappings
replace_map = {
    # Math operator artifacts
    '\uf0a2': '', '\uf03d': '=', '\uf0b4': '×', '\uf0d8': '√',
    '\uf0b7': '·', '\uf0a8': '∈', '\uf0a3': '≤', '\uf0b9': '≥',
    '\uf0b8': 'θ', '\uf071': 'π', '\uf0e8': 'α', '\uf0e9': 'β',
    '\uf0ea': 'γ', '\uf0eb': 'δ', '\uf0a5': '∞', '\uf0b1': '±',
    '\uf0ae': '⇒', '\uf0e0': '→', '\uf0b0': '°', '\uf0b2': '²',
    '\uf0b3': '³',  '\uf0b5': 'μ', '\uf0b6': 'σ',
    # PyPDF2 artifact chars
    '': '=', '': '+', '': '−', '': '×', '': '÷',
    '': '¹', '': '²', '': '³', '': ':', '': '<',
    '': '>', '': '(', '': ')', '': '≠', '': '√',
    '': '|', '': '∩', '': '∪', '': 'α', '': 'β',
    '': 'γ', '': 'δ', '': 'π', '': 'θ', '': 'σ',
    '': '{', '': '', '': '}', '': '[', '': ']',
    '': '×', '': '÷', '': '≠', '': '≤', '': '≥',
    # Angle bracket artifacts
    '': '', '': '', '': '>', '': '<',
    '\u2000': ' ', '\u2001': ' ', '\u2002': ' ', '\u2003': ' ',
    '\u2004': ' ', '\u2005': ' ', '\u2006': ' ',
    '\u200b': '', '\u200c': '', '\u200d': '',
    '\ufeff': '', '\u3000': ' ',
}

def deep_clean(s):
    if not s:
        return ''
    # Apply replacement map
    for old, new in replace_map.items():
        s = s.replace(old, new)
    # Remove repeated non-Chinese non-ASCII junk characters
    s = re.sub(r'[^\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u2010-\u20500-9a-zA-Z+\-×÷=<>()\[\]{}.,:;!?/\\^%$#@~`\'\"|_ \n]', '', s)
    # Collapse spaces
    s = re.sub(r'\s+', ' ', s).strip()
    # Remove leading non-alphanumeric
    s = re.sub(r'^[^a-zA-Z0-9\u4e00-\u9fff]+', '', s)
    return s

# Also fix specific known patterns
def fix_common_patterns(s):
    # 桌面上有 → various missing chars
    s = s.replace('???!?', '')
    s = s.replace('???', '')
    # Remove trailing labels like (A) (B) etc from question text
    s = re.sub(r'\s*\([A-E]\)[^\(\)]*$', '', s)
    return s

for p in data:
    p['question'] = deep_clean(p['question'])
    p['question'] = fix_common_patterns(p['question'])
    p['options'] = [deep_clean(o) for o in p['options']]
    p['answer'] = deep_clean(p['answer'])
    p['explanation'] = deep_clean(p.get('explanation', ''))
    # Validate options
    p['options'] = [o for o in p['options'] if o]
    if len(p['options']) < 2:
        p['options'] = ['A', 'B']
    if not p.get('questionEn'):
        p['questionEn'] = ''

# Save
with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Show samples after cleanup
units_order = ['條件機率與貝氏定理', '三元一次聯立方程式', '矩陣的運算', '矩陣的應用']
for u in units_order:
    probs = [p for p in data if p['unit'] == u]
    print(f'\n=== {u} ({len(probs)} problems) ===')
    for p in probs[:2]:
        print(f'  [{p["id"]}] ({p["difficulty"]})')
        q = p['question'][:150] if len(p['question']) > 150 else p['question']
        print(f'  Q: {q}')
        print(f'  Opts: {p["options"]}')
        print(f'  Ans: {p["answer"]}')
        print()
