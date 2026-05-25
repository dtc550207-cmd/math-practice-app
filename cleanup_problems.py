import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Common garbled char replacements
replacements = {
    '\uf0a2': '', '\uf03d': '=', '\uf020': '',
    '\uf0b4': '×', '\uf0e0': '→', '\uf0ae': '⇒',
    '\uf0b0': '°', '\uf0b2': '²', '\uf0b3': '³',
    '\uf0d8': '√', '\uf0b7': '·', '\uf0a8': '∈',
    '\uf0a3': '≤', '\uf0b9': '≥', '\uf0b8': 'θ',
    '\uf071': 'π', '\uf073': 'σ', '\uf0e8': 'α',
    '\uf0e9': 'β', '\uf0ea': 'γ', '\uf0eb': 'δ',
    '\uf0a5': '∞', '\uf0b1': '±',
    '': '=', '': '+', '': '−', '': '×', '': '÷',
    '': '¹', '': '²', '': '³',
    '': ':', '': '；', '': '<', '': '>',
    '': '(', '': ')', '': '≠',
    '': '|', '': '∩', '': '∪',
    '': 'α', '': 'β', '': 'γ', '': 'δ',
    '': 'π', '': 'θ', '': 'σ',
    '': '{', '': '', '': '', '': '',
    '': '}', '': '', '': '',
    '': '[', '': ']', '': '',
    '': '', '': '',
    '': '×', '': '',
    '\u2000': ' ', '\u2001': ' ', '\u2002': ' ', '\u2003': ' ',
    '\u2004': ' ', '\u2005': ' ', '\u2006': ' ', '\u2007': ' ',
    '\u2008': ' ', '\u2009': ' ', '\u200a': ' ',
    '\u3000': ' ',
}

def clean_text(text):
    for old, new in replacements.items():
        text = text.replace(old, new)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove leading/trailing special chars
    text = text.strip(' ,;()[]{}')
    return text

for p in data:
    p['question'] = clean_text(p['question'])
    p['options'] = [clean_text(o) for o in p['options']]
    p['answer'] = clean_text(p['answer'])
    p['explanation'] = clean_text(p.get('explanation', ''))
    p['questionEn'] = ''
    # Remove any empty options
    p['options'] = [o for o in p['options'] if o and len(o) > 0]
    # Ensure at least 2 options remain
    if len(p['options']) < 2:
        # Try to preserve from original options
        if p.get('answer') and p['answer'] not in p['options']:
            p['options'].append(p['answer'])
        if len(p['options']) < 2:
            p['options'] = ['A', 'B']

with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Print stats
units = {}
for p in data:
    units[p['unit']] = units.get(p['unit'], 0) + 1
print('After cleanup:')
print(f'Total: {len(data)} problems')
for u, c in sorted(units.items()):
    print(f'  {u}: {c}')
print(f'Easy: {sum(1 for p in data if p["difficulty"]=="easy")}')
print(f'Medium: {sum(1 for p in data if p["difficulty"]=="medium")}')
print(f'Hard: {sum(1 for p in data if p["difficulty"]=="hard")}')

# Show samples
print('\nSample cleaned questions:')
for u in sorted(units.keys()):
    for p in data:
        if p['unit'] == u:
            print(f'\n[{p["id"]}] ({p["difficulty"]})')
            print(f'  Q: {p["question"][:120]}')
            print(f'  Options: {p["options"][:5]}')
            print(f'  Answer: {p["answer"]}')
            break
