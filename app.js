// ============================================================
// 高中數學練習系統 - 完整應用程式
// ============================================================

const app = {

  // ---------- 狀態 ----------
  state: {
    student: null,           // {class, name, id}
    currentUnit: '',
    currentDifficulty: '',
    currentProblem: null,
    currentOptions: [],
    correctStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    pikminCount: 0,
    language: 'zh-TW',
    problems: [],
    sessionStart: null,
    problemStart: null,
    teacherAuthed: false,
    lastUnitIndex: 0,
  },

  // ---------- 多語言 ----------
  i18n: {
    'zh-TW': {
      loginTitle: '🏫 高中數學練習系統', loginSubtitle: '課後自我練習平台',
      labelClass: '班級', labelName: '姓名', classPlaceholder: '例如: 102A',
      namePlaceholder: '請輸入姓名', enterBtn: '🎯 進入練習',
      teacherBtn: '📊 教師專區', teacherLoginTitle: '🔐 教師登入',
      labelPassword: '教師密碼', loginBtn: '登入', backBtn: '返回',
      dashLeaderboard: '排行榜', dashLogout: '登出',
      statPikmin: '皮克敏', statSolved: '已解題', statAcc: '正確率', statStreak: '連勝',
      selectUnitTitle: '📚 選擇練習單元', selectDiffTitle: '⚡ 選擇難度',
      diffEasy: '簡單', diffMedium: '中等', diffHard: '難',
      timer: '⏱', close: '關閉', question: '第', end: '題',
      correct: '✅ 答對了！太棒了！', incorrect: '❌ 答錯了',
      explanation: '💡 解析', nextBtn: '➡️ 下一題', retryBtn: '🔄 再練一題',
      collectPikmin: '🎉 收集皮克敏！', gardenTitle: '🌺 我的皮克敏花園',
      gardenCount: '你已經收集了', gardenCountEnd: '隻皮克敏！',
      lbTitle: '🏆 排行榜', lbFilter: '篩選班級：', lbRank: '排名', lbName: '姓名',
      lbClass: '班級', lbSolved: '解題數', lbAccuracy: '正確率', lbPikmin: '皮克敏',
      btnClose: '關閉',
      tdTitle: '📊 教師儀表板', tdLogout: '登出',
      tabOverview: '📈 總覽', tabStudents: '👨‍🎓 學生', tabExport: '📥 匯出',
      tdTotalStudents: '學生總數', tdTotalProblems: '總解題數',
      tdAvgAcc: '平均正確率', tdActive: '今日活躍',
      tdExportDesc: '點擊下方按鈕匯出所有學生學習報告為 CSV 檔案',
      tdExport: '📥 匯出報告', tdClear: '🗑️ 清除所有資料',
      confirmClear: '確定要清除所有資料嗎？此操作無法復原！',
      toastLogin: '登入成功！', toastPractice: '開始練習！', noProblems: '此單元暫無題目',
      selectUnitFirst: '請先選擇單元', selectDiffFirst: '請先選擇難度',
      passwordError: '密碼錯誤', teacherPassword: 'teacher123',
      tdThName: '姓名', tdThClass: '班級', tdThSolved: '解題數', tdThCorrect: '正確率',
      tdThStreak: '連勝', tdThPikmin: '皮克敏', tdThLast: '最後練習',
    },
    'en': {
      loginTitle: '🏫 Math Practice System', loginSubtitle: 'After-class Self-practice Platform',
      labelClass: 'Class', labelName: 'Name', classPlaceholder: 'e.g. 102A',
      namePlaceholder: 'Enter your name', enterBtn: '🎯 Start Practice',
      teacherBtn: '📊 Teacher', teacherLoginTitle: '🔐 Teacher Login',
      labelPassword: 'Password', loginBtn: 'Login', backBtn: 'Back',
      dashLeaderboard: 'Leaderboard', dashLogout: 'Logout',
      statPikmin: 'Pikmin', statSolved: 'Solved', statAcc: 'Accuracy', statStreak: 'Streak',
      selectUnitTitle: '📚 Select Unit', selectDiffTitle: '⚡ Select Difficulty',
      diffEasy: 'Easy', diffMedium: 'Medium', diffHard: 'Hard',
      timer: '⏱', close: 'Close', question: 'Q', end: '',
      correct: '✅ Correct! Great job!', incorrect: '❌ Incorrect',
      explanation: '💡 Explanation', nextBtn: '➡️ Next', retryBtn: '🔄 Try Again',
      collectPikmin: '🎉 Collect Pikmin!', gardenTitle: '🌺 My Pikmin Garden',
      gardenCount: 'You have collected', gardenCountEnd: 'Pikmin!',
      lbTitle: '🏆 Leaderboard', lbFilter: 'Filter Class：', lbRank: 'Rank', lbName: 'Name',
      lbClass: 'Class', lbSolved: 'Solved', lbAccuracy: 'Accuracy', lbPikmin: 'Pikmin',
      btnClose: 'Close',
      tdTitle: '📊 Teacher Dashboard', tdLogout: 'Logout',
      tabOverview: '📈 Overview', tabStudents: '👨‍🎓 Students', tabExport: '📥 Export',
      tdTotalStudents: 'Total Students', tdTotalProblems: 'Total Problems',
      tdAvgAcc: 'Avg Accuracy', tdActive: 'Active Today',
      tdExportDesc: 'Click to export all student learning reports as CSV',
      tdExport: '📥 Export CSV', tdClear: '🗑️ Clear All Data',
      confirmClear: 'Are you sure? This cannot be undone!',
      toastLogin: 'Login successful!', toastPractice: 'Start practicing!',
      noProblems: 'No problems available for this unit',
      selectUnitFirst: 'Please select a unit first',
      selectDiffFirst: 'Please select difficulty first',
      passwordError: 'Wrong password', teacherPassword: 'teacher123',
      tdThName: 'Name', tdThClass: 'Class', tdThSolved: 'Solved', tdThCorrect: 'Accuracy',
      tdThStreak: 'Streak', tdThPikmin: 'Pikmin', tdThLast: 'Last Practice',
    }
  },

  // ---------- 工具函數 ----------
  t(key) { return this.i18n[this.state.language][key] || key; },

  showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  toast(msg, duration = 2000) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
  },

  // ---------- 語言 ----------
  setLanguage(lang) {
    this.state.language = lang;
    this.applyLanguage();
    localStorage.setItem('mathLang', lang);
  },

  applyLanguage() {
    const t = this.t.bind(this);
    const map = {
      loginTitle: 'loginTitle', loginSubtitle: 'loginSubtitle',
      labelClass: 'labelClass', labelName: 'labelName',
      enterBtn: 'enterBtn', teacherBtn: 'teacherBtn',
      teacherLoginTitle: 'teacherLoginTitle', labelPassword: 'labelPassword',
      dashLeaderboard: 'dashLeaderboard', dashLogout: 'dashLogout',
      statPikminLabel: 'statPikmin', statSolvedLabel: 'statSolved',
      statAccLabel: 'statAcc', statStreakLabel: 'statStreak',
      selectUnitTitle: 'selectUnitTitle', selectDiffTitle: 'selectDiffTitle',
      diffEasy: 'diffEasy', diffMedium: 'diffMedium', diffHard: 'diffHard',
      gardenTitle: 'gardenTitle', btnCloseGarden: 'btnClose',
      lbTitle: 'lbTitle', lbFilterLabel: 'lbFilter', btnCloseLB: 'btnClose',
      tdTitle: 'tdTitle', tdLogout: 'tdLogout',
      tabOverview: 'tabOverview', tabStudents: 'tabStudents', tabExport: 'tabExport',
      tdLabelStudents: 'tdTotalStudents', tdLabelProblems: 'tdTotalProblems',
      tdLabelAvgAcc: 'tdAvgAcc', tdLabelActive: 'tdActive',
      tdExportDesc: 'tdExportDesc', tdExport: 'tdExport', tdClear: 'tdClear',
      tdThName: 'tdThName', tdThClass: 'tdThClass', tdThSolved: 'tdThSolved',
      tdThCorrect: 'tdThCorrect', tdThStreak: 'tdThStreak', tdThPikmin: 'tdThPikmin',
      tdThLast: 'tdThLast', teacherLoginTitle: 'teacherLoginTitle',
      labelPassword: 'labelPassword',
    };
    for (const [id, key] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) el.textContent = t(key);
    }
    // Placeholders
    document.getElementById('classInput').placeholder = t('classPlaceholder');
    document.getElementById('nameInput').placeholder = t('namePlaceholder');
    // Login buttons
    document.getElementById('enterBtn').textContent = t('enterBtn');
    document.getElementById('teacherBtn').textContent = t('teacherBtn');
    // Update dynamic content
    if (this.state.student) this.updateDashboard();
  },

  // ---------- 載入題庫 ----------
  async loadProblems() {
    try {
      const cached = localStorage.getItem('mathProblems');
      const cacheTime = localStorage.getItem('mathProblemsTime');
      // Cache for 1 hour
      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
        this.state.problems = JSON.parse(cached);
        return;
      }
      const res = await fetch('problems.json');
      this.state.problems = await res.json();
      // Avoid caching failure if fetch fails and we have cached data
      try {
        localStorage.setItem('mathProblems', JSON.stringify(this.state.problems));
        localStorage.setItem('mathProblemsTime', Date.now().toString());
      } catch(e) {}
    } catch(e) {
      console.warn('Fetch problems failed, using fallback');
      // Generate some basic problems as fallback
      this.state.problems = this.generateFallbackProblems();
    }
  },

  generateFallbackProblems() {
    const units = ['代數', '幾何', '函數'];
    const probs = [];
    for (const unit of units) {
      for (let d = 0; d < 3; d++) {
        const diff = ['easy','medium','hard'][d];
        for (let i = 0; i < 3; i++) {
          probs.push({
            id: `F${unit[0]}${diff[0]}${i}`,
            unit, difficulty: diff,
            question: `範例題目 ${unit} ${diff} #${i+1}`,
            options: ['A','B','C','D'],
            answer: 'A',
            explanation: '這是範例題目，請匯入實際題庫'
          });
        }
      }
    }
    return probs;
  },

  // ---------- 取得題目 ----------
  getProblems(unit, difficulty, count = 10) {
    let pool = this.state.problems.filter(p => p.unit === unit && p.difficulty === difficulty);
    if (pool.length === 0) return [];
    // Shuffle and return
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },

  // ---------- 登入 ----------
  login() {
    const cls = document.getElementById('classInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();
    if (!cls || !name) {
      document.getElementById('errorMsg').textContent = this.t('請填寫班級和姓名');
      document.getElementById('errorMsg').classList.remove('hidden');
      return;
    }
    document.getElementById('errorMsg').classList.add('hidden');

    // Load student data or create new
    const studentId = `${cls}-${name}`;
    let data = this.loadStudentData(studentId);
    if (!data) {
      data = {
        id: studentId, class: cls, name, createdAt: Date.now(),
        pikminCount: 0, totalCorrect: 0, totalAttempts: 0,
        correctStreak: 0, bestStreak: 0, lastPractice: null,
        unitProgress: {}
      };
      this.saveStudentData(data);
    }

    this.state.student = data;
    this.state.totalCorrect = data.totalCorrect || 0;
    this.state.totalAttempts = data.totalAttempts || 0;
    this.state.correctStreak = data.correctStreak || 0;
    this.state.pikminCount = data.pikminCount || 0;

    document.getElementById('dashStudent').textContent = `${cls} - ${name}`;
    this.showView('dashboardView');
    this.updateDashboard();
    this.renderUnits();
    this.toast(this.t('toastLogin'));
  },

  loadStudentData(id) {
    try {
      const all = JSON.parse(localStorage.getItem('mathStudentData') || '{}');
      return all[id] || null;
    } catch(e) { return null; }
  },

  saveStudentData(data) {
    try {
      const all = JSON.parse(localStorage.getItem('mathStudentData') || '{}');
      all[data.id] = { ...data, lastPractice: Date.now() };
      localStorage.setItem('mathStudentData', JSON.stringify(all));
    } catch(e) {}
  },

  getAllStudents() {
    try {
      const all = JSON.parse(localStorage.getItem('mathStudentData') || '{}');
      return Object.values(all);
    } catch(e) { return []; }
  },

  saveAllStudents(students) {
    try {
      const map = {};
      for (const s of students) map[s.id] = s;
      localStorage.setItem('mathStudentData', JSON.stringify(map));
    } catch(e) {}
  },

  logout() {
    this.state.student = null;
    this.state.teacherAuthed = false;
    this.showView('loginView');
  },

  // ---------- 儀表板 ----------
  updateDashboard() {
    const s = this.state;
    const data = s.student || {};
    document.getElementById('statPikmin').querySelector('.stat-num').textContent = data.pikminCount || 0;
    document.getElementById('statSolved').querySelector('.stat-num').textContent = data.totalAttempts || 0;
    const acc = data.totalAttempts > 0 ? Math.round((data.totalCorrect / data.totalAttempts) * 100) : 0;
    document.getElementById('statAccuracy').querySelector('.stat-num').textContent = acc + '%';
    document.getElementById('statStreak').querySelector('.stat-num').textContent = data.correctStreak || 0;
  },

  renderUnits() {
    const units = [...new Set(this.state.problems.map(p => p.unit))];
    const grid = document.getElementById('unitGrid');
    grid.innerHTML = '';
    for (const unit of units) {
      const btn = document.createElement('button');
      btn.className = 'unit-btn';
      btn.textContent = unit;
      btn.onclick = () => this.selectUnit(unit, btn);
      grid.appendChild(btn);
    }
  },

  selectUnit(unit, btn) {
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.state.currentUnit = unit;
    document.getElementById('difficultySection').classList.remove('hidden');
  },

  // ---------- 開始練習 ----------
  async startPractice(difficulty) {
    if (!this.state.currentUnit) {
      this.toast(this.t('selectUnitFirst')); return;
    }
    this.state.currentDifficulty = difficulty;
    this.state.sessionProblems = this.getProblems(this.state.currentUnit, difficulty, 10);
    this.state.sessionIndex = 0;

    if (this.state.sessionProblems.length === 0) {
      this.toast(this.t('noProblems')); return;
    }

    // Apply adaptive algorithm
    this.applyAdaptive();

    document.getElementById('practiceUnitBadge').textContent = this.state.currentUnit;
    const diffMap = { easy: this.t('diffEasy'), medium: this.t('diffMedium'), hard: this.t('diffHard') };
    document.getElementById('practiceDiffBadge').textContent = diffMap[difficulty];
    document.getElementById('scoreDisplay').textContent = '⭐ ' + (this.state.student?.pikminCount || 0);

    this.showView('practiceView');
    this.state.sessionStart = Date.now();
    this.state.problemStart = Date.now();
    this.startTimer();
    this.showQuestion();
    this.toast(this.t('toastPractice'));
  },

  // ---------- 自適應學習演算法 ----------
  applyAdaptive() {
    const data = this.state.student;
    if (!data) return;
    const streak = data.correctStreak || 0;
    const total = data.totalAttempts || 0;
    const correct = data.totalCorrect || 0;
    const accuracy = total > 0 ? correct / total : 0;

    // Adaptively adjust difficulty based on performance
    let targetDiff = this.state.currentDifficulty;
    const diffLevels = ['easy', 'medium', 'hard'];
    const curLevel = diffLevels.indexOf(targetDiff);

    // 3+ consecutive correct → suggest harder
    if (streak >= 3 && curLevel < 2) {
      targetDiff = diffLevels[curLevel + 1];
    }
    // 2+ consecutive incorrect → suggest easier
    if (streak <= -2 && curLevel > 0) {
      targetDiff = diffLevels[curLevel - 1];
    }
    // Low accuracy (< 40%) → recommend easier
    if (total >= 5 && accuracy < 0.4 && curLevel > 0) {
      targetDiff = diffLevels[curLevel - 1];
    }
    // High accuracy (> 85%) and enough attempts → recommend harder
    if (total >= 10 && accuracy > 0.85 && curLevel < 2) {
      targetDiff = diffLevels[curLevel + 1];
    }

    if (targetDiff !== this.state.currentDifficulty) {
      const diffMap = { easy: this.t('diffEasy'), medium: this.t('diffMedium'), hard: this.t('diffHard') };
      const rec = diffMap[targetDiff];
      setTimeout(() => {
        this.toast(`💡 ${this.t('建議難度')}: ${rec}`, 3000);
      }, 500);
    }
  },

  // ---------- 顯示題目 ----------
  showQuestion() {
    const problems = this.state.sessionProblems;
    const idx = this.state.sessionIndex;

    if (idx >= problems.length) {
      // No more problems, generate more or end
      this.state.sessionProblems = this.getProblems(this.state.currentUnit, this.state.currentDifficulty, 10);
      this.state.sessionIndex = 0;
      if (this.state.sessionProblems.length === 0) {
        document.getElementById('questionText').textContent = this.t('暫無更多題目');
        return;
      }
    }

    const p = problems[this.state.sessionIndex];
    this.state.currentProblem = p;

    document.getElementById('questionNum').textContent = `${this.t('question')} ${idx + 1} ${this.t('end')}`;
    document.getElementById('questionText').textContent = this.state.language === 'en' && p.questionEn ? p.questionEn : p.question;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    const opts = p.options || [];

    for (const opt of opts) {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => this.checkAnswer(btn, opt);
      container.appendChild(btn);
    }

    // Reset feedback
    document.getElementById('feedbackArea').classList.add('hidden');
    document.getElementById('feedbackArea').classList.remove('is-correct', 'is-incorrect');
    document.getElementById('nextBtn').classList.add('hidden');
    document.getElementById('retryBtn').classList.add('hidden');
    document.getElementById('pikminReward').classList.add('hidden');

    // Enable options
    container.querySelectorAll('.option-btn').forEach(b => b.disabled = false);

    // Update progress
    const progress = ((idx + 1) / problems.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Start timer for this problem
    this.state.problemStart = Date.now();
  },

  // ---------- 檢查答案 ----------
  checkAnswer(btn, selected) {
    const p = this.state.currentProblem;
    const isCorrect = selected === p.answer;

    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const feedback = document.getElementById('feedbackArea');
    const feedbackText = document.getElementById('feedbackText');

    if (isCorrect) {
      btn.classList.add('correct');
      feedback.classList.add('is-correct');
      feedbackText.textContent = this.t('correct');
      this.state.totalCorrect++;
      this.state.correctStreak = (this.state.student?.correctStreak || 0) + 1;

      // Adaptive: increase difficulty if streak is high
      if (this.state.correctStreak >= 3) {
        this.tryUpgradeDifficulty();
      }

      // Show reward
      setTimeout(() => {
        document.getElementById('pikminReward').classList.remove('hidden');
        document.getElementById('nextBtn').classList.remove('hidden');
      }, 500);
    } else {
      btn.classList.add('incorrect');
      feedback.classList.add('is-incorrect');
      const exp = this.state.language === 'en' && p.explanationEn ? p.explanationEn : p.explanation || '';
      feedbackText.innerHTML = `${this.t('incorrect')}<br>${this.t('explanation')}: ${exp}`;
      this.state.correctStreak = 0;

      // Adaptive: if failing, allow retry
      setTimeout(() => {
        document.getElementById('retryBtn').classList.remove('hidden');
      }, 500);
    }

    this.state.totalAttempts++;

    // Update student data
    if (this.state.student) {
      const data = this.state.student;
      data.totalCorrect = this.state.totalCorrect;
      data.totalAttempts = this.state.totalAttempts;
      data.correctStreak = this.state.correctStreak;
      if (data.correctStreak > (data.bestStreak || 0)) data.bestStreak = data.correctStreak;
      this.saveStudentData(data);
    }

    feedback.classList.remove('hidden');
  },

  // ---------- 自適應升級 ----------
  tryUpgradeDifficulty() {
    const diffLevels = ['easy', 'medium', 'hard'];
    const cur = diffLevels.indexOf(this.state.currentDifficulty);
    if (cur < 2) {
      const nextDiff = diffLevels[cur + 1];
      const diffMap = { easy: this.t('diffEasy'), medium: this.t('diffMedium'), hard: this.t('diffHard') };
      this.toast(`🔥 ${this.t('連勝')}3! ${this.t('可挑戰')} ${diffMap[nextDiff]}${this.t('題目')}!`, 3000);
    }
  },

  // ---------- 收集皮克敏 ----------
  collectPikmin() {
    this.state.pikminCount++;
    if (this.state.student) {
      this.state.student.pikminCount = this.state.pikminCount;
      this.saveStudentData(this.state.student);
    }
    document.getElementById('scoreDisplay').textContent = '⭐ ' + this.state.pikminCount;
    document.getElementById('pikminReward').classList.add('hidden');
    this.showGarden();
  },

  // ---------- 下一題 ----------
  nextQuestion() {
    this.state.sessionIndex++;
    this.showQuestion();
  },

  // ---------- 再練一題 ----------
  retryQuestion() {
    // Load another problem of same difficulty
    const extra = this.getProblems(this.state.currentUnit, this.state.currentDifficulty, 1);
    if (extra.length > 0) {
      this.state.sessionProblems.splice(this.state.sessionIndex + 1, 0, ...extra);
    }
    this.showQuestion();
  },

  // ---------- 計時器 ----------
  startTimer() {
    if (this._timerInterval) clearInterval(this._timerInterval);
    const start = Date.now();
    this._timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const sec = String(elapsed % 60).padStart(2, '0');
      document.getElementById('timerDisplay').textContent = `⏱ ${min}:${sec}`;
    }, 1000);
  },

  stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  // ---------- 返回儀表板 ----------
  backToDashboard() {
    this.stopTimer();
    this.showView('dashboardView');
    this.updateDashboard();
    this.renderUnits();
    document.getElementById('difficultySection').classList.add('hidden');
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('selected'));
  },

  // ---------- 皮克敏花園 ----------
  showGarden() {
    document.getElementById('gardenCount').textContent =
      `${this.t('gardenCount')} ${this.state.pikminCount} ${this.t('gardenCountEnd')}`;
    const container = document.getElementById('gardenContainer');
    container.innerHTML = '';

    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    for (let i = 0; i < this.state.pikminCount; i++) {
      const el = document.createElement('div');
      el.className = 'pikmin-item';
      el.style.background = colors[i % colors.length];
      el.textContent = '🌱';
      el.style.fontSize = '30px';
      container.appendChild(el);
    }
    if (this.state.pikminCount === 0) {
      container.innerHTML = '<p style="color:#aaa;font-size:16px;padding:40px">答對題目收集皮克敏吧！</p>';
    }
    this.showView('gardenView');
  },

  hideGarden() {
    this.showView('practiceView');
  },

  // ---------- 排行榜 ----------
  showLeaderboard() {
    const select = document.getElementById('lbClassFilter');
    select.innerHTML = '<option value="all">全部班級</option>';
    const classes = [...new Set(this.getAllStudents().map(s => s.class))];
    for (const cls of classes) {
      const opt = document.createElement('option');
      opt.value = cls; opt.textContent = cls;
      select.appendChild(opt);
    }
    this.renderLeaderboard();
    this.showView('leaderboardView');
  },

  renderLeaderboard() {
    const filter = document.getElementById('lbClassFilter').value;
    let students = this.getAllStudents();
    if (filter !== 'all') students = students.filter(s => s.class === filter);

    // Sort by pikminCount (primary), then accuracy (secondary)
    students.sort((a, b) => {
      if ((b.pikminCount || 0) !== (a.pikminCount || 0)) return (b.pikminCount || 0) - (a.pikminCount || 0);
      const accA = a.totalAttempts > 0 ? a.totalCorrect / a.totalAttempts : 0;
      const accB = b.totalAttempts > 0 ? b.totalCorrect / b.totalAttempts : 0;
      return accB - accA;
    });

    const container = document.getElementById('lbContainer');
    container.innerHTML = '';

    if (students.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:30px;color:#aaa">暫無學生資料</p>';
      return;
    }

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const acc = s.totalAttempts > 0 ? Math.round((s.totalCorrect / s.totalAttempts) * 100) : 0;
      const rank = i + 1;
      let rankClass = '';
      if (rank === 1) rankClass = 'gold';
      else if (rank === 2) rankClass = 'silver';
      else if (rank === 3) rankClass = 'bronze';

      const item = document.createElement('div');
      item.className = 'lb-item';
      item.innerHTML = `
        <div class="lb-rank ${rankClass}">${rank}</div>
        <div class="lb-name">${s.name}</div>
        <div class="lb-stats">${s.class} | ${s.totalAttempts || 0}題 | ${acc}%</div>
        <div class="lb-pikmin">🌱 ${s.pikminCount || 0}</div>
      `;
      container.appendChild(item);
    }
  },

  hideLeaderboard() {
    this.showView('dashboardView');
  },

  // ---------- 教師專區 ----------
  showTeacherLogin() {
    document.getElementById('teacherPassword').value = '';
    document.getElementById('teacherError').classList.add('hidden');
    this.showView('teacherLoginView');
  },

  teacherAuth() {
    const pw = document.getElementById('teacherPassword').value;
    if (pw === this.t('teacherPassword')) {
      this.state.teacherAuthed = true;
      this.showView('teacherDashboardView');
      this.renderTeacherDashboard();
    } else {
      document.getElementById('teacherError').textContent = this.t('passwordError');
      document.getElementById('teacherError').classList.remove('hidden');
    }
  },

  showTeacherTab(tab) {
    document.querySelectorAll('.td-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.td-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('td' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
    if (tab === 'overview') this.renderTeacherOverview();
    if (tab === 'students') this.renderTeacherStudents();
    // Mark tab as active
    const tabMap = { overview: 'tabOverview', students: 'tabStudents', export: 'tabExport' };
    document.getElementById(tabMap[tab]).classList.add('active');
  },

  renderTeacherDashboard() {
    this.renderTeacherOverview();
    this.showTeacherTab('overview');
  },

  renderTeacherOverview() {
    const students = this.getAllStudents();
    document.getElementById('tdTotalStudents').textContent = students.length;

    let totalProblems = 0, totalCorrect = 0, activeToday = 0;
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);

    for (const s of students) {
      totalProblems += s.totalAttempts || 0;
      totalCorrect += s.totalCorrect || 0;
      if (s.lastPractice && s.lastPractice >= todayStart.getTime()) activeToday++;
    }

    document.getElementById('tdTotalProblems').textContent = totalProblems;
    const avgAcc = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;
    document.getElementById('tdTotalAccuracy').textContent = avgAcc + '%';
    document.getElementById('tdActiveToday').textContent = activeToday;

    // Unit distribution chart
    this.renderUnitChart();
  },

  renderUnitChart() {
    const chart = document.getElementById('tdUnitChart');
    const units = [...new Set(this.state.problems.map(p => p.unit))];
    const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e'];

    let html = '<h3 style="margin-bottom:10px">📊 各單元練習分布</h3><div class="chart-bar-group">';
    for (let i = 0; i < units.length; i++) {
      const count = this.state.problems.filter(p => p.unit === units[i]).length;
      const maxCount = Math.max(...units.map(u => this.state.problems.filter(p => p.unit === u).length));
      const height = Math.max(20, (count / maxCount) * 150);
      html += `<div class="chart-bar" style="height:${height}px;background:${colors[i % colors.length]}">${count}<br><span style="font-size:10px;opacity:0.8">${units[i]}</span></div>`;
    }
    html += '</div>';
    chart.innerHTML = html;
  },

  renderTeacherStudents() {
    const tbody = document.getElementById('tdTableBody');
    tbody.innerHTML = '';
    const students = this.getAllStudents();

    if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#aaa">暫無學生資料</td></tr>';
      return;
    }

    students.sort((a, b) => (b.totalAttempts || 0) - (a.totalAttempts || 0));

    for (const s of students) {
      const acc = s.totalAttempts > 0 ? Math.round((s.totalCorrect / s.totalAttempts) * 100) : 0;
      const last = s.lastPractice ? new Date(s.lastPractice).toLocaleDateString() : '-';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${s.name}</strong></td>
        <td>${s.class}</td>
        <td>${s.totalAttempts || 0}</td>
        <td>${acc}%</td>
        <td>${s.correctStreak || 0}</td>
        <td>🌱 ${s.pikminCount || 0}</td>
        <td>${last}</td>
      `;
      tbody.appendChild(tr);
    }
  },

  // ---------- 匯出報告 ----------
  exportReport() {
    const students = this.getAllStudents();
    if (students.length === 0) {
      this.toast('暫無學生資料可匯出'); return;
    }

    let csv = '班級,姓名,解題數,正確數,正確率,連勝,最佳連勝,皮克敏,最後練習\n';
    for (const s of students) {
      const acc = s.totalAttempts > 0 ? Math.round((s.totalCorrect / s.totalAttempts) * 100) : 0;
      const last = s.lastPractice ? new Date(s.lastPractice).toLocaleDateString() : '-';
      csv += `${s.class},${s.name},${s.totalAttempts || 0},${s.totalCorrect || 0},${acc}%,${s.correctStreak || 0},${s.bestStreak || 0},${s.pikminCount || 0},${last}\n`;
    }

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `學習報告_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('📥 報告已匯出！');
  },

  // ---------- 清除資料 ----------
  clearAllData() {
    if (confirm(this.t('confirmClear'))) {
      localStorage.removeItem('mathStudentData');
      // Also clear current state
      this.state.totalCorrect = 0;
      this.state.totalAttempts = 0;
      this.state.correctStreak = 0;
      this.state.pikminCount = 0;
      this.state.student = null;
      this.toast('所有資料已清除');
      this.renderTeacherDashboard();
    }
  },

  // ---------- 初始化 ----------
  async init() {
    // Load saved language
    const savedLang = localStorage.getItem('mathLang');
    if (savedLang) this.state.language = savedLang;

    await this.loadProblems();
    this.applyLanguage();

    // Check if use Pikmin colors
    console.log('🏫 高中數學練習系統 v2.0 loaded');
    console.log('📚 題庫筆數:', this.state.problems.length);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => app.init());