import os, sys
sys.stdout.reconfigure(encoding='utf-8')

from pdfminer.high_level import extract_text

base = r'C:\Users\WU\Desktop\opencode'

# Find the actual path
target_file = None
for dp, dn, fn in os.walk(base):
    for f in fn:
        if '單元07' in f and f.endswith('.pdf'):
            target_file = os.path.join(dp, f)
            break
    if target_file:
        break

if target_file:
    print(f'File: {target_file}')
    text = extract_text(target_file)
    out_path = r'C:\Users\WU\AppData\Local\Temp\pdfminer_test.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(text[:10000])
    print(f'Extracted {len(text)} chars')
    print('--- First 800 chars ---')
    print(text[:800])
else:
    print('Unit 07 PDF not found')
