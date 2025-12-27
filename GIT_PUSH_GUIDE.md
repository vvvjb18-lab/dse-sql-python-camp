# Git 推送指南

## ✅ 当前状态

- ✅ Git 仓库已初始化
- ✅ README.md 已提交
- ✅ 远程仓库已添加
- ⚠️ 推送需要 GitHub 认证

## 🔐 推送方式

### 方式一：使用 Personal Access Token（推荐）

1. **生成 GitHub Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问权限）
   - 生成并复制 token

2. **推送时使用 token**：
```bash
git push -u origin main
# 用户名：vvvjb18-lab
# 密码：粘贴你的 Personal Access Token
```

### 方式二：使用 SSH（更安全）

1. **生成 SSH 密钥**（如果还没有）：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. **添加 SSH 密钥到 GitHub**：
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"，粘贴公钥

3. **更改远程仓库地址为 SSH**：
```bash
git remote set-url origin git@github.com:vvvjb18-lab/dse-sql-python-camp.git
git push -u origin main
```

### 方式三：配置 Git 凭据助手

```bash
# 配置凭据助手（Linux）
git config --global credential.helper store

# 然后推送，输入一次凭据后会保存
git push -u origin main
```

## 📝 完整推送所有文件

当前只提交了 README.md，如果要推送所有文件：

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Add all project files"

# 推送
git push -u origin main
```

## ⚠️ 注意事项

1. **不要提交敏感文件**：
   - `config.py`（包含 API 密钥）
   - `database.db`（用户数据）
   - `*.log`（日志文件）

2. **.gitignore 已配置**：
   - 这些文件会自动被忽略
   - 只会提交安全的文件

3. **首次推送可能需要较长时间**：
   - 取决于文件大小和网络速度

## 🎯 推荐步骤

1. 先推送 README.md（已完成 ✅）
2. 添加其他文件：
   ```bash
   git add .
   git commit -m "Add project files"
   git push origin main
   ```

