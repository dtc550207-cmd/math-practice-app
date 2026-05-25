import os, json, re, sys

base = r'C:\Users\WU\Desktop\opencode'

units = {
    '07': '條件機率與貝氏定理',
    '08': '三元一次聯立方程式',
    '09': '矩陣的運算',
    '10': '矩陣的應用'
}

pdf_files = {}
for dp, dn, fn in os.walk(base):
    for f in fn:
        for code, name in units.items():
            if f'單元{code}' in f and f.endswith('.pdf'):
                pdf_files[code] = os.path.join(dp, f)

print("Found PDFs:")
for code, path in sorted(pdf_files.items()):
    print(f"  單元{code}_{units[code]}: {path[-60:]}")
