// 题库练习页面主要JavaScript文件

// 全局变量
let currentDifficulty = 'intermediate';
let currentExerciseFilter = '';
let userProgress = {};
let currentQuestion = null;
let sqlEditor = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePracticePage();
    createParticles();
    loadUserProgress();
    displayQuestions();
    updateStatistics();
});

// 初始化练习页面
function initializePracticePage() {
    // 初始化SQL编辑器（用于模态框）
    initializeSQLEditor();
    
    // 设置模态框关闭事件
    setupModalEvents();
    
    // 加载用户进度
    loadUserProgress();
    
    // 显示初始题目
    displayQuestions();
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
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }
    
    setInterval(createParticle, 800);
}

// 初始化SQL编辑器
function initializeSQLEditor() {
    // 等待模态框中的编辑器元素加载
    setTimeout(() => {
        const editorElement = document.getElementById('sql-editor-modal');
        if (editorElement && typeof CodeMirror !== 'undefined') {
            sqlEditor = CodeMirror.fromTextArea(editorElement, {
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
                    'Cmd-Enter': executeSQL,
                    'Tab': function(cm) {
                        cm.replaceSelection('    ');
                    }
                }
            });
        }
    }, 100);
}

// 设置模态框事件
function setupModalEvents() {
    const modal = document.getElementById('question-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// 加载用户进度
function loadUserProgress() {
    const savedProgress = localStorage.getItem('sql-trainer-practice-progress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    } else {
        userProgress = {
            completedQuestions: [],
            correctAnswers: 0,
            totalAttempts: 0,
            totalPoints: 0,
            difficultyStats: {
                beginner: { completed: 0, correct: 0 },
                intermediate: { completed: 0, correct: 0 },
                advanced: { completed: 0, correct: 0 }
            }
        };
    }
}

// 保存用户进度
function saveUserProgress() {
    localStorage.setItem('sql-trainer-practice-progress', JSON.stringify(userProgress));
}

// 选择难度
function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // 更新按钮状态
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${difficulty}`).classList.add('active');
    
    // 显示对应难度的题目
    displayQuestions();
    
    // 更新统计
    updateStatistics();
    
    // 动画效果
    anime({
        targets: '#questions-list',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// 按练习筛选
function filterByExercise() {
    const filter = document.getElementById('exercise-filter').value;
    currentExerciseFilter = filter;
    displayQuestions();
}

// 随机排序题目
function shuffleQuestions() {
    const questionsList = document.getElementById('questions-list');
    const questions = Array.from(questionsList.children);
    
    // 随机排序
    questions.sort(() => Math.random() - 0.5);
    
    // 清空并重新添加
    questionsList.innerHTML = '';
    questions.forEach(question => questionsList.appendChild(question));
    
    // 动画效果
    anime({
        targets: '.question-card',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        delay: anime.stagger(50),
        easing: 'easeOutQuad'
    });
    
    showNotification('题目已随机排序', 'success');
}

// 显示题目列表
function displayQuestions() {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;
    
    const questions = getQuestionsByDifficulty(currentDifficulty);
    
    // 应用练习筛选
    let filteredQuestions = questions;
    if (currentExerciseFilter) {
        filteredQuestions = questions.filter(q => 
            q.exercise.toString() === currentExerciseFilter
        );
    }
    
    if (filteredQuestions.length === 0) {
        questionsList.innerHTML = `
            <div class="glass-card p-8 text-center">
                <div class="text-6xl mb-4">📚</div>
                <h3 class="text-xl font-semibold text-white mb-2">暂无题目</h3>
                <p class="text-gray-300">当前难度等级没有题目，请选择其他难度。</p>
            </div>
        `;
        return;
    }
    
    questionsList.innerHTML = filteredQuestions.map(questionInfo => {
        const exerciseData = getExerciseData(questionInfo.exercise, questionInfo.question);
        const isCompleted = userProgress.completedQuestions.includes(`${questionInfo.exercise}-${questionInfo.question}`);
        const points = questionInfo.points;
        
        return `
            <div class="question-card glass-card p-6 ${isCompleted ? 'neon-border' : ''}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded mr-2">
                                练习${questionInfo.exercise}
                            </span>
                            <span class="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                ${points}分
                            </span>
                            ${isCompleted ? '<span class="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded ml-2">已完成</span>' : ''}
                        </div>
                        <h4 class="text-lg font-semibold text-white mb-2">${exerciseData?.title || questionInfo.title}</h4>
                        <p class="text-sm text-gray-300 mb-3">${exerciseData?.description || ''}</p>
                        <div class="flex items-center justify-between text-xs text-gray-400">
                            <div class="flex items-center space-x-2">
                                <span>${exerciseData?.parts?.length || 0} 个子问题</span>
                                <span class="mx-2">•</span>
                                <span>${questionInfo.difficulty || currentDifficulty} 难度</span>
                            </div>
                            <button 
                                class="px-3 py-1 rounded-full bg-purple-600/20 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition text-xs"
                                type="button"
                                onclick="event.stopPropagation(); askAIForQuestion(${questionInfo.exercise}, ${questionInfo.question});"
                            >
                                🤖 詢問 AI
                            </button>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                            <span class="text-white font-bold">${questionInfo.exercise}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between" onclick="openQuestion(${questionInfo.exercise}, ${questionInfo.question})">
                    <div class="flex items-center space-x-4">
                        <div class="text-xs text-gray-400">
                            进度: ${isCompleted ? '100%' : '0%'}
                        </div>
                        <div class="w-24 bg-gray-700 rounded-full h-2">
                            <div class="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300" 
                                 style="width: ${isCompleted ? '100%' : '0%'}"></div>
                        </div>
                    </div>
                    <div class="text-cyan-400 text-sm">
                        ${isCompleted ? '✓ 已完成' : '→ 开始练习'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // 添加动画效果
    anime({
        targets: '.question-card',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
    });
}

// 一鍵向 AI 詢問題目與標準答案
async function askAIForQuestion(exerciseNum, questionNum) {
    try {
        if (typeof AIService === 'undefined') {
            showNotification('AI 服務尚未加載，請稍後再試', 'error');
            return;
        }
        const exerciseData = getExerciseData(exerciseNum, questionNum);
        if (!exerciseData) {
            showNotification('無法獲取題目資料', 'error');
            return;
        }
        const questionId = `${exerciseNum}-${questionNum}`;
        const parts = exerciseData.parts || [];
        // 拼接題目與標準答案
        let promptParts = parts.map((p, idx) => {
            return `子問題 ${idx + 1}：${p.question || ''}\n標準答案 SQL：\n${p.solution || ''}\n答案說明：${p.answer || ''}`;
        }).join('\n\n');

        const systemContext = `你是一名 SQL 教學助教，正在幫助學生理解以下練習題目與標準答案。
請使用「先提示、再講解」的方式：
1. 先用幾句話概括這題要考的重點概念。
2. 再一步一步解釋標準答案為什麼這樣寫。
3. 盡量不要直接讓學生背答案，而是理解背後邏輯。
4. 全程使用繁體中文，語氣友善、適合中學生。`;

        const userMessage = `請幫我詳細講解這道 SQL 練習題：

【練習編號】${questionId}
【標題】${exerciseData.title || ''}
【題目描述】${exerciseData.description || ''}

【子問題與標準答案】：
${promptParts}

請依序：
1. 總結這題重點概念。
2. 針對每個子問題，逐步說明解題思路。
3. 指出學生常犯錯誤與避免方法。`;

        // 顯示一則簡單提示（可選）
        showNotification('正在向 AI 取得講解，請稍候...', 'info');

        const reply = await AIService.chat(userMessage, systemContext, 0.4);

        // 使用全局 AI 助手顯示結果（若已加載）
        if (window.aiAssistant && typeof window.aiAssistant.showMessage === 'function') {
            window.aiAssistant.openSidebar && window.aiAssistant.openSidebar();
            window.aiAssistant.showMessage('assistant', reply || 'AI 返回了空內容，請稍後重試。');
        } else {
            alert(reply || 'AI 返回了空內容，請稍後重試。');
        }
    } catch (error) {
        console.error('詢問 AI 失敗:', error);
        showNotification('詢問 AI 失敗，請檢查網絡或後端狀態', 'error');
    }
}

// 打开题目
function openQuestion(exerciseNum, questionNum) {
    const exerciseData = getExerciseData(exerciseNum, questionNum);
    if (!exerciseData) {
        showNotification('题目数据加载失败', 'error');
        return;
    }
    
    currentQuestion = {
        exercise: exerciseNum,
        question: questionNum,
        data: exerciseData
    };
    
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;
    
    modalBody.innerHTML = generateQuestionModalContent(exerciseData, exerciseNum, questionNum);
    
    // 显示模态框
    const modal = document.getElementById('question-modal');
    modal.classList.add('active');
    
    // 初始化模态框内的SQL编辑器
    setTimeout(() => {
        initializeModalSQLEditor();
    }, 100);
    
    // 动画效果
    anime({
        targets: '.modal-content',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// 生成题目模态框内容
function generateQuestionModalContent(exerciseData, exerciseNum, questionNum) {
    const isCompleted = userProgress.completedQuestions.includes(`${exerciseNum}-${questionNum}`);
    
    return `
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-2xl font-bold gradient-text">${exerciseData.title}</h2>
                <p class="text-gray-300 mt-1">练习 ${exerciseNum} - 题目 ${questionNum}</p>
            </div>
            <button onclick="closeModal()" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <span class="text-white">✕</span>
            </button>
        </div>
        
        <div class="mb-6">
            <div class="glass-card p-4 mb-4">
                <h3 class="font-semibold text-white mb-2">题目描述</h3>
                <p class="text-gray-300 text-sm leading-relaxed">${exerciseData.description}</p>
            </div>
            
            <div class="glass-card p-4">
                <h3 class="font-semibold text-white mb-4">子问题列表</h3>
                <div class="space-y-4" id="question-parts">
                    ${exerciseData.parts.map((part, index) => `
                        <div class="border border-gray-600 rounded-lg p-4">
                            <div class="flex items-start justify-between mb-3">
                                <h4 class="font-semibold text-white">问题 ${index + 1}</h4>
                                <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">${part.points || '自动评分'}</span>
                            </div>
                            <p class="text-gray-300 mb-3">${part.question}</p>
                            <div class="text-sm text-gray-400 mb-3">
                                <strong>提示：</strong>${part.hint}
                            </div>
                            <div class="flex space-x-3">
                                <button class="btn-primary px-4 py-2 text-sm" onclick="showSolution(${index})">
                                    查看答案
                                </button>
                                <button class="btn-secondary px-4 py-2 text-sm" onclick="startPractice(${index})">
                                    开始练习
                                </button>
                            </div>
                            <div id="solution-${index}" class="hidden mt-4 p-3 bg-slate-800 rounded-lg">
                                <h5 class="font-semibold text-green-300 mb-2">参考答案：</h5>
                                <pre class="text-sm text-gray-300 whitespace-pre-wrap">${part.solution}</pre>
                                <div class="mt-2 text-xs text-gray-400">
                                    <strong>解析：</strong>${part.answer}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
                ${isCompleted ? 
                    '<span class="text-green-400"><strong>✓ 已完成</strong></span>' : 
                    '<span class="text-yellow-400"><strong>⏳ 待完成</strong></span>'
                }
                <span class="text-gray-400">
                    进度: ${isCompleted ? '100%' : '0%'}
                </span>
            </div>
            <div class="flex space-x-3">
                <button class="btn-secondary px-6 py-2" onclick="markAsCompleted(${exerciseNum}, ${questionNum})">
                    ${isCompleted ? '取消完成' : '标记完成'}
                </button>
                <button class="btn-primary px-6 py-2" onclick="startFullPractice(${exerciseNum}, ${questionNum})">
                    开始完整练习
                </button>
            </div>
        </div>
        
        <!-- 练习区域 -->
        <div id="practice-area" class="hidden">
            <div class="glass-card p-4 mb-4">
                <h3 class="font-semibold text-white mb-3">SQL编辑器</h3>
                <div class="sql-editor">
                    <textarea id="sql-editor-modal" placeholder="在此输入您的SQL查询语句..."></textarea>
                </div>
                <div class="flex space-x-3 mt-4">
                    <button class="btn-primary px-6 py-2" onclick="executeSQL()">执行查询</button>
                    <button class="btn-secondary px-6 py-2" onclick="clearSQLEditor()">清空</button>
                    <button class="btn-secondary px-6 py-2" onclick="showHint()">提示</button>
                </div>
            </div>
            
            <div id="result-area" class="glass-card p-4 hidden">
                <h3 class="font-semibold text-white mb-3">执行结果</h3>
                <div id="result-content" class="bg-slate-800 rounded-lg p-3 overflow-x-auto">
                    <!-- 结果将在这里显示 -->
                </div>
            </div>
        </div>
    `;
}

// 初始化模态框内的SQL编辑器
function initializeModalSQLEditor() {
    const editorElement = document.getElementById('sql-editor-modal');
    if (editorElement && typeof CodeMirror !== 'undefined' && !sqlEditor) {
        sqlEditor = CodeMirror.fromTextArea(editorElement, {
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
    }
}

// 显示答案
function showSolution(partIndex) {
    const solutionElement = document.getElementById(`solution-${partIndex}`);
    if (solutionElement) {
        solutionElement.classList.toggle('hidden');
        
        if (!solutionElement.classList.contains('hidden')) {
            anime({
                targets: solutionElement,
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }
}

// 开始练习
function startPractice(partIndex) {
    const practiceArea = document.getElementById('practice-area');
    if (practiceArea) {
        practiceArea.classList.remove('hidden');
        
        // 滚动到练习区域
        practiceArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // 动画效果
        anime({
            targets: practiceArea,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 300,
            easing: 'easeOutQuad'
        });
        
        showNotification('练习模式已开启，请编写SQL查询', 'success');
    }
}

// 开始完整练习
function startFullPractice(exerciseNum, questionNum) {
    startPractice(0);
    showNotification('开始完整练习模式', 'success');
}

// 执行SQL
function executeSQL() {
    if (!sqlEditor) {
        showNotification('SQL编辑器未初始化', 'error');
        return;
    }
    
    const sql = sqlEditor.getValue().trim();
    if (!sql) {
        showNotification('请输入SQL查询语句', 'error');
        return;
    }
    
    // 模拟SQL执行
    const result = simulateSQLExecution(sql);
    displaySQLResult(result);
    
    // 更新用户统计
    userProgress.totalAttempts++;
    if (result.success) {
        userProgress.correctAnswers++;
    }
    
    saveUserProgress();
    updateStatistics();
}

// 模拟SQL执行
function simulateSQLExecution(sql) {
    // 这里应该连接到实际的SQL执行引擎
    // 现在只是模拟执行结果
    
    const mockResults = {
        'SELECT': {
            success: true,
            data: [
                { ID: 'S001', Name: '张三', Sex: 'M', Class: '5A' },
                { ID: 'S002', Name: '李四', Sex: 'F', Class: '5B' },
                { ID: 'S003', Name: '王五', Sex: 'M', Class: '5A' }
            ],
            message: '查询成功，返回3条记录'
        },
        'INSERT': {
            success: true,
            data: [],
            message: '插入成功，影响1条记录'
        },
        'UPDATE': {
            success: true,
            data: [],
            message: '更新成功，影响2条记录'
        },
        'DELETE': {
            success: true,
            data: [],
            message: '删除成功，影响1条记录'
        }
    };
    
    const sqlType = sql.toUpperCase().split(' ')[0];
    
    if (mockResults[sqlType]) {
        return mockResults[sqlType];
    }
    
    // 默认成功结果
    return {
        success: true,
        data: [],
        message: 'SQL语句执行成功'
    };
}

// 显示SQL执行结果
function displaySQLResult(result) {
    const resultArea = document.getElementById('result-area');
    const resultContent = document.getElementById('result-content');
    
    if (!resultArea || !resultContent) return;
    
    if (result.success) {
        let html = '';
        
        if (result.data && result.data.length > 0) {
            // 显示表格结果
            html = '<table class="w-full text-sm">';
            
            // 表头
            html += '<thead><tr class="border-b border-gray-600">';
            Object.keys(result.data[0]).forEach(key => {
                html += `<th class="text-left py-2 px-3 text-cyan-300">${key}</th>`;
            });
            html += '</tr></thead>';
            
            // 数据行
            html += '<tbody>';
            result.data.forEach((row, index) => {
                html += `<tr class="border-b border-gray-700 hover:bg-slate-700 ${index % 2 === 0 ? 'bg-slate-800/50' : ''}">`;
                Object.values(row).forEach(value => {
                    html += `<td class="py-2 px-3 text-gray-300">${value}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
        } else {
            // 显示消息
            html = `
                <div class="text-green-300 p-4">
                    <div class="flex items-center">
                        <span class="mr-2">✓</span>
                        <span>${result.message}</span>
                    </div>
                </div>
            `;
        }
        
        resultContent.innerHTML = html;
        showNotification('SQL执行成功！', 'success');
    } else {
        resultContent.innerHTML = `
            <div class="text-red-300 p-4">
                <div class="font-semibold mb-2">执行错误：</div>
                <div class="text-sm">${result.error || '未知错误'}</div>
            </div>
        `;
        showNotification('SQL执行失败', 'error');
    }
    
    resultArea.classList.remove('hidden');
    
    // 滚动到结果区域
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 清空SQL编辑器
function clearSQLEditor() {
    if (sqlEditor) {
        sqlEditor.setValue('');
    }
    
    const resultArea = document.getElementById('result-area');
    if (resultArea) {
        resultArea.classList.add('hidden');
    }
    
    showNotification('编辑器已清空', 'success');
}

// 显示提示
function showHint() {
    if (currentQuestion && currentQuestion.data) {
        const hints = currentQuestion.data.parts.map(part => part.hint).join('\\n');
        showNotification(`提示：${hints}`, 'success', 5000);
    } else {
        showNotification('请选择一个题目开始练习', 'error');
    }
}

// 标记为完成
function markAsCompleted(exerciseNum, questionNum) {
    const questionKey = `${exerciseNum}-${questionNum}`;
    const isCompleted = userProgress.completedQuestions.includes(questionKey);
    
    if (isCompleted) {
        // 取消完成状态
        userProgress.completedQuestions = userProgress.completedQuestions.filter(id => id !== questionKey);
        userProgress.difficultyStats[currentDifficulty].completed--;
        showNotification('已取消完成标记', 'success');
        saveUserProgress();
        updateStatistics();
        closeModal();
        displayQuestions();
    } else {
        // 标记为完成
        userProgress.completedQuestions.push(questionKey);
        userProgress.difficultyStats[currentDifficulty].completed++;
        
        // 增加积分
        const questionInfo = getQuestionsByDifficulty(currentDifficulty)
            .find(q => q.exercise === exerciseNum && q.question === parseFloat(questionNum));
        if (questionInfo) {
            userProgress.totalPoints += questionInfo.points;
        }
        
        saveUserProgress();
        updateStatistics();
        closeModal();
        displayQuestions();
        
        // 自动跳转到下一题
        setTimeout(() => {
            autoNextQuestion(exerciseNum, questionNum);
        }, 500); // 延迟500ms，等待模态框关闭动画完成
    }
}

// 自动跳转到下一题
function autoNextQuestion(currentExerciseNum, currentQuestionNum) {
    try {
        // 获取当前难度的所有题目
        let questions = getQuestionsByDifficulty(currentDifficulty);
        
        // 应用练习筛选
        if (currentExerciseFilter) {
            questions = questions.filter(q => 
                q.exercise.toString() === currentExerciseFilter
            );
        }
        
        if (questions.length === 0) {
            showNotification('当前没有更多题目', 'info');
            return;
        }
        
        // 找到当前题目在列表中的位置
        const currentIndex = questions.findIndex(q => 
            q.exercise === currentExerciseNum && q.question === parseFloat(currentQuestionNum)
        );
        
        if (currentIndex === -1) {
            // 当前题目不在列表中，可能是筛选导致的
            showNotification('恭喜完成题目！', 'success');
            return;
        }
        
        // 找到下一题（跳过已完成的题目）
        let nextIndex = currentIndex + 1;
        while (nextIndex < questions.length) {
            const nextQuestion = questions[nextIndex];
            const nextQuestionKey = `${nextQuestion.exercise}-${nextQuestion.question}`;
            
            // 如果下一题未完成，则打开它
            if (!userProgress.completedQuestions.includes(nextQuestionKey)) {
                showNotification('自动跳转到下一题', 'success');
                setTimeout(() => {
                    openQuestion(nextQuestion.exercise, nextQuestion.question);
                }, 300);
                return;
            }
            
            nextIndex++;
        }
        
        // 如果没有未完成的下一题，显示完成提示
        showNotification('恭喜！你已经完成了当前筛选下的所有题目！', 'success');
    } catch (error) {
        console.error('自动跳转下一题失败:', error);
        showNotification('恭喜完成题目！', 'success');
    }
}

// 更新统计信息
function updateStatistics() {
    const totalQuestions = getQuestionsByDifficulty('beginner').length + 
                          getQuestionsByDifficulty('intermediate').length + 
                          getQuestionsByDifficulty('advanced').length;
    
    const completedQuestions = userProgress.completedQuestions.length;
    const accuracy = userProgress.totalAttempts > 0 ? 
        Math.round((userProgress.correctAnswers / userProgress.totalAttempts) * 100) : 0;
    
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('completed-questions').textContent = completedQuestions;
    document.getElementById('accuracy-rate').textContent = accuracy + '%';
    document.getElementById('total-points').textContent = userProgress.totalPoints;
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('question-modal');
    if (modal) {
        modal.classList.remove('active');
        
        // 重置状态
        currentQuestion = null;
        
        // 清空SQL编辑器
        if (sqlEditor) {
            sqlEditor.setValue('');
        }
        
        // 隐藏结果区域
        const resultArea = document.getElementById('result-area');
        if (resultArea) {
            resultArea.classList.add('hidden');
        }
    }
}

// 返回首页
function showHome() {
    window.location.href = 'index.html';
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

// 导出函数供HTML调用
window.selectDifficulty = selectDifficulty;
window.filterByExercise = filterByExercise;
window.shuffleQuestions = shuffleQuestions;
window.openQuestion = openQuestion;
window.showSolution = showSolution;
window.startPractice = startPractice;
window.startFullPractice = startFullPractice;
window.executeSQL = executeSQL;
window.clearSQLEditor = clearSQLEditor;
window.showHint = showHint;
window.markAsCompleted = markAsCompleted;
window.closeModal = closeModal;
window.showHome = showHome;