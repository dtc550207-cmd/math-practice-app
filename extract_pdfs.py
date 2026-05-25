import os, json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\WU\Desktop\opencode'

units = {
    '07': '條件機率與貝氏定理',
    '08': '三元一次聯立方程式',
    '09': '矩陣的運算',
    '10': '矩陣的應用'
}

units_en = {
    '07': 'Conditional Probability & Bayes Theorem',
    '08': 'System of Three Linear Equations',
    '09': 'Matrix Operations',
    '10': 'Applications of Matrices'
}

pdf_files = {}
for dp, dn, fn in os.walk(base):
    for f in fn:
        for code in units:
            if f'單元{code}' in f and f.endswith('.pdf'):
                pdf_files[code] = os.path.join(dp, f)

print(f"Found {len(pdf_files)} PDF files")

from PyPDF2 import PdfReader

all_problems = []

for code in sorted(pdf_files.keys()):
    path = pdf_files[code]
    unit_zh = units[code]
    unit_en = units_en[code]
    
    print(f"\n{'='*50}")
    print(f"Processing: 單元{code} - {unit_zh}")
    
    try:
        reader = PdfReader(path)
        num_pages = len(reader.pages)
        print(f"Pages: {num_pages}")
        
        full_text = ""
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text += text + "\n"
        
        print(f"Extracted text length: {len(full_text)} chars")
        
        # Save raw text for inspection
        os.makedirs(os.path.join(base, 'math-practice-app', 'extracted'), exist_ok=True)
        with open(os.path.join(base, 'math-practice-app', 'extracted', f'unit{code}_raw.txt'), 'w', encoding='utf-8') as f:
            f.write(full_text[:20000])
        
        # Split into lines
        lines = full_text.split('\n')
        print(f"Total lines: {len(lines)}")
        
        # Show first 50 lines to understand format
        print("\nFirst 50 lines:")
        for i, line in enumerate(lines[:50]):
            if line.strip():
                print(f"  [{i}] {line.strip()[:100]}")
        
    except Exception as e:
        print(f"Error: {e}")
