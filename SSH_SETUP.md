# SSH 配置指南

## 问题

SSH 推送失败，提示 "Host key verification failed" 或 "无法读取远端版本库"。

## 解决方案

### 方案一：配置 SSH 密钥（推荐）

1. **检查是否已有 SSH 密钥**：
```bash
ls -la ~/.ssh/id_*.pub
```

2. **如果没有，生成新的 SSH 密钥**：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按 Enter 使用默认路径
# 可以设置密码或直接按 Enter 跳过
```

3. **复制公钥**：
```bash
cat ~/.ssh/id_ed25519.pub
# 复制输出的内容
```

4. **添加到 GitHub**：
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - Title: 填写一个描述（如 "My Linux PC"）
   - Key: 粘贴刚才复制的公钥
   - 点击 "Add SSH key"

5. **测试 SSH 连接**：
```bash
ssh -T git@github.com
# 应该看到：Hi vvvjb18-lab! You've successfully authenticated...
```

6. **推送代码**：
```bash
git push -u origin main
```

### 方案二：使用 HTTPS + Personal Access Token

如果不想配置 SSH，可以改回 HTTPS 方式：

1. **更改远程仓库地址**：
```bash
git remote set-url origin https://github.com/vvvjb18-lab/dse-sql-python-camp.git
```

2. **生成 Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问权限）
   - 生成并复制 token

3. **推送时使用 token**：
```bash
git push -u origin main
# 用户名：vvvjb18-lab
# 密码：粘贴你的 Personal Access Token
```

### 方案三：跳过主机密钥验证（不推荐，仅用于测试）

```bash
# 添加到 known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

# 然后推送
git push -u origin main
```

## 推荐

**推荐使用方案一（SSH）**，因为：
- 更安全
- 不需要每次输入密码
- 是 GitHub 推荐的方式

## 当前状态

- ✅ Git 仓库已初始化
- ✅ README.md 已提交
- ✅ 远程仓库已配置（SSH 方式）
- ⚠️ 需要配置 SSH 密钥才能推送

