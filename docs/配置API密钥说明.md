# 🔑 如何配置AI API密钥

## 📍 配置位置

**文件：`config.py`**

## 📝 配置步骤

### 步骤1：打开配置文件

打开项目根目录下的 `config.py` 文件

### 步骤2：找到配置行

找到这一行：
```python
ZHIPU_API_KEY = "YOUR_API_KEY"
```

### 步骤3：替换API密钥

将 `"YOUR_API_KEY"` 替换为您的实际API密钥，例如：
```python
ZHIPU_API_KEY = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
```

### 步骤4：保存文件

保存 `config.py` 文件

### 步骤5：重启服务

如果后端服务正在运行，需要重启：
1. 停止当前的后端服务（按 Ctrl+C）
2. 重新运行：`python app.py`

## 🔗 如何获取API密钥

1. 访问智谱AI官网：https://open.bigmodel.cn/
2. 注册/登录账号
3. 进入控制台
4. 创建API密钥
5. 复制密钥到 `config.py` 文件中

## ✅ 验证配置

配置完成后，启动后端服务：
```bash
python app.py
```

如果看到以下信息，说明配置成功：
```
 * Running on http://127.0.0.1:5000
```

如果看到警告信息，说明还需要配置API密钥。

## 🔒 安全提示

⚠️ **重要**：
- 不要将包含真实API密钥的 `config.py` 文件提交到公共代码仓库
- 可以将 `config.py` 添加到 `.gitignore` 文件中
- API密钥是私密信息，请妥善保管

## 📋 配置示例

**配置前：**
```python
ZHIPU_API_KEY = "YOUR_API_KEY"
```

**配置后：**
```python
ZHIPU_API_KEY = "your_actual_api_key_here_123456789"
```

## 🎯 配置完成后

配置完成后，以下AI功能将可用：
- ✅ AI学习分析（学习进度页面）
- ✅ AI检错教官（整句输入练习）
- ✅ AI智能问答（互动练习页面）

## ❓ 常见问题

### Q: 不配置API密钥可以使用吗？
A: 可以！所有基础功能都可以正常使用，只是AI功能不可用。

### Q: 配置后还是无法使用AI功能？
A: 检查：
1. API密钥是否正确（没有多余空格）
2. 后端服务是否正在运行
3. 浏览器控制台是否有错误信息

### Q: 可以临时禁用AI功能吗？
A: 可以，将API密钥改回 `"YOUR_API_KEY"` 即可。

