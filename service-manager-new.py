#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DSE SQL 訓練營 - 後端服務管理工具 (新版本界面)
Linux 本地圖形化程序 - 重新設計版本
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import subprocess
import threading
import time
import os
import sys
import json
import re
import webbrowser
import socket
import urllib.request
import urllib.error
import sqlite3
import shutil
from pathlib import Path

# 尝试导入 psutil（如果可用，用于更准确的系统监控）
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

# 顏色常量定義（視覺設計系統）
COLORS = {
    'primary': '#2c3e50',      # 深藍 - 主要背景
    'primary_light': '#3498db', # 青藍 - 主要按鈕
    'success': '#2ecc71',      # 青綠 - 正常狀態
    'warning': '#f39c12',      # 琥珀 - 警告
    'danger': '#e74c3c',        # 紅 - 嚴重
    'info': '#3498db',         # 藍 - 資訊
    'bg_main': '#ffffff',       # 白色 - 主要內容
    'bg_sidebar': '#f8f9fa',   # 淺灰 - 側邊欄
    'bg_dark': '#2c3e50',      # 深藍 - 深色模式
    'text_primary': '#2c3e50',  # 主要文字
    'text_secondary': '#7f8c8d', # 次要文字
    'border': '#dee2e6',       # 邊框
}

class ServiceManagerNew:
    """重新設計的服務管理器 - 四區域響應式佈局"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("DSE SQL 訓練營 - 服務管理器 (新版本)")
        self.root.geometry("1400x900")
        self.root.minsize(1200, 800)
        
        # 設置窗口圖示（延遲加載，避免段錯誤）
        self._icon_image = None
        try:
            icon_path = "/home/yivh/下載/1202768.png"
            if os.path.exists(icon_path):
                # 延遲加載圖標，在界面創建後再設置
                self.icon_path = icon_path
        except Exception as e:
            print(f"載入窗口圖示失敗: {e}")
            self.icon_path = None
        
        # 設置工作目錄
        self.work_dir = Path(__file__).parent.absolute()
        os.chdir(self.work_dir)
        
        # 服務狀態
        self.service_running = False
        self.service_pid = None
        self.process = None
        self.log_thread = None
        self.monitor_thread = None
        self.stop_monitoring = False
        
        # 系統監控相關狀態
        self.system_monitor_running = True
        self.system_monitor_interval = 2000  # 毫秒
        self.cpu_history = []
        self.mem_history = []
        self.temp_history = []
        self.access_history = []
        
        # 配置
        self.config_file = self.work_dir / "config.py"
        self.backend_log = self.work_dir / "backend.log"
        self.app_file = self.work_dir / "app.py"
        self.domain_config_file = self.work_dir / "domain_config.json"
        self.port = 5000
        
        # 網域名稱配置（延遲加載）
        self.public_ip = "59.148.148.76"
        self.domain_name = "icthelper.duckdns.org"
        self.domain_config_file = self.work_dir / "domain_config.json"
        # 延遲加載配置，避免在初始化時出錯
        
        # NPM 配置（延遲加載）
        self.npm_address = "192.168.10.1:81"
        # 延遲加載配置
        
        # 當前選中的功能標籤
        self.current_tab = None
        
        # Toast 通知系統
        self.toast_widgets = []
        
        # 創建界面
        try:
            self.setup_styles()
            self.create_layout()
            
            # 延遲加載配置和圖標
            self.root.after(100, self.delayed_init)
            
            # 鍵盤快捷鍵綁定（在界面創建後）
            self.root.after(200, self.setup_keyboard_shortcuts)
        except Exception as e:
            print(f"界面創建失敗: {e}")
            import traceback
            traceback.print_exc()
            messagebox.showerror("錯誤", f"界面創建失敗:\n{str(e)}")
            self.root.destroy()
            return
        
        # 窗口關閉事件
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def setup_keyboard_shortcuts(self):
        """設置鍵盤快捷鍵"""
        try:
            # Ctrl+S: 啟動/停止服務
            self.root.bind('<Control-s>', lambda e: self.toggle_service())
            # Ctrl+H: 健康檢查
            self.root.bind('<Control-h>', lambda e: self.check_health())
            # Ctrl+Q: 退出
            self.root.bind('<Control-q>', lambda e: self.on_closing())
            # F5: 刷新
            self.root.bind('<F5>', lambda e: self.refresh_log())
            # Ctrl+F: 聚焦搜索框（如果存在）
            def focus_search(e):
                if hasattr(self, 'search_entry'):
                    try:
                        self.search_entry.focus()
                    except:
                        pass
            self.root.bind('<Control-f>', focus_search)
            # Escape: 清除搜索
            self.root.bind('<Escape>', lambda e: self.clear_search())
        except Exception as e:
            print(f"設置快捷鍵失敗: {e}")
    
    def clear_search(self):
        """清除搜索"""
        try:
            if hasattr(self, 'search_entry') and self.search_entry:
                self.search_entry.delete(0, tk.END)
            if hasattr(self, 'log_search_entry') and self.log_search_entry:
                self.log_search_entry.delete(0, tk.END)
        except:
            pass
    
    def setup_styles(self):
        """設置自定義樣式"""
        try:
            style = ttk.Style()
            
            # 配置主題
            style.theme_use('clam')
            
            # 自定義按鈕樣式
            style.configure('Primary.TButton',
                          background=COLORS['primary_light'],
                          foreground='white',
                          padding=10,
                          font=('Arial', 10, 'bold'))
            
            # 簡化樣式映射，避免可能的問題
            try:
                style.map('Primary.TButton',
                         background=[('active', COLORS['info']),
                                    ('pressed', COLORS['primary'])])
            except Exception as e:
                print(f"樣式映射警告: {e}")
            
            # 自定義標籤樣式
            style.configure('Status.TLabel',
                           font=('Arial', 11, 'bold'),
                           padding=5)
            
            # 自定義框架樣式
            style.configure('Sidebar.TFrame',
                           background=COLORS['bg_sidebar'])
            
            # 成功按鈕樣式
            style.configure('Success.TButton',
                           background=COLORS['success'],
                           foreground='white')
            
            # 危險按鈕樣式
            style.configure('Danger.TButton',
                           background=COLORS['danger'],
                           foreground='white')
            
            # 警告按鈕樣式
            style.configure('Warning.TButton',
                           background=COLORS['warning'],
                           foreground='white')
        except Exception as e:
            print(f"樣式設置警告: {e}")
            # 繼續執行，使用默認樣式
    
    def create_layout(self):
        """創建四區域響應式佈局"""
        # 配置根窗口網格
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(1, weight=1)
        
        # 1. 頂部導航欄
        self.create_top_bar()
        
        # 2. 主內容區域（左側面板 + 中央工作區 + 右側監控面板）
        main_container = ttk.Frame(self.root)
        main_container.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        main_container.columnconfigure(1, weight=1)
        main_container.rowconfigure(0, weight=1)
        
        # 左側功能面板
        self.create_left_panel(main_container)
        
        # 中央工作區
        self.create_center_workspace(main_container)
        
        # 右側監控面板
        self.create_right_panel(main_container)
        
        # 3. 底部狀態欄
        self.create_bottom_bar()
    
    def create_top_bar(self):
        """創建頂部導航欄"""
        top_bar = ttk.Frame(self.root, style='Sidebar.TFrame')
        top_bar.grid(row=0, column=0, sticky=(tk.W, tk.E), padx=0, pady=0)
        top_bar.columnconfigure(1, weight=1)
        
        # 左側：服務狀態總覽
        status_frame = ttk.Frame(top_bar)
        status_frame.pack(side=tk.LEFT, padx=10, pady=5)
        
        # 狀態指示器（使用 Label 代替 Canvas，避免段错误）
        self.status_indicator = ttk.Label(status_frame, text="🔴", font=('Arial', 14))
        self.status_indicator.pack(side=tk.LEFT, padx=(0, 5))
        self.update_status_indicator('stopped')
        
        # 狀態文字
        status_text_frame = ttk.Frame(status_frame)
        status_text_frame.pack(side=tk.LEFT, padx=5)
        
        self.status_label = ttk.Label(status_text_frame, text="已停止", font=('Arial', 11, 'bold'))
        self.status_label.pack(anchor=tk.W)
        
        status_info = ttk.Label(status_text_frame, text="PID: - | 端口: 5000", font=('Arial', 9))
        status_info.pack(anchor=tk.W)
        self.status_info_label = status_info
        
        # 健康檢查按鈕
        health_btn = ttk.Button(status_frame, text="🔍 健康檢查", command=self.check_health, width=12)
        health_btn.pack(side=tk.LEFT, padx=5)
        
        # 中間：快速操作按鈕組
        action_frame = ttk.Frame(top_bar)
        action_frame.pack(side=tk.LEFT, padx=20, pady=5)
        
        # 智能服務控制按鈕（根據狀態動態切換）
        self.service_control_btn = ttk.Button(
            action_frame,
            text="▶ 啟動服務",
            command=self.toggle_service,
            style='Primary.TButton',
            width=15
        )
        self.service_control_btn.pack(side=tk.LEFT, padx=2)
        
        # 緊急操作按鈕
        emergency_btn = ttk.Button(
            action_frame,
            text="■ 緊急停止",
            command=self.emergency_stop,
            width=12
        )
        emergency_btn.pack(side=tk.LEFT, padx=2)
        
        # 右側：全域功能
        global_frame = ttk.Frame(top_bar)
        global_frame.pack(side=tk.RIGHT, padx=10, pady=5)
        
        # 全局搜索
        search_frame = ttk.Frame(global_frame)
        search_frame.pack(side=tk.LEFT, padx=5)
        
        ttk.Label(search_frame, text="🔍", font=('Arial', 12)).pack(side=tk.LEFT, padx=2)
        self.search_entry = ttk.Entry(search_frame, width=20)
        self.search_entry.pack(side=tk.LEFT, padx=2)
        self.search_entry.bind('<Return>', self.perform_search)
        
        # 通知中心
        self.notification_btn = ttk.Button(global_frame, text="🔔 通知 (0)", command=self.show_notifications, width=12)
        self.notification_btn.pack(side=tk.LEFT, padx=2)
        self.notification_count = 0
        
        # 用戶設定
        settings_btn = ttk.Button(global_frame, text="⚙️ 設定", command=self.show_settings, width=10)
        settings_btn.pack(side=tk.LEFT, padx=2)
    
    def create_left_panel(self, parent):
        """創建左側功能面板（垂直標籤導航）"""
        left_panel = ttk.Frame(parent, style='Sidebar.TFrame', width=250)
        left_panel.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 2))
        left_panel.columnconfigure(0, weight=1)
        
        # 功能分組
        self.function_groups = {
            '🔧 服務管理': [
                ('服務控制', self.show_service_control),
                ('健康監控', self.show_health_monitor),
                ('訪問配置', self.show_access_config),
                ('防火牆設定', self.show_firewall_config),
            ],
            '📦 容器管理': [
                ('NPM 容器', self.show_npm_container),
                ('Docker 狀態', self.show_docker_status),
            ],
            '📊 數據管理': [
                ('資料庫管理', self.show_database_management),
                ('用戶管理', self.show_user_management),
                ('學習進度', self.show_learning_progress),
            ],
            '⚙️ 系統配置': [
                ('API 金鑰管理', self.show_api_keys),
                ('域名設定', self.show_domain_config),
                ('檔案配置', self.show_file_config),
                ('備份管理', self.show_backup_management),
            ],
            '🤖 AI 服務': [
                ('模型狀態', self.show_ai_status),
                ('連接測試', self.show_ai_test),
                ('使用統計', self.show_ai_stats),
            ],
            '📂 檔案管理': [
                ('HTML 文件', self.show_html_files),
                ('配置文件', self.show_config_files),
                ('日誌文件', self.show_log_files),
            ],
        }
        
        # 創建可收折式目錄
        try:
            self.function_tree = ttk.Treeview(left_panel, show='tree', selectmode='browse')
            self.function_tree.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
            
            # 綁定選擇事件
            self.function_tree.bind('<<TreeviewSelect>>', self.on_function_select)
            
            # 添加功能分組
            for group_name, functions in self.function_groups.items():
                try:
                    group_id = self.function_tree.insert('', 'end', text=group_name, open=True)
                    for func_name, func_handler in functions:
                        self.function_tree.insert(group_id, 'end', text=func_name, values=(func_handler,))
                except Exception as e:
                    print(f"添加分组 {group_name} 失败: {e}")
        except Exception as e:
            print(f"创建功能树失败: {e}")
            import traceback
            traceback.print_exc()
            # 创建简单的替代界面
            try:
                error_label = ttk.Label(left_panel, text="功能树加载失败", foreground='red')
                error_label.pack(pady=20)
            except:
                pass
    
    def create_center_workspace(self, parent):
        """創建中央工作區（動態內容區）"""
        workspace_frame = ttk.Frame(parent)
        workspace_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S), padx=2)
        workspace_frame.columnconfigure(0, weight=1)
        workspace_frame.rowconfigure(1, weight=1)
        
        # 標籤式工作區
        self.workspace_notebook = ttk.Notebook(workspace_frame)
        self.workspace_notebook.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 默認顯示日誌頁面
        self.create_log_tab()
    
    def create_log_tab(self):
        """創建日誌標籤頁"""
        log_frame = ttk.Frame(self.workspace_notebook, padding=5)
        self.workspace_notebook.add(log_frame, text="服務日誌")
        
        # 工具列
        toolbar = ttk.Frame(log_frame)
        toolbar.pack(fill=tk.X, pady=(0, 5))
        
        ttk.Button(toolbar, text="清空", command=self.clear_log).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="刷新", command=self.refresh_log).pack(side=tk.LEFT, padx=2)
        
        self.auto_scroll_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(toolbar, text="自動滾動", variable=self.auto_scroll_var).pack(side=tk.LEFT, padx=2)
        
        ttk.Button(toolbar, text="過濾", command=self.show_log_filter).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="匯出", command=self.export_log).pack(side=tk.LEFT, padx=2)
        
        # 搜索框
        search_frame = ttk.Frame(toolbar)
        search_frame.pack(side=tk.RIGHT, padx=5)
        ttk.Label(search_frame, text="搜尋:").pack(side=tk.LEFT)
        self.log_search_entry = ttk.Entry(search_frame, width=20)
        self.log_search_entry.pack(side=tk.LEFT, padx=2)
        self.log_search_entry.bind('<KeyRelease>', self.filter_log)
        
        # 日誌內容區
        log_container = ttk.Frame(log_frame)
        log_container.pack(fill=tk.BOTH, expand=True)
        
        self.log_text = scrolledtext.ScrolledText(
            log_container,
            wrap=tk.WORD,
            font=('Consolas', 10),
            bg='#1e1e1e',
            fg='#d4d4d4',
            insertbackground='#ffffff',
            spacing1=2,
            spacing2=1,
            spacing3=2,
            padx=5,
            pady=5
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        # 即時過濾面板（可收折）
        self.log_filter_frame = ttk.LabelFrame(log_frame, text="過濾選項", padding=5)
        # 默認隱藏，點擊過濾按鈕顯示
        self.log_filter_visible = False
        
        # 初始化自動滾動變量（如果還沒有）
        if not hasattr(self, 'auto_scroll_var'):
            self.auto_scroll_var = tk.BooleanVar(value=True)
        
        # 綁定滾輪
        self.log_text.bind("<MouseWheel>", self.on_log_mousewheel)
        self.log_text.bind("<Button-4>", self.on_log_mousewheel)
        self.log_text.bind("<Button-5>", self.on_log_mousewheel)
    
    def create_right_panel(self, parent):
        """創建右側即時監控面板（固定面板）"""
        right_panel = ttk.Frame(parent, width=300)
        right_panel.grid(row=0, column=2, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(2, 0))
        right_panel.columnconfigure(0, weight=1)
        
        # 系統資源監控
        monitor_frame = ttk.LabelFrame(right_panel, text="📈 系統資源監控", padding=10)
        monitor_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # CPU
        cpu_frame = ttk.Frame(monitor_frame)
        cpu_frame.pack(fill=tk.X, pady=2)
        ttk.Label(cpu_frame, text="CPU:", width=8).pack(side=tk.LEFT)
        self.cpu_progress = ttk.Progressbar(cpu_frame, length=150, mode='determinate')
        self.cpu_progress.pack(side=tk.LEFT, padx=5)
        self.cpu_label = ttk.Label(cpu_frame, text="--%", width=8)
        self.cpu_label.pack(side=tk.LEFT)
        
        # 記憶體
        mem_frame = ttk.Frame(monitor_frame)
        mem_frame.pack(fill=tk.X, pady=2)
        ttk.Label(mem_frame, text="記憶體:", width=8).pack(side=tk.LEFT)
        self.mem_progress = ttk.Progressbar(mem_frame, length=150, mode='determinate')
        self.mem_progress.pack(side=tk.LEFT, padx=5)
        self.mem_label = ttk.Label(mem_frame, text="--%", width=8)
        self.mem_label.pack(side=tk.LEFT)
        
        # 磁碟
        disk_frame = ttk.Frame(monitor_frame)
        disk_frame.pack(fill=tk.X, pady=2)
        ttk.Label(disk_frame, text="磁碟:", width=8).pack(side=tk.LEFT)
        self.disk_progress = ttk.Progressbar(disk_frame, length=150, mode='determinate')
        self.disk_progress.pack(side=tk.LEFT, padx=5)
        self.disk_label = ttk.Label(disk_frame, text="--%", width=8)
        self.disk_label.pack(side=tk.LEFT)
        
        # 服務狀態
        service_frame = ttk.LabelFrame(right_panel, text="🌐 服務狀態", padding=10)
        service_frame.pack(fill=tk.X, padx=5, pady=5)
        
        self.backend_status_label = ttk.Label(service_frame, text="後端: 檢查中...")
        self.backend_status_label.pack(anchor=tk.W, pady=2)
        
        self.db_status_label = ttk.Label(service_frame, text="資料庫: 檢查中...")
        self.db_status_label.pack(anchor=tk.W, pady=2)
        
        self.user_count_label = ttk.Label(service_frame, text="用戶: 檢查中...")
        self.user_count_label.pack(anchor=tk.W, pady=2)
        
        # 訪問趨勢（簡化版）
        access_frame = ttk.LabelFrame(right_panel, text="📊 24小時訪問趨勢", padding=10)
        access_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.access_label = ttk.Label(access_frame, text="今日訪問: 載入中...")
        self.access_label.pack(anchor=tk.W, pady=5)
        
        # 初始化進度條最大值
        if hasattr(self, 'cpu_progress'):
            self.cpu_progress['maximum'] = 100
        if hasattr(self, 'mem_progress'):
            self.mem_progress['maximum'] = 100
        if hasattr(self, 'disk_progress'):
            self.disk_progress['maximum'] = 100
    
    def create_bottom_bar(self):
        """創建底部狀態欄"""
        bottom_bar = ttk.Frame(self.root, style='Sidebar.TFrame')
        bottom_bar.grid(row=2, column=0, sticky=(tk.W, tk.E), padx=0, pady=0)
        bottom_bar.columnconfigure(1, weight=1)
        
        # 系統狀態
        sys_info = ttk.Label(bottom_bar, text="Ubuntu 22.04 | Python 3.10 | Docker 24.0", font=('Arial', 8))
        sys_info.pack(side=tk.LEFT, padx=5, pady=2)
        
        # 網路信息
        self.network_label = ttk.Label(bottom_bar, text="本機IP: 載入中...", font=('Arial', 8))
        self.network_label.pack(side=tk.LEFT, padx=5, pady=2)
        
        # 通知和操作記錄
        self.bottom_notification = ttk.Label(bottom_bar, text="[通知] 0個警告 | 0個錯誤", font=('Arial', 8))
        self.bottom_notification.pack(side=tk.RIGHT, padx=5, pady=2)
    
    # ========== 功能方法（占位符，需要從原文件遷移） ==========
    
    def load_domain_config(self):
        """載入網域名稱配置"""
        try:
            if hasattr(self, 'domain_config_file') and self.domain_config_file.exists():
                with open(self.domain_config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                    self.public_ip = config.get('public_ip', self.public_ip)
                    self.domain_name = config.get('domain_name', self.domain_name)
        except Exception as e:
            print(f"載入域名配置失敗: {e}")
    
    def load_npm_config(self):
        """載入 NPM 配置"""
        try:
            npm_config_file = self.work_dir / "npm_config.json"
            if npm_config_file.exists():
                with open(npm_config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                    self.npm_address = config.get('npm_address', self.npm_address)
        except Exception as e:
            print(f"載入 NPM 配置失敗: {e}")
    
    def update_status_indicator(self, status):
        """更新狀態指示器"""
        try:
            if status == 'running':
                text = '🟢'
                color = COLORS['success']
            elif status == 'stopped':
                text = '🔴'
                color = COLORS['danger']
            else:
                text = '🟡'
                color = COLORS['warning']
            
            # 使用 Label 的 text 和 foreground 属性
            self.status_indicator.config(text=text, foreground=color)
        except Exception as e:
            print(f"更新狀態指示器失敗: {e}")
    
    def toggle_service(self):
        """智能服務控制（根據狀態切換）"""
        if self.service_running:
            self.stop_service()
        else:
            self.start_service()
    
    def start_service(self):
        """啟動服務"""
        if self.service_running:
            messagebox.showwarning("警告", "服務已在運行中！")
            return
        
        try:
            # 檢查 app.py 是否存在
            if not self.app_file.exists():
                messagebox.showerror("錯誤", f"找不到應用程序文件: {self.app_file}")
                return
            
            # 檢查端口是否被占用
            if self.is_port_in_use(self.port):
                result = messagebox.askyesno(
                    "端口占用",
                    f"端口 {self.port} 已被占用。是否要停止現有進程？"
                )
                if result:
                    self.kill_process_on_port(self.port)
                    time.sleep(1)
                else:
                    return
            
            # 啟動服務
            self.log_message("正在啟動服務...", "info")
            self.service_control_btn.config(state=tk.DISABLED)
            
            # 使用 subprocess 啟動服務
            self.process = subprocess.Popen(
                [sys.executable, str(self.app_file)],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
                cwd=str(self.work_dir)
            )
            
            self.service_pid = self.process.pid
            self.service_running = True
            
            # 更新按鈕狀態
            self.service_control_btn.config(text="■ 停止服務", state=tk.NORMAL)
            
            # 啟動日誌監控線程
            self.start_log_monitor()
            
            # 等待服務啟動
            time.sleep(2)
            self.check_service_status()
            
            self.log_message(f"服務已啟動 (PID: {self.service_pid})", "success")
            self.update_status()
            self.show_toast(f"服務已成功啟動 (PID: {self.service_pid})", "success")
            
        except Exception as e:
            self.log_message(f"啟動服務失敗: {str(e)}", "error")
            messagebox.showerror("錯誤", f"啟動服務失敗:\n{str(e)}")
            self.service_running = False
            self.service_control_btn.config(text="▶ 啟動服務", state=tk.NORMAL)
    
    def stop_service(self):
        """停止服務"""
        if not self.service_running:
            messagebox.showwarning("警告", "服務未運行！")
            return
        
        try:
            self.log_message("正在停止服務...", "info")
            
            # 停止監控
            self.stop_monitoring = True
            
            # 終止進程
            if self.process:
                self.process.terminate()
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    self.process.kill()
                    self.process.wait()
                self.process = None
            
            # 使用 pkill 確保所有相關進程都被終止
            try:
                subprocess.run(
                    ["pkill", "-f", "python.*app.py"],
                    timeout=3,
                    capture_output=True
                )
            except:
                pass
            
            self.service_running = False
            self.service_pid = None
            
            # 更新按鈕狀態
            self.service_control_btn.config(text="▶ 啟動服務", state=tk.NORMAL)
            
            self.log_message("服務已停止", "success")
            self.update_status()
            self.show_toast("服務已停止", "info")
            
        except Exception as e:
            self.log_message(f"停止服務失敗: {str(e)}", "error")
            messagebox.showerror("錯誤", f"停止服務失敗:\n{str(e)}")
    
    def emergency_stop(self):
        """緊急停止"""
        if self.service_running:
            self.log_message("執行緊急停止...", "warning")
            # 強制殺死所有相關進程
            try:
                subprocess.run(["pkill", "-9", "-f", "python.*app.py"], timeout=3, capture_output=True)
                self.service_running = False
                self.service_pid = None
                self.process = None
                self.service_control_btn.config(text="▶ 啟動服務", state=tk.NORMAL)
                self.update_status()
                self.log_message("緊急停止完成", "success")
                messagebox.showinfo("完成", "服務已緊急停止")
            except Exception as e:
                self.log_message(f"緊急停止失敗: {str(e)}", "error")
                messagebox.showerror("錯誤", f"緊急停止失敗:\n{str(e)}")
        else:
            messagebox.showinfo("提示", "服務未運行，無需停止")
    
    def toggle_service(self):
        """智能服務控制（根據狀態切換）"""
        if self.service_running:
            self.stop_service()
        else:
            self.start_service()
    
    def check_health(self):
        """健康檢查"""
        try:
            url = f"http://localhost:{self.port}/health"
            req = urllib.request.Request(url)
            
            try:
                with urllib.request.urlopen(req, timeout=3) as response:
                    data = json.loads(response.read().decode())
                    messagebox.showinfo(
                        "健康檢查",
                        f"服務狀態: 正常\n\n{json.dumps(data, indent=2, ensure_ascii=False)}"
                    )
                    self.log_message("健康檢查: 服務正常", "success")
                    self.show_toast("健康檢查: 服務正常", "success")
            except urllib.error.URLError as e:
                messagebox.showerror("健康檢查", f"無法連接到服務:\n{str(e)}")
                self.log_message(f"健康檢查失敗: {str(e)}", "error")
        except Exception as e:
            messagebox.showerror("錯誤", f"健康檢查失敗:\n{str(e)}")
    
    def perform_search(self, event=None):
        """執行全局搜索"""
        query = self.search_entry.get()
        self.log_message(f"搜索: {query}", "info")
    
    def show_toast(self, message, toast_type='info', duration=3000):
        """
        顯示 Toast 通知
        
        Args:
            message: 通知消息
            toast_type: 通知類型 ('success', 'error', 'warning', 'info')
            duration: 顯示時長（毫秒）
        """
        # 創建 Toast 窗口
        toast = tk.Toplevel(self.root)
        toast.overrideredirect(True)  # 無邊框
        toast.attributes('-topmost', True)  # 置頂
        
        # 設置位置（右上角）
        toast.update_idletasks()
        x = self.root.winfo_x() + self.root.winfo_width() - 350
        y = self.root.winfo_y() + 50 + len(self.toast_widgets) * 60
        toast.geometry(f"320x60+{x}+{y}")
        
        # 設置背景顏色
        colors = {
            'success': COLORS['success'],
            'error': COLORS['danger'],
            'warning': COLORS['warning'],
            'info': COLORS['info']
        }
        bg_color = colors.get(toast_type, COLORS['info'])
        
        toast.configure(bg=bg_color)
        
        # 創建內容框架
        content_frame = tk.Frame(toast, bg=bg_color, padx=15, pady=10)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # 圖標
        icons = {
            'success': '✓',
            'error': '✗',
            'warning': '⚠',
            'info': 'ℹ'
        }
        icon_label = tk.Label(
            content_frame,
            text=icons.get(toast_type, 'ℹ'),
            bg=bg_color,
            fg='white',
            font=('Arial', 16, 'bold')
        )
        icon_label.pack(side=tk.LEFT, padx=(0, 10))
        
        # 消息
        msg_label = tk.Label(
            content_frame,
            text=message,
            bg=bg_color,
            fg='white',
            font=('Arial', 10),
            wraplength=250,
            justify=tk.LEFT
        )
        msg_label.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # 關閉按鈕
        close_btn = tk.Label(
            content_frame,
            text='×',
            bg=bg_color,
            fg='white',
            font=('Arial', 18, 'bold'),
            cursor='hand2'
        )
        close_btn.pack(side=tk.RIGHT, padx=(5, 0))
        
        def close_toast():
            toast.destroy()
            if toast in self.toast_widgets:
                self.toast_widgets.remove(toast)
            # 重新排列其他 Toast
            self.reposition_toasts()
        
        close_btn.bind('<Button-1>', lambda e: close_toast())
        
        # 添加到列表
        self.toast_widgets.append(toast)
        
        # 自動關閉（除了錯誤類型）
        if toast_type != 'error':
            toast.after(duration, close_toast)
    
    def reposition_toasts(self):
        """重新排列 Toast 通知位置"""
        for i, toast in enumerate(self.toast_widgets):
            try:
                x = self.root.winfo_x() + self.root.winfo_width() - 350
                y = self.root.winfo_y() + 50 + i * 60
                toast.geometry(f"320x60+{x}+{y}")
            except:
                pass
    
    def show_notifications(self):
        """顯示通知中心"""
        if self.notification_count > 0:
            messagebox.showinfo("通知中心", f"當前有 {self.notification_count} 個通知")
        else:
            messagebox.showinfo("通知中心", "暫無通知")
    
    def show_settings(self):
        """顯示設定"""
        messagebox.showinfo("設定", "設定功能待實現")
    
    def on_function_select(self, event):
        """功能選擇事件處理"""
        selection = self.function_tree.selection()
        if selection:
            item = self.function_tree.item(selection[0])
            text = item.get('text', '')
            values = item.get('values', [])
            if values:
                handler = values[0]
                handler()
                # 更新当前选中的标签
                self.current_tab = text
    
    def get_or_create_tab(self, tab_name, create_func):
        """
        獲取或創建標籤頁
        
        Args:
            tab_name: 標籤頁名稱
            create_func: 創建標籤頁內容的函數
        """
        # 檢查標籤頁是否已存在
        for i in range(self.workspace_notebook.index("end")):
            if self.workspace_notebook.tab(i, "text") == tab_name:
                # 標籤頁已存在，切換到它
                self.workspace_notebook.select(i)
                return
        
        # 創建新標籤頁
        frame = ttk.Frame(self.workspace_notebook, padding=10)
        self.workspace_notebook.add(frame, text=tab_name)
        self.workspace_notebook.select(self.workspace_notebook.index("end") - 1)
        
        # 調用創建函數
        create_func(frame)
    
    # ========== 功能頁面實現 ==========
    
    def show_service_control(self):
        """顯示服務控制頁面"""
        def create_page(parent):
            # 服務狀態卡片
            status_card = ttk.LabelFrame(parent, text="服務狀態", padding=15)
            status_card.pack(fill=tk.X, pady=(0, 10))
            
            status_grid = ttk.Frame(status_card)
            status_grid.pack(fill=tk.X)
            
            ttk.Label(status_grid, text="運行狀態:", font=('Arial', 10, 'bold')).grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
            status_display = ttk.Label(status_grid, text="檢查中...", font=('Arial', 10))
            status_display.grid(row=0, column=1, sticky=tk.W, padx=5, pady=5)
            
            ttk.Label(status_grid, text="進程 ID:", font=('Arial', 10, 'bold')).grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
            pid_display = ttk.Label(status_grid, text="-", font=('Arial', 10))
            pid_display.grid(row=1, column=1, sticky=tk.W, padx=5, pady=5)
            
            ttk.Label(status_grid, text="端口:", font=('Arial', 10, 'bold')).grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
            port_display = ttk.Label(status_grid, text=str(self.port), font=('Arial', 10))
            port_display.grid(row=2, column=1, sticky=tk.W, padx=5, pady=5)
            
            # 更新顯示
            def update_display():
                if self.service_running:
                    status_display.config(text="🟢 運行中", foreground=COLORS['success'])
                    pid_display.config(text=str(self.service_pid or '未知'))
                else:
                    status_display.config(text="🔴 已停止", foreground=COLORS['danger'])
                    pid_display.config(text="-")
                parent.after(2000, update_display)
            update_display()
            
            # 控制按鈕
            control_frame = ttk.LabelFrame(parent, text="服務控制", padding=15)
            control_frame.pack(fill=tk.X, pady=(0, 10))
            
            btn_frame = ttk.Frame(control_frame)
            btn_frame.pack()
            
            ttk.Button(btn_frame, text="▶ 啟動服務", command=self.start_service, width=15).pack(side=tk.LEFT, padx=5)
            ttk.Button(btn_frame, text="■ 停止服務", command=self.stop_service, width=15).pack(side=tk.LEFT, padx=5)
            ttk.Button(btn_frame, text="↻ 重啟服務", command=self.restart_service, width=15).pack(side=tk.LEFT, padx=5)
            ttk.Button(btn_frame, text="🔍 健康檢查", command=self.check_health, width=15).pack(side=tk.LEFT, padx=5)
        
        self.get_or_create_tab("服務控制", create_page)
    
    def show_health_monitor(self):
        """顯示健康監控頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            
            def update_health():
                info_text.delete(1.0, tk.END)
                info_text.insert(tk.END, "健康監控信息\n")
                info_text.insert(tk.END, "=" * 50 + "\n\n")
                info_text.insert(tk.END, f"服務狀態: {'運行中' if self.service_running else '已停止'}\n")
                info_text.insert(tk.END, f"進程 ID: {self.service_pid or '未知'}\n")
                info_text.insert(tk.END, f"端口: {self.port}\n\n")
                info_text.insert(tk.END, "點擊「健康檢查」按鈕獲取詳細信息\n")
                parent.after(5000, update_health)
            update_health()
        
        self.get_or_create_tab("健康監控", create_page)
    
    def show_access_config(self):
        """顯示訪問配置頁面"""
        def create_page(parent):
            config_frame = ttk.LabelFrame(parent, text="訪問配置", padding=15)
            config_frame.pack(fill=tk.X, pady=10, padx=10)
            
            ttk.Label(config_frame, text="訪問模式:", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=5)
            access_mode = tk.StringVar(value="local")
            ttk.Radiobutton(config_frame, text="本地 (localhost:5000)", variable=access_mode, value="local").pack(anchor=tk.W)
            ttk.Radiobutton(config_frame, text="公網 (域名/IP)", variable=access_mode, value="public").pack(anchor=tk.W)
            
            ttk.Label(config_frame, text="快速訪問:", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(15, 5))
            pages = [("首頁", "index.html"), ("SQL 練習", "practice.html"), ("Python 中心", "python-center.html")]
            for name, file in pages:
                btn = ttk.Button(config_frame, text=f"🌐 {name}", command=lambda f=file: webbrowser.open(f"http://localhost:{self.port}/{f}"))
                btn.pack(fill=tk.X, pady=2)
        
        self.get_or_create_tab("訪問配置", create_page)
    
    def show_firewall_config(self):
        """顯示防火牆設定頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=15)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            info_text.insert(tk.END, "防火牆配置\n")
            info_text.insert(tk.END, "=" * 50 + "\n\n")
            info_text.insert(tk.END, f"端口: {self.port}\n")
            info_text.insert(tk.END, "配置命令:\n")
            info_text.insert(tk.END, f"sudo ufw allow {self.port}/tcp\n")
            info_text.insert(tk.END, "sudo ufw reload\n")
            info_text.config(state=tk.DISABLED)
        
        self.get_or_create_tab("防火牆設定", create_page)
    
    def show_npm_container(self):
        """顯示 NPM 容器頁面"""
        def create_page(parent):
            # NPM 狀態
            status_frame = ttk.LabelFrame(parent, text="NPM 容器狀態", padding=15)
            status_frame.pack(fill=tk.X, pady=10, padx=10)
            
            npm_status_label = ttk.Label(status_frame, text="檢查中...", font=('Arial', 11))
            npm_status_label.pack(pady=10)
            
            # 控制按鈕
            control_frame = ttk.LabelFrame(parent, text="容器控制", padding=15)
            control_frame.pack(fill=tk.X, pady=10, padx=10)
            
            btn_frame = ttk.Frame(control_frame)
            btn_frame.pack()
            
            ttk.Button(btn_frame, text="▶ 啟動 NPM", command=self.start_npm_container, width=12).pack(side=tk.LEFT, padx=3)
            ttk.Button(btn_frame, text="■ 停止 NPM", command=self.stop_npm_container, width=12).pack(side=tk.LEFT, padx=3)
            ttk.Button(btn_frame, text="↻ 重啟 NPM", command=self.restart_npm_container, width=12).pack(side=tk.LEFT, padx=3)
            
            # 地址配置
            config_frame = ttk.LabelFrame(parent, text="NPM 地址配置", padding=15)
            config_frame.pack(fill=tk.X, pady=10, padx=10)
            
            addr_frame = ttk.Frame(config_frame)
            addr_frame.pack(fill=tk.X)
            
            ttk.Label(addr_frame, text="NPM 地址:", font=('Arial', 10)).pack(side=tk.LEFT, padx=5)
            npm_addr_entry = ttk.Entry(addr_frame, width=25)
            npm_addr_entry.pack(side=tk.LEFT, padx=5)
            npm_addr_entry.insert(0, self.npm_address)
            
            def save_addr():
                self.npm_address = npm_addr_entry.get()
                self.save_npm_address()
                self.show_toast("NPM 地址已保存", "success")
            
            ttk.Button(addr_frame, text="保存", command=save_addr).pack(side=tk.LEFT, padx=5)
            ttk.Button(addr_frame, text="🌐 打開", command=self.open_npm_manager).pack(side=tk.LEFT, padx=5)
            
            # 更新狀態
            def update_npm_status():
                self.check_npm_status()
                parent.after(5000, update_npm_status)
            update_npm_status()
        
        self.get_or_create_tab("NPM 容器", create_page)
    
    def show_docker_status(self):
        """顯示 Docker 狀態頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            
            def update_docker():
                info_text.delete(1.0, tk.END)
                info_text.insert(tk.END, "Docker 狀態\n")
                info_text.insert(tk.END, "=" * 50 + "\n\n")
                try:
                    result = subprocess.run(['docker', 'ps', '-a'], capture_output=True, text=True, timeout=3)
                    info_text.insert(tk.END, result.stdout)
                except:
                    info_text.insert(tk.END, "無法獲取 Docker 狀態\n")
                parent.after(10000, update_docker)
            update_docker()
        
        self.get_or_create_tab("Docker 狀態", create_page)
    
    def show_database_management(self):
        """顯示資料庫管理頁面"""
        def create_page(parent):
            # 工具欄
            toolbar = ttk.Frame(parent)
            toolbar.pack(fill=tk.X, pady=5, padx=10)
            
            ttk.Button(toolbar, text="刷新狀態", command=lambda: self.refresh_database_status_new(parent)).pack(side=tk.LEFT, padx=2)
            ttk.Button(toolbar, text="備份資料庫", command=self.backup_database).pack(side=tk.LEFT, padx=2)
            ttk.Button(toolbar, text="打開位置", command=self.open_database_folder).pack(side=tk.LEFT, padx=2)
            
            # 資料庫信息
            info_frame = ttk.LabelFrame(parent, text="資料庫信息", padding=10)
            info_frame.pack(fill=tk.X, pady=5, padx=10)
            
            self.db_info_text = scrolledtext.ScrolledText(info_frame, wrap=tk.WORD, height=6, font=('Consolas', 9))
            self.db_info_text.pack(fill=tk.BOTH, expand=True)
            
            # 初次刷新
            self.refresh_database_status_new(parent)
        
        self.get_or_create_tab("資料庫管理", create_page)
    
    def show_user_management(self):
        """顯示用戶管理頁面"""
        def create_page(parent):
            # 工具欄
            toolbar = ttk.Frame(parent)
            toolbar.pack(fill=tk.X, pady=5, padx=10)
            
            ttk.Button(toolbar, text="刷新列表", command=lambda: self.refresh_user_list_new(parent)).pack(side=tk.LEFT, padx=2)
            
            # 用戶列表
            list_frame = ttk.LabelFrame(parent, text="用戶列表", padding=10)
            list_frame.pack(fill=tk.BOTH, expand=True, pady=5, padx=10)
            
            columns = ("id", "username", "email", "created_at", "is_active")
            user_tree = ttk.Treeview(list_frame, columns=columns, show="headings", height=15)
            
            for col, text in zip(columns, ["ID", "用戶名", "電子郵件", "創建時間", "狀態"]):
                user_tree.heading(col, text=text)
                user_tree.column(col, width=100)
            
            scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=user_tree.yview)
            user_tree.configure(yscrollcommand=scrollbar.set)
            
            user_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
            scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
            
            # 保存引用以便刷新
            parent._user_tree = user_tree
            
            # 初次刷新
            self.refresh_user_list_new(parent)
        
        self.get_or_create_tab("用戶管理", create_page)
    
    def show_learning_progress(self):
        """顯示學習進度頁面"""
        def create_page(parent):
            # 工具欄
            toolbar = ttk.Frame(parent)
            toolbar.pack(fill=tk.X, pady=5, padx=10)
            
            ttk.Button(toolbar, text="刷新進度", command=lambda: self.refresh_user_progress_new(parent)).pack(side=tk.LEFT, padx=2)
            
            # 進度列表
            list_frame = ttk.LabelFrame(parent, text="學習進度", padding=10)
            list_frame.pack(fill=tk.BOTH, expand=True, pady=5, padx=10)
            
            columns = ("user_id", "username", "completed", "score", "time", "level")
            progress_tree = ttk.Treeview(list_frame, columns=columns, show="headings", height=15)
            
            for col, text in zip(columns, ["ID", "用戶名", "完成題數", "總分", "學習時長(分)", "等級"]):
                progress_tree.heading(col, text=text)
                progress_tree.column(col, width=100)
            
            scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=progress_tree.yview)
            progress_tree.configure(yscrollcommand=scrollbar.set)
            
            progress_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
            scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
            
            # 保存引用
            parent._progress_tree = progress_tree
            
            # 初次刷新
            self.refresh_user_progress_new(parent)
        
        self.get_or_create_tab("學習進度", create_page)
    
    def show_api_keys(self):
        """顯示 API 金鑰管理頁面"""
        def create_page(parent):
            config_frame = ttk.LabelFrame(parent, text="API 金鑰配置", padding=15)
            config_frame.pack(fill=tk.BOTH, expand=True, pady=10, padx=10)
            
            # 智譜AI
            zhipu_frame = ttk.Frame(config_frame)
            zhipu_frame.pack(fill=tk.X, pady=5)
            
            ttk.Label(zhipu_frame, text="智譜AI API 密鑰:", font=('Arial', 10, 'bold')).pack(side=tk.LEFT, padx=5)
            zhipu_entry = ttk.Entry(zhipu_frame, width=40, show="*")
            zhipu_entry.pack(side=tk.LEFT, padx=5)
            
            def save_zhipu():
                # TODO: 保存到 config.py
                self.show_toast("API 密鑰已保存", "success")
            
            ttk.Button(zhipu_frame, text="保存", command=save_zhipu).pack(side=tk.LEFT, padx=5)
            
            # SiliconFlow
            sf_frame = ttk.Frame(config_frame)
            sf_frame.pack(fill=tk.X, pady=5)
            
            ttk.Label(sf_frame, text="SiliconFlow API 密鑰:", font=('Arial', 10, 'bold')).pack(side=tk.LEFT, padx=5)
            sf_entry = ttk.Entry(sf_frame, width=40, show="*")
            sf_entry.pack(side=tk.LEFT, padx=5)
            
            def save_sf():
                # TODO: 保存到 config.py
                self.show_toast("API 密鑰已保存", "success")
            
            ttk.Button(sf_frame, text="保存", command=save_sf).pack(side=tk.LEFT, padx=5)
        
        self.get_or_create_tab("API 金鑰管理", create_page)
    
    def show_domain_config(self):
        """顯示域名設定頁面"""
        def create_page(parent):
            config_frame = ttk.LabelFrame(parent, text="域名配置", padding=15)
            config_frame.pack(fill=tk.X, pady=10, padx=10)
            
            ttk.Label(config_frame, text="公網 IP/域名:", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=5)
            domain_entry = ttk.Entry(config_frame, width=40)
            domain_entry.pack(fill=tk.X, pady=5)
            domain_entry.insert(0, self.domain_name or self.public_ip)
            
            def save_domain():
                value = domain_entry.get().strip()
                if value:
                    if self.is_valid_ip(value) or self.is_valid_domain(value):
                        self.domain_name = value if not self.is_valid_ip(value) else ''
                        self.public_ip = value if self.is_valid_ip(value) else self.public_ip
                        self.save_domain_config_new()
                        self.show_toast("域名配置已保存", "success")
                    else:
                        self.show_toast("無效的 IP 或域名", "error")
            
            ttk.Button(config_frame, text="💾 保存", command=save_domain).pack(pady=10)
        
        self.get_or_create_tab("域名設定", create_page)
    
    def show_file_config(self):
        """顯示檔案配置頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            info_text.insert(tk.END, "配置文件管理\n")
            info_text.insert(tk.END, "=" * 50 + "\n\n")
            info_text.insert(tk.END, f"配置文件: {self.config_file}\n")
            info_text.insert(tk.END, f"應用文件: {self.app_file}\n")
            info_text.insert(tk.END, f"日誌文件: {self.backend_log}\n")
            info_text.config(state=tk.DISABLED)
        
        self.get_or_create_tab("檔案配置", create_page)
    
    def show_backup_management(self):
        """顯示備份管理頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            info_text.insert(tk.END, "備份管理\n")
            info_text.insert(tk.END, "=" * 50 + "\n\n")
            info_text.insert(tk.END, "備份功能待實現\n")
            info_text.config(state=tk.DISABLED)
        
        self.get_or_create_tab("備份管理", create_page)
    
    def show_ai_status(self):
        """顯示 AI 模型狀態頁面"""
        def create_page(parent):
            status_frame = ttk.LabelFrame(parent, text="AI 模型狀態", padding=15)
            status_frame.pack(fill=tk.BOTH, expand=True, pady=10, padx=10)
            
            status_text = scrolledtext.ScrolledText(status_frame, wrap=tk.WORD, font=('Consolas', 10), height=15)
            status_text.pack(fill=tk.BOTH, expand=True)
            
            def update_status():
                status_text.delete(1.0, tk.END)
                status_text.insert(tk.END, "AI 模型狀態\n")
                status_text.insert(tk.END, "=" * 50 + "\n\n")
                status_text.insert(tk.END, "智譜AI: 檢查中...\n")
                status_text.insert(tk.END, "SiliconFlow: 檢查中...\n")
                parent.after(5000, update_status)
            update_status()
        
        self.get_or_create_tab("AI 模型狀態", create_page)
    
    def show_ai_test(self):
        """顯示 AI 連接測試頁面"""
        def create_page(parent):
            test_frame = ttk.LabelFrame(parent, text="AI 連接測試", padding=15)
            test_frame.pack(fill=tk.BOTH, expand=True, pady=10, padx=10)
            
            ttk.Label(test_frame, text="選擇模型:", font=('Arial', 10)).pack(anchor=tk.W, pady=5)
            model_var = tk.StringVar(value="glm-4-flash-250414")
            model_combo = ttk.Combobox(test_frame, textvariable=model_var, 
                                     values=["glm-4-flash-250414", "deepseek-ai/DeepSeek-V3.2"],
                                     state="readonly", width=30)
            model_combo.pack(anchor=tk.W, pady=5)
            
            def test_model():
                self.show_toast(f"測試模型: {model_var.get()}", "info")
            
            ttk.Button(test_frame, text="測試連接", command=test_model).pack(pady=10)
        
        self.get_or_create_tab("AI 連接測試", create_page)
    
    def show_ai_stats(self):
        """顯示 AI 使用統計頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            info_text.insert(tk.END, "AI 使用統計\n")
            info_text.insert(tk.END, "=" * 50 + "\n\n")
            info_text.insert(tk.END, "統計功能待實現\n")
            info_text.config(state=tk.DISABLED)
        
        self.get_or_create_tab("AI 使用統計", create_page)
    
    def show_html_files(self):
        """顯示 HTML 文件頁面"""
        def create_page(parent):
            # 工具欄
            toolbar = ttk.Frame(parent)
            toolbar.pack(fill=tk.X, pady=5, padx=10)
            
            ttk.Button(toolbar, text="刷新列表", command=lambda: self.refresh_html_list_new(parent)).pack(side=tk.LEFT, padx=2)
            
            # 文件列表
            list_frame = ttk.LabelFrame(parent, text="HTML 文件", padding=10)
            list_frame.pack(fill=tk.BOTH, expand=True, pady=5, padx=10)
            
            html_tree = ttk.Treeview(list_frame, columns=("path", "size"), show="tree headings", height=15)
            html_tree.heading("#0", text="文件名")
            html_tree.heading("path", text="路徑")
            html_tree.heading("size", text="大小")
            
            scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=html_tree.yview)
            html_tree.configure(yscrollcommand=scrollbar.set)
            
            html_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
            scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
            
            parent._html_tree = html_tree
            self.refresh_html_list_new(parent)
        
        self.get_or_create_tab("HTML 文件", create_page)
    
    def show_config_files(self):
        """顯示配置文件頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            info_text.insert(tk.END, "配置文件列表\n")
            info_text.insert(tk.END, "=" * 50 + "\n\n")
            config_files = ['config.py', 'app.py', 'database.py']
            for f in config_files:
                info_text.insert(tk.END, f"- {f}\n")
            info_text.config(state=tk.DISABLED)
        
        self.get_or_create_tab("配置文件", create_page)
    
    def show_log_files(self):
        """顯示日誌文件頁面"""
        def create_page(parent):
            info_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, font=('Consolas', 10), height=20)
            info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            info_text.insert(tk.END, "日誌文件\n")
            info_text.insert(tk.END, "=" * 50 + "\n\n")
            info_text.insert(tk.END, f"後端日誌: {self.backend_log}\n")
            info_text.config(state=tk.DISABLED)
        
        self.get_or_create_tab("日誌文件", create_page)
    
    # ========== 輔助方法 ==========
    
    def restart_service(self):
        """重啟服務"""
        if self.service_running:
            self.stop_service()
            time.sleep(2)
        self.start_service()
    
    def is_valid_ip(self, ip):
        """檢查是否為有效的 IP 地址"""
        try:
            socket.inet_aton(ip)
            return True
        except:
            return False
    
    def is_valid_domain(self, domain):
        """檢查是否為有效的域名"""
        try:
            socket.gethostbyname(domain)
            return True
        except:
            return False
    
    def refresh_database_status_new(self, parent):
        """刷新資料庫狀態（新版本）"""
        try:
            db_path = self.work_dir / "database.db"
            if hasattr(parent, '_db_info_text'):
                text_widget = parent._db_info_text
            else:
                # 查找資料庫信息文本區域
                for widget in parent.winfo_children():
                    if isinstance(widget, ttk.LabelFrame) and widget.cget('text') == '資料庫信息':
                        for child in widget.winfo_children():
                            if isinstance(child, scrolledtext.ScrolledText):
                                text_widget = child
                                parent._db_info_text = text_widget
                                break
                        break
                else:
                    return
            
            text_widget.config(state=tk.NORMAL)
            text_widget.delete(1.0, tk.END)
            
            if db_path.exists():
                size_bytes = db_path.stat().st_size
                size_mb = size_bytes / 1024 / 1024
                text_widget.insert(tk.END, f"路徑: {db_path}\n")
                text_widget.insert(tk.END, f"大小: {size_mb:.2f} MB\n\n")
                
                try:
                    conn = sqlite3.connect(str(db_path))
                    cursor = conn.cursor()
                    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
                    tables = [row[0] for row in cursor.fetchall()]
                    conn.close()
                    text_widget.insert(tk.END, f"資料表: {', '.join(tables) if tables else '無'}\n")
                except Exception as e:
                    text_widget.insert(tk.END, f"讀取資料表失敗: {e}\n")
            else:
                text_widget.insert(tk.END, "資料庫不存在\n")
            
            text_widget.config(state=tk.DISABLED)
        except Exception as e:
            print(f"刷新資料庫狀態失敗: {e}")
    
    def refresh_user_list_new(self, parent):
        """刷新用戶列表（新版本）"""
        try:
            if not hasattr(parent, '_user_tree'):
                return
            
            tree = parent._user_tree
            # 清空現有項目
            for item in tree.get_children():
                tree.delete(item)
            
            db_path = self.work_dir / "database.db"
            if not db_path.exists():
                return
            
            conn = sqlite3.connect(str(db_path))
            cursor = conn.cursor()
            cursor.execute("SELECT id, username, email, created_at, is_active FROM users ORDER BY id")
            
            for row in cursor.fetchall():
                user_id, username, email, created_at, is_active = row
                status = "啟用" if is_active else "停用"
                tree.insert("", tk.END, values=(user_id, username or "-", email or "-", created_at or "-", status))
            
            conn.close()
        except Exception as e:
            print(f"刷新用戶列表失敗: {e}")
    
    def refresh_user_progress_new(self, parent):
        """刷新用戶學習進度（新版本）"""
        try:
            if not hasattr(parent, '_progress_tree'):
                return
            
            tree = parent._progress_tree
            # 清空現有項目
            for item in tree.get_children():
                tree.delete(item)
            
            db_path = self.work_dir / "database.db"
            if not db_path.exists():
                return
            
            conn = sqlite3.connect(str(db_path))
            cursor = conn.cursor()
            
            # 獲取用戶進度
            cursor.execute('''
                SELECT u.id, u.username, up.completed_exercises, up.total_score, up.study_time, up.level
                FROM users u
                LEFT JOIN user_progress up ON u.id = up.user_id
                ORDER BY up.total_score DESC, u.id ASC
            ''')
            
            for row in cursor.fetchall():
                user_id, username, completed_exercises, total_score, study_time, level = row
                completed_count = 0
                if completed_exercises:
                    try:
                        completed_list = json.loads(completed_exercises)
                        completed_count = len(completed_list) if isinstance(completed_list, list) else 0
                    except:
                        pass
                
                tree.insert("", tk.END, values=(
                    user_id, username or "-", completed_count, total_score or 0, study_time or 0, level or 1
                ))
            
            conn.close()
        except Exception as e:
            print(f"刷新學習進度失敗: {e}")
    
    def refresh_html_list_new(self, parent):
        """刷新 HTML 文件列表（新版本）"""
        try:
            if not hasattr(parent, '_html_tree'):
                return
            
            tree = parent._html_tree
            # 清空現有項目
            for item in tree.get_children():
                tree.delete(item)
            
            # 查找所有 HTML 文件
            for html_file in self.work_dir.glob("*.html"):
                size = html_file.stat().st_size
                size_str = f"{size / 1024:.1f} KB" if size < 1024 * 1024 else f"{size / 1024 / 1024:.1f} MB"
                mtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(html_file.stat().st_mtime))
                tree.insert("", tk.END, text=html_file.name, values=(str(html_file), size_str, mtime))
        except Exception as e:
            print(f"刷新 HTML 列表失敗: {e}")
    
    def backup_database(self):
        """備份資料庫"""
        try:
            db_path = self.work_dir / "database.db"
            if not db_path.exists():
                self.show_toast("資料庫不存在", "error")
                return
            
            backup_dir = self.work_dir / "backups"
            backup_dir.mkdir(exist_ok=True)
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            backup_path = backup_dir / f"database_{timestamp}.db"
            
            shutil.copy2(db_path, backup_path)
            self.show_toast(f"資料庫已備份: {backup_path.name}", "success")
        except Exception as e:
            self.show_toast(f"備份失敗: {str(e)}", "error")
    
    def open_database_folder(self):
        """打開資料庫位置"""
        try:
            db_dir = str(self.work_dir)
            if sys.platform.startswith("linux"):
                subprocess.Popen(["xdg-open", db_dir])
            elif sys.platform == "darwin":
                subprocess.Popen(["open", db_dir])
            elif sys.platform.startswith("win"):
                os.startfile(db_dir)
        except Exception as e:
            self.show_toast(f"無法打開目錄: {str(e)}", "error")
    
    def save_domain_config_new(self):
        """保存域名配置（新版本）"""
        try:
            config = {
                'public_ip': self.public_ip,
                'domain_name': self.domain_name,
                'display_value': self.domain_name or self.public_ip,
                'last_updated': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            with open(self.domain_config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"保存域名配置失敗: {e}")
    
    def save_npm_address(self):
        """保存 NPM 地址"""
        try:
            npm_config_file = self.work_dir / "npm_config.json"
            config = {
                'npm_address': self.npm_address,
                'last_updated': time.strftime("%Y-%m-%d %H:%M:%S")
            }
            with open(npm_config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"保存 NPM 地址失敗: {e}")
    
    def open_npm_manager(self):
        """打開 NPM 管理界面"""
        try:
            npm_url = f"http://{self.npm_address}"
            webbrowser.open(npm_url)
            self.log_message(f"已打開 NPM 管理界面: {npm_url}", "info")
        except Exception as e:
            self.show_toast(f"無法打開 NPM: {str(e)}", "error")
    
    def start_npm_container(self):
        """啟動 NPM 容器"""
        try:
            check_result = self.run_sudo_command(
                ['docker', 'ps', '-a', '--filter', 'name=npm', '--format', '{{.Names}}'],
                timeout=3,
                show_password_dialog=False
            )
            
            if check_result.returncode == 0 and 'npm' in check_result.stdout:
                result = self.run_sudo_command(
                    ['docker', 'start', 'npm'],
                    timeout=10,
                    show_password_dialog=True
                )
                if result.returncode == 0:
                    self.show_toast("NPM 容器已啟動", "success")
                    self.check_npm_status()
                else:
                    self.show_toast("啟動 NPM 容器失敗", "error")
            else:
                self.create_npm_container()
        except Exception as e:
            self.show_toast(f"啟動失敗: {str(e)}", "error")
    
    def stop_npm_container(self):
        """停止 NPM 容器"""
        try:
            result = self.run_sudo_command(
                ['docker', 'stop', 'npm'],
                timeout=10,
                show_password_dialog=True
            )
            if result.returncode == 0:
                self.show_toast("NPM 容器已停止", "success")
                self.check_npm_status()
            else:
                self.show_toast("停止 NPM 容器失敗", "error")
        except Exception as e:
            self.show_toast(f"停止失敗: {str(e)}", "error")
    
    def restart_npm_container(self):
        """重啟 NPM 容器"""
        try:
            result = self.run_sudo_command(
                ['docker', 'restart', 'npm'],
                timeout=15,
                show_password_dialog=True
            )
            if result.returncode == 0:
                self.show_toast("NPM 容器已重啟", "success")
                self.check_npm_status()
            else:
                self.show_toast("重啟 NPM 容器失敗", "error")
        except Exception as e:
            self.show_toast(f"重啟失敗: {str(e)}", "error")
    
    def create_npm_container(self):
        """創建 NPM 容器"""
        try:
            docker_cmd = [
                'docker', 'run', '-d',
                '--name=npm',
                '--restart=unless-stopped',
                '--network=host',
                '-v', '/home/yivh/nginx-proxy-manager/data:/data',
                '-v', '/home/yivh/nginx-proxy-manager/letsencrypt:/etc/letsencrypt',
                'jc21/nginx-proxy-manager:latest'
            ]
            
            result = self.run_sudo_command(
                docker_cmd,
                timeout=30,
                show_password_dialog=True
            )
            
            if result.returncode == 0:
                self.show_toast("NPM 容器已創建並啟動", "success")
                self.check_npm_status()
            else:
                self.show_toast("創建 NPM 容器失敗", "error")
        except Exception as e:
            self.show_toast(f"創建失敗: {str(e)}", "error")
    
    def check_npm_status(self):
        """檢查 NPM 容器狀態"""
        try:
            result = self.run_sudo_command(
                ['docker', 'ps', '-a', '--filter', 'name=npm', '--format', '{{.Status}}'],
                timeout=3,
                show_password_dialog=False
            )
            
            if hasattr(self, 'npm_status_label'):
                if result.returncode == 0 and result.stdout.strip():
                    status = result.stdout.strip()
                    if 'Up' in status:
                        self.npm_status_label.config(text="運行中", foreground=COLORS['success'])
                    elif 'Exited' in status:
                        self.npm_status_label.config(text="已停止", foreground=COLORS['danger'])
                    else:
                        self.npm_status_label.config(text=status[:20], foreground=COLORS['warning'])
                else:
                    self.npm_status_label.config(text="未創建", foreground="gray")
        except:
            if hasattr(self, 'npm_status_label'):
                self.npm_status_label.config(text="檢查失敗", foreground=COLORS['danger'])
    
    def clear_log(self):
        """清空日誌"""
        self.log_text.delete(1.0, tk.END)
    
    def refresh_log(self):
        """刷新日誌"""
        self.log_message("刷新日誌", "info")
    
    def show_log_filter(self):
        """顯示日誌過濾面板"""
        try:
            if hasattr(self, 'log_filter_visible') and self.log_filter_visible:
                self.log_filter_frame.pack_forget()
                self.log_filter_visible = False
            else:
                # 簡單地顯示過濾面板
                self.log_filter_frame.pack(fill=tk.X, pady=5)
                self.log_filter_visible = True
        except Exception as e:
            # 如果出錯，至少記錄錯誤
            try:
                self.log_message(f"顯示過濾面板失敗: {e}", "error")
            except:
                print(f"顯示過濾面板失敗: {e}")
    
    def filter_log(self, event=None):
        """過濾日誌"""
        query = self.log_search_entry.get()
        # TODO: 實現日誌過濾
        pass
    
    def export_log(self):
        """匯出日誌"""
        filename = filedialog.asksaveasfilename(
            defaultextension='.txt',
            filetypes=[('Text files', '*.txt'), ('All files', '*.*')]
        )
        if filename:
            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(self.log_text.get(1.0, tk.END))
                messagebox.showinfo("成功", "日誌已匯出")
            except Exception as e:
                messagebox.showerror("錯誤", f"匯出失敗: {e}")
    
    def on_log_mousewheel(self, event):
        """日誌滾輪事件"""
        if event.delta:
            self.log_text.yview_scroll(int(-1 * (event.delta / 120)), "units")
        elif event.num == 4:
            self.log_text.yview_scroll(-1, "units")
        elif event.num == 5:
            self.log_text.yview_scroll(1, "units")
    
    def log_message(self, message, msg_type="log"):
        """添加日誌消息"""
        timestamp = time.strftime("%H:%M:%S")
        
        # 根據類型設置顏色標籤
        tags = {
            "info": ("info", "#4ec9b0"),
            "success": ("success", "#4ec9b0"),
            "error": ("error", "#f48771"),
            "warning": ("warning", "#dcdcaa"),
            "log": ("log", "#d4d4d4")
        }
        
        tag, color = tags.get(msg_type, ("log", "#d4d4d4"))
        
        self.log_text.config(state=tk.NORMAL)
        
        # 插入消息
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n", tag)
        
        # 配置標籤顏色
        if tag not in self.log_text.tag_names():
            self.log_text.tag_configure(tag, foreground=color)
        
        # 自動滾動
        if self.auto_scroll_var.get():
            self.log_text.see(tk.END)
        
        self.log_text.config(state=tk.DISABLED)
    
    def delayed_init(self):
        """延遲初始化（在界面創建後執行）"""
        try:
            # 加載配置
            self.load_domain_config()
            self.load_npm_config()
            
            # 設置圖標
            if hasattr(self, 'icon_path') and self.icon_path and os.path.exists(self.icon_path):
                try:
                    icon_image = tk.PhotoImage(file=self.icon_path)
                    self.root.iconphoto(False, icon_image)
                    self._icon_image = icon_image
                except Exception as e:
                    print(f"設置圖標失敗: {e}")
            
            # 啟動狀態監控
            self.start_monitoring()
        except Exception as e:
            print(f"延遲初始化失敗: {e}")
            import traceback
            traceback.print_exc()
    
    def start_monitoring(self):
        """啟動狀態監控"""
        self.stop_monitoring = False
        self.monitor_thread = threading.Thread(target=self.monitor_loop, daemon=True)
        self.monitor_thread.start()
        
        # 啟動系統資源監控更新
        self.schedule_system_monitor_update()
    
    def monitor_loop(self):
        """監控循環"""
        while not self.stop_monitoring:
            try:
                self.check_service_status()
                time.sleep(2)
            except:
                pass
    
    def check_service_status(self):
        """檢查服務狀態"""
        try:
            # 檢查進程是否存在
            if self.process:
                poll_result = self.process.poll()
                if poll_result is not None:
                    # 進程已結束
                    self.service_running = False
                    self.service_pid = None
                    self.process = None
                    self.root.after(0, self.update_status)
                    return
            
            # 檢查端口是否被占用
            port_in_use = self.is_port_in_use(self.port)
            
            if port_in_use and not self.service_running:
                # 端口被占用但我們沒有記錄進程，嘗試查找
                pid = self.find_process_on_port(self.port)
                if pid:
                    self.service_pid = pid
                    self.service_running = True
                    self.root.after(0, self.update_status)
            elif not port_in_use and self.service_running:
                # 端口未被占用但我們認為服務在運行
                self.service_running = False
                self.service_pid = None
                self.root.after(0, self.update_status)
            else:
                self.root.after(0, self.update_status)
                
        except Exception as e:
            pass
    
    def update_status(self):
        """更新狀態顯示"""
        if self.service_running:
            self.status_label.config(text="運行中", foreground=COLORS['success'])
            self.status_info_label.config(text=f"PID: {self.service_pid or '未知'} | 端口: {self.port}")
            self.update_status_indicator('running')
            self.service_control_btn.config(text="■ 停止服務", state=tk.NORMAL)
        else:
            self.status_label.config(text="已停止", foreground=COLORS['danger'])
            self.status_info_label.config(text=f"PID: - | 端口: {self.port}")
            self.update_status_indicator('stopped')
            self.service_control_btn.config(text="▶ 啟動服務", state=tk.NORMAL)
    
    def start_log_monitor(self):
        """啟動日誌監控"""
        if self.log_thread and self.log_thread.is_alive():
            return
        
        self.log_thread = threading.Thread(target=self.read_logs, daemon=True)
        self.log_thread.start()
    
    def read_logs(self):
        """讀取日誌"""
        if not self.process:
            return
        
        try:
            for line in iter(self.process.stdout.readline, ''):
                if not line:
                    break
                line = line.rstrip()
                if line:
                    self.root.after(0, lambda l=line: self.log_message(l, "log"))
        except:
            pass
    
    # ========== 輔助函數 ==========
    
    def is_port_in_use(self, port):
        """檢查端口是否被占用"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                result = s.connect_ex(('localhost', port))
                return result == 0
        except:
            return False
    
    def find_process_on_port(self, port):
        """查找占用端口的進程 ID"""
        try:
            result = subprocess.run(
                ['ss', '-tlnp'],
                capture_output=True,
                text=True,
                timeout=2
            )
            for line in result.stdout.split('\n'):
                if f':{port}' in line and 'python' in line.lower():
                    # 提取 PID
                    match = re.search(r'pid=(\d+)', line)
                    if match:
                        return int(match.group(1))
        except:
            pass
        return None
    
    def kill_process_on_port(self, port):
        """終止占用端口的進程"""
        try:
            pid = self.find_process_on_port(port)
            if pid:
                subprocess.run(['kill', str(pid)], timeout=3)
        except:
            pass
    
    def get_cpu_usage_percent(self):
        """獲取 CPU 使用率"""
        if PSUTIL_AVAILABLE:
            try:
                return psutil.cpu_percent(interval=0.1)
            except:
                pass
        
        # 簡化版本（使用 loadavg）
        try:
            load1, _, _ = os.getloadavg()
            cpu_count = os.cpu_count() or 1
            percent = min(100.0, max(0.0, (load1 / cpu_count) * 100.0))
            return percent
        except:
            return None
    
    def get_memory_usage(self):
        """獲取記憶體使用情況 (used, total, percent)，單位 bytes"""
        if PSUTIL_AVAILABLE:
            try:
                mem = psutil.virtual_memory()
                return mem.used, mem.total, mem.percent
            except:
                pass
        
        # 簡化版本（讀取 /proc/meminfo）
        try:
            meminfo = {}
            with open("/proc/meminfo", "r") as f:
                for line in f:
                    parts = line.split(":")
                    if len(parts) == 2:
                        key = parts[0].strip()
                        value = parts[1].strip().split()[0]
                        meminfo[key] = int(value) * 1024  # kB -> bytes
            total = meminfo.get("MemTotal", 0)
            available = meminfo.get("MemAvailable", 0)
            used = total - available if total and available else 0
            percent = (used / total * 100.0) if total else 0.0
            return used, total, percent
        except:
            return 0, 0, 0.0
    
    def get_disk_usage(self):
        """獲取磁碟使用情況 (used, total, percent)，單位 bytes"""
        try:
            usage = shutil.disk_usage(str(self.work_dir))
            used = usage.used
            total = usage.total
            percent = (used / total * 100.0) if total else 0.0
            return used, total, percent
        except:
            return 0, 0, 0.0
    
    def schedule_system_monitor_update(self):
        """安排系統資源監控更新"""
        try:
            self.update_system_monitor()
        except Exception as e:
            print(f"更新系統監控失敗: {e}")
        
        # 每2秒更新一次
        if self.system_monitor_running:
            self.root.after(self.system_monitor_interval, self.schedule_system_monitor_update)
    
    def update_system_monitor(self):
        """更新系統資源監控資訊"""
        try:
            # CPU 使用率
            cpu_usage = self.get_cpu_usage_percent()
            if cpu_usage is not None:
                self.cpu_progress['value'] = cpu_usage
                self.cpu_label.config(text=f"{cpu_usage:.1f}%")
            
            # 記憶體
            mem_used, mem_total, mem_percent = self.get_memory_usage()
            if mem_total > 0:
                self.mem_progress['value'] = mem_percent
                self.mem_label.config(text=f"{mem_percent:.1f}%")
            
            # 磁碟
            disk_used, disk_total, disk_percent = self.get_disk_usage()
            self.disk_progress['value'] = disk_percent
            self.disk_label.config(text=f"{disk_percent:.1f}%")
            
            # 服務狀態
            if self.service_running:
                self.backend_status_label.config(
                    text=f"後端: 🟢 運行中 (PID: {self.service_pid or '未知'})",
                    foreground=COLORS['success']
                )
            else:
                self.backend_status_label.config(
                    text="後端: 🔴 已停止",
                    foreground=COLORS['danger']
                )
            
            # 資料庫狀態（簡單檢查）
            try:
                db_path = self.work_dir / "database.db"
                if db_path.exists():
                    self.db_status_label.config(
                        text="資料庫: 🟢 可用",
                        foreground=COLORS['success']
                    )
                else:
                    self.db_status_label.config(
                        text="資料庫: 🟡 未創建",
                        foreground=COLORS['warning']
                    )
            except:
                self.db_status_label.config(
                    text="資料庫: 🔴 檢查失敗",
                    foreground=COLORS['danger']
                )
            
            # 用戶數量（簡單查詢）
            try:
                conn = sqlite3.connect(self.work_dir / "database.db")
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM users")
                user_count = cursor.fetchone()[0]
                conn.close()
                self.user_count_label.config(text=f"用戶: {user_count} 人")
            except:
                self.user_count_label.config(text="用戶: 無法獲取")
                
        except Exception as e:
            print(f"更新系統監控失敗: {e}")
    
    def check_pkexec_available(self):
        """檢查 pkexec 是否可用"""
        try:
            result = subprocess.run(
                ['which', 'pkexec'],
                capture_output=True,
                text=True,
                timeout=2
            )
            return result.returncode == 0
        except:
            return False
    
    def run_sudo_command(self, cmd, timeout=10, show_password_dialog=True):
        """
        執行需要 sudo 權限的命令（使用 pkexec 彈出密碼輸入窗口）
        
        Args:
            cmd: 命令列表（不包含 sudo，例如 ['docker', 'ps', '-a']）
            timeout: 超時時間（秒）
            show_password_dialog: 是否顯示密碼輸入窗口（使用 pkexec）
        
        Returns:
            subprocess.CompletedProcess 對象
        """
        if show_password_dialog:
            # 檢查 pkexec 是否可用
            if not self.check_pkexec_available():
                # 如果 pkexec 不可用，提示用戶
                result = messagebox.askyesno(
                    "需要管理員權限",
                    "此操作需要管理員權限（sudo）。\n\n"
                    "系統未檢測到 pkexec（圖形化密碼輸入工具）。\n\n"
                    "是否繼續？將在終端中提示輸入密碼。\n\n"
                    "提示：安裝 policykit-1 可獲得圖形化密碼輸入：\n"
                    "sudo apt-get install policykit-1"
                )
                if not result:
                    raise Exception("用戶取消操作")
                # 回退到 sudo（會在終端提示）
                full_cmd = ['sudo'] + cmd
            else:
                # 使用 pkexec 彈出圖形化密碼輸入窗口
                full_cmd = ['pkexec'] + cmd
        else:
            # 直接使用 sudo（用於後台檢查，不彈出窗口）
            full_cmd = ['sudo'] + cmd
        
        try:
            result = subprocess.run(
                full_cmd,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            # 檢查是否是用戶取消了密碼輸入（pkexec 返回 126 或 127）
            if show_password_dialog and result.returncode in [126, 127]:
                raise Exception("用戶取消了密碼輸入或權限不足")
            
            return result
        except subprocess.TimeoutExpired:
            raise Exception(f"命令執行超時（{timeout}秒）")
        except FileNotFoundError:
            if show_password_dialog:
                # 如果命令不存在，提示用戶
                raise Exception("未找到必要的命令。請確保已安裝 Docker 和 sudo/pkexec")
            raise Exception("未找到 sudo 或 pkexec 命令")
        except Exception as e:
            # 如果是我們自己拋出的異常，直接傳遞
            if "用戶取消" in str(e) or "超時" in str(e) or "未找到" in str(e):
                raise
            raise Exception(f"執行命令失敗: {str(e)}")
    
    def on_closing(self):
        """窗口關閉事件"""
        if self.service_running:
            if messagebox.askokcancel("退出", "服務正在運行，確定要退出嗎？"):
                self.stop_service()
                self.root.destroy()
        else:
            self.root.destroy()


def main():
    root = tk.Tk()
    app = ServiceManagerNew(root)
    root.mainloop()


if __name__ == '__main__':
    main()

