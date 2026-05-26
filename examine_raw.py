import os, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\WU\Desktop\opencode'

target_file = None
for dp, dn, fn in os.walk(base):
    for f in fn:
        if '單元09' in f and f.endswith('.pdf'):
            target_file = os.path.join(dp, f)
            break
    if target_file:
        break

from PyPDF2 import PdfReader
reader = PdfReader(target_file)
text = ""
for page in reader.pages:
    t = page.extract_text()
    if t:
        text += t + "\n"

lines = text.split('\n')

# Look for question #4 (the first multiple choice question)
# Find questions around line 200-400
for i, line in enumerate(lines):
    if '4.' in line and '編碼' in line:
        # Print lines from this question through the next 30 lines
        print(f'--- Question 4 starts at line {i} ---')
        for j in range(i, min(i+50, len(lines))):
            print(f'[{j}] {repr(lines[j])}')
        print()
        break

# Also find another MCQ later
for i, line in enumerate(lines):
    if '15.' in line and '編碼' in line:
        print(f'--- Question 15 starts at line {i} ---')
        for j in range(i, min(i+50, len(lines))):
            print(f'[{j}] {repr(lines[j])}')
        break
