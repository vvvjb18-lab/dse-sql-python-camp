// DSE SQL 訓練營 - 主要JavaScript功能

// 全局變量
let currentProblem = null;
let userProgress = {
    completedProblems: [],
    currentLevel: 5,
    totalScore: 1270,
    studyTime: 42,
    achievements: ['query-master', 'efficiency-expert', 'learning-master']
};

// 題目數據庫
const problems = {
    'basic-select': {
        id: 'basic-select',
        title: '基礎查詢練習',
        description: '從students表中查詢所有學生的姓名(name)和分數(score)，並按分數從高到低排序。',
        tableStructure: 'students(id, name, class, score, grade)',
        difficulty: 'easy',
        expectedQuery: 'SELECT name, score FROM students ORDER BY score DESC;',
        hint: '使用SELECT選擇需要的列，使用ORDER BY進行排序，DESC表示降序。',
        sampleData: [
            { name: '張小明', score: 95 },
            { name: '李美玲', score: 88 },
            { name: '王大華', score: 92 },
            { name: '陳雅婷', score: 85 }
        ]
    },
    'where-conditions': {
        id: 'where-conditions',
        title: '條件篩選練習',
        description: '查詢分數大於等於90分的學生姓名和班級，按分數降序排列。',
        tableStructure: 'students(id, name, class, score, grade)',
        difficulty: 'easy',
        expectedQuery: 'SELECT name, class FROM students WHERE score >= 90 ORDER BY score DESC;',
        hint: '使用WHERE子句設置條件，>=表示大於等於。',
        sampleData: [
            { name: '張小明', class: '4A' },
            { name: '王大華', class: '4B' }
        ]
    },
    'join-tables': {
        id: 'join-tables',
        title: '多表連接練習',
        description: '查詢學生的姓名、班級名稱和分數，需要連接students表和classes表。',
        tableStructure: 'students(id, name, class_id, score), classes(id, class_name)',
        difficulty: 'medium',
        expectedQuery: 'SELECT s.name, c.class_name, s.score FROM students s JOIN classes c ON s.class_id = c.id ORDER BY s.score DESC;',
        hint: '使用JOIN連接兩個表，ON指定連接條件，可以給表起別名簡化寫法。',
        sampleData: [
            { name: '張小明', class_name: '四年級A班', score: 95 },
            { name: '李美玲', class_name: '四年級B班', score: 88 }
        ]
    },
    'group-by': {
        id: 'group-by',
        title: '數據分組練習',
        description: '統計每個班級的平均分數，顯示班級名稱和平均分，按平均分降序排列。',
        tableStructure: 'students(id, name, class, score)',
        difficulty: 'medium',
        expectedQuery: 'SELECT class, AVG(score) as avg_score FROM students GROUP BY class ORDER BY avg_score DESC;',
        hint: '使用GROUP BY按班級分組，AVG()函數計算平均值，使用別名讓結果更清晰。',
        sampleData: [
            { class: '4A', avg_score: 91.5 },
            { class: '4B', avg_score: 86.3 }
        ]
    },
    'subqueries': {
        id: 'subqueries',
        title: '子查詢練習',
        description: '查詢分數高於全年級平均分的學生信息。',
        tableStructure: 'students(id, name, class, score)',
        difficulty: 'hard',
        expectedQuery: 'SELECT name, class, score FROM students WHERE score > (SELECT AVG(score) FROM students) ORDER BY score DESC;',
        hint: '子查詢先計算全年級平均分，主查詢找出高於平均分的學生。',
        sampleData: [
            { name: '張小明', class: '4A', score: 95 },
            { name: '王大華', class: '4B', score: 92 }
        ]
    }
};

// 初始化函數
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserProgress();
    setupEventListeners();
    startBackgroundAnimation();
});

function initializeApp() {
    // 初始化英雄區域動畫
    anime({
        targets: '#hero-title',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // 初始化進度圓環
    updateProgressRing();
    
    // 載入默認題目
    loadProblem('basic-select');
}

function loadUserProgress() {
    // 從localStorage載入用戶進度
    const savedProgress = localStorage.getItem('dse-sql-progress');
    if (savedProgress) {
        userProgress = { ...userProgress, ...JSON.parse(savedProgress) };
    }
    updateProgressDisplay();
}

function saveUserProgress() {
    localStorage.setItem('dse-sql-progress', JSON.stringify(userProgress));
}

function setupEventListeners() {
    // SQL輸入框事件監聽
    const sqlInput = document.getElementById('sql-input');
    if (sqlInput) {
        sqlInput.addEventListener('input', function() {
            // 即時語法檢查
            checkSyntax(this.value);
        });

        sqlInput.addEventListener('keydown', function(e) {
            // Ctrl+Enter 執行查詢
            if (e.ctrlKey && e.key === 'Enter') {
                runQuery();
            }
        });
    }
}

function startBackgroundAnimation() {
    // 創建浮動的代碼背景效果
    const heroSection = document.querySelector('.hero-bg');
    if (!heroSection) return;

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingCode(heroSection);
        }, i * 2000);
    }
}

function createFloatingCode(container) {
    const codeSnippets = [
        'SELECT * FROM students;',
        'WHERE score > 90;',
        'ORDER BY grade DESC;',
        'GROUP BY class;',
        'JOIN classes ON ...;',
        'HAVING COUNT(*) > 1;',
        'AVG(score) AS average;',
        'UPDATE students SET...;'
    ];

    const element = document.createElement('div');
    element.className = 'floating-code';
    element.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    container.appendChild(element);

    // 移除元素
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, 25000);
}

function startLearning() {
    // 平滑滾動到訓練區域
    const trainingSection = document.querySelector('section.py-12.bg-white');
    if (trainingSection) {
        trainingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 顯示歡迎訊息
    showNotification('歡迎開始您的SQL學習之旅！', 'success');
}

function loadProblem(problemId) {
    const problem = problems[problemId];
    if (!problem) return;

    currentProblem = problem;

    // 更新題目顯示
    const titleElement = document.querySelector('.lg\\:col-span-2 h3');
    const descriptionElement = document.querySelector('.lg\\:col-span-2 .text-gray-700');
    const structureElement = document.querySelector('.lg\\:col-span-2 .bg-gray-100 p');

    if (titleElement) {
        titleElement.textContent = `當前題目：${problem.title}`;
    }
    if (descriptionElement) {
        descriptionElement.innerHTML = `<strong>題目描述：</strong>${problem.description}`;
    }
    if (structureElement) {
        structureElement.innerHTML = `<strong>表格結構：</strong>${problem.tableStructure}`;
    }

    // 更新難度標籤
    const difficultyElement = document.querySelector('.px-2.py-1.bg-emerald-100');
    if (difficultyElement) {
        const difficultyText = problem.difficulty === 'easy' ? '初級' : 
                              problem.difficulty === 'medium' ? '中級' : '高級';
        const difficultyClass = problem.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                               problem.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' :
                               'bg-red-100 text-red-800';
        difficultyElement.textContent = difficultyText;
        difficultyElement.className = `px-2 py-1 ${difficultyClass} rounded-full text-xs font-medium`;
    }

    // 清空輸入框和結果
    const sqlInput = document.getElementById('sql-input');
    if (sqlInput) {
        sqlInput.value = '';
    }
    hideResultArea();

    // 更新提示區域
    updateHintArea(problem.hint);

    // 高亮選中的題目卡片
    highlightSelectedProblem(problemId);

    // 添加載入動畫
    anime({
        targets: '.lg\\:col-span-2 .bg-white',
        scale: [0.95, 1],
        opacity: [0.8, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

function highlightSelectedProblem(problemId) {
    // 移除所有高亮
    document.querySelectorAll('.problem-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
    });

    // 添加高亮到選中的題目
    const selectedCard = document.querySelector(`[onclick="loadProblem('${problemId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
    }
}

function runQuery() {
    const sqlInput = document.getElementById('sql-input');
    if (!sqlInput || !sqlInput.value.trim()) {
        showNotification('請先輸入SQL查詢語句', 'warning');
        return;
    }

    const query = sqlInput.value.trim();
    
    // 檢查是否為正確答案
    const isCorrect = checkAnswer(query, currentProblem.expectedQuery);
    
    // 顯示結果
    showQueryResult(query, isCorrect);
    
    // 更新進度
    if (isCorrect) {
        updateProgress();
        showSuccessEffect();
    }
}

function checkAnswer(userQuery, expectedQuery) {
    // 簡化的答案檢查邏輯
    const normalize = (str) => {
        return str.toLowerCase()
                  .replace(/\s+/g, ' ')
                  .replace(/;/g, '')
                  .trim();
    };

    return normalize(userQuery) === normalize(expectedQuery);
}

function showQueryResult(query, isCorrect) {
    const resultArea = document.getElementById('result-area');
    const queryResult = document.getElementById('query-result');
    
    if (!resultArea || !queryResult) return;

    let resultHTML = '';
    
    if (isCorrect) {
        // 顯示正確答案的結果表格
        resultHTML = `
            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                    <div class="text-emerald-500 mr-2">✓</div>
                    <span class="text-emerald-800 font-medium">查詢正確！</span>
                </div>
            </div>
            ${generateResultTable(currentProblem.sampleData)}
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                    <strong>解題思路：</strong>${currentProblem.hint}
                </p>
            </div>
        `;
    } else {
        // 顯示錯誤提示
        resultHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                    <div class="text-red-500 mr-2">✗</div>
                    <span class="text-red-800 font-medium">查詢有誤，請檢查語法</span>
                </div>
                <p class="text-sm text-red-600 mt-2">
                    提示：${currentProblem.hint}
                </p>
            </div>
        `;
    }

    queryResult.innerHTML = resultHTML;
    resultArea.classList.remove('hidden');

    // 添加顯示動畫
    anime({
        targets: resultArea,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutQuad'
    });
}

function generateResultTable(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    
    let tableHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
    `;

    headers.forEach(header => {
        tableHTML += `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`;
    });

    tableHTML += `
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    data.forEach(row => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${row[header]}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    return tableHTML;
}

function hideResultArea() {
    const resultArea = document.getElementById('result-area');
    if (resultArea) {
        resultArea.classList.add('hidden');
    }
}

function showHint() {
    if (!currentProblem) return;

    const hintArea = document.getElementById('hint-area');
    if (hintArea) {
        hintArea.innerHTML = `
            <h4 class="text-sm font-medium text-blue-900 mb-2">💡 解題提示</h4>
            <p class="text-sm text-blue-800">${currentProblem.hint}</p>
        `;
        
        // 添加顯示動畫
        anime({
            targets: hintArea,
            scale: [0.95, 1],
            opacity: [0.8, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
}

function updateHintArea(hint) {
    const hintArea = document.getElementById('hint-area');
    if (hintArea) {
        hintArea.innerHTML = `
            <h4 class="text-sm font-medium text-blue-900 mb-2">💡 小提示</h4>
            <p class="text-sm text-blue-800">${hint}</p>
        `;
    }
}

function resetQuery() {
    const sqlInput = document.getElementById('sql-input');
    if (sqlInput) {
        sqlInput.value = '';
    }
    hideResultArea();
    
    // 添加重置動畫
    const editor = document.querySelector('.sql-editor');
    if (editor) {
        anime({
            targets: editor,
            scale: [0.98, 1],
            duration: 200,
            easing: 'easeOutQuad'
        });
    }
}

function checkSyntax(query) {
    // 簡單的語法檢查
    const hasSelect = query.toLowerCase().includes('select');
    const hasFrom = query.toLowerCase().includes('from');
    
    // 這裡可以添加更複雜的語法檢查邏輯
    console.log('語法檢查:', { hasSelect, hasFrom });
}

function updateProgress() {
    if (!currentProblem || userProgress.completedProblems.includes(currentProblem.id)) {
        return;
    }

    userProgress.completedProblems.push(currentProblem.id);
    userProgress.totalScore += 10;
    
    saveUserProgress();
    updateProgressDisplay();
}

function updateProgressDisplay() {
    // 更新進度圓環
    const totalProblems = Object.keys(problems).length;
    const completedCount = userProgress.completedProblems.length;
    const percentage = Math.round((completedCount / totalProblems) * 100);
    
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 40; // r=40
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    // 更新進度文字
    const progressText = document.querySelector('.absolute.inset-0 .text-lg');
    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }

    // 更新題目計數
    const progressDescription = document.querySelector('.text-center .text-sm');
    if (progressDescription) {
        progressDescription.textContent = `已完成 ${completedCount}/${totalProblems} 個題目`;
    }
}

function updateProgressRing() {
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 40;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }
}

function showSuccessEffect() {
    // 成功時的粒子效果
    const button = document.querySelector('[onclick="runQuery()"]');
    if (button) {
        anime({
            targets: button,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }

    // 顯示成功通知
    showNotification('恭喜！查詢正確！', 'success');
}

function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-emerald-500 text-white' :
        type === 'warning' ? 'bg-amber-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // 顯示動畫
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });

    // 自動移除
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }
        });
    }, 3000);
}

// 用戶系統功能
function showLoginModal() {
    // 創建或顯示登錄模態框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">登錄</h2>
            <form onsubmit="handleLogin(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">用戶名或電郵</label>
                    <input type="text" id="login-username" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">密碼</label>
                    <input type="password" id="login-password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="flex space-x-4">
                    <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        登錄
                    </button>
                    <button type="button" onclick="closeLoginModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                        取消
                    </button>
                </div>
            </form>
            <p class="text-center mt-4 text-sm text-gray-600">
                還沒有賬號？<a href="#" onclick="showRegisterModal()" class="text-blue-600 hover:text-blue-800">立即注冊</a>
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加動畫
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

function closeLoginModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black');
    if (modal) {
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuad',
            complete: () => {
                modal.remove();
            }
        });
    }
}

function showRegisterModal() {
    // 關閉登錄模態框
    closeLoginModal();
    
    // 創建注冊模態框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">注冊新賬號</h2>
            <form onsubmit="handleRegister(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">用戶名</label>
                    <input type="text" id="register-username" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">電郵地址</label>
                    <input type="email" id="register-email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">密碼</label>
                    <input type="password" id="register-password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">確認密碼</label>
                    <input type="password" id="register-confirm-password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="flex space-x-4">
                    <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        注冊
                    </button>
                    <button type="button" onclick="closeRegisterModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                        取消
                    </button>
                </div>
            </form>
            <p class="text-center mt-4 text-sm text-gray-600">
                已有賬號？<a href="#" onclick="showLoginModal()" class="text-blue-600 hover:text-blue-800">立即登錄</a>
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加動畫
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

function closeRegisterModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black');
    if (modal && modal.innerHTML.includes('注冊新賬號')) {
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuad',
            complete: () => {
                modal.remove();
            }
        });
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('sql-users') || '{}');
    
    // 檢查用戶名或電郵
    let foundUser = null;
    for (let user in users) {
        if (user === username || users[user].email === username) {
            if (users[user].password === password) {
                foundUser = user;
                break;
            }
        }
    }
    
    if (foundUser) {
        currentUser = foundUser;
        localStorage.setItem('current-user', currentUser);
        closeLoginModal();
        updateUILoggedIn();
        showNotification('登錄成功！', 'success');
    } else {
        showNotification('用戶名或密碼錯誤！', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('兩次輸入的密碼不一致！', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('sql-users') || '{}');
    
    // 檢查用戶名是否已存在
    if (users[username]) {
        showNotification('用戶名已存在！', 'error');
        return;
    }
    
    // 檢查電郵是否已存在
    for (let user in users) {
        if (users[user].email === email) {
            showNotification('電郵地址已被使用！', 'error');
            return;
        }
    }
    
    // 創建新用戶
    users[username] = {
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        level: 1,
        totalScore: 0
    };
    
    localStorage.setItem('sql-users', JSON.stringify(users));
    
    // 初始化用戶進度數據
    const initialProgress = {
        completedExercises: [],
        scores: {
            'fill-blank': [],
            'card-arrangement': [],
            'drag-drop': [],
            'sql-practice': []
        },
        studyTime: 0,
        achievements: [],
        joinDate: new Date().toISOString(),
        level: 1,
        totalScore: 0
    };
    
    localStorage.setItem(`user-progress-${username}`, JSON.stringify(initialProgress));
    localStorage.setItem(`user-profile-${username}`, JSON.stringify({
        username: username,
        email: email
    }));
    
    showNotification('注冊成功！請登錄。', 'success');
    closeRegisterModal();
    showLoginModal();
}

function updateUILoggedIn() {
    // 更新導航欄顯示
    const userSection = document.getElementById('user-section');
    if (userSection) {
        userSection.innerHTML = `
            <span class="text-sm text-gray-600">歡迎, ${currentUser}</span>
            <button onclick="logout()" class="text-sm text-blue-600 hover:text-blue-800">退出</button>
        `;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('current-user');
    
    // 更新導航欄
    const userSection = document.getElementById('user-section');
    if (userSection) {
        userSection.innerHTML = `
            <button onclick="showLoginModal()" class="text-sm text-gray-600 hover:text-blue-600">登錄</button>
            <span class="text-gray-300">|</span>
            <button onclick="showRegisterModal()" class="text-sm text-blue-600 hover:text-blue-800 font-medium">注冊</button>
        `;
    }
    
    showNotification('已退出登錄', 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-emerald-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-amber-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // 顯示動畫
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });

    // 自動移除
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }
        });
    }, 3000);
}

// 導出函數供HTML使用
window.startLearning = startLearning;
window.loadProblem = loadProblem;
window.runQuery = runQuery;
window.showHint = showHint;
window.resetQuery = resetQuery;
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeRegisterModal = closeRegisterModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;