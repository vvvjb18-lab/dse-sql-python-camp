#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
安全版本 - 移除可能导致段错误的功能，使用更简单的实现
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import subprocess
import threading
import time
import os
import sys
import json
import webbrowser
import socket
import urllib.request
import urllib.error
import sqlite3
import shutil
from pathlib import Path

# 尝试导入 psutil
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

# 颜色常量
COLORS = {
    'primary': '#2c3e50',
    'primary_light': '#3498db',
    'success': '#2ecc71',
    'warning': '#f39c12',
    'danger': '#e74c3c',
    'info': '#3498db',
    'bg_main': '#ffffff',
    'bg_sidebar': '#f8f9fa',
    'text_primary': '#2c3e50',
    'text_secondary': '#7f8c8d',
}

class ServiceManagerSafe:
    """安全版本 - 使用简单的按钮列表替代 Treeview"""
    
    def __init__(self):
        print("初始化服务管理器...")
        
        # 创建根窗口
        self.root = tk.Tk()
        self.root.title("DSE SQL 訓練營 - 服務管理器")
        self.root.geometry("1200x800")
        
        # 工作目录
        self.work_dir = Path(__file__).parent.absolute()
        os.chdir(self.work_dir)
        
        # 服务状态
        self.service_running = False
        self.service_pid = None
        self.process = None
        self.port = 5000
        
        # 配置文件
        self.config_file = self.work_dir / "config.py"
        self.app_file = self.work_dir / "app.py"
        self.backend_log = self.work_dir / "backend.log"
        self.domain_config_file = self.work_dir / "domain_config.json"
        self.npm_config_file = self.work_dir / "npm_config.json"
        
        # 域名配置
        self.public_ip = "59.148.148.76"
        self.domain_name = ""
        
        # NPM 配置
        self.npm_address = "192.168.10.1:81"
        
        # Toast 通知
        self.toast_widgets = []
        
        # 创建界面（使用简单布局）
        try:
            self.create_simple_layout()
            print("界面创建成功")
        except Exception as e:
            print(f"界面创建失败: {e}")
            import traceback
            traceback.print_exc()
            messagebox.showerror("错误", f"界面创建失败:\n{str(e)}")
            return
        
        # 窗口关闭事件
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def create_simple_layout(self):
        """创建简单布局（不使用 Treeview）"""
        # 主容器
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 顶部栏
        top_frame = ttk.Frame(main_frame)
        top_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(top_frame, text="DSE SQL 訓練營 - 服務管理器", font=('Arial', 14, 'bold')).pack(side=tk.LEFT, padx=10)
        
        self.service_control_btn = ttk.Button(top_frame, text="▶ 啟動服務", command=self.toggle_service, width=15)
        self.service_control_btn.pack(side=tk.RIGHT, padx=5)
        
        # 主内容区（水平分割）
        content_frame = ttk.Frame(main_frame)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # 左侧：功能按钮列表（不使用 Treeview）
        left_frame = ttk.LabelFrame(content_frame, text="功能菜单", padding=10, width=250)
        left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=5, pady=5)
        left_frame.pack_propagate(False)
        
        # 功能分组（使用按钮列表）
        self.create_function_buttons(left_frame)
        
        # 中央：工作区
        center_frame = ttk.Frame(content_frame)
        center_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 标签式工作区
        self.workspace_notebook = ttk.Notebook(center_frame)
        self.workspace_notebook.pack(fill=tk.BOTH, expand=True)
        
        # 默认日志页面
        self.create_log_tab()
        
        # 右侧：监控面板
        right_frame = ttk.LabelFrame(content_frame, text="系统监控", padding=10, width=300)
        right_frame.pack(side=tk.RIGHT, fill=tk.Y, padx=5, pady=5)
        right_frame.pack_propagate(False)
        
        self.create_monitor_panel(right_frame)
        
        # 底部状态栏
        bottom_frame = ttk.Frame(main_frame)
        bottom_frame.pack(fill=tk.X, side=tk.BOTTOM)
        
        self.status_label = ttk.Label(bottom_frame, text="就绪", font=('Arial', 9))
        self.status_label.pack(side=tk.LEFT, padx=10)
        
        self.time_label = ttk.Label(bottom_frame, text="", font=('Arial', 9))
        self.time_label.pack(side=tk.RIGHT, padx=10)
        self.update_time()
    
    def create_function_buttons(self, parent):
        """创建功能按钮列表（替代 Treeview）"""
        # 功能分组
        groups = {
            '🔧 服务管理': [
                ('服务控制', self.show_service_control),
                ('健康监控', self.show_health_monitor),
                ('访问配置', self.show_access_config),
                ('防火墙设定', self.show_firewall_config),
            ],
            '📦 容器管理': [
                ('NPM 容器', self.show_npm_container),
                ('Docker 状态', self.show_docker_status),
            ],
            '📊 数据管理': [
                ('数据库管理', self.show_database_management),
                ('用户管理', self.show_user_management),
                ('学习进度', self.show_learning_progress),
            ],
            '⚙️ 系统配置': [
                ('API 密钥管理', self.show_api_keys),
                ('域名设定', self.show_domain_config),
                ('文件配置', self.show_file_config),
                ('备份管理', self.show_backup_management),
            ],
            '🤖 AI 服务': [
                ('AI 模型状态', self.show_ai_status),
                ('AI 连接测试', self.show_ai_test),
                ('AI 使用统计', self.show_ai_stats),
            ],
            '📂 文件管理': [
                ('HTML 文件', self.show_html_files),
                ('配置文件', self.show_config_files),
                ('日志文件', self.show_log_files),
            ],
        }
        
        # 为每个分组创建标签和按钮
        for group_name, functions in groups.items():
            # 分组标签
            group_label = ttk.Label(parent, text=group_name, font=('Arial', 10, 'bold'))
            group_label.pack(anchor=tk.W, pady=(10, 5), padx=5)
            
            # 功能按钮
            for func_name, func_handler in functions:
                btn = ttk.Button(
                    parent,
                    text=f"  {func_name}",
                    command=func_handler,
                    width=22
                )
                btn.pack(anchor=tk.W, pady=2, padx=10)
    
    def create_log_tab(self):
        """创建日志标签页"""
        log_frame = ttk.Frame(self.workspace_notebook, padding=5)
        self.workspace_notebook.add(log_frame, text="服务日志")
        
        # 工具栏
        toolbar = ttk.Frame(log_frame)
        toolbar.pack(fill=tk.X, pady=(0, 5))
        
        ttk.Button(toolbar, text="清空", command=self.clear_log).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="刷新", command=self.refresh_log).pack(side=tk.LEFT, padx=2)
        
        # 日志内容
        self.log_text = scrolledtext.ScrolledText(
            log_frame,
            wrap=tk.WORD,
            font=('Consolas', 9),
            bg='#1e1e1e',
            fg='#d4d4d4',
            insertbackground='white'
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        self.log_message("服务管理器已启动", "info")
    
    def create_monitor_panel(self, parent):
        """创建监控面板"""
        # CPU
        cpu_frame = ttk.Frame(parent)
        cpu_frame.pack(fill=tk.X, pady=5)
        ttk.Label(cpu_frame, text="CPU:").pack(side=tk.LEFT)
        self.cpu_progress = ttk.Progressbar(cpu_frame, length=150, mode='determinate')
        self.cpu_progress.pack(side=tk.LEFT, padx=5)
        self.cpu_label = ttk.Label(cpu_frame, text="--%")
        self.cpu_label.pack(side=tk.LEFT)
        
        # 内存
        mem_frame = ttk.Frame(parent)
        mem_frame.pack(fill=tk.X, pady=5)
        ttk.Label(mem_frame, text="内存:").pack(side=tk.LEFT)
        self.mem_progress = ttk.Progressbar(mem_frame, length=150, mode='determinate')
        self.mem_progress.pack(side=tk.LEFT, padx=5)
        self.mem_label = ttk.Label(mem_frame, text="--%")
        self.mem_label.pack(side=tk.LEFT)
        
        # 磁盘
        disk_frame = ttk.Frame(parent)
        disk_frame.pack(fill=tk.X, pady=5)
        ttk.Label(disk_frame, text="磁盘:").pack(side=tk.LEFT)
        self.disk_progress = ttk.Progressbar(disk_frame, length=150, mode='determinate')
        self.disk_progress.pack(side=tk.LEFT, padx=5)
        self.disk_label = ttk.Label(disk_frame, text="--%")
        self.disk_label.pack(side=tk.LEFT)
        
        # 启动监控
        self.start_monitoring()
    
    def get_or_create_tab(self, tab_name, create_func):
        """获取或创建标签页"""
        for i in range(self.workspace_notebook.index("end")):
            if self.workspace_notebook.tab(i, "text") == tab_name:
                self.workspace_notebook.select(i)
                return
        
        frame = ttk.Frame(self.workspace_notebook, padding=10)
        self.workspace_notebook.add(frame, text=tab_name)
        self.workspace_notebook.select(self.workspace_notebook.index("end") - 1)
        create_func(frame)
    
    # ========== 功能页面（简化版） ==========
    
    def show_service_control(self):
        def create_page(parent):
            ttk.Label(parent, text="服务控制", font=('Arial', 12, 'bold')).pack(pady=10)
            ttk.Button(parent, text="启动服务", command=self.start_service).pack(pady=5)
            ttk.Button(parent, text="停止服务", command=self.stop_service).pack(pady=5)
        self.get_or_create_tab("服务控制", create_page)
    
    def show_health_monitor(self):
        def create_page(parent):
            ttk.Label(parent, text="健康监控", font=('Arial', 12, 'bold')).pack(pady=10)
            ttk.Button(parent, text="健康检查", command=self.check_health).pack(pady=5)
        self.get_or_create_tab("健康监控", create_page)
    
    def show_access_config(self):
        def create_page(parent):
            ttk.Label(parent, text="访问配置", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("访问配置", create_page)
    
    def show_firewall_config(self):
        def create_page(parent):
            ttk.Label(parent, text="防火墙设定", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("防火墙设定", create_page)
    
    def show_npm_container(self):
        def create_page(parent):
            ttk.Label(parent, text="NPM 容器", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("NPM 容器", create_page)
    
    def show_docker_status(self):
        def create_page(parent):
            ttk.Label(parent, text="Docker 状态", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("Docker 状态", create_page)
    
    def show_database_management(self):
        def create_page(parent):
            ttk.Label(parent, text="数据库管理", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("数据库管理", create_page)
    
    def show_user_management(self):
        def create_page(parent):
            ttk.Label(parent, text="用户管理", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("用户管理", create_page)
    
    def show_learning_progress(self):
        def create_page(parent):
            ttk.Label(parent, text="学习进度", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("学习进度", create_page)
    
    def show_api_keys(self):
        def create_page(parent):
            ttk.Label(parent, text="API 密钥管理", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("API 密钥管理", create_page)
    
    def show_domain_config(self):
        def create_page(parent):
            ttk.Label(parent, text="域名设定", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("域名设定", create_page)
    
    def show_file_config(self):
        def create_page(parent):
            ttk.Label(parent, text="文件配置", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("文件配置", create_page)
    
    def show_backup_management(self):
        def create_page(parent):
            ttk.Label(parent, text="备份管理", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("备份管理", create_page)
    
    def show_ai_status(self):
        def create_page(parent):
            ttk.Label(parent, text="AI 模型状态", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("AI 模型状态", create_page)
    
    def show_ai_test(self):
        def create_page(parent):
            ttk.Label(parent, text="AI 连接测试", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("AI 连接测试", create_page)
    
    def show_ai_stats(self):
        def create_page(parent):
            ttk.Label(parent, text="AI 使用统计", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("AI 使用统计", create_page)
    
    def show_html_files(self):
        def create_page(parent):
            ttk.Label(parent, text="HTML 文件", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("HTML 文件", create_page)
    
    def show_config_files(self):
        def create_page(parent):
            ttk.Label(parent, text="配置文件", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("配置文件", create_page)
    
    def show_log_files(self):
        def create_page(parent):
            ttk.Label(parent, text="日志文件", font=('Arial', 12, 'bold')).pack(pady=10)
        self.get_or_create_tab("日志文件", create_page)
    
    # ========== 服务控制 ==========
    
    def toggle_service(self):
        if self.service_running:
            self.stop_service()
        else:
            self.start_service()
    
    def start_service(self):
        if self.service_running:
            messagebox.showinfo("提示", "服务已在运行")
            return
        
        try:
            self.log_message("正在启动服务...", "info")
            self.process = subprocess.Popen(
                [sys.executable, str(self.app_file)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=str(self.work_dir)
            )
            self.service_running = True
            self.service_pid = self.process.pid
            self.service_control_btn.config(text="■ 停止服務")
            self.log_message(f"服务已启动 (PID: {self.service_pid})", "success")
        except Exception as e:
            self.log_message(f"启动服务失败: {str(e)}", "error")
            messagebox.showerror("错误", f"启动服务失败:\n{str(e)}")
    
    def stop_service(self):
        if not self.service_running:
            return
        
        try:
            self.log_message("正在停止服务...", "info")
            if self.process:
                self.process.terminate()
                self.process.wait(timeout=5)
            self.service_running = False
            self.service_pid = None
            self.service_control_btn.config(text="▶ 啟動服務")
            self.log_message("服务已停止", "success")
        except Exception as e:
            self.log_message(f"停止服务失败: {str(e)}", "error")
    
    def check_health(self):
        try:
            url = f"http://localhost:{self.port}/health"
            with urllib.request.urlopen(url, timeout=3) as response:
                data = json.loads(response.read().decode())
                messagebox.showinfo("健康检查", f"服务状态: 正常\n\n{json.dumps(data, indent=2, ensure_ascii=False)}")
        except Exception as e:
            messagebox.showerror("健康检查", f"无法连接到服务:\n{str(e)}")
    
    # ========== 日志功能 ==========
    
    def log_message(self, message, level='info'):
        """记录日志"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        colors = {
            'info': '#4ec9b0',
            'success': '#4ec9b0',
            'error': '#f48771',
            'warning': '#dcdcaa',
            'log': '#cccccc'
        }
        color = colors.get(level, '#cccccc')
        
        if hasattr(self, 'log_text'):
            self.log_text.insert(tk.END, f"[{timestamp}] {message}\n", level)
            self.log_text.tag_config(level, foreground=color)
            self.log_text.see(tk.END)
    
    def clear_log(self):
        if hasattr(self, 'log_text'):
            self.log_text.delete(1.0, tk.END)
    
    def refresh_log(self):
        self.log_message("日志已刷新", "info")
    
    # ========== 监控功能 ==========
    
    def start_monitoring(self):
        """启动系统监控"""
        def monitor_loop():
            while True:
                try:
                    self.update_monitoring()
                    time.sleep(2)
                except:
                    pass
        
        thread = threading.Thread(target=monitor_loop, daemon=True)
        thread.start()
    
    def update_monitoring(self):
        """更新监控数据"""
        try:
            if PSUTIL_AVAILABLE:
                cpu_percent = psutil.cpu_percent(interval=0.1)
                mem = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                
                self.cpu_progress['value'] = cpu_percent
                self.cpu_label.config(text=f"{cpu_percent:.1f}%")
                
                self.mem_progress['value'] = mem.percent
                self.mem_label.config(text=f"{mem.percent:.1f}%")
                
                self.disk_progress['value'] = disk.percent
                self.disk_label.config(text=f"{disk.percent:.1f}%")
        except:
            pass
    
    def update_time(self):
        """更新时间显示"""
        current_time = time.strftime("%Y-%m-%d %H:%M:%S")
        if hasattr(self, 'time_label'):
            self.time_label.config(text=current_time)
        self.root.after(1000, self.update_time)
    
    def on_closing(self):
        """窗口关闭事件"""
        if self.service_running:
            if messagebox.askokcancel("退出", "服务正在运行，确定要退出吗？"):
                self.stop_service()
                self.root.destroy()
        else:
            self.root.destroy()

if __name__ == "__main__":
    try:
        app = ServiceManagerSafe()
        app.root.mainloop()
    except Exception as e:
        print(f"程序错误: {e}")
        import traceback
        traceback.print_exc()
        messagebox.showerror("错误", f"程序错误:\n{str(e)}")

