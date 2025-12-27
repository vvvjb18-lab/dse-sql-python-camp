// 主题管理系统
// 支持系统主题跟随和手动切换

(function() {
    'use strict';
    
    // 主题配置
    const themes = {
        dark: {
            '--bg-primary': '#0f172a',
            '--bg-secondary': '#1e293b',
            '--bg-tertiary': '#334155',
            '--bg-card': 'rgba(255, 255, 255, 0.05)',
            '--bg-card-hover': 'rgba(255, 255, 255, 0.08)',
            '--bg-nav': 'rgba(15, 23, 42, 0.8)',
            '--text-primary': '#f8fafc',
            '--text-secondary': '#cbd5e1',
            '--text-tertiary': '#94a3b8',
            '--border-color': 'rgba(255, 255, 255, 0.1)',
            '--border-hover': 'rgba(0, 245, 255, 0.3)',
            '--shadow-color': 'rgba(0, 245, 255, 0.15)',
            '--code-bg': '#1e293b',
            '--code-border': '#334155'
        },
        light: {
            '--bg-primary': '#ffffff',
            '--bg-secondary': '#f8fafc',
            '--bg-tertiary': '#f1f5f9',
            '--bg-card': 'rgba(15, 23, 42, 0.05)',
            '--bg-card-hover': 'rgba(15, 23, 42, 0.08)',
            '--bg-nav': 'rgba(255, 255, 255, 0.95)',
            '--text-primary': '#0f172a',
            '--text-secondary': '#334155',
            '--text-tertiary': '#64748b',
            '--border-color': 'rgba(0, 0, 0, 0.1)',
            '--border-hover': 'rgba(59, 130, 246, 0.3)',
            '--shadow-color': 'rgba(0, 0, 0, 0.1)',
            '--code-bg': '#f8fafc',
            '--code-border': '#e2e8f0'
        }
    };
    
    // 固定颜色（不受主题影响）
    const fixedColors = {
        '--primary-blue': '#00f5ff',
        '--primary-purple': '#6366f1',
        '--accent-green': '#10b981',
        '--accent-orange': '#f59e0b',
        '--accent-red': '#ef4444',
        '--gradient-primary': 'linear-gradient(135deg, #00f5ff 0%, #6366f1 100%)',
        '--gradient-secondary': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        '--gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };
    
    // 获取系统主题偏好
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // 获取保存的主题或使用系统主题
    function getTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        return getSystemTheme();
    }
    
    // 应用主题
    function applyTheme(theme) {
        const root = document.documentElement;
        const themeColors = themes[theme];
        
        // 应用主题颜色
        Object.keys(themeColors).forEach(key => {
            root.style.setProperty(key, themeColors[key]);
        });
        
        // 应用固定颜色
        Object.keys(fixedColors).forEach(key => {
            root.style.setProperty(key, fixedColors[key]);
        });
        
        // 添加主题类名
        root.classList.remove('theme-dark', 'theme-light');
        root.classList.add(`theme-${theme}`);
        
        // 保存主题偏好
        localStorage.setItem('theme-preference', theme);
        
        // 更新主题切换按钮
        updateThemeButton(theme);
    }
    
    // 切换主题
    function toggleTheme() {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }
    
    // 更新主题切换按钮
    function updateThemeButton(theme) {
        const buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(btn => {
            const icon = btn.querySelector('.theme-icon');
            if (icon) {
                if (theme === 'dark') {
                    icon.innerHTML = '🌙'; // 月亮图标表示深色模式
                    icon.setAttribute('title', '切换到浅色模式');
                } else {
                    icon.innerHTML = '☀️'; // 太阳图标表示浅色模式
                    icon.setAttribute('title', '切换到深色模式');
                }
            }
        });
    }
    
    // 监听系统主题变化
    function watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // 只有在用户没有手动设置主题时才跟随系统
                const savedTheme = localStorage.getItem('theme-preference');
                if (!savedTheme || savedTheme === 'auto') {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // 初始化主题
    function initTheme() {
        const theme = getTheme();
        applyTheme(theme);
        watchSystemTheme();
    }
    
    // 创建主题切换按钮
    function createThemeButton() {
        const existingBtn = document.querySelector('.theme-toggle-btn');
        if (existingBtn) return; // 如果已存在，不重复创建
        
        const btn = document.createElement('button');
        btn.className = 'theme-toggle-btn';
        btn.setAttribute('aria-label', '切换主题');
        btn.innerHTML = '<span class="theme-icon">🌙</span>';
        btn.onclick = toggleTheme;
        
        // 查找导航栏或合适的位置插入按钮
        const nav = document.querySelector('nav, .fixed-nav, .navbar');
        if (nav) {
            const navContent = nav.querySelector('.flex.items-center, .nav-content, .max-w-7xl');
            if (navContent) {
                // 插入到导航栏右侧
                const userSection = navContent.querySelector('#user-section, .user-section');
                if (userSection) {
                    userSection.parentNode.insertBefore(btn, userSection);
                } else {
                    navContent.appendChild(btn);
                }
            } else {
                nav.appendChild(btn);
            }
        } else {
            // 如果没有导航栏，创建浮动按钮
            btn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px var(--shadow-color);
            `;
            btn.onmouseenter = function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 6px 20px var(--shadow-color)';
            };
            btn.onmouseleave = function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 12px var(--shadow-color)';
            };
            document.body.appendChild(btn);
        }
        
        // 更新按钮样式
        updateThemeButtonStyle(btn);
    }
    
    // 更新按钮样式
    function updateThemeButtonStyle(btn) {
        if (!btn) return;
        
        // 如果按钮在导航栏中，使用导航栏样式
        if (btn.closest('nav')) {
            btn.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
                margin-left: 0.5rem;
            `;
            btn.onmouseenter = function() {
                this.style.background = 'var(--bg-card-hover)';
                this.style.borderColor = 'var(--border-hover)';
                this.style.transform = 'scale(1.05)';
            };
            btn.onmouseleave = function() {
                this.style.background = 'var(--bg-card)';
                this.style.borderColor = 'var(--border-color)';
                this.style.transform = 'scale(1)';
            };
        }
    }
    
    // 导出函数到全局
    window.ThemeManager = {
        init: initTheme,
        toggle: toggleTheme,
        getTheme: getTheme,
        applyTheme: applyTheme,
        createButton: createThemeButton
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            createThemeButton();
        });
    } else {
        initTheme();
        createThemeButton();
    }
})();

