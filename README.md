# DSE SQL & Python 訓練營

一個完整的 SQL 和 Python 學習平台，提供互動式練習、AI 智能助手和進度追蹤功能。

## 🌐 線上演示

**🎯 成品網站：** [https://icthelper.duckdns.org](https://icthelper.duckdns.org)

> 這是本專案的線上演示版本，可以直接體驗所有功能，無需本地安裝。

## ✨ 主要特性

- 📚 **互動式學習**：SQL 和 Python 練習題，支援多種題型（選擇題、填空題、拖放題、程式碼補全）
- 🤖 **AI 智能助手**：整合智譜AI、DeepSeek、Qwen 等多種 AI 模型，提供智能問答和學習分析
- 📊 **學習進度追蹤**：自動記錄學習進度，支援多用戶系統
- 🌐 **多語言支援**：支援繁體中文、簡體中文、英文
- 🎯 **綜合練習**：100+ SQL 題目，涵蓋不同難度和主題
- 💻 **GUI 服務管理器**：Linux 圖形化服務管理工具

## 🚀 快速開始

### 系統要求

- Python 3.8+
- Linux 系統（推薦 Ubuntu 20.04+）
- 現代瀏覽器（Chrome、Firefox、Edge）

### 安裝步驟

1. **克隆專案**
```bash
git clone https://github.com/vvvjb18-lab/dse-sql-python-camp.git
cd dse-sql-python-camp
```

2. **安裝 Python 依賴**
```bash
pip install -r requirements.txt
```

3. **安裝 GUI 依賴（可選）**
```bash
chmod +x scripts/install-gui-dependencies.sh
./scripts/install-gui-dependencies.sh
```

4. **初始化資料庫**
```bash
python3 init_database.py
```

5. **配置環境變數（可選，用於 AI 功能）**
```bash
cp config.py.example config.py
# 編輯 config.py，新增你的 API 金鑰
```

6. **啟動服務**

**方式一：使用 GUI 管理器（推薦）**
```bash
python3 service-manager-safe.py
```

**方式二：命令列啟動**
```bash
python3 app.py
```

7. **訪問應用**
打開瀏覽器訪問：`http://localhost:5000`

## 📁 專案結構

```
dse-sql-python-camp/
├── README.md                 # 專案說明
├── LICENSE                  # MIT 授權
├── .gitignore              # Git 忽略檔案
├── requirements.txt        # Python 依賴
├── config.py.example       # 配置檔案範例
│
├── app.py                  # Flask 後端主程式
├── database.py            # 資料庫操作模組
├── init_database.py       # 資料庫初始化腳本
│
├── service-manager-safe.py # GUI 服務管理器（推薦）
├── service-manager-new.py # GUI 服務管理器（備用）
│
├── index.html             # 首頁
├── guide.html             # 學習指南
├── progress.html          # 學習進度
├── user-system.html       # 用戶中心
├── practice.html          # SQL 練習
├── interactive.html       # 互動式練習
├── all-practice.html      # 綜合練習
├── python-center.html     # Python 學習中心
│
├── *.js                   # JavaScript 前端檔案
├── lang.js                # 多語言支援
│
├── scripts/               # 工具腳本
│   ├── start-service-manager.sh
│   ├── install-gui-dependencies.sh
│   └── ...
│
├── docs/                  # 文件
│   ├── 完整部署與維護指南.md
│   ├── 技術架構說明.md
│   └── ...
│
└── resources/             # 靜態資源
    └── hero-bg.jpg
```

## 🔧 配置說明

### AI 功能配置

專案支援三種 AI 模型：

1. **智譜AI (GLM-4-Flash)** - 預設模型
   - 在 `config.py` 中設定 `ZHIPUAI_API_KEY`

2. **SiliconFlow (DeepSeek/Qwen)**
   - 在 `config.py` 中設定 `SILICONFLOW_API_KEY`

3. **用戶自訂模型**
   - 透過用戶中心頁面選擇

### 資料庫配置

資料庫使用 SQLite，檔案為 `database.db`。首次執行會自動建立。

## 📖 功能說明

### 學習功能

- **SQL 練習**：100+ 題目，涵蓋基礎到進階
- **Python 學習中心**：Python 語法和程式設計練習
- **互動式練習**：拖放、填空、選擇題等多種題型
- **學習指南**：系統化的學習路徑
- **進度追蹤**：自動記錄學習進度和成績

### AI 助手功能

- **智能問答**：回答 SQL 和 Python 相關問題
- **程式碼檢查**：檢查程式碼並提供回饋
- **學習分析**：分析學習狀況並提供建議
- **個人化提示**：根據題目產生提示

### 管理功能

- **用戶管理**：註冊、登入、個人資料
- **服務管理**：GUI 工具管理後端服務
- **系統監控**：CPU、記憶體、磁碟使用情況
- **日誌查看**：即時查看服務日誌

## 🛠️ 技術棧

- **後端**：Flask 3.0
- **前端**：原生 JavaScript、HTML5、CSS3
- **資料庫**：SQLite
- **AI 整合**：智譜AI、SiliconFlow
- **GUI**：Tkinter (Python)

## 📝 開發說明

### 新增新題目

1. 編輯對應的 JavaScript 檔案（如 `sql-questions-100.js`）
2. 按照現有格式新增題目
3. 重新整理頁面即可看到新題目

### 新增新功能

1. 後端 API：在 `app.py` 中新增路由
2. 前端頁面：建立新的 HTML 檔案
3. 資料庫：如需新表，在 `database.py` 中定義

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 🙏 致謝

- 智譜AI 提供 GLM-4-Flash 模型
- SiliconFlow 提供 DeepSeek 和 Qwen 模型
- Flask 社群

## 📞 聯絡方式

如有問題或建議，請提交 Issue 或透過以下方式聯絡：

- 電子郵件：yivh5723@gmail.com

---

**注意**：本專案僅供學習使用。使用 AI 功能需要配置相應的 API 金鑰。
