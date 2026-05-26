import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Verify every question has a valid answer in options
errors = []
for p in data:
    if p['answer'] not in p['options']:
        errors.append(f'{p["id"]}: answer "{p["answer"]}" not in options {p["options"]}')

if errors:
    print(f'❌ {len(errors)} answer errors:')
    for e in errors[:20]:
        print(f'  {e}')
else:
    print('✅ All answers are valid (exist in options)')

# Print stats
units = {}
for p in data:
    units[p['unit']] = units.get(p['unit'], 0) + 1
print(f'\nTotal: {len(data)} questions')
for u, c in sorted(units.items()):
    print(f'  {u}: {c}')

# Show first 2 questions from each unit
print('\n=== Sample Questions ===')
for u in sorted(units.keys()):
    count = 0
    for p in data:
        if p['unit'] == u and count < 2:
            print(f'\n[{p["id"]}] ({p["difficulty"]}) {p["unit"]}')
            print(f'  Q: {p["question"][:150]}')
            print(f'  Options: {p["options"]}')
            print(f'  Answer: {p["answer"]}')
            count += 1
