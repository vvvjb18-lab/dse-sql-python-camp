# AI助手功能使用说明

## 功能概述

本项目已集成智谱AI GLM-4-Flash模型，提供智能学习助手功能，包括：
- 💬 智能问答：回答SQL相关问题
- ✓ SQL检查：检查SQL语句并提供反馈
- 💡 学习提示：根据题目生成个性化提示
- 📖 概念解释：解释SQL语法和概念

## 安装步骤

### 1. 安装Python依赖

```bash
pip install -r requirements.txt
```

### 2. 配置API密钥

有两种方式配置API密钥：

**方式1：使用config.py文件（推荐）**
1. 打开 `config.py` 文件
2. 将 `YOUR_API_KEY` 替换为您的实际智谱AI API密钥

```python
ZHIPU_API_KEY = "your_actual_api_key_here"
```

**方式2：使用环境变量**
1. 创建 `.env` 文件（如果不存在）
2. 添加以下内容：
```
ZHIPU_API_KEY=your_actual_api_key_here
```

### 3. 启动后端服务

```bash
python app.py
```

服务将在 `http://localhost:5000` 启动

### 4. 使用AI助手

1. 打开 `interactive-exercises.html` 页面
2. 点击右上角的 "🤖 AI助手" 按钮
3. 在对话框中输入问题或使用快捷按钮

## API接口说明

### 1. 聊天接口
- **URL**: `POST /api/chat`
- **请求体**:
```json
{
    "message": "用户消息",
    "context": "上下文信息（可选）",
    "temperature": 0.6
}
```

### 2. SQL检查接口
- **URL**: `POST /api/check-sql`
- **请求体**:
```json
{
    "sql": "SQL语句",
    "expected": "期望的SQL语句（可选）",
    "table_structure": "表结构（可选）"
}
```

### 3. 获取提示接口
- **URL**: `POST /api/get-hint`
- **请求体**:
```json
{
    "problem_description": "题目描述",
    "table_structure": "表结构",
    "difficulty": "难度等级"
}
```

### 4. 健康检查接口
- **URL**: `GET /health`
- **响应**: `{"status": "ok", "service": "DSE SQL 訓練營 AI服务"}`

## 前端使用示例

### JavaScript调用示例

```javascript
// 发送聊天消息
const response = await AIService.chat("什么是SELECT语句？", "当前学习基础查询", 0.6);
console.log(response);

// 检查SQL语句
const feedback = await AIService.checkSQL(
    "SELECT * FROM students",
    "SELECT name FROM students",
    "students(id, name, class, score)"
);
console.log(feedback);

// 获取学习提示
const hint = await AIService.getHint(
    "查询所有学生的姓名和分数",
    "students(id, name, class, score)",
    "easy"
);
console.log(hint);
```

## 注意事项

1. **API密钥安全**：请勿将API密钥提交到公共代码仓库
2. **服务运行**：使用AI功能前，确保后端服务正在运行
3. **网络连接**：确保能够访问智谱AI的API服务
4. **使用限制**：请注意API的调用频率限制

## 故障排除

### 问题1：AI服务未连接
- 检查后端服务是否正在运行：`python app.py`
- 检查浏览器控制台是否有错误信息
- 确认API密钥配置正确

### 问题2：API调用失败
- 检查API密钥是否有效
- 检查网络连接
- 查看后端服务日志

### 问题3：跨域错误
- 确保已安装 `flask-cors`
- 检查 `app.py` 中的CORS配置

## 开发说明

### 修改AI服务地址

如果后端服务运行在不同地址，修改 `ai-service.js` 中的 `AI_SERVICE_URL`：

```javascript
const AI_SERVICE_URL = 'http://your-server:5000/api';
```

### 自定义系统提示词

在 `app.py` 中修改 `system_prompt` 来自定义AI的行为和回答风格。

## 技术支持

如有问题，请检查：
1. Python版本（建议3.7+）
2. 依赖包是否正确安装
3. API密钥是否有效
4. 网络连接是否正常

