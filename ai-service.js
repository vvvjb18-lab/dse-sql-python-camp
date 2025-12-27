/**
 * DSE SQL 訓練營 - AI服务客户端
 * 用于调用后端AI服务
 */

// 自动检测当前主机地址（支持localhost和公网IP）
function getAIServiceBaseURL() {
    // 获取当前页面的主机地址
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    // 如果是localhost或127.0.0.1，使用localhost:5000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//localhost:5000/api`;
    }
    
    // 如果通过域名访问（如 icthelper.myftp.org），使用当前域名（不添加端口）
    // 这样可以通过 NPM 反向代理访问，不会跳转到 IP:5000
    if (hostname.includes('.') && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        // 是域名，使用当前协议和主机（保持端口，如果有的话）
        return `${protocol}//${hostname}${port ? ':' + port : ''}/api`;
    }
    
    // 否则是 IP 地址，使用 IP:5000
    return `${protocol}//${hostname}:5000/api`;
}

const AI_SERVICE_URL = getAIServiceBaseURL();

// 模型緩存（避免頻繁請求）
let modelCache = {
    model: null,
    timestamp: 0,
    cacheDuration: 5 * 60 * 1000  // 5分鐘緩存
};

// 獲取用戶選擇的模型（全局函數，可在其他文件中使用）
async function getSelectedModel() {
    try {
        // 檢查緩存
        const now = Date.now();
        if (modelCache.model && (now - modelCache.timestamp) < modelCache.cacheDuration) {
            return modelCache.model;
        }
        
        // 如果已登錄，優先從數據庫讀取
        if (typeof UserAPI !== 'undefined' && UserAPI.isLoggedIn()) {
            try {
                const result = await UserAPI.getAIModel();
                if (result.success && result.model) {
                    modelCache.model = result.model;
                    modelCache.timestamp = now;
                    console.log('[DEBUG getSelectedModel] 從數據庫讀取模型:', result.model);
                    return result.model;
                }
            } catch (error) {
                console.warn('[WARNING getSelectedModel] 從數據庫讀取失敗，使用localStorage:', error);
            }
        }
        
        // 如果未登錄或數據庫讀取失敗，從localStorage讀取
        const currentUser = localStorage.getItem('current-user');
        if (currentUser) {
            const settingsKey = `user-settings-${currentUser}`;
            const settingsStr = localStorage.getItem(settingsKey);
            const userSettings = settingsStr ? JSON.parse(settingsStr) : {};
            const selectedModel = userSettings.selectedModel || 'glm-4-flash-250414';
            
            modelCache.model = selectedModel;
            modelCache.timestamp = now;
            console.log('[DEBUG getSelectedModel] 從localStorage讀取模型:', selectedModel);
            return selectedModel;
        }
        
        // 默認模型
        const defaultModel = 'glm-4-flash-250414';
        modelCache.model = defaultModel;
        modelCache.timestamp = now;
        console.log('[DEBUG getSelectedModel] 使用默認模型:', defaultModel);
        return defaultModel;
    } catch (error) {
        console.error('[ERROR getSelectedModel] 獲取模型設置失敗:', error);
        return 'glm-4-flash-250414';
    }
}

// 設置用戶選擇的模型（全局函數）
async function setSelectedModel(modelId) {
    try {
        // 驗證模型ID
        const validModels = ['glm-4-flash-250414', 'deepseek-ai/DeepSeek-V3.2', 'Qwen/Qwen2.5-Coder-32B-Instruct'];
        if (!validModels.includes(modelId)) {
            console.error('[ERROR setSelectedModel] 無效的模型ID:', modelId);
            return false;
        }
        
        // 更新緩存
        modelCache.model = modelId;
        modelCache.timestamp = Date.now();
        
        // 如果已登錄，保存到數據庫
        if (typeof UserAPI !== 'undefined' && UserAPI.isLoggedIn()) {
            try {
                const result = await UserAPI.setAIModel(modelId);
                if (result.success) {
                    console.log('[DEBUG setSelectedModel] 已保存到數據庫:', modelId);
                    return true;
                } else {
                    console.warn('[WARNING setSelectedModel] 保存到數據庫失敗:', result.error);
                }
            } catch (error) {
                console.warn('[WARNING setSelectedModel] 保存到數據庫出錯:', error);
            }
        }
        
        // 同時保存到localStorage（作為備份）
        const currentUser = localStorage.getItem('current-user');
        if (currentUser) {
            const settingsKey = `user-settings-${currentUser}`;
            const userSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
            userSettings.selectedModel = modelId;
            localStorage.setItem(settingsKey, JSON.stringify(userSettings));
            console.log('[DEBUG setSelectedModel] 已保存到localStorage:', modelId);
        }
        
        return true;
    } catch (error) {
        console.error('[ERROR setSelectedModel] 設置模型失敗:', error);
        return false;
    }
}

// 清除模型緩存
function clearModelCache() {
    modelCache.model = null;
    modelCache.timestamp = 0;
}

// 將函數添加到window對象，使其全局可用
if (typeof window !== 'undefined') {
    window.getSelectedModel = getSelectedModel;
    window.setSelectedModel = setSelectedModel;
    window.clearModelCache = clearModelCache;
}

class AIService {
    /**
     * 发送聊天消息到AI
     * @param {string} message - 用户消息
     * @param {string} context - 上下文信息（可选）
     * @param {number} temperature - 温度参数（可选，默认0.6）
     * @returns {Promise<string>} AI回复
     */
    static async chat(message, context = '', temperature = 0.6) {
        try {
            // 獲取當前選擇的模型（異步）
            const selectedModel = await getSelectedModel();
            console.log('[DEBUG AIService.chat] 準備發送請求，使用模型:', selectedModel);
            
            const response = await fetch(`${AI_SERVICE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    context: context,
                    temperature: temperature,
                    model: selectedModel
                })
            });
            
            console.log('[DEBUG AIService.chat] 請求已發送，模型參數:', selectedModel);

            const data = await response.json();
            
            // 調試日志：記錄實際使用的模型
            if (data.model_used) {
                console.log('[DEBUG AIService.chat] 後端返回的實際使用模型:', data.model_used);
                if (data.model_used !== selectedModel) {
                    console.warn('[WARNING] 請求的模型與實際使用的模型不一致！', {
                        requested: selectedModel,
                        actual: data.model_used
                    });
                }
            }

            if (data.success) {
                return data.message;
            } else {
                throw new Error(data.error || 'AI服务请求失败');
            }
        } catch (error) {
            console.error('AI服务错误:', error);
            throw error;
        }
    }

    /**
     * 检查SQL语句
     * @param {string} sql - 要检查的SQL语句
     * @param {string} expected - 期望的SQL语句（可选）
     * @param {string} tableStructure - 表结构（可选）
     * @returns {Promise<string>} 检查反馈
     */
    static async checkSQL(sql, expected = '', tableStructure = '') {
        try {
            const selectedModel = await getSelectedModel();
            const response = await fetch(`${AI_SERVICE_URL}/check-sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sql: sql,
                    expected: expected,
                    table_structure: tableStructure,
                    model: selectedModel
                })
            });

            const data = await response.json();

            if (data.success) {
                return data.feedback;
            } else {
                throw new Error(data.error || 'SQL检查失败');
            }
        } catch (error) {
            console.error('SQL检查错误:', error);
            throw error;
        }
    }

    /**
     * 获取学习提示
     * @param {string} problemDescription - 题目描述
     * @param {string} tableStructure - 表结构（可选）
     * @param {string} difficulty - 难度等级（可选）
     * @returns {Promise<string>} 学习提示
     */
    static async getHint(problemDescription, tableStructure = '', difficulty = 'easy') {
        try {
            const selectedModel = await getSelectedModel();
            const response = await fetch(`${AI_SERVICE_URL}/get-hint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    problem_description: problemDescription,
                    table_structure: tableStructure,
                    difficulty: difficulty,
                    model: selectedModel
                })
            });

            const data = await response.json();

            if (data.success) {
                return data.hint;
            } else {
                throw new Error(data.error || '获取提示失败');
            }
        } catch (error) {
            console.error('获取提示错误:', error);
            throw error;
        }
    }

    /**
     * 分析用户学习表现
     * @param {Object} userProgress - 用户进度数据
     * @param {Object} userProfile - 用户资料
     * @returns {Promise<Object>} 分析结果
     */
    static async analyzeLearning(userProgress, userProfile = {}) {
        try {
            const selectedModel = await getSelectedModel();
            const response = await fetch(`${AI_SERVICE_URL}/analyze-learning`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_progress: userProgress,
                    user_profile: userProfile,
                    model: selectedModel
                })
            });

            const data = await response.json();

            if (data.success) {
                return {
                    analysis: data.analysis,
                    statistics: data.statistics
                };
            } else {
                throw new Error(data.error || '学习分析失败');
            }
        } catch (error) {
            console.error('学习分析错误:', error);
            throw error;
        }
    }

    /**
     * 详细检查SQL语句（检错教官模式）
     * @param {string} sql - 要检查的SQL语句
     * @param {string} expected - 期望的SQL语句
     * @param {string} tableStructure - 表结构
     * @param {string} problemDescription - 题目描述
     * @returns {Promise<string>} 详细检查反馈
     */
    static async checkSQLDetailed(sql, expected = '', tableStructure = '', problemDescription = '') {
        try {
            const selectedModel = await getSelectedModel();
            const response = await fetch(`${AI_SERVICE_URL}/check-sql-detailed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sql: sql,
                    expected: expected,
                    table_structure: tableStructure,
                    problem_description: problemDescription,
                    model: selectedModel
                })
            });

            const data = await response.json();

            if (data.success) {
                return data.feedback;
            } else {
                throw new Error(data.error || 'SQL详细检查失败');
            }
        } catch (error) {
            console.error('SQL详细检查错误:', error);
            throw error;
        }
    }

    /**
     * 检查服务是否可用
     * @returns {Promise<boolean>} 服务是否可用
     */
    static async checkHealth() {
        try {
            // 获取健康检查URL（去掉/api后缀，加上/health）
            const baseURL = AI_SERVICE_URL.replace('/api', '');
            const response = await fetch(`${baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            return data.status === 'ok';
        } catch (error) {
            console.error('健康检查失败:', error);
            return false;
        }
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
}

