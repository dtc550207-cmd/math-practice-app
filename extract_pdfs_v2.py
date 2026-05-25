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

from PyPDF2 import PdfReader

all_problems = []
problem_id = 1

for code in sorted(pdf_files.keys()):
    path = pdf_files[code]
    unit_zh = units[code]
    unit_en = units_en[code]
    
    reader = PdfReader(path)
    full_text = ""
    for page in reader.pages:
        t = page.extract_text()
        if t:
            full_text += t + "\n"
    
    lines = full_text.split('\n')
    
    # Parse questions
    i = 0
    current_q = None
    options_buffer = []
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detect question start: numbered + 難易度
        q_match = re.match(r'(\d+)\.\s*編碼\s+\S+\s+難易度：([易中難]).*', line)
        
        if q_match:
            # Save previous question if exists
            if current_q and current_q.get('options'):
                # Only include questions with options and answers
                if current_q.get('answer_text') and len(current_q.get('options', [])) >= 2:
                    all_problems.append(current_q)
            
            q_num = q_match.group(1)
            diff_raw = q_match.group(2)
            diff_map = {'易': 'easy', '中': 'medium', '難': 'hard'}
            difficulty = diff_map.get(diff_raw, 'medium')
            
            # Collect question text from subsequent lines until we hit another question or answer
            q_lines = []
            j = i + 1
            options = []
            answer_text = None
            
            while j < len(lines):
                l = lines[j].strip()
                
                if re.match(r'\d+\.\s*編碼', l):
                    break
                
                if l.startswith('解答'):
                    answer_text = l.replace('解答', '').strip().lstrip('○╳').strip()
                    # For T/F: ○ = True, ╳ = False
                    if '○' in l:
                        answer_text = '○'
                    elif '╳' in l:
                        answer_text = '╳'
                    j += 1
                    break
                
                if l.startswith('解析'):
                    break
                
                q_lines.append(l)
                j += 1
            
            # Parse options from the question text
            opt_pattern = re.findall(r'\(([A-E])\)\s*([^)]+?)(?=\s*\([A-E]\)|$)', ' '.join(q_lines[-3:]))
            
            if opt_pattern:
                options = []
                for letter, text in opt_pattern:
                    clean = text.strip().rstrip(',')
                    if clean:
                        options.append(clean)
                
                # Remove option lines from question text
                question_text = '\n'.join(q_lines[:-3]).strip()
                if not question_text:
                    question_text = '\n'.join(q_lines).strip()
                
                # Clean up question text
                question_text = re.sub(r'\s+', ' ', question_text).strip()
                
                current_q = {
                    'id': f'U{code}Q{q_num}',
                    'unit': unit_zh,
                    'unitEn': unit_en,
                    'difficulty': difficulty,
                    'question': question_text,
                    'questionEn': '',
                    'options': options,
                    'answer': '',
                    'answer_text': answer_text if answer_text else '',
                    'explanation': ''
                }
                
                # Map answer letter to option value
                if answer_text and opt_pattern:
                    for letter, text in opt_pattern:
                        if answer_text.strip() == letter.strip():
                            current_q['answer'] = text.strip()
                            break
                
            i = j
        else:
            i += 1
    
    # Don't forget last question
    if current_q and current_q.get('options') and current_q.get('answer_text') and len(current_q.get('options', [])) >= 2:
        all_problems.append(current_q)
    
    print(f"  Unit {code}: extracted {len([p for p in all_problems if p['unit']==unit_zh])} questions")

# Second pass: extract true/false questions and convert
print("\nConverting True/False questions to multiple choice...")

# Re-process each PDF for T/F questions
tq_id = 1
for code in sorted(pdf_files.keys()):
    path = pdf_files[code]
    unit_zh = units[code]
    unit_en = units_en[code]
    
    reader = PdfReader(path)
    full_text = ""
    for page in reader.pages:
        t = page.extract_text()
        if t:
            full_text += t + "\n"
    
    lines = full_text.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Match numbered question lines (both 是非題 and 單選題)
        q_match = re.match(r'(\d+)\.\s*編碼\s+\S+\s+難易度：([易中難]).*', line)
        
        if q_match:
            q_num = q_match.group(1)
            diff_raw = q_match.group(2)
            diff_map = {'易': 'easy', '中': 'medium', '難': 'hard'}
            difficulty = diff_map.get(diff_raw, 'medium')
            
            q_lines = []
            j = i + 1
            answer_text = None
            found_answer = False
            
            while j < len(lines):
                l = lines[j].strip()
                
                if re.match(r'\d+\.\s*編碼', l):
                    break
                
                if l.startswith('解答'):
                    answer_text = l
                    found_answer = True
                    j += 1
                    break
                
                if l.startswith('解析'):
                    j += 1
                    continue
                
                q_lines.append(l)
                j += 1
            
            # Check if this is a T/F question (has ○ or ╳ in answer)
            is_tf = answer_text and ('○' in answer_text or '╳' in answer_text) if answer_text else False
            
            if is_tf:
                correct_option = '正確' if '○' in answer_text else '錯誤'
                
                # Check we don't already have this question
                existing = [p for p in all_problems if p['question'][:30] == ' '.join(q_lines).strip()[:30]]
                if not existing:
                    question_text = re.sub(r'\s+', ' ', ' '.join(q_lines)).strip()
                    if question_text and len(question_text) > 10:
                        tf_id = f'TF{code}Q{q_num}'
                        all_problems.append({
                            'id': tf_id,
                            'unit': unit_zh,
                            'unitEn': unit_en,
                            'difficulty': difficulty,
                            'question': question_text,
                            'questionEn': '',
                            'options': ['正確', '錯誤'],
                            'answer': correct_option,
                            'answer_text': '',
                            'explanation': ''
                        })
            
            # If this is a multiple choice question, we already handled it in first pass
            # But let's also check for MCQs that might have been missed
            
            i = j
        else:
            i += 1

# Clean up and assign answer_text
for p in all_problems:
    if 'answer_text' in p:
        del p['answer_text']
    if not p.get('explanation'):
        p['explanation'] = ''
    if not p.get('questionEn'):
        p['questionEn'] = ''

print(f"\nTotal questions extracted: {len(all_problems)}")

# Verify we have questions for all units
for u in units.values():
    count = len([p for p in all_problems if p['unit'] == u])
    print(f"  {u}: {count} questions")

# Write to JSON
output_path = os.path.join(base, 'math-practice-app', 'problems.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_problems, f, ensure_ascii=False, indent=2)

print(f"\n✅ Saved to: {output_path}")
print(f"Total problems: {len(all_problems)}")
