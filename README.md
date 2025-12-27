# DSE SQL & Python 訓練營

一个完整的 SQL 和 Python 学习平台，提供交互式练习、AI 智能助手和进度跟踪功能。

## ✨ 主要特性

- 📚 **交互式学习**：SQL 和 Python 练习题，支持多种题型（选择题、填空题、拖放题、代码补全）
- 🤖 **AI 智能助手**：集成智谱AI、DeepSeek、Qwen 等多种 AI 模型，提供智能问答和学习分析
- 📊 **学习进度跟踪**：自动记录学习进度，支持多用户系统
- 🌐 **多语言支持**：支持繁体中文、简体中文、英文
- 🎯 **综合练习**：100+ SQL 题目，涵盖不同难度和主题
- 💻 **GUI 服务管理器**：Linux 图形化服务管理工具

## 🚀 快速开始

### 系统要求

- Python 3.8+
- Linux 系统（推荐 Ubuntu 20.04+）
- 现代浏览器（Chrome、Firefox、Edge）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/dse-sql-training-camp.git
cd dse-sql-training-camp
```

2. **安装 Python 依赖**
```bash
pip install -r requirements.txt
```

3. **安装 GUI 依赖（可选）**
```bash
chmod +x scripts/install-gui-dependencies.sh
./scripts/install-gui-dependencies.sh
```

4. **初始化数据库**
```bash
python3 init_database.py
```

5. **配置环境变量（可选，用于 AI 功能）**
```bash
cp config.py.example config.py
# 编辑 config.py，添加你的 API 密钥
```

6. **启动服务**

**方式一：使用 GUI 管理器（推荐）**
```bash
python3 service-manager-safe.py
```

**方式二：命令行启动**
```bash
python3 app.py
```

7. **访问应用**
打开浏览器访问：`http://localhost:5000`

## 📁 项目结构

```
dse-sql-training-camp/
├── README.md                 # 项目说明
├── LICENSE                  # MIT 许可证
├── .gitignore              # Git 忽略文件
├── requirements.txt        # Python 依赖
├── config.py.example       # 配置文件示例
│
├── app.py                  # Flask 后端主程序
├── database.py            # 数据库操作模块
├── init_database.py       # 数据库初始化脚本
│
├── service-manager-safe.py # GUI 服务管理器（推荐）
├── service-manager-new.py # GUI 服务管理器（备用）
│
├── index.html             # 首页
├── guide.html             # 学习指南
├── progress.html          # 学习进度
├── user-system.html       # 用户中心
├── practice.html          # SQL 练习
├── interactive.html       # 交互式练习
├── all-practice.html      # 综合练习
├── python-center.html     # Python 学习中心
│
├── *.js                   # JavaScript 前端文件
├── lang.js                # 多语言支持
│
├── scripts/               # 工具脚本
│   ├── start-service-manager.sh
│   ├── install-gui-dependencies.sh
│   └── ...
│
├── docs/                  # 文档
│   ├── 完整部署与维护指南.md
│   ├── 技术架构说明.md
│   └── ...
│
└── resources/             # 静态资源
    └── hero-bg.jpg
```

## 🔧 配置说明

### AI 功能配置

项目支持三种 AI 模型：

1. **智谱AI (GLM-4-Flash)** - 默认模型
   - 在 `config.py` 中设置 `ZHIPUAI_API_KEY`

2. **SiliconFlow (DeepSeek/Qwen)**
   - 在 `config.py` 中设置 `SILICONFLOW_API_KEY`

3. **用户自定义模型**
   - 通过用户中心页面选择

### 数据库配置

数据库使用 SQLite，文件为 `database.db`。首次运行会自动创建。

## 📖 功能说明

### 学习功能

- **SQL 练习**：100+ 题目，涵盖基础到高级
- **Python 学习中心**：Python 语法和编程练习
- **交互式练习**：拖放、填空、选择题等多种题型
- **学习指南**：系统化的学习路径
- **进度跟踪**：自动记录学习进度和成绩

### AI 助手功能

- **智能问答**：回答 SQL 和 Python 相关问题
- **代码检查**：检查代码并提供反馈
- **学习分析**：分析学习状况并提供建议
- **个性化提示**：根据题目生成提示

### 管理功能

- **用户管理**：注册、登录、个人资料
- **服务管理**：GUI 工具管理后端服务
- **系统监控**：CPU、内存、磁盘使用情况
- **日志查看**：实时查看服务日志

## 🛠️ 技术栈

- **后端**：Flask 3.0
- **前端**：原生 JavaScript、HTML5、CSS3
- **数据库**：SQLite
- **AI 集成**：智谱AI、SiliconFlow
- **GUI**：Tkinter (Python)

## 📝 开发说明

### 添加新题目

1. 编辑对应的 JavaScript 文件（如 `sql-questions-100.js`）
2. 按照现有格式添加题目
3. 刷新页面即可看到新题目

### 添加新功能

1. 后端 API：在 `app.py` 中添加路由
2. 前端页面：创建新的 HTML 文件
3. 数据库：如需新表，在 `database.py` 中定义

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 智谱AI 提供 GLM-4-Flash 模型
- SiliconFlow 提供 DeepSeek 和 Qwen 模型
- Flask 社区

## 📞 联系方式

如有问题或建议，请提交 Issue。

---

**注意**：本项目仅供学习使用。使用 AI 功能需要配置相应的 API 密钥。
# dse-sql-python-camp
