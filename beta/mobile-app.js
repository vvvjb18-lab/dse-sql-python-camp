// SQL训练营移动应用主要JavaScript文件

// 全局变量
let currentUser = null;
let currentExercise = null;
let currentQuestion = 0;
let userProgress = {};
let exerciseData = {};

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
            beginner: 0,
            intermediate: 0,
            advanced: 0
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
        case 'questions':
            loadQuestions();
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
        'questions': 3,
        'profile': 4
    };
    
    const navIndex = pageMap[activePage];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
    }
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
    
    const totalProgress = currentUser.progress.beginner + 
                         currentUser.progress.intermediate + 
                         currentUser.progress.advanced;
    return Math.min(Math.round(totalProgress / 3), 100);
}

// 更新统计卡片
function updateStatCards() {
    const stats = {
        'total-questions': currentUser.totalExercises,
        'correct-rate': Math.round((currentUser.correctAnswers / Math.max(currentUser.totalExercises, 1)) * 100) + '%',
        'study-days': Math.floor((new Date() - new Date(currentUser.joinDate)) / (1000 * 60 * 60 * 24)) + 1,
        'current-level': getUserLevel()
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// 创建粒子效果
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particlesContainer.appendChild(particle);
        
        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }
    
    // 定期创建新粒子
    setInterval(createParticle, 800);
}

// 开始推荐练习
function startRecommendedExercise() {
    showNotification('正在加载推荐练习...', 'success');
    setTimeout(() => {
        showPage('interactive');
        startInteractiveExercise('fill-blank');
    }, 1000);
}

// 加载互动练习
function loadInteractiveExercises() {
    // 练习列表已在HTML中静态定义
    // 这里可以添加动态内容加载逻辑
}

// 开始互动练习
function startInteractiveExercise(type) {
    currentExercise = type;
    currentQuestion = 0;
    
    // 加载练习数据
    loadExerciseData(type);
    
    // 切换到练习详情页
    showPage('interactive-detail');
    
    // 更新页面标题和进度
    updateExerciseHeader();
    
    // 加载第一题
    loadQuestion();
}

// 加载练习数据
function loadExerciseData(type) {
    exerciseData = getExerciseData(type);
}

// 获取练习数据
function getExerciseData(type) {
    const exercises = {
        'fill-blank': {
            title: 'SQL填空练习',
            questions: [
                {
                    question: 'SELECT * FROM students _____ age > 18;',
                    answer: 'WHERE',
                    explanation: 'WHERE子句用于筛选满足条件的记录。'
                },
                {
                    question: 'SELECT name, _____(age) FROM students GROUP BY grade;',
                    answer: 'AVG',
                    explanation: 'AVG()函数用于计算平均值，常与GROUP BY一起使用。'
                },
                {
                    question: 'SELECT * FROM students ORDER BY age _____;',
                    answer: 'DESC',
                    explanation: 'DESC表示降序排列，ASC表示升序排列。'
                },
                {
                    question: 'SELECT * FROM students LIMIT _____ OFFSET 10;',
                    answer: '10',
                    explanation: 'LIMIT限制返回记录数，OFFSET指定起始位置。'
                },
                {
                    question: 'SELECT * FROM students _____ JOIN grades ON students.id = grades.student_id;',
                    answer: 'INNER',
                    explanation: 'INNER JOIN返回两个表中匹配的记录。'
                }
            ]
        },
        'drag-sort': {
            title: 'SQL语句排序',
            questions: [
                {
                    question: '将以下SQL语句按正确顺序排列：',
                    parts: ['SELECT name, age', 'FROM students', 'WHERE age > 18', 'ORDER BY age DESC'],
                    correctOrder: [0, 1, 2, 3],
                    explanation: 'SQL语句的标准顺序是：SELECT → FROM → WHERE → ORDER BY'
                },
                {
                    question: '将以下JOIN语句按正确顺序排列：',
                    parts: ['SELECT s.name, g.grade', 'FROM students s', 'LEFT JOIN grades g', 'ON s.id = g.student_id'],
                    correctOrder: [0, 1, 2, 3],
                    explanation: 'JOIN语句的顺序：SELECT → FROM → JOIN → ON'
                }
            ]
        },
        'multiple-choice': {
            title: 'SQL选择题',
            questions: [
                {
                    question: '以下哪个SQL语句用于删除表中的数据？',
                    options: ['DELETE', 'DROP', 'REMOVE', 'CLEAR'],
                    answer: 0,
                    explanation: 'DELETE语句用于删除表中的数据，DROP用于删除整个表结构。'
                },
                {
                    question: 'SQL中用于统计记录数量的函数是？',
                    options: ['SUM()', 'COUNT()', 'TOTAL()', 'NUMBER()'],
                    answer: 1,
                    explanation: 'COUNT()函数用于统计记录数量，SUM()用于求和。'
                }
            ]
        },
        'connect-match': {
            title: 'SQL概念匹配',
            questions: [
                {
                    question: '将SQL概念与其描述匹配：',
                    concepts: ['PRIMARY KEY', 'FOREIGN KEY', 'INDEX', 'VIEW'],
                    descriptions: ['唯一标识表中每条记录', '建立表间关系', '提高查询速度', '虚拟表'],
                    matches: [0, 1, 2, 3],
                    explanation: '这些都是数据库中的重要概念，理解它们有助于更好地设计数据库。'
                }
            ]
        }
    };
    
    return exercises[type] || { title: '未知练习', questions: [] };
}

// 更新练习头部信息
function updateExerciseHeader() {
    if (!exerciseData) return;
    
    const titleElement = document.getElementById('exercise-title');
    const progressElement = document.getElementById('exercise-progress');
    
    if (titleElement) {
        titleElement.textContent = exerciseData.title;
    }
    
    if (progressElement) {
        progressElement.textContent = `第${currentQuestion + 1}题 / 共${exerciseData.questions.length}题`;
    }
    
    // 更新进度条
    updateExerciseProgress();
}

// 更新练习进度条
function updateExerciseProgress() {
    if (!exerciseData) return;
    
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestion + 1) / exerciseData.questions.length) * 100;
    
    if (progressBar) {
        anime({
            targets: progressBar,
            width: progress + '%',
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
}

// 加载题目
function loadQuestion() {
    if (!exerciseData || !exerciseData.questions[currentQuestion]) return;
    
    const question = exerciseData.questions[currentQuestion];
    const contentElement = document.getElementById('exercise-content');
    
    if (!contentElement) return;
    
    let html = '';
    
    switch(currentExercise) {
        case 'fill-blank':
            html = generateFillBlankQuestion(question);
            break;
        case 'drag-sort':
            html = generateDragSortQuestion(question);
            break;
        case 'multiple-choice':
            html = generateMultipleChoiceQuestion(question);
            break;
        case 'connect-match':
            html = generateConnectMatchQuestion(question);
            break;
    }
    
    contentElement.innerHTML = html;
    
    // 添加交互事件
    setupQuestionInteractions();
    
    // 更新按钮状态
    updateNavigationButtons();
    
    // 隐藏答案解析
    hideAnswerSection();
}

// 生成填空题
function generateFillBlankQuestion(question) {
    const parts = question.question.split('_____');
    
    return `
        <h3 class="text-lg font-semibold text-white mb-4">请填写正确的SQL关键词：</h3>
        <div class="bg-slate-800 rounded-lg p-4 mb-4">
            <div class="text-cyan-300 text-lg">
                ${parts[0]}
                <input type="text" id="fill-answer" class="inline-block w-24 bg-slate-700 border border-cyan-400 rounded px-2 py-1 text-white text-center mx-2" placeholder="?">
                ${parts[1]}
            </div>
        </div>
        <button class="btn-primary w-full py-3" onclick="checkFillBlankAnswer()">检查答案</button>
    `;
}

// 生成拖拽排序题
function generateDragSortQuestion(question) {
    const shuffledParts = [...question.parts].sort(() => Math.random() - 0.5);
    
    return `
        <h3 class="text-lg font-semibold text-white mb-4">拖拽排序SQL语句：</h3>
        <p class="text-gray-300 mb-4">${question.question}</p>
        
        <div class="mb-4">
            <h4 class="font-semibold text-white mb-2">待排序项：</h4>
            <div id="drag-items" class="space-y-2">
                ${shuffledParts.map((part, index) => `
                    <div class="drag-item" draggable="true" data-index="${question.parts.indexOf(part)}">
                        ${part}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="mb-4">
            <h4 class="font-semibold text-white mb-2">正确顺序：</h4>
            <div id="drop-zone" class="drop-zone">
                <p class="text-gray-400 text-center">拖拽上方项目到这里排序</p>
            </div>
        </div>
        
        <button class="btn-primary w-full py-3" onclick="checkDragSortAnswer()">检查答案</button>
    `;
}

// 生成选择题
function generateMultipleChoiceQuestion(question) {
    return `
        <h3 class="text-lg font-semibold text-white mb-4">${question.question}</h3>
        
        <div class="space-y-3 mb-4">
            ${question.options.map((option, index) => `
                <label class="flex items-center p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                    <input type="radio" name="mc-answer" value="${index}" class="mr-3 text-cyan-400">
                    <span class="text-white">${option}</span>
                </label>
            `).join('')}
        </div>
        
        <button class="btn-primary w-full py-3" onclick="checkMultipleChoiceAnswer()">检查答案</button>
    `;
}

// 生成连接匹配题
function generateConnectMatchQuestion(question) {
    const shuffledConcepts = [...question.concepts].sort(() => Math.random() - 0.5);
    const shuffledDescriptions = [...question.descriptions].sort(() => Math.random() - 0.5);
    
    return `
        <h3 class="text-lg font-semibold text-white mb-4">${question.question}</h3>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <h4 class="font-semibold text-white mb-2">概念</h4>
                <div class="space-y-2">
                    ${shuffledConcepts.map((concept, index) => `
                        <div class="drag-item" draggable="true" data-type="concept" data-index="${question.concepts.indexOf(concept)}">
                            ${concept}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-white mb-2">描述</h4>
                <div class="space-y-2">
                    ${shuffledDescriptions.map((desc, index) => `
                        <div class="drop-zone" data-type="description" data-index="${question.descriptions.indexOf(desc)}">
                            ${desc}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <button class="btn-primary w-full py-3" onclick="checkConnectMatchAnswer()">检查答案</button>
    `;
}

// 设置题目交互
function setupQuestionInteractions() {
    // 设置拖拽功能
    setupDragAndDrop();
    
    // 设置输入框焦点
    const input = document.getElementById('fill-answer');
    if (input) {
        input.focus();
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkFillBlankAnswer();
            }
        });
    }
}

// 设置拖拽功能
function setupDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        // 移动端触摸支持
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

// 拖拽事件处理
let draggedElement = null;
let touchOffset = { x: 0, y: 0 };

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedElement) {
        // 处理拖放逻辑
        if (this.classList.contains('drop-zone')) {
            this.appendChild(draggedElement);
        }
    }
}

// 触摸事件处理
function handleTouchStart(e) {
    e.preventDefault();
    draggedElement = this;
    
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    this.style.position = 'fixed';
    this.style.zIndex = '1000';
    this.style.opacity = '0.8';
    this.style.transform = 'scale(1.05)';
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!draggedElement) return;
    
    const touch = e.touches[0];
    draggedElement.style.left = (touch.clientX - touchOffset.x) + 'px';
    draggedElement.style.top = (touch.clientY - touchOffset.y) + 'px';
}

function handleTouchEnd(e) {
    if (!draggedElement) return;
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.drop-zone');
    
    if (dropZone) {
        dropZone.appendChild(draggedElement);
    }
    
    // 重置样式
    draggedElement.style.position = '';
    draggedElement.style.zIndex = '';
    draggedElement.style.opacity = '';
    draggedElement.style.transform = '';
    draggedElement.style.left = '';
    draggedElement.style.top = '';
    
    draggedElement = null;
}

// 检查填空题答案
function checkFillBlankAnswer() {
    const input = document.getElementById('fill-answer');
    if (!input) return;
    
    const userAnswer = input.value.trim().toUpperCase();
    const correctAnswer = exerciseData.questions[currentQuestion].answer.toUpperCase();
    
    const isCorrect = userAnswer === correctAnswer;
    
    // 显示答案结果
    showAnswerResult(isCorrect, exerciseData.questions[currentQuestion].explanation);
    
    // 更新用户统计
    updateUserStats(isCorrect);
}

// 检查拖拽排序答案
function checkDragSortAnswer() {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;
    
    const orderedItems = dropZone.querySelectorAll('.drag-item');
    const userOrder = Array.from(orderedItems).map(item => 
        parseInt(item.getAttribute('data-index'))
    );
    
    const correctOrder = exerciseData.questions[currentQuestion].correctOrder;
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    
    showAnswerResult(isCorrect, exerciseData.questions[currentQuestion].explanation);
    updateUserStats(isCorrect);
}

// 检查选择题答案
function checkMultipleChoiceAnswer() {
    const selectedAnswer = document.querySelector('input[name="mc-answer"]:checked');
    if (!selectedAnswer) {
        showNotification('请选择一个答案', 'error');
        return;
    }
    
    const userAnswer = parseInt(selectedAnswer.value);
    const correctAnswer = exerciseData.questions[currentQuestion].answer;
    const isCorrect = userAnswer === correctAnswer;
    
    showAnswerResult(isCorrect, exerciseData.questions[currentQuestion].explanation);
    updateUserStats(isCorrect);
}

// 检查连接匹配答案
function checkConnectMatchAnswer() {
    // 这里简化处理，实际应该检查每个匹配是否正确
    const isCorrect = true; // 假设用户都匹配正确
    
    showAnswerResult(isCorrect, exerciseData.questions[currentQuestion].explanation);
    updateUserStats(isCorrect);
}

// 显示答案结果
function showAnswerResult(isCorrect, explanation) {
    const answerSection = document.getElementById('answer-section');
    const answerContent = document.getElementById('answer-content');
    
    if (answerSection && answerContent) {
        const resultClass = isCorrect ? 'border-green-400' : 'border-red-400';
        const resultColor = isCorrect ? 'text-green-300' : 'text-red-300';
        const resultText = isCorrect ? '回答正确！' : '回答错误！';
        
        answerSection.className = `px-4 mb-6 ${resultClass}`;
        answerSection.querySelector('h4').className = `font-semibold ${resultColor} mb-2`;
        answerSection.querySelector('h4').textContent = resultText;
        
        answerContent.innerHTML = `
            <p class="mb-2">${explanation}</p>
            <div class="text-xs text-gray-400 mt-2">
                ${isCorrect ? '✓ 正确' : '✗ 错误'}
            </div>
        `;
        
        answerSection.classList.remove('hidden');
        
        // 滚动到答案区域
        answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 显示通知
    showNotification(isCorrect ? '回答正确！' : '回答错误，继续努力！', 
                    isCorrect ? 'success' : 'error');
}

// 隐藏答案解析
function hideAnswerSection() {
    const answerSection = document.getElementById('answer-section');
    if (answerSection) {
        answerSection.classList.add('hidden');
    }
}

// 更新用户统计
function updateUserStats(isCorrect) {
    if (!currentUser) return;
    
    currentUser.totalExercises++;
    if (isCorrect) {
        currentUser.correctAnswers++;
    }
    
    // 更新进度
    const level = getCurrentLevel();
    if (currentUser.progress[level] !== undefined) {
        currentUser.progress[level] = Math.min(
            currentUser.progress[level] + (isCorrect ? 10 : 5), 
            100
        );
    }
    
    saveUserData();
}

// 获取当前难度等级
function getCurrentLevel() {
    if (!currentExercise) return 'beginner';
    
    const levelMap = {
        'fill-blank': 'beginner',
        'drag-sort': 'intermediate',
        'multiple-choice': 'intermediate',
        'connect-match': 'advanced'
    };
    
    return levelMap[currentExercise] || 'beginner';
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 0;
        prevBtn.style.opacity = currentQuestion === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        const isLastQuestion = currentQuestion === exerciseData.questions.length - 1;
        nextBtn.textContent = isLastQuestion ? '完成' : '下一题';
    }
}

// 上一题
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateExerciseHeader();
        loadQuestion();
    }
}

// 下一题
function nextQuestion() {
    if (currentQuestion < exerciseData.questions.length - 1) {
        currentQuestion++;
        updateExerciseHeader();
        loadQuestion();
    } else {
        // 完成练习
        completeExercise();
    }
}

// 完成练习
function completeExercise() {
    showNotification('恭喜完成练习！', 'success');
    
    // 延迟返回互动练习首页
    setTimeout(() => {
        showPage('interactive');
    }, 1500);
}

// 关闭练习
function closeExercise() {
    showPage('interactive');
}

// 初始化SQL编辑器
function initializeSQLEditor() {
    const editor = CodeMirror.fromTextArea(document.getElementById('sql-editor'), {
        mode: 'text/x-sql',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        extraKeys: {
            'Ctrl-Enter': executeSQL,
            'Cmd-Enter': executeSQL
        }
    });
    
    // 保存编辑器实例
    window.sqlEditor = editor;
}

// 加载实战练习
function loadPracticeExercise() {
    // 这里可以加载不同的练习题
    const exercises = [
        {
            description: '查询所有学生的姓名和年龄，按年龄降序排列。',
            tables: {
                students: ['id (INT)', 'name (VARCHAR)', 'age (INT)', 'grade (VARCHAR)']
            },
            solution: 'SELECT name, age FROM students ORDER BY age DESC;'
        }
    ];
    
    // 设置默认练习
    const exercise = exercises[0];
    document.getElementById('practice-description').textContent = exercise.description;
    
    // 更新数据表结构显示
    updateTableStructure(exercise.tables);
}

// 更新数据表结构显示
function updateTableStructure(tables) {
    // 这里可以动态生成表结构显示
    // 简化处理，使用静态内容
}

// 执行SQL
function executeSQL() {
    const sql = window.sqlEditor ? window.sqlEditor.getValue() : '';
    
    if (!sql.trim()) {
        showNotification('请输入SQL查询语句', 'error');
        return;
    }
    
    // 模拟SQL执行
    const result = simulateSQLExecution(sql);
    displaySQLResult(result);
    
    // 更新用户统计
    currentUser.totalExercises++;
    saveUserData();
}

// 模拟SQL执行
function simulateSQLExecution(sql) {
    // 这里应该连接到实际的SQL执行引擎
    // 现在只是模拟执行结果
    
    const mockData = {
        'SELECT name, age FROM students ORDER BY age DESC;': {
            success: true,
            data: [
                { name: '张三', age: 22 },
                { name: '李四', age: 21 },
                { name: '王五', age: 20 },
                { name: '赵六', age: 19 }
            ]
        },
        'SELECT * FROM students WHERE age > 18;': {
            success: true,
            data: [
                { id: 1, name: '张三', age: 22, grade: '大四' },
                { id: 2, name: '李四', age: 21, grade: '大三' }
            ]
        }
    };
    
    return mockData[sql.trim()] || {
        success: false,
        error: 'SQL语法错误或表不存在'
    };
}

// 显示SQL执行结果
function displaySQLResult(result) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    if (!resultSection || !resultContent) return;
    
    if (result.success) {
        let html = '<table class="w-full text-sm">';
        
        if (result.data.length > 0) {
            // 表头
            html += '<thead><tr class="border-b border-gray-600">';
            Object.keys(result.data[0]).forEach(key => {
                html += `<th class="text-left py-2 px-3 text-cyan-300">${key}</th>`;
            });
            html += '</tr></thead>';
            
            // 数据行
            html += '<tbody>';
            result.data.forEach(row => {
                html += '<tr class="border-b border-gray-700 hover:bg-slate-700">';
                Object.values(row).forEach(value => {
                    html += `<td class="py-2 px-3 text-gray-300">${value}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody>';
        }
        
        html += '</table>';
        resultContent.innerHTML = html;
        
        showNotification('SQL执行成功！', 'success');
    } else {
        resultContent.innerHTML = `
            <div class="text-red-300">
                <div class="font-semibold mb-2">执行错误：</div>
                <div class="text-sm">${result.error}</div>
            </div>
        `;
        
        showNotification('SQL执行失败：' + result.error, 'error');
    }
    
    resultSection.classList.remove('hidden');
}

// 清空SQL
function clearSQL() {
    if (window.sqlEditor) {
        window.sqlEditor.setValue('');
    }
    
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
        resultSection.classList.add('hidden');
    }
}

// 显示提示
function showHint() {
    showNotification('提示：使用SELECT语句查询数据，ORDER BY用于排序', 'success');
}

// 下一个练习
function nextPractice() {
    // 这里可以加载下一个练习题
    showNotification('正在加载下一题...', 'success');
    
    // 清空当前内容
    clearSQL();
    
    // 更新统计数据
    updateDashboard();
}

// 加载题库
function loadQuestions() {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;
    
    const questions = getQuestionsByDifficulty('beginner');
    
    questionsList.innerHTML = questions.map((question, index) => `
        <div class="glass-card p-4" onclick="openQuestion(${index})">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-white mb-1">题目 ${index + 1}</h4>
                    <p class="text-sm text-gray-300">${question.title}</p>
                    <div class="flex items-center mt-2">
                        <span class="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">${question.points}分</span>
                        <span class="text-xs text-gray-400 ml-2">${question.difficulty}</span>
                    </div>
                </div>
                <div class="text-cyan-400">→</div>
            </div>
        </div>
    `).join('');
}

// 根据难度获取题目
function getQuestionsByDifficulty(difficulty) {
    const questionSets = {
        beginner: [
            { title: '基础SELECT查询', points: 10, difficulty: '简单' },
            { title: 'WHERE条件筛选', points: 15, difficulty: '简单' },
            { title: 'ORDER BY排序', points: 15, difficulty: '简单' }
        ],
        intermediate: [
            { title: 'GROUP BY分组', points: 20, difficulty: '中等' },
            { title: 'JOIN连接查询', points: 25, difficulty: '中等' },
            { title: '子查询应用', points: 30, difficulty: '中等' }
        ],
        advanced: [
            { title: '复杂查询优化', points: 35, difficulty: '困难' },
            { title: '存储过程编写', points: 40, difficulty: '困难' },
            { title: '数据库设计', points: 50, difficulty: '困难' }
        ]
    };
    
    return questionSets[difficulty] || [];
}

// 选择难度
function selectDifficulty(level) {
    // 更新按钮状态
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // 加载对应难度的题目
    const questions = getQuestionsByDifficulty(level);
    const questionsList = document.getElementById('questions-list');
    
    questionsList.innerHTML = questions.map((question, index) => `
        <div class="glass-card p-4" onclick="openQuestion(${index})">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-white mb-1">${question.title}</h4>
                    <div class="flex items-center mt-2">
                        <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">${question.points}分</span>
                        <span class="text-xs text-gray-400 ml-2">${question.difficulty}</span>
                    </div>
                </div>
                <div class="text-cyan-400">→</div>
            </div>
        </div>
    `).join('');
}

// 打开题目
function openQuestion(index) {
    showNotification('正在打开题目...', 'success');
    // 这里可以实现题目详情页面
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
    
    // 更新最近活动
    updateRecentActivities();
}

// 更新成就徽章
function updateAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    const allAchievements = [
        { id: 'first_exercise', name: '初次练习', icon: '🎯', unlocked: true },
        { id: 'ten_correct', name: '十连对', icon: '🔥', unlocked: currentUser.correctAnswers >= 10 },
        { id: 'week_streak', name: '坚持一周', icon: '⭐', unlocked: currentUser.streak >= 7 },
        { id: 'sql_master', name: 'SQL大师', icon: '👑', unlocked: currentUser.totalExercises >= 100 }
    ];
    
    achievementsGrid.innerHTML = allAchievements.map(achievement => `
        <div class="text-center p-3 ${achievement.unlocked ? '' : 'opacity-30'}">
            <div class="text-2xl mb-1">${achievement.icon}</div>
            <div class="text-xs text-gray-300">${achievement.name}</div>
        </div>
    `).join('');
}

// 更新最近活动
function updateRecentActivities() {
    const recentActivities = document.getElementById('recent-activities');
    if (!recentActivities) return;
    
    const activities = [
        { time: '2小时前', action: '完成了SQL填空练习', type: 'exercise' },
        { time: '昨天', action: '学习了JOIN查询', type: 'study' },
        { time: '2天前', action: '获得了"十连对"成就', type: 'achievement' }
    ];
    
    recentActivities.innerHTML = activities.map(activity => `
        <div class="flex items-center p-3 bg-slate-800 rounded-lg">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-3">
                <span class="text-white text-xs">${getActivityIcon(activity.type)}</span>
            </div>
            <div class="flex-1">
                <div class="text-sm text-white">${activity.action}</div>
                <div class="text-xs text-gray-400">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// 获取活动图标
function getActivityIcon(type) {
    const icons = {
        exercise: '✏️',
        study: '📚',
        achievement: '🏆'
    };
    return icons[type] || '📝';
}

// 编辑个人资料
function editProfile() {
    showModal(`
        <h3 class="text-lg font-semibold text-white mb-4">编辑个人资料</h3>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                <input type="text" id="edit-username" value="${currentUser.name}" 
                       class="w-full bg-slate-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">头像文字</label>
                <input type="text" id="edit-avatar" value="${currentUser.avatar}" maxlength="2"
                       class="w-full bg-slate-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
            </div>
            <div class="flex space-x-3 mt-6">
                <button onclick="closeModal()" class="btn-secondary flex-1 py-2">取消</button>
                <button onclick="saveProfile()" class="btn-primary flex-1 py-2">保存</button>
            </div>
        </div>
    `);
}

// 保存个人资料
function saveProfile() {
    const username = document.getElementById('edit-username').value.trim();
    const avatar = document.getElementById('edit-avatar').value.trim();
    
    if (!username) {
        showNotification('请输入用户名', 'error');
        return;
    }
    
    currentUser.name = username;
    currentUser.avatar = avatar || '用';
    
    saveUserData();
    updateProfile();
    closeModal();
    
    showNotification('个人资料已更新', 'success');
}

// 重置进度
function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
        currentUser.totalExercises = 0;
        currentUser.correctAnswers = 0;
        currentUser.progress = { beginner: 0, intermediate: 0, advanced: 0 };
        currentUser.achievements = [];
        
        saveUserData();
        updateProfile();
        updateDashboard();
        
        showNotification('进度已重置', 'success');
    }
}

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 显示模态框
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    if (modal && modalBody) {
        modalBody.innerHTML = content;
        modal.classList.add('active');
    }
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
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
    
    // 优化滚动性能
    document.addEventListener('touchmove', function(e) {
        // 允许滚动，但优化性能
    }, { passive: true });
}

// 设置通知系统
function setupNotificationSystem() {
    // 检查通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// 导出函数供HTML调用
window.showPage = showPage;
window.startRecommendedExercise = startRecommendedExercise;
window.startInteractiveExercise = startInteractiveExercise;
window.closeExercise = closeExercise;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.checkFillBlankAnswer = checkFillBlankAnswer;
window.checkDragSortAnswer = checkDragSortAnswer;
window.checkMultipleChoiceAnswer = checkMultipleChoiceAnswer;
window.checkConnectMatchAnswer = checkConnectMatchAnswer;
window.executeSQL = executeSQL;
window.clearSQL = clearSQL;
window.showHint = showHint;
window.nextPractice = nextPractice;
window.selectDifficulty = selectDifficulty;
window.openQuestion = openQuestion;
window.editProfile = editProfile;
window.saveProfile = saveProfile;
window.resetProgress = resetProgress;
window.closeModal = closeModal;