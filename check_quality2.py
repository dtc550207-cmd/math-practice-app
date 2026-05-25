import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\WU\Desktop\opencode\math-practice-app\problems.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'Total: {len(data)} problems')

units = {}
for p in data:
    units[p['unit']] = units.get(p['unit'], 0) + 1

for u, c in sorted(units.items()):
    print(f'  {u}: {c}')

easy = sum(1 for p in data if p['difficulty'] == 'easy')
med = sum(1 for p in data if p['difficulty'] == 'medium')
hard = sum(1 for p in data if p['difficulty'] == 'hard')
print(f'Easy: {easy}, Medium: {med}, Hard: {hard}')

# Show first question of each unit
for u in sorted(units.keys()):
    for p in data:
        if p['unit'] == u:
            print(f'\nSample [{p["id"]}] {u} ({p["difficulty"]})')
            print(f'  Q: {p["question"][:100]}')
            print(f'  Options: {p["options"][:5]}')
            print(f'  Answer: {p["answer"]}')
            break
