# 🚀 DSE SQL 訓練營 - 啟動指南

## ✅ 快速啟動（推薦）

### 方式一：簡單啟動（僅前端，無AI功能）

**雙擊運行：`啟動简单版.bat`**

或者手動運行：
```bash
python -m http.server 8000
```

然後在瀏覽器中打開：**http://localhost:8000/index.html**

### 方式二：完整功能（包含AI）

**雙擊運行：`啟動完整版.bat`**

或者手動運行：
```bash
# 終端1：啟動後端（AI功能）
python app.py

# 終端2：啟動前端
python -m http.server 8000
```

## 📋 功能說明

### ✅ 基礎功能（無需後端）
- 用戶註冊/登錄
- SQL練習題目
- 互動練習（填空、卡片、拖放）
- 完整學習路徑
- 學習進度追蹤

### 🤖 AI功能（需要後端）
- AI學習分析（學習進度頁面）
- AI檢錯教官（整句輸入練習）
- AI智能問答

## 🔧 配置AI功能（可選）

系統支持3種AI模型供您選擇：

### 1. GLM-4-Flash（智譜AI）- 默認模型
- 快速響應，適合日常問答
- 配置方法：
  1. 打開 `config.py` 文件
  2. 將 `ZHIPU_API_KEY = 'YOUR_API_KEY'` 替換為您的智譜AI API密鑰
  3. 或在 `.env` 文件中設置：`ZHIPU_API_KEY=your_key`

### 2. DeepSeek-V3.2（DeepSeek）
- 強大的推理能力，適合複雜問題
- 配置方法：
  1. 在 `.env` 文件中設置：`SILICONFLOW_API_KEY=your_key`
  2. 獲取API密鑰：訪問 https://siliconflow.cn/ 註冊並獲取API密鑰

### 3. Qwen2.5-Coder-32B（Qwen）
- 專為代碼優化，適合SQL學習
- 配置方法：
  1. 同樣使用SiliconFlow API密鑰（與DeepSeek相同）
  2. 在 `.env` 文件中設置：`SILICONFLOW_API_KEY=your_key`

### 選擇AI模型
1. 登錄後，進入「個人資料」頁面
2. 在「AI模型設置」區域選擇您喜歡的模型
3. 點擊模型卡片即可切換

**注意**：
- 即使不配置API密鑰，所有基礎功能都可以正常使用！
- 如果某個模型的API密鑰未配置，該模型將不可用
- 建議至少配置一個模型的API密鑰以獲得最佳體驗

## 📄 頁面列表

| 頁面 | 文件 | 功能 |
|------|------|------|
| 訓練平台 | `index.html` | 主要SQL練習平台 |
| 互動練習 | `interactive.html` | 互動練習和完整學習路徑 |
| 學習進度 | `progress.html` | 學習進度追蹤和AI分析 |
| 題庫練習 | `practice.html` | 題庫練習 |
| 用戶中心 | `user-system.html` | 用戶個人中心 |
| 學習指南 | `guide.html` | SQL學習指南 |

## 🐛 常見問題

### Q1: 端口被占用
**解決方案**：修改端口號
```bash
python -m http.server 8080  # 使用8080端口
```

### Q2: AI功能無法使用
**解決方案**：
1. 確保後端服務正在運行：`python app.py`
2. 檢查API密鑰是否正確配置
3. 查看瀏覽器控制台錯誤信息

### Q3: 頁面無法加載
**解決方案**：
1. 使用本地服務器而不是直接打開HTML文件
2. 檢查文件路徑是否正確
3. 使用瀏覽器開發者工具查看錯誤

### Q4: 依賴安裝失敗
**解決方案**：
```bash
pip install --upgrade pip
pip install flask flask-cors python-dotenv
```

## 💡 使用提示

1. **首次使用**：建議先註冊賬號，這樣可以保存學習進度
2. **學習路徑**：在互動練習頁面選擇"完整學習路徑"，按照推薦順序學習
3. **AI助手**：配置API密鑰後，可以在學習進度頁面使用AI分析功能
4. **檢錯功能**：在整句輸入練習中，可以使用"AI檢錯"按鈕獲得詳細反饋

## 📞 技術支持

- 檢查Python版本：`python --version`（建議3.7+）
- 檢查依賴：`pip list`
- 查看日誌：後端服務會在終端顯示日誌信息

---

**現在就可以開始學習了！** 🎉

