import json
with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
units = {}
for p in data:
    units.setdefault(p['unit'], []).append(p)
for u, probs in sorted(units.items()):
    print(f'\n=== {u} ({len(probs)} total) ===')
    for p in probs[:3]:
        rid = p['id']
        diff = p['difficulty']
        q = p['question'][:120]
        opts = p['options']
        ans = p['answer']
        print(f'  [{rid}] {diff}')
        print(f'  Q: {q}')
        print(f'  Options: {opts}')
        print(f'  Answer: {ans}')
        print()
