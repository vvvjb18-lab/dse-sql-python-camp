/**
 * 用戶 API 服務模組
 * 處理與後端的用戶相關 API 調用
 */

const UserAPI = {
    // API 基礎 URL
    baseURL: window.location.origin,
    
    /**
     * 用戶註冊
     */
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('註冊錯誤:', error);
            return {
                success: false,
                error: '網絡錯誤，請檢查後端服務是否運行'
            };
        }
    },
    
    /**
     * 用戶登錄
     */
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 保存會話信息到 localStorage
                localStorage.setItem('session_token', result.session_token);
                localStorage.setItem('user_id', result.user_id);
                localStorage.setItem('username', result.username);
                localStorage.setItem('email', result.email);
                localStorage.setItem('current-user', result.username);
            }
            
            return result;
        } catch (error) {
            console.error('登錄錯誤:', error);
            return {
                success: false,
                error: '網絡錯誤，請檢查後端服務是否運行'
            };
        }
    },
    
    /**
     * 用戶登出
     */
    async logout() {
        try {
            const sessionToken = localStorage.getItem('session_token');
            
            if (sessionToken) {
                await fetch(`${this.baseURL}/api/user/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_token: sessionToken
                    })
                });
            }
            
            // 清除本地存儲
            localStorage.removeItem('session_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('current-user');
            
            return { success: true };
        } catch (error) {
            console.error('登出錯誤:', error);
            // 即使 API 調用失敗，也清除本地存儲
            localStorage.removeItem('session_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('current-user');
            return { success: true };
        }
    },
    
    /**
     * 獲取用戶資料
     */
    async getProfile() {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: false,
                    error: '未登錄'
                };
            }
            
            const url = `${this.baseURL}/api/user/profile?session_token=${sessionToken || ''}&user_id=${userId || ''}`;
            const response = await fetch(url);
            const result = await response.json();
            
            return result;
        } catch (error) {
            console.error('獲取資料錯誤:', error);
            return {
                success: false,
                error: '獲取資料失敗'
            };
        }
    },
    
    /**
     * 更新用戶資料
     */
    async updateProfile(profileData) {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: false,
                    error: '未登錄'
                };
            }
            
            const response = await fetch(`${this.baseURL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    session_token: sessionToken,
                    ...profileData
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('更新資料錯誤:', error);
            return {
                success: false,
                error: '更新資料失敗'
            };
        }
    },
    
    /**
     * 獲取用戶學習進度
     */
    async getProgress() {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: false,
                    error: '未登錄'
                };
            }
            
            const url = `${this.baseURL}/api/user/progress?session_token=${sessionToken || ''}&user_id=${userId || ''}`;
            const response = await fetch(url);
            const result = await response.json();
            
            return result;
        } catch (error) {
            console.error('獲取進度錯誤:', error);
            return {
                success: false,
                error: '獲取進度失敗'
            };
        }
    },
    
    /**
     * 更新用戶學習進度
     */
    async updateProgress(progressData) {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: false,
                    error: '未登錄'
                };
            }
            
            const response = await fetch(`${this.baseURL}/api/user/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    session_token: sessionToken,
                    ...progressData
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('更新進度錯誤:', error);
            return {
                success: false,
                error: '更新進度失敗'
            };
        }
    },
    
    /**
     * 檢查用戶名是否存在
     */
    async checkUsername(username) {
        try {
            const response = await fetch(`${this.baseURL}/api/user/check-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('檢查用戶名錯誤:', error);
            return {
                success: false,
                exists: false
            };
        }
    },
    
    /**
     * 檢查郵箱是否存在
     */
    async checkEmail(email) {
        try {
            const response = await fetch(`${this.baseURL}/api/user/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('檢查郵箱錯誤:', error);
            return {
                success: false,
                exists: false
            };
        }
    },
    
    /**
     * 獲取互動練習進度
     */
    async getInteractiveProgress() {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: false,
                    error: '未登錄',
                    progress: {}
                };
            }
            
            const response = await fetch(`${this.baseURL}/api/user/interactive-progress?session_token=${sessionToken}&user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('獲取互動練習進度錯誤:', error);
            return {
                success: false,
                error: '獲取進度失敗',
                progress: {}
            };
        }
    },
    
    /**
     * 保存互動練習進度
     */
    async saveInteractiveProgress(progress) {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                // 如果未登錄，仍然保存到localStorage作為備份
                localStorage.setItem('interactiveProgress', JSON.stringify(progress));
                return {
                    success: false,
                    error: '未登錄，已保存到本地',
                    saved_locally: true
                };
            }
            
            const response = await fetch(`${this.baseURL}/api/user/interactive-progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    session_token: sessionToken,
                    progress: progress
                })
            });
            
            const result = await response.json();
            
            // 同時保存到localStorage作為備份
            if (result.success) {
                localStorage.setItem('interactiveProgress', JSON.stringify(progress));
            }
            
            return result;
        } catch (error) {
            console.error('保存互動練習進度錯誤:', error);
            // 如果後端保存失敗，至少保存到localStorage
            localStorage.setItem('interactiveProgress', JSON.stringify(progress));
            return {
                success: false,
                error: '保存到後端失敗，已保存到本地',
                saved_locally: true
            };
        }
    },
    
    /**
     * 驗證會話
     */
    async validateSession() {
        try {
            const sessionToken = localStorage.getItem('session_token');
            
            if (!sessionToken) {
                return {
                    success: false,
                    error: '未登錄'
                };
            }
            
            const response = await fetch(`${this.baseURL}/api/user/session?session_token=${sessionToken}`);
            const result = await response.json();
            
            if (!result.success) {
                // 會話無效，清除本地存儲
                this.logout();
            }
            
            return result;
        } catch (error) {
            console.error('驗證會話錯誤:', error);
            return {
                success: false,
                error: '驗證失敗'
            };
        }
    },
    
    /**
     * 檢查是否已登錄
     */
    isLoggedIn() {
        const sessionToken = localStorage.getItem('session_token');
        const username = localStorage.getItem('username');
        return !!(sessionToken && username);
    },
    
    /**
     * 獲取當前用戶名
     */
    getCurrentUsername() {
        return localStorage.getItem('username') || localStorage.getItem('current-user');
    },
    
    /**
     * 獲取用戶選擇的 AI 模型
     */
    async getAIModel() {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: true,
                    model: 'glm-4-flash-250414'  // 未登錄時返回默認模型
                };
            }
            
            const url = `${this.baseURL}/api/user/ai-model?session_token=${sessionToken || ''}&user_id=${userId || ''}`;
            const response = await fetch(url);
            const result = await response.json();
            
            return result;
        } catch (error) {
            console.error('獲取AI模型錯誤:', error);
            return {
                success: true,
                model: 'glm-4-flash-250414'  // 出錯時返回默認模型
            };
        }
    },
    
    /**
     * 設置用戶選擇的 AI 模型
     */
    async setAIModel(modelId) {
        try {
            const sessionToken = localStorage.getItem('session_token');
            const userId = localStorage.getItem('user_id');
            
            if (!sessionToken && !userId) {
                return {
                    success: false,
                    error: '未登錄'
                };
            }
            
            const response = await fetch(`${this.baseURL}/api/user/ai-model`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    session_token: sessionToken,
                    model: modelId
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('設置AI模型錯誤:', error);
            return {
                success: false,
                error: '設置AI模型失敗'
            };
        }
    }
};

// 導出到全局
if (typeof window !== 'undefined') {
    window.UserAPI = UserAPI;
}

