// SQL训练营移动应用增强版JavaScript文件

// 引入题库数据
importScripts('sql-questions-100.js');
importScripts('python-questions.js');

// 全局变量
let currentUser = null;
let currentExercise = null;
let currentQuestion = 0;
let userProgress = {};
let exerciseData = {};
let currentBank = 'sql'; // 'sql' 或 'python'
let currentDifficulty = 'medium';
let currentQuestions = [];
let currentQuizQuestions = [];
let currentQuizIndex = 0;
let quizAnswers = [];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    createParticles();
    loadUserData();
    updateDashboard();
});

// 初始化应用
function initializeApp() {
    // 检查是否是首次使用
    if (!localStorage.getItem('sql-trainer-initialized')) {
        initializeUserData();
        localStorage.setItem('sql-trainer-initialized', 'true');
    }
    
    // 初始化SQL编辑器
    if (document.getElementById('sql-editor')) {
        initializeSQLEditor();
    }
    
    // 设置触摸事件优化
    setupTouchOptimization();
    
    // 初始化通知系统
    setupNotificationSystem();
}

// 初始化用户数据
function initializeUserData() {
    const defaultUser = {
        name: 'SQL学习者',
        avatar: '用',
        joinDate: new Date().toISOString(),
        totalExercises: 0,
        correctAnswers: 0,
        studyTime: 0,
        streak: 0,
        achievements: [],
        recentActivities: [],
        progress: {
            sql: {
                easy: 0,
                medium: 0,
                hard: 0,
                totalCompleted: 0
            },
            python: {
                easy: 0,
                medium: 0,
                hard: 0,
                totalCompleted: 0
            }
        }
    };
    
    localStorage.setItem('sql-trainer-user', JSON.stringify(defaultUser));
    localStorage.setItem('sql-trainer-exercises', JSON.stringify([]));
}

// 加载用户数据
function loadUserData() {
    const userData = localStorage.getItem('sql-trainer-user');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

// 保存用户数据
function saveUserData() {
    if (currentUser) {
        localStorage.setItem('sql-trainer-user', JSON.stringify(currentUser));
    }
}

// 页面切换
function showPage(pageName) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    
    // 显示目标页面
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // 更新导航栏状态
    updateNavigation(pageName);
    
    // 根据页面加载相应内容
    switch(pageName) {
        case 'home':
            updateDashboard();
            break;
        case 'interactive':
            loadInteractiveExercises();
            break;
        case 'practice':
            loadPracticeExercise();
            break;
        case 'comprehensive':
            loadComprehensiveQuestions();
            break;
        case 'profile':
            updateProfile();
            break;
    }
    
    // 页面切换动画
    anime({
        targets: targetPage,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// 更新导航栏状态
function updateNavigation(activePage) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // 根据页面名称找到对应的导航项
    const pageMap = {
        'home': 0,
        'interactive': 1,
        'practice': 2,
        'comprehensive': 3,
        'profile': 4
    };
    
    const navIndex = pageMap[activePage];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
    }
}

// 综合练习相关功能

// 切换题库类型
function switchQuestionBank(bank) {
    currentBank = bank;
    
    // 更新按钮状态
    document.getElementById('sql-tab').className = bank === 'sql' ? 'btn-primary px-4 py-2 text-sm flex-1' : 'btn-secondary px-4 py-2 text-sm flex-1';
    document.getElementById('python-tab').className = bank === 'python' ? 'btn-primary px-4 py-2 text-sm flex-1' : 'btn-secondary px-4 py-2 text-sm flex-1';
    
    loadComprehensiveQuestions();
    updateBankStats();
}

// 选择难度
function selectBankDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // 更新按钮状态
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadComprehensiveQuestions();
}

// 加载综合练习题目
function loadComprehensiveQuestions() {
    let questions = [];
    
    if (currentBank === 'sql') {
        questions = sqlQuestions100.questions;
    } else if (currentBank === 'python') {
        questions = pythonQuestions.questions;
    }
    
    // 按难度筛选
    if (currentDifficulty !== 'all') {
        questions = questions.filter(q => q.difficulty === currentDifficulty);
    }
    
    currentQuestions = questions;
    renderComprehensiveQuestions();
    updateBankStats();
}

// 渲染综合练习题目
function renderComprehensiveQuestions() {
    const container = document.getElementById('comprehensive-questions');
    if (!container) return;
    
    container.innerHTML = '';
    
    currentQuestions.forEach((question, index) => {
        const isCompleted = userProgress[question.id];
        const questionCard = document.createElement('div');
        questionCard.className = 'glass-card p-4';
        questionCard.onclick = () => startQuestionQuiz(question);
        
        questionCard.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <span class="inline-block w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                            ${question.id}
                        </span>
                        <h4 class="font-semibold text-white text-sm">${question.title}</h4>
                        <span class="ml-2 px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}">
                            ${getDifficultyText(question.difficulty)}
                        </span>
                    </div>
                    <p class="text-gray-300 text-sm mb-3">${question.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">
                            ${isCompleted ? '✅ 已完成' : '⏳ 未开始'}
                        </span>
                        <button class="btn-primary px-3 py-1 text-xs" onclick="event.stopPropagation(); startQuestionQuiz(${JSON.stringify(question).replace(/"/g, '&quot;')})">
                            开始
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(questionCard);
    });
}

// 开始题目测验
function startQuestionQuiz(question) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold gradient-text">${question.title}</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div class="flex items-center mb-4">
                <span class="px-3 py-1 rounded-full text-sm ${getDifficultyColor(question.difficulty)}">
                    ${getDifficultyText(question.difficulty)}
                </span>
                <span class="ml-3 px-3 py-1 rounded-full text-sm bg-gray-600 text-gray-200">
                    ${question.category}
                </span>
            </div>
            
            <p class="text-gray-300 mb-6">${question.description}</p>
            
            <div class="space-y-3 mb-6">
                ${question.options.map((option, index) => `
                    <div class="glass-card p-3 rounded-lg">
                        <label class="flex items-center cursor-pointer">
                            <input type="radio" name="answer" value="${index}" class="mr-3">
                            <span class="text-gray-300 text-sm">${option}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex items-center justify-between">
                <button onclick="submitQuestionAnswer(${question.id})" class="btn-primary px-6 py-2 text-sm">
                    提交答案
                </button>
                <button onclick="showQuestionExplanation(${JSON.stringify(question).replace(/"/g, '&quot;')})" class="btn-secondary px-6 py-2 text-sm">
                    查看解析
                </button>
            </div>
            
            <div id="question-result" class="mt-4 hidden">
                <!-- 答案结果将在这里显示 -->
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// 提交题目答案
function submitQuestionAnswer(questionId) {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        showNotification('请选择一个答案', 'error');
        return;
    }
    
    let question;
    if (currentBank === 'sql') {
        question = sqlQuestions100.questions.find(q => q.id === questionId);
    } else {
        question = pythonQuestions.questions.find(q => q.id === questionId);
    }
    
    if (!question) return;
    
    const isCorrect = parseInt(selectedAnswer.value) === question.correct;
    
    // 记录进度
    userProgress[questionId] = {
        answered: true,
        correct: isCorrect,
        timestamp: Date.now(),
        bank: currentBank
    };
    localStorage.setItem('sql-trainer-progress', JSON.stringify(userProgress));
    
    // 更新用户统计
    if (currentUser) {
        currentUser.progress[currentBank].totalCompleted++;
        if (isCorrect) {
            currentUser.correctAnswers++;
        }
        currentUser.totalExercises++;
        saveUserData();
        updateDashboard();
    }
    
    // 显示结果
    const resultDiv = document.getElementById('question-result');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div class="glass-card p-4 rounded-lg ${isCorrect ? 'border-green-500' : 'border-red-500'}">
            <div class="flex items-center mb-2">
                <span class="text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}">
                    ${isCorrect ? '✅ 回答正确！' : '❌ 回答错误！'}
                </span>
            </div>
            <p class="text-gray-300 text-sm mb-2">${question.explanation}</p>
            <p class="text-gray-400 text-xs">
                正确答案：${question.options[question.correct]}
            </p>
        </div>
    `;
    
    if (isCorrect) {
        showNotification('回答正确！', 'success');
    } else {
        showNotification('回答错误，继续努力！', 'error');
    }
    
    updateBankStats();
}

// 显示题目解析
function showQuestionExplanation(question) {
    const resultDiv = document.getElementById('question-result');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div class="glass-card p-4 rounded-lg border-blue-500">
            <h4 class="text-white font-semibold mb-2">题目解析</h4>
            <p class="text-gray-300 text-sm mb-2">${question.explanation}</p>
            <p class="text-green-400 text-xs">
                正确答案：${question.options[question.correct]}
            </p>
        </div>
    `;
}

// 更新题库统计
function updateBankStats() {
    const totalElement = document.getElementById('bank-total');
    const completedElement = document.getElementById('bank-completed');
    
    if (!totalElement || !completedElement) return;
    
    let totalQuestions = 0;
    if (currentBank === 'sql') {
        totalQuestions = sqlQuestions100.questions.length;
    } else if (currentBank === 'python') {
        totalQuestions = pythonQuestions.questions.length;
    }
    
    const completedQuestions = Object.values(userProgress).filter(p => p.bank === currentBank).length;
    
    totalElement.textContent = totalQuestions;
    completedElement.textContent = completedQuestions;
}

// 获取难度颜色
function getDifficultyColor(difficulty) {
    const colors = {
        'easy': 'bg-green-500 text-green-100',
        'medium': 'bg-yellow-500 text-yellow-100',
        'hard': 'bg-red-500 text-red-100'
    };
    return colors[difficulty] || 'bg-gray-500 text-gray-100';
}

// 获取难度文本
function getDifficultyText(difficulty) {
    const texts = {
        'easy': '初级',
        'medium': '中级',
        'hard': '高级'
    };
    return texts[difficulty] || '未知';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// 更新仪表板
function updateDashboard() {
    if (!currentUser) return;
    
    // 更新统计数据
    document.getElementById('total-questions').textContent = currentUser.totalExercises;
    const accuracy = currentUser.totalExercises > 0 ? 
        Math.round((currentUser.correctAnswers / currentUser.totalExercises) * 100) : 0;
    document.getElementById('correct-rate').textContent = accuracy + '%';
    
    // 计算学习天数
    const joinDate = new Date(currentUser.joinDate);
    const today = new Date();
    const studyDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('study-days').textContent = studyDays;
    
    // 更新等级
    const level = getUserLevel();
    document.getElementById('current-level').textContent = level;
    
    // 更新进度环
    updateProgressRing();
    
    // 更新统计卡片
    updateStatCards();
}

// 获取用户等级
function getUserLevel() {
    const total = currentUser.totalExercises;
    if (total < 10) return '初级';
    if (total < 30) return '中级';
    if (total < 60) return '高级';
    return '专家';
}

// 更新进度环
function updateProgressRing() {
    const progress = calculateOverallProgress();
    const circle = document.getElementById('progress-circle');
    const text = document.getElementById('progress-text');
    
    if (circle && text) {
        const circumference = 2 * Math.PI * 36;
        const offset = circumference - (progress / 100) * circumference;
        
        anime({
            targets: circle,
            strokeDashoffset: offset,
            duration: 1000,
            easing: 'easeOutQuad'
        });
        
        anime({
            targets: text,
            innerHTML: [0, progress],
            duration: 1000,
            round: 1,
            easing: 'easeOutQuad'
        });
    }
}

// 计算总体进度
function calculateOverallProgress() {
    if (!currentUser) return 0;
    
    const totalQuestions = 200; // 100 SQL + 100 Python
    const completedQuestions = currentUser.progress.sql.totalCompleted + currentUser.progress.python.totalCompleted;
    
    return Math.round((completedQuestions / totalQuestions) * 100);
}

// 更新统计卡片
function updateStatCards() {
    const sqlProgress = currentUser.progress.sql;
    const pythonProgress = currentUser.progress.python;
    
    // 更新SQL统计
    const sqlTotalElement = document.getElementById('sql-total');
    const sqlCompletedElement = document.getElementById('sql-completed');
    
    if (sqlTotalElement) sqlTotalElement.textContent = '100';
    if (sqlCompletedElement) sqlCompletedElement.textContent = sqlProgress.totalCompleted;
    
    // 更新Python统计
    const pythonTotalElement = document.getElementById('python-total');
    const pythonCompletedElement = document.getElementById('python-completed');
    
    if (pythonTotalElement) pythonTotalElement.textContent = '100';
    if (pythonCompletedElement) pythonCompletedElement.textContent = pythonProgress.totalCompleted;
}

// 创建粒子效果
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 设置触摸优化
function setupTouchOptimization() {
    // 防止双击缩放
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// 设置通知系统
function setupNotificationSystem() {
    // 检查通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// 显示通知
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 加载互动练习
function loadInteractiveExercises() {
    // 这里可以添加互动练习的加载逻辑
    console.log('Loading interactive exercises...');
}

// 加载实战练习
function loadPracticeExercise() {
    // 这里可以添加实战练习的加载逻辑
    console.log('Loading practice exercises...');
}

// 更新个人中心
function updateProfile() {
    if (!currentUser) return;
    
    // 更新用户信息
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-avatar').textContent = currentUser.avatar;
    document.getElementById('study-streak').textContent = currentUser.streak;
    
    // 更新统计数据
    document.getElementById('total-exercises').textContent = currentUser.totalExercises;
    const accuracy = currentUser.totalExercises > 0 ? 
        Math.round((currentUser.correctAnswers / currentUser.totalExercises) * 100) : 0;
    document.getElementById('accuracy-rate').textContent = accuracy + '%';
    document.getElementById('study-time').textContent = Math.round(currentUser.studyTime) + 'h';
    document.getElementById('achievements').textContent = currentUser.achievements.length;
    
    // 更新成就徽章
    updateAchievements();
    
    // 更新学习记录
    updateRecentActivities();
}

// 更新成就徽章
function updateAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    const allAchievements = [
        { id: 'first_exercise', name: '初次练习', icon: '🎯', description: '完成第一次练习' },
        { id: 'streak_7', name: '连续7天', icon: '🔥', description: '连续学习7天' },
        { id: 'accuracy_90', name: '高准确率', icon: '🎯', description: '准确率达到90%' },
        { id: 'sql_master', name: 'SQL大师', icon: '💎', description: '完成所有SQL题目' },
        { id: 'python_master', name: 'Python大师', icon: '🐍', description: '完成所有Python题目' }
    ];
    
    achievementsGrid.innerHTML = '';
    
    allAchievements.forEach(achievement => {
        const isUnlocked = currentUser.achievements.includes(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `text-center p-2 rounded-lg ${isUnlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-600'}`;
        achievementElement.innerHTML = `
            <div class="text-2xl mb-1">${achievement.icon}</div>
            <div class="text-xs text-white">${achievement.name}</div>
        `;
        achievementsGrid.appendChild(achievementElement);
    });
}

// 更新学习记录
function updateRecentActivities() {
    const recentActivities = document.getElementById('recent-activities');
    if (!recentActivities) return;
    
    const activities = currentUser.recentActivities.slice(0, 5);
    
    if (activities.length === 0) {
        recentActivities.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">暂无学习记录</p>';
        return;
    }
    
    recentActivities.innerHTML = activities.map(activity => `
        <div class="flex items-center p-3 bg-white/5 rounded-lg">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-3">
                <span class="text-white text-sm">${activity.type === 'sql' ? 'SQL' : 'Py'}</span>
            </div>
            <div class="flex-1">
                <div class="text-sm text-white">${activity.title}</div>
                <div class="text-xs text-gray-400">${activity.date}</div>
            </div>
            <div class="text-xs ${activity.correct ? 'text-green-400' : 'text-red-400'}">
                ${activity.correct ? '正确' : '错误'}
            </div>
        </div>
    `).join('');
}

// 编辑个人资料
function editProfile() {
    showNotification('编辑资料功能即将推出', 'success');
}

// 重置进度
function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
        localStorage.clear();
        initializeUserData();
        loadUserData();
        updateDashboard();
        updateProfile();
        showNotification('进度已重置', 'success');
    }
}

// 初始化SQL编辑器
function initializeSQLEditor() {
    const editorElement = document.getElementById('sql-editor');
    if (!editorElement) return;
    
    const editor = CodeMirror.fromTextArea(editorElement, {
        mode: 'text/x-sql',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        viewportMargin: Infinity
    });
    
    window.sqlEditor = editor;
}

// 其他功能函数

function startRecommendedExercise() {
    showNotification('推荐练习即将推出', 'success');
}

function loadQuestions() {
    console.log('Loading questions...');
}

// 模态框控制
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// 导出函数供HTML调用
window.showPage = showPage;
window.switchQuestionBank = switchQuestionBank;
window.selectBankDifficulty = selectBankDifficulty;
window.startQuestionQuiz = startQuestionQuiz;
window.submitQuestionAnswer = submitQuestionAnswer;
window.showQuestionExplanation = showQuestionExplanation;
window.closeModal = closeModal;
window.editProfile = editProfile;
window.resetProgress = resetProgress;
window.startRecommendedExercise = startRecommendedExercise;