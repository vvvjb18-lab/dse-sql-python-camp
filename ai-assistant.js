/**
 * DSE SQL 訓練營 - 統一AI助手組件
 * 支持Markdown格式，可在所有頁面使用
 * 新增功能：文字選擇浮動工具列、翻譯、解釋代碼等
 */

// 檢查是否已加載marked.js，如果沒有則動態加載
function ensureMarkedLoaded() {
    return new Promise((resolve) => {
        if (typeof marked !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = function() {
            console.log('Marked.js已加載');
            resolve();
        };
        script.onerror = function() {
            console.warn('Marked.js加載失敗，將使用純文本顯示');
            resolve();
        };
        document.head.appendChild(script);
    });
}

class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.aiServiceAvailable = false;
        this.modal = null;
        this.messagesContainer = null;
        this.selectedText = '';
        this.selectedRange = null;
        this.floatingToolbar = null;
        this.sidebar = null;
        this.currentTab = 'chat'; // chat, translate, explain, etc.
        this.init();
    }

    async init() {
        // 確保marked.js已加載
        await ensureMarkedLoaded();
        // 創建AI助手按鈕和對話框
        this.createAIAssistantUI();
        // 創建浮動工具列
        this.createFloatingToolbar();
        // 創建側邊欄
        this.createSidebar();
        // 監聽文字選擇事件
        this.setupTextSelectionListener();
        // 檢查AI服務狀態
        this.checkAIService();
        // 載入當前選擇的模型
        this.loadCurrentModel();
    }
    
    async loadCurrentModel() {
        try {
            if (typeof getSelectedModel !== 'undefined') {
                const currentModel = await getSelectedModel();
                const selector = document.getElementById('ai-model-selector');
                if (selector) {
                    selector.value = currentModel;
                }
            }
        } catch (error) {
            console.warn('載入當前模型失敗:', error);
        }
    }
    
    async onModelChange(event) {
        const selectedModel = event.target.value;
        try {
            if (typeof setSelectedModel !== 'undefined') {
                const success = await setSelectedModel(selectedModel);
                if (success) {
                    // 顯示成功提示
                    const modelNames = {
                        'glm-4-flash-250414': 'GLM-4-Flash',
                        'deepseek-ai/DeepSeek-V3.2': 'DeepSeek-V3.2',
                        'Qwen/Qwen2.5-Coder-32B-Instruct': 'Qwen2.5-Coder-32B'
                    };
                    const modelName = modelNames[selectedModel] || selectedModel;
                    this.addSidebarMessage('系統', `✓ 已切換到 ${modelName} 模型`, 'success');
                } else {
                    this.addSidebarMessage('系統', '❌ 模型切換失敗，請重試', 'error');
                    // 恢復原來的選擇
                    await this.loadCurrentModel();
                }
            }
        } catch (error) {
            console.error('切換模型失敗:', error);
            this.addSidebarMessage('系統', '❌ 模型切換失敗，請重試', 'error');
            await this.loadCurrentModel();
        }
    }

    createAIAssistantUI() {
        // 創建浮動按鈕
        const button = document.createElement('button');
        button.id = 'ai-assistant-btn';
        button.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group';
        button.innerHTML = `
            <span class="text-2xl">🤖</span>
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden" id="ai-notification-badge">!</span>
        `;
        button.onclick = () => this.toggleSidebar();
        document.body.appendChild(button);

        // 創建對話框（保留原有功能）
        const modal = document.createElement('div');
        modal.id = 'ai-assistant-modal';
        modal.className = 'fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 hidden flex flex-col border border-gray-200';
        modal.innerHTML = `
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">🤖</span>
                    <h3 class="font-semibold">AI學習助手</h3>
                </div>
                <button onclick="window.aiAssistant.close()" class="text-white hover:text-gray-200">✕</button>
            </div>
            <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                <div class="text-center text-gray-500 text-sm py-4">
                    👋 你好！我是你的SQL學習助手。<br>
                    我可以回答SQL相關問題、檢查SQL語句、提供學習提示。
                </div>
            </div>
            <div class="border-t p-4 bg-white">
                <div class="flex space-x-2">
                    <input 
                        type="text" 
                        id="ai-chat-input" 
                        placeholder="輸入你的問題..." 
                        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onkeypress="if(event.key==='Enter') window.aiAssistant.sendMessage()"
                    >
                    <button 
                        onclick="window.aiAssistant.sendMessage()" 
                        class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        發送
                    </button>
                </div>
                <div class="flex space-x-2 mt-2">
                    <button 
                        onclick="window.aiAssistant.quickAction('hint')" 
                        class="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition-colors"
                    >
                        💡 獲取提示
                    </button>
                    <button 
                        onclick="window.aiAssistant.quickAction('explain')" 
                        class="flex-1 bg-green-50 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-100 transition-colors"
                    >
                        📖 解釋概念
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
        this.messagesContainer = document.getElementById('ai-chat-messages');
    }

    createFloatingToolbar() {
        // 創建浮動工具列
        const toolbar = document.createElement('div');
        toolbar.id = 'floating-toolbar';
        toolbar.className = 'fixed bg-white rounded-lg shadow-2xl border border-gray-200 p-2 z-[9999] hidden flex items-center space-x-2';
        toolbar.style.transition = 'opacity 0.2s, transform 0.2s';
        toolbar.style.backdropFilter = 'blur(10px)';
        toolbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        toolbar.innerHTML = `
            <button 
                onclick="window.aiAssistant.handleToolbarAction('ask')" 
                class="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                title="提問"
            >
                <span>❓</span>
                <span>提問</span>
            </button>
            <button 
                onclick="window.aiAssistant.handleToolbarAction('explain')" 
                class="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                title="解釋代碼"
            >
                <span>📚</span>
                <span>解釋</span>
            </button>
            <button 
                onclick="window.aiAssistant.handleToolbarAction('translate')" 
                class="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                title="翻譯"
            >
                <span>🌐</span>
                <span>翻譯</span>
            </button>
            <div class="w-px h-6 bg-gray-300"></div>
            <button 
                onclick="window.aiAssistant.hideFloatingToolbar()" 
                class="px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                title="關閉"
            >
                ✕
            </button>
        `;
        document.body.appendChild(toolbar);
        this.floatingToolbar = toolbar;
    }

    createSidebar() {
        // 創建側邊欄
        const sidebar = document.createElement('div');
        sidebar.id = 'ai-sidebar';
        sidebar.className = 'fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[9998] transform translate-x-full transition-transform duration-300 flex flex-col';
        // 添加響應式寬度
        sidebar.style.maxWidth = 'calc(100vw - 2rem)';
        sidebar.innerHTML = `
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">🤖</span>
                    <h3 class="font-semibold">AI助手</h3>
                </div>
                <button onclick="window.aiAssistant.toggleSidebar()" class="text-white hover:text-gray-200">✕</button>
            </div>
            
            <!-- AI模型選擇器 -->
            <div class="bg-gray-50 border-b px-4 py-2">
                <label class="block text-xs font-medium text-gray-700 mb-1">選擇 AI 模型</label>
                <select 
                    id="ai-model-selector" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    onchange="window.aiAssistant.onModelChange(event)"
                >
                    <option value="glm-4-flash-250414">GLM-4-Flash (智譜AI)</option>
                    <option value="deepseek-ai/DeepSeek-V3.2">DeepSeek-V3.2</option>
                    <option value="Qwen/Qwen2.5-Coder-32B-Instruct">Qwen2.5-Coder-32B</option>
                </select>
            </div>
            
            <!-- 標籤頁切換 -->
            <div class="flex border-b bg-gray-50">
                <button 
                    onclick="window.aiAssistant.switchTab('chat')" 
                    class="flex-1 px-4 py-3 text-sm font-medium border-b-2 border-purple-600 text-purple-600 tab-button"
                    data-tab="chat"
                >
                    📝 Chat
                </button>
                <button 
                    onclick="window.aiAssistant.switchTab('translate')" 
                    class="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 tab-button"
                    data-tab="translate"
                >
                    🌐 翻譯
                </button>
                <button 
                    onclick="window.aiAssistant.switchTab('explain')" 
                    class="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 tab-button"
                    data-tab="explain"
                >
                    📚 解釋
                </button>
            </div>
            
            <!-- 內容區域 -->
            <div class="flex-1 overflow-y-auto">
                <!-- Chat 標籤頁 -->
                <div id="tab-chat" class="tab-content p-4">
                    <div id="sidebar-chat-messages" class="space-y-3 mb-4">
                        <div class="text-center text-gray-500 text-sm py-4">
                            👋 你好！我是你的SQL學習助手。
                        </div>
                    </div>
                    <div class="border-t pt-4">
                        <div class="flex space-x-2">
                            <input 
                                type="text" 
                                id="sidebar-chat-input" 
                                placeholder="輸入你的問題..." 
                                class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white text-gray-900"
                                onkeypress="if(event.key==='Enter') window.aiAssistant.sendSidebarMessage()"
                            >
                            <button 
                                onclick="window.aiAssistant.sendSidebarMessage()" 
                                class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                                發送
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 翻譯標籤頁 -->
                <div id="tab-translate" class="tab-content hidden p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">要翻譯的文字</label>
                        <textarea 
                            id="translate-input" 
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white text-gray-900"
                            rows="4"
                            placeholder="輸入要翻譯的文字..."
                        ></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">目標語言</label>
                        <select id="translate-target" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white text-gray-900">
                            <option value="zh">中文</option>
                            <option value="en">英文</option>
                            <option value="auto">自動檢測</option>
                        </select>
                    </div>
                    <button 
                        onclick="window.aiAssistant.translateText()" 
                        class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                    >
                        翻譯
                    </button>
                    <div id="translate-result" class="mt-4 p-4 bg-gray-50 rounded-lg hidden">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">翻譯結果</span>
                            <div class="space-x-2">
                                <button onclick="window.aiAssistant.copyTranslation()" class="text-xs text-blue-600 hover:text-blue-800">複製</button>
                                <button onclick="window.aiAssistant.replaceSelectedText()" class="text-xs text-green-600 hover:text-green-800">替換選取文字</button>
                            </div>
                        </div>
                        <div id="translate-result-text" class="text-sm text-gray-800"></div>
                    </div>
                </div>
                
                <!-- 解釋標籤頁 -->
                <div id="tab-explain" class="tab-content hidden p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">要解釋的代碼或文字</label>
                        <textarea 
                            id="explain-input" 
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono bg-white text-gray-900"
                            rows="6"
                            placeholder="輸入SQL代碼或其他要解釋的內容..."
                        ></textarea>
                    </div>
                    <button 
                        onclick="window.aiAssistant.explainCode()" 
                        class="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors"
                    >
                        解釋
                    </button>
                    <div id="explain-result" class="mt-4 p-4 bg-gray-50 rounded-lg hidden">
                        <div class="text-sm font-medium text-gray-700 mb-2">解釋結果</div>
                        <div id="explain-result-text" class="text-sm text-gray-800 prose prose-sm max-w-none"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(sidebar);
        this.sidebar = sidebar;
    }

    setupTextSelectionListener() {
        // 監聽文字選擇事件
        document.addEventListener('mouseup', (e) => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 0) {
                // 保存選取的文字和範圍
                this.selectedText = selectedText;
                this.selectedRange = selection.getRangeAt(0);
                
                // 顯示浮動工具列
                this.showFloatingToolbar(e);
            } else {
                // 隱藏浮動工具列
                this.hideFloatingToolbar();
            }
        });

        // 點擊其他地方時隱藏工具列
        document.addEventListener('mousedown', (e) => {
            if (this.floatingToolbar && !this.floatingToolbar.contains(e.target)) {
                const selection = window.getSelection();
                if (selection.toString().trim().length === 0) {
                    this.hideFloatingToolbar();
                }
            }
        });
    }

    showFloatingToolbar(event) {
        if (!this.floatingToolbar) return;
        
        // 獲取選取文字的位置
        const range = window.getSelection().getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // 計算工具列位置（選取文字下方，靠右對齊）
        const toolbarWidth = 300;
        const toolbarHeight = 50;
        let left = rect.left + (rect.width / 2) - (toolbarWidth / 2);
        let top = rect.bottom + 10;
        
        // 確保工具列不會超出視窗
        if (left < 10) left = 10;
        if (left + toolbarWidth > window.innerWidth - 10) {
            left = window.innerWidth - toolbarWidth - 10;
        }
        if (top + toolbarHeight > window.innerHeight - 10) {
            top = rect.top - toolbarHeight - 10;
        }
        
        this.floatingToolbar.style.left = left + 'px';
        this.floatingToolbar.style.top = top + 'px';
        this.floatingToolbar.classList.remove('hidden');
    }

    hideFloatingToolbar() {
        if (this.floatingToolbar) {
            this.floatingToolbar.classList.add('hidden');
        }
    }

    handleToolbarAction(action) {
        this.hideFloatingToolbar();
        
        // 打開側邊欄並切換到對應標籤頁
        if (!this.isSidebarOpen()) {
            this.toggleSidebar();
        }
        
        switch(action) {
            case 'ask':
                this.switchTab('chat');
                // 將選取的文字填入輸入框
                setTimeout(() => {
                    const input = document.getElementById('sidebar-chat-input');
                    if (input) {
                        input.value = `關於這段文字：${this.selectedText}`;
                        input.focus();
                    }
                }, 100);
                break;
            case 'explain':
                this.switchTab('explain');
                setTimeout(() => {
                    const input = document.getElementById('explain-input');
                    if (input) {
                        input.value = this.selectedText;
                        input.focus();
                    }
                }, 100);
                break;
            case 'translate':
                this.switchTab('translate');
                setTimeout(() => {
                    const input = document.getElementById('translate-input');
                    if (input) {
                        input.value = this.selectedText;
                        input.focus();
                    }
                }, 100);
                break;
        }
    }

    toggleSidebar() {
        if (!this.sidebar) return;
        
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.sidebar.classList.remove('translate-x-full');
            // 檢查AI服務狀態
            if (!this.aiServiceAvailable) {
                this.addSidebarMessage('系統', '⚠️ AI服務未連接。請確保後端服務正在運行（python app.py）', 'warning');
            }
        } else {
            this.sidebar.classList.add('translate-x-full');
        }
    }

    isSidebarOpen() {
        return this.sidebar && !this.sidebar.classList.contains('translate-x-full');
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // 更新標籤按鈕狀態
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('border-b-2', 'border-purple-600', 'text-purple-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('border-b-2', 'border-purple-600', 'text-purple-600');
                btn.classList.add('text-gray-600');
            }
        });
        
        // 顯示對應的內容區域
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    async translateText() {
        const input = document.getElementById('translate-input');
        const targetLang = document.getElementById('translate-target').value;
        const text = input.value.trim();
        
        if (!text) {
            alert('請輸入要翻譯的文字');
            return;
        }
        
        if (!this.aiServiceAvailable) {
            alert('⚠️ AI服務未連接');
            return;
        }
        
        // 顯示加載狀態
        const resultDiv = document.getElementById('translate-result');
        const resultText = document.getElementById('translate-result-text');
        resultDiv.classList.remove('hidden');
        resultText.innerHTML = '正在翻譯...';
        
        try {
            // 構建翻譯提示
            const prompt = `請將以下文字翻譯成${targetLang === 'zh' ? '中文' : targetLang === 'en' ? '英文' : '最合適的語言'}：\n\n${text}`;
            
            const response = await AIService.chat(prompt);
            resultText.textContent = response;
            
            // 保存翻譯結果供後續使用
            this.translationResult = response;
        } catch (error) {
            resultText.innerHTML = `❌ 翻譯失敗：${error.message}`;
        }
    }

    copyTranslation() {
        const resultText = document.getElementById('translate-result-text').textContent;
        navigator.clipboard.writeText(resultText).then(() => {
            alert('已複製到剪貼板');
        }).catch(err => {
            console.error('複製失敗:', err);
        });
    }

    replaceSelectedText() {
        if (!this.selectedRange || !this.translationResult) {
            alert('沒有可替換的文字');
            return;
        }
        
        try {
            this.selectedRange.deleteContents();
            this.selectedRange.insertNode(document.createTextNode(this.translationResult));
            this.hideFloatingToolbar();
            alert('已替換選取的文字');
        } catch (error) {
            console.error('替換失敗:', error);
            alert('替換失敗，請手動複製');
        }
    }

    async explainCode() {
        const input = document.getElementById('explain-input');
        const code = input.value.trim();
        
        if (!code) {
            alert('請輸入要解釋的代碼或文字');
            return;
        }
        
        if (!this.aiServiceAvailable) {
            alert('⚠️ AI服務未連接');
            return;
        }
        
        // 顯示加載狀態
        const resultDiv = document.getElementById('explain-result');
        const resultText = document.getElementById('explain-result-text');
        resultDiv.classList.remove('hidden');
        resultText.innerHTML = '正在解釋...';
        
        try {
            // 構建解釋提示
            const prompt = `請詳細解釋以下代碼或文字的功能和用法：\n\n\`\`\`sql\n${code}\n\`\`\``;
            
            const response = await AIService.chat(prompt);
            
            // 渲染Markdown
            if (typeof marked !== 'undefined') {
                resultText.innerHTML = marked.parse(response);
            } else {
                resultText.textContent = response;
            }
        } catch (error) {
            resultText.innerHTML = `❌ 解釋失敗：${error.message}`;
        }
    }

    async sendSidebarMessage() {
        const input = document.getElementById('sidebar-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!this.aiServiceAvailable) {
            this.addSidebarMessage('系統', '⚠️ AI服務未連接。請先啟動後端服務。', 'warning');
            return;
        }
        
        // 添加用戶消息
        this.addSidebarMessage('用戶', message, 'user');
        input.value = '';
        
        // 顯示加載狀態
        const loadingId = this.addSidebarMessage('AI', '正在思考...', 'ai', true);
        
        try {
            let context = this.getPageContext();
            const response = await AIService.chat(message, context);
            
            // 移除加載消息，添加AI回復
            this.removeSidebarMessage(loadingId);
            this.addSidebarMessage('AI', response, 'ai');
        } catch (error) {
            this.removeSidebarMessage(loadingId);
            this.addSidebarMessage('系統', `❌ 錯誤：${error.message}`, 'error');
        }
    }

    addSidebarMessage(sender, content, type, isLoading = false) {
        const container = document.getElementById('sidebar-chat-messages');
        if (!container) return null;
        
        const messageId = 'sidebar-msg-' + Date.now() + '-' + Math.random();
        
        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-3`;
        
        const bgColor = type === 'user' ? 'bg-purple-600 text-white' : 
                      type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                      type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                      'bg-white text-gray-800 border border-gray-200';
        
        // 如果是AI消息且marked可用，渲染Markdown
        let contentHtml = content;
        if (type === 'ai' && typeof marked !== 'undefined') {
            try {
                contentHtml = marked.parse(content);
            } catch (e) {
                console.warn('Markdown解析失敗:', e);
                contentHtml = content.replace(/\n/g, '<br>');
            }
        } else {
            contentHtml = content.replace(/\n/g, '<br>');
        }
        
        messageDiv.innerHTML = `
            <div class="max-w-[85%] ${bgColor} rounded-lg p-3 ${isLoading ? 'animate-pulse' : ''} shadow-sm">
                <div class="text-xs font-medium mb-1 opacity-75">${sender}</div>
                <div class="text-sm ${type === 'ai' ? 'prose prose-sm max-w-none' : ''}">${contentHtml}</div>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        return messageId;
    }

    removeSidebarMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }

    async checkAIService() {
        try {
            this.aiServiceAvailable = await AIService.checkHealth();
            if (this.aiServiceAvailable) {
                console.log('AI服務已連接');
            } else {
                console.warn('AI服務未連接');
            }
        } catch (error) {
            console.warn('AI服務檢查失敗:', error);
            this.aiServiceAvailable = false;
        }
    }

    close() {
        this.isOpen = false;
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
        if (this.sidebar) {
            this.sidebar.classList.add('translate-x-full');
        }
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!this.aiServiceAvailable) {
            this.addMessage('系統', '⚠️ AI服務未連接。請先啟動後端服務。', 'warning');
            return;
        }
        
        // 添加用戶消息
        this.addMessage('用戶', message, 'user');
        input.value = '';
        
        // 顯示加載狀態
        const loadingId = this.addMessage('AI', '正在思考...', 'ai', true);
        
        try {
            let context = this.getPageContext();
            const response = await AIService.chat(message, context);
            
            // 移除加載消息，添加AI回復
            this.removeMessage(loadingId);
            this.addMessage('AI', response, 'ai');
        } catch (error) {
            this.removeMessage(loadingId);
            this.addMessage('系統', `❌ 錯誤：${error.message}`, 'error');
        }
    }

    toggle() {
        // 兼容舊的toggle方法，現在切換側邊欄
        this.toggleSidebar();
    }

    getPageContext() {
        const path = window.location.pathname;
        let context = `當前頁面：${path}`;
        
        if (path.includes('interactive-exercises')) {
            context += ' | 互動練習頁面';
        } else if (path.includes('progress')) {
            context += ' | 學習進度頁面';
        } else if (path.includes('guide')) {
            context += ' | 學習指南頁面';
        } else if (path.includes('practice')) {
            context += ' | 題庫練習頁面';
        } else if (path.includes('index')) {
            context += ' | 訓練平台頁面';
        }
        
        return context;
    }

    addMessage(sender, content, type, isLoading = false) {
        if (!this.messagesContainer) return null;
        
        const messageId = 'msg-' + Date.now() + '-' + Math.random();
        
        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-3`;
        
        const bgColor = type === 'user' ? 'bg-purple-600 text-white' : 
                      type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                      'bg-white text-gray-800 border border-gray-200';
        
        let contentHtml = content;
        if (type === 'ai' && typeof marked !== 'undefined') {
            try {
                contentHtml = marked.parse(content);
            } catch (e) {
                console.warn('Markdown解析失敗:', e);
                contentHtml = content.replace(/\n/g, '<br>');
            }
        } else {
            contentHtml = content.replace(/\n/g, '<br>');
        }
        
        messageDiv.innerHTML = `
            <div class="max-w-[85%] ${bgColor} rounded-lg p-3 ${isLoading ? 'animate-pulse' : ''} shadow-sm">
                <div class="text-xs font-medium mb-1 opacity-75">${sender}</div>
                <div class="text-sm ${type === 'ai' ? 'prose prose-sm max-w-none' : ''}">${contentHtml}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        return messageId;
    }

    removeMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }

    async quickAction(action) {
        if (!this.aiServiceAvailable) {
            this.addMessage('系統', '⚠️ AI服務未連接', 'warning');
            return;
        }
        
        let message = '';
        
        switch(action) {
            case 'hint':
                message = '請給我一些SQL學習的提示和建議';
                break;
            case 'explain':
                message = '請解釋一下SQL的基本概念和語法';
                break;
            default:
                return;
        }
        
        document.getElementById('ai-chat-input').value = message;
        await this.sendMessage();
    }
}

// 初始化AI助手（當頁面加載完成後）
function initAIAssistant() {
    if (typeof AIService !== 'undefined') {
        window.aiAssistant = new AIAssistant();
    } else {
        setTimeout(() => {
            if (typeof AIService !== 'undefined') {
                window.aiAssistant = new AIAssistant();
            } else {
                console.warn('AIService未加載，AI助手功能將不可用');
            }
        }, 500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
} else {
    initAIAssistant();
}
