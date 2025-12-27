#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
數據庫初始化腳本
運行此腳本以創建數據庫和表結構
"""

from database import Database
import os

def main():
    print("=" * 50)
    print("  DSE SQL 訓練營 - 數據庫初始化")
    print("=" * 50)
    print()
    
    # 檢查數據庫文件是否已存在
    db_path = 'database.db'
    if os.path.exists(db_path):
        response = input(f"數據庫文件 {db_path} 已存在，是否要重新初始化？(y/N): ")
        if response.lower() != 'y':
            print("取消初始化")
            return
        # 備份舊數據庫
        backup_path = f"{db_path}.backup"
        if os.path.exists(backup_path):
            os.remove(backup_path)
        os.rename(db_path, backup_path)
        print(f"已備份舊數據庫到 {backup_path}")
    
    # 初始化數據庫
    print("正在初始化數據庫...")
    db = Database(db_path)
    
    print()
    print("=" * 50)
    print("  ✓ 數據庫初始化完成！")
    print("=" * 50)
    print()
    print("數據庫文件位置:", os.path.abspath(db_path))
    print()
    print("已創建的表:")
    print("  - users (用戶表)")
    print("  - user_profiles (用戶資料表)")
    print("  - user_progress (用戶學習進度表)")
    print("  - user_sessions (用戶會話表)")
    print()
    print("現在可以啟動後端服務了！")
    print()

if __name__ == '__main__':
    main()

