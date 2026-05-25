import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Show detailed samples
samples = []
for p in data:
    if p['unit'] not in [s.get('unit') for s in samples]:
        samples.append(p)
    if len(samples) >= 8:
        break

for p in samples:
    print('='*60)
    print(f'ID: {p["id"]}')
    print(f'Unit: {p["unit"]}')
    print(f'Difficulty: {p["difficulty"]}')
    print(f'Question: {p["question"]}')
    print(f'Options: {p["options"]}')
    print(f'Answer: {p["answer"]}')
    print()

# Also show a few matrix-specific questions
print('\n--- MATRIX QUESTIONS ---')
mcount = 0
for p in data:
    if '矩陣' in p['unit'] and p['difficulty'] == 'easy' and mcount < 3:
        print('='*60)
        print(f'ID: {p["id"]}')
        print(f'Q: {p["question"][:200]}')
        print(f'Opts: {p["options"]}')
        print(f'Ans: {p["answer"]}')
        print()
        mcount += 1
