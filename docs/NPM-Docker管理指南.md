# Nginx Proxy Manager (NPM) Docker 管理指南

## 🐳 NPM Docker 运行指令

### 标准运行命令

```bash
sudo docker run -d \
  --name=npm \
  --restart=unless-stopped \
  --network=host \
  -v /home/yivh/nginx-proxy-manager/data:/data \
  -v /home/yivh/nginx-proxy-manager/letsencrypt:/etc/letsencrypt \
  jc21/nginx-proxy-manager:latest
```

### 参数详解

| 参数 | 作用 | 重要性 |
| :--- | :--- | :--- |
| `-d` | 后台运行容器 | 常规操作 |
| `--name=npm` | 容器命名为 `npm` | 便于管理，可用 `sudo docker restart npm` 等命令 |
| `--restart=unless-stopped` | 自动重启策略 | **重要**：服务器重启后 NPM 自动恢复 |
| **`--network=host`** | **关键**：共享宿主机网络 | **核心配置**：容器内 `127.0.0.1` 直接指向宿主机 |
| **`-v /home/yivh/nginx-proxy-manager/data:/data`** | **关键**：挂载配置数据目录 | **核心配置**：保留所有网站配置、SSL证书设置等 |
| **`-v /home/yivh/nginx-proxy-manager/letsencrypt:/etc/letsencrypt`** | 挂载 SSL 证书目录 | 保留证书相关文件 |
| `jc21/nginx-proxy-manager:latest` | 官方 NPM 镜像 | 使用稳定版镜像 |

## 🔧 常用管理命令

### 容器操作

```bash
# 启动容器
sudo docker start npm

# 停止容器
sudo docker stop npm

# 重启容器
sudo docker restart npm

# 查看容器状态
sudo docker ps | grep npm

# 查看容器日志
sudo docker logs npm
sudo docker logs npm --tail 50
sudo docker logs npm -f  # 实时查看日志

# 查看容器详细信息
sudo docker inspect npm

# 进入容器（调试用）
sudo docker exec -it npm /bin/sh
```

### 更新容器

**重要**：更新时配置数据不会丢失（因为使用了数据卷挂载）

```bash
# 1. 停止并移除旧容器
sudo docker stop npm
sudo docker rm npm

# 2. 拉取最新的镜像
sudo docker pull jc21/nginx-proxy-manager:latest

# 3. 使用完全相同的命令（包含所有 -v 挂载参数）重新运行
sudo docker run -d \
  --name=npm \
  --restart=unless-stopped \
  --network=host \
  -v /home/yivh/nginx-proxy-manager/data:/data \
  -v /home/yivh/nginx-proxy-manager/letsencrypt:/etc/letsencrypt \
  jc21/nginx-proxy-manager:latest
```

## 📁 数据目录结构

```
/home/yivh/nginx-proxy-manager/
├── data/                 # 核心数据目录（必须备份）
│   ├── database.sqlite  # 存储代理主机、访问列表等配置
│   └── ...              # 其他 NPM 运行时文件
└── letsencrypt/         # SSL 证书相关目录
```

### 重要说明

- **`/data` 目录**：包含所有 NPM 配置（代理主机、SSL 证书设置、访问列表等）
- **`/letsencrypt` 目录**：SSL 证书相关文件
- **必须定期备份**：整个 `/home/yivh/nginx-proxy-manager/` 目录

## 💾 备份和恢复

### 备份脚本

```bash
#!/bin/bash
# NPM 配置备份脚本

BACKUP_DIR="/home/yivh/backups/npm"
SOURCE_DIR="/home/yivh/nginx-proxy-manager"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/npm_backup_$TIMESTAMP.tar.gz" -C "$(dirname $SOURCE_DIR)" "$(basename $SOURCE_DIR)"

echo "备份完成: $BACKUP_DIR/npm_backup_$TIMESTAMP.tar.gz"
```

### 手动备份

```bash
# 创建备份目录
mkdir -p ~/backups/npm

# 备份整个 NPM 配置目录
tar -czf ~/backups/npm/npm_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  -C /home/yivh nginx-proxy-manager

# 查看备份文件
ls -lh ~/backups/npm/
```

### 恢复备份

```bash
# 停止 NPM 容器
sudo docker stop npm
sudo docker rm npm

# 恢复备份
tar -xzf ~/backups/npm/npm_backup_YYYYMMDD_HHMMSS.tar.gz -C /home/yivh

# 重新启动容器（使用标准运行命令）
sudo docker run -d \
  --name=npm \
  --restart=unless-stopped \
  --network=host \
  -v /home/yivh/nginx-proxy-manager/data:/data \
  -v /home/yivh/nginx-proxy-manager/letsencrypt:/etc/letsencrypt \
  jc21/nginx-proxy-manager:latest
```

## ⚠️ 重要注意事项

### 1. 网络模式

- **使用 `host` 网络模式**：容器直接使用宿主机的 80、443、81 端口
- **不需要端口映射**：不要添加 `-p 80:80` 等参数，否则会导致冲突
- **优势**：容器内 `127.0.0.1` 直接指向宿主机，解决网络连通问题

### 2. 数据持久化

- **必须使用数据卷挂载**：确保配置数据保存在宿主机
- **定期备份**：备份整个 `/home/yivh/nginx-proxy-manager/` 目录
- **更新容器**：更新时配置不会丢失（因为使用了数据卷）

### 3. 访问管理后台

- **地址**：`http://你的服务器IP:81`
- **默认账号**：首次访问需要设置管理员账号
- **等待时间**：容器启动后约等待 20 秒再访问

### 4. SSL 证书管理

- **证书位置**：NPM 后台 → SSL Certificates
- **证书更新**：续期后需要在 NPM 后台重新导入
- **检查证书**：定期检查代理主机的 SSL 标签页，确保证书正确关联

## 🔍 故障排除

### 容器无法启动

```bash
# 查看详细错误信息
sudo docker logs npm

# 检查端口占用
sudo netstat -tlnp | grep -E ":80|:443|:81"

# 检查数据目录权限
ls -la /home/yivh/nginx-proxy-manager/
```

### 网站无法访问

1. **检查容器状态**
   ```bash
   sudo docker ps | grep npm
   ```

2. **查看容器日志**
   ```bash
   sudo docker logs npm --tail 100
   ```

3. **检查 NPM 配置**
   - 登录 NPM 后台：`http://你的IP:81`
   - 检查 Proxy Hosts 配置
   - 检查 SSL 证书关联

4. **检查后端服务**
   ```bash
   ps aux | grep "python.*app.py"
   ss -tlnp | grep :5000
   ```

### SSL 证书问题

1. **检查证书关联**
   - NPM 后台 → Proxy Hosts → 选择网站 → SSL 标签页
   - 确保证书已正确关联

2. **重新导入证书**
   - NPM 后台 → SSL Certificates
   - 编辑证书，重新导入 `fullchain.cer` 和 `.key`

3. **重启容器**
   ```bash
   sudo docker restart npm
   ```

## 📊 监控和维护

### 定期检查

- **每日**：检查容器运行状态
- **每周**：查看容器日志
- **每月**：备份配置数据
- **每季度**：检查磁盘空间使用

### 监控命令

```bash
# 检查容器资源使用
sudo docker stats npm

# 检查数据目录大小
du -sh /home/yivh/nginx-proxy-manager/

# 检查备份目录
ls -lh ~/backups/npm/
```

## 🔗 相关资源

- **NPM 官方文档**：https://nginxproxymanager.com/
- **Docker 文档**：https://docs.docker.com/
- **NPM GitHub**：https://github.com/NginxProxyManager/nginx-proxy-manager

## 💡 最佳实践

1. **定期备份**：每周或每月备份一次配置
2. **监控日志**：定期查看容器日志，及时发现问题
3. **更新策略**：在非高峰期更新容器
4. **测试恢复**：定期测试备份恢复流程
5. **文档记录**：记录所有配置变更

