#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
數據庫管理模組
處理 SQLite 數據庫連接和操作
"""

import sqlite3
import hashlib
import json
import os
from datetime import datetime
from pathlib import Path

class Database:
    def __init__(self, db_path='database.db'):
        """初始化數據庫連接"""
        self.db_path = db_path
        self.conn = None
        self.init_database()
    
    def get_connection(self):
        """獲取數據庫連接"""
        if self.conn is None:
            self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row  # 使查詢結果可以通過列名訪問
        return self.conn
    
    def close(self):
        """關閉數據庫連接"""
        if self.conn:
            self.conn.close()
            self.conn = None
    
    def init_database(self):
        """初始化數據庫，創建表結構"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # 創建用戶表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        ''')
        
        # 創建用戶資料表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                full_name TEXT,
                avatar_url TEXT,
                bio TEXT,
                phone TEXT,
                birth_date DATE,
                gender TEXT,
                location TEXT,
                preferences TEXT,  -- JSON格式存儲用戶偏好設置
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        
        # 創建用戶學習進度表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                completed_exercises TEXT,  -- JSON格式存儲完成的練習ID列表
                scores TEXT,  -- JSON格式存儲各類型練習的分數
                study_time INTEGER DEFAULT 0,  -- 學習時長（分鐘）
                achievements TEXT,  -- JSON格式存儲成就列表
                level INTEGER DEFAULT 1,
                total_score INTEGER DEFAULT 0,
                join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_study_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        
        # 創建用戶會話表（用於管理登錄狀態）
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        
        # 創建索引以提高查詢性能
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)')
        
        conn.commit()
        print("✓ 數據庫初始化完成")
    
    @staticmethod
    def hash_password(password):
        """對密碼進行哈希處理"""
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    
    def register_user(self, username, email, password):
        """註冊新用戶"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            password_hash = self.hash_password(password)
            cursor.execute('''
                INSERT INTO users (username, email, password_hash)
                VALUES (?, ?, ?)
            ''', (username, email, password_hash))
            
            user_id = cursor.lastrowid
            
            # 創建默認用戶資料
            cursor.execute('''
                INSERT INTO user_profiles (user_id)
                VALUES (?)
            ''', (user_id,))
            
            # 創建默認學習進度記錄
            cursor.execute('''
                INSERT INTO user_progress (user_id, completed_exercises, scores)
                VALUES (?, ?, ?)
            ''', (user_id, json.dumps([]), json.dumps({
                'fill-blank': [],
                'card-arrangement': [],
                'drag-drop': [],
                'sql-practice': []
            })))
            
            conn.commit()
            return {'success': True, 'user_id': user_id, 'username': username}
        except sqlite3.IntegrityError as e:
            if 'username' in str(e):
                return {'success': False, 'error': '用戶名已存在'}
            elif 'email' in str(e):
                return {'success': False, 'error': '電子郵件已被註冊'}
            return {'success': False, 'error': '註冊失敗：數據庫錯誤'}
        except Exception as e:
            return {'success': False, 'error': f'註冊失敗：{str(e)}'}
    
    def login_user(self, username_or_email, password):
        """用戶登錄"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        password_hash = self.hash_password(password)
        
        # 支持用戶名或郵箱登錄
        cursor.execute('''
            SELECT id, username, email, is_active
            FROM users
            WHERE (username = ? OR email = ?) AND password_hash = ? AND is_active = 1
        ''', (username_or_email, username_or_email, password_hash))
        
        user = cursor.fetchone()
        
        if user:
            # 更新最後登錄時間
            cursor.execute('''
                UPDATE users
                SET last_login = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (user['id'],))
            conn.commit()
            
            return {
                'success': True,
                'user_id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        else:
            return {'success': False, 'error': '用戶名或密碼錯誤'}
    
    def get_user_profile(self, user_id):
        """獲取用戶資料"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.id, u.username, u.email, u.created_at, u.last_login,
                   p.full_name, p.avatar_url, p.bio, p.phone, p.birth_date,
                   p.gender, p.location, p.preferences
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE u.id = ?
        ''', (user_id,))
        
        row = cursor.fetchone()
        if row:
            profile = dict(row)
            if profile.get('preferences'):
                try:
                    profile['preferences'] = json.loads(profile['preferences'])
                except:
                    profile['preferences'] = {}
            return {'success': True, 'profile': profile}
        return {'success': False, 'error': '用戶不存在'}
    
    def update_user_profile(self, user_id, **kwargs):
        """更新用戶資料"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # 允許更新的字段
        allowed_fields = ['full_name', 'avatar_url', 'bio', 'phone', 'birth_date', 'gender', 'location', 'preferences']
        
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in kwargs:
                if field == 'preferences' and isinstance(kwargs[field], dict):
                    updates.append(f"{field} = ?")
                    values.append(json.dumps(kwargs[field]))
                else:
                    updates.append(f"{field} = ?")
                    values.append(kwargs[field])
        
        if not updates:
            return {'success': False, 'error': '沒有要更新的字段'}
        
        updates.append("updated_at = CURRENT_TIMESTAMP")
        values.append(user_id)
        
        try:
            cursor.execute(f'''
                UPDATE user_profiles
                SET {', '.join(updates)}
                WHERE user_id = ?
            ''', values)
            
            conn.commit()
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': f'更新失敗：{str(e)}'}
    
    def get_user_progress(self, user_id):
        """獲取用戶學習進度"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM user_progress
            WHERE user_id = ?
        ''', (user_id,))
        
        row = cursor.fetchone()
        if row:
            progress = dict(row)
            # 解析JSON字段
            if progress.get('completed_exercises'):
                try:
                    progress['completed_exercises'] = json.loads(progress['completed_exercises'])
                except:
                    progress['completed_exercises'] = []
            else:
                progress['completed_exercises'] = []
            
            if progress.get('scores'):
                try:
                    progress['scores'] = json.loads(progress['scores'])
                except:
                    progress['scores'] = {
                        'fill-blank': [],
                        'card-arrangement': [],
                        'drag-drop': [],
                        'sql-practice': []
                    }
            else:
                progress['scores'] = {
                    'fill-blank': [],
                    'card-arrangement': [],
                    'drag-drop': [],
                    'sql-practice': []
                }
            
            if progress.get('achievements'):
                try:
                    progress['achievements'] = json.loads(progress['achievements'])
                except:
                    progress['achievements'] = []
            else:
                progress['achievements'] = []
            
            return {'success': True, 'progress': progress}
        return {'success': False, 'error': '學習進度不存在'}
    
    def update_user_progress(self, user_id, **kwargs):
        """更新用戶學習進度"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        allowed_fields = ['completed_exercises', 'scores', 'study_time', 'achievements', 'level', 'total_score']
        
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in kwargs:
                if field in ['completed_exercises', 'scores', 'achievements']:
                    updates.append(f"{field} = ?")
                    values.append(json.dumps(kwargs[field]))
                else:
                    updates.append(f"{field} = ?")
                    values.append(kwargs[field])
        
        if not updates:
            return {'success': False, 'error': '沒有要更新的字段'}
        
        updates.append("last_study_date = CURRENT_TIMESTAMP")
        updates.append("updated_at = CURRENT_TIMESTAMP")
        values.append(user_id)
        
        try:
            cursor.execute(f'''
                UPDATE user_progress
                SET {', '.join(updates)}
                WHERE user_id = ?
            ''', values)
            
            conn.commit()
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': f'更新失敗：{str(e)}'}
    
    def create_session(self, user_id, session_token, expires_at, ip_address=None, user_agent=None):
        """創建用戶會話"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, session_token, expires_at, ip_address, user_agent))
            conn.commit()
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': f'創建會話失敗：{str(e)}'}
    
    def get_session(self, session_token):
        """獲取會話信息"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT s.*, u.username, u.email
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.session_token = ? AND s.expires_at > CURRENT_TIMESTAMP
        ''', (session_token,))
        
        row = cursor.fetchone()
        if row:
            return {'success': True, 'session': dict(row)}
        return {'success': False, 'error': '會話無效或已過期'}
    
    def delete_session(self, session_token):
        """刪除會話"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM user_sessions WHERE session_token = ?', (session_token,))
        conn.commit()
        return {'success': True}
    
    def check_username_exists(self, username):
        """檢查用戶名是否存在"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
        return cursor.fetchone() is not None
    
    def check_email_exists(self, email):
        """檢查郵箱是否存在"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        return cursor.fetchone() is not None

