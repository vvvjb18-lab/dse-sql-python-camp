# SSL 证书管理说明

## 📋 证书信息

- **域名**：`icthelper.duckdns.org`
- **证书类型**：Let's Encrypt（通过 acme.sh）
- **证书路径**：`~/.acme.sh/icthelper.duckdns.org_ecc/`
- **管理工具**：Nginx Proxy Manager (NPM)

## ✅ 当前状态

- ✅ SSL 证书已成功配置
- ✅ HTTPS 访问正常
- ✅ 证书自动续期已设置（acme.sh）

## 🔄 证书续期流程

### 自动续期

`acme.sh` 已设置自动任务，会在证书到期前（约60天后）自动续签。

### 手动更新到 NPM（重要）

**证书续签后，需要手动更新到 NPM：**

1. **获取新证书文件**
   ```bash
   # 证书文件路径
   ~/.acme.sh/icthelper.duckdns.org_ecc/icthelper.duckdns.org.cer  # fullchain
   ~/.acme.sh/icthelper.duckdns.org_ecc/icthelper.duckdns.org.key   # 私钥
   ```

2. **查看证书内容**
   ```bash
   cat ~/.acme.sh/icthelper.duckdns.org_ecc/icthelper.duckdns.org.cer
   cat ~/.acme.sh/icthelper.duckdns.org_ecc/icthelper.duckdns.org.key
   ```

3. **更新到 NPM**
   - 登录 Nginx Proxy Manager
   - 进入 **SSL Certificates**
   - 找到 `icthelper.duckdns.org` 的自定义证书
   - 点击 **Edit**
   - 将新的 `fullchain.cer` 内容复制到 **Certificate**
   - 将新的 `.key` 内容复制到 **Private Key**
   - 点击 **Save**

### 续期提醒

建议设置一个 **80天后** 的提醒，用于检查并更新 NPM 中的证书。

## 📝 证书管理命令

### 检查证书状态

```bash
# 查看证书信息
acme.sh --info -d icthelper.duckdns.org

# 查看证书到期时间
openssl x509 -in ~/.acme.sh/icthelper.duckdns.org_ecc/icthelper.duckdns.org.cer -noout -dates
```

### 手动续期（如果需要）

```bash
# 手动触发续期
acme.sh --renew -d icthelper.duckdns.org --force
```

### 查看续期任务

```bash
# 查看 cron 任务
crontab -l | grep acme

# 查看 acme.sh 日志
tail -f ~/.acme.sh/acme.sh.log
```

## 🔍 验证证书

### 在线验证

访问以下网站验证证书状态：
- https://www.ssllabs.com/ssltest/analyze.html?d=icthelper.duckdns.org
- https://crt.sh/?q=icthelper.duckdns.org

### 命令行验证

```bash
# 检查证书链
openssl s_client -connect icthelper.duckdns.org:443 -showcerts

# 检查证书有效期
echo | openssl s_client -servername icthelper.duckdns.org -connect icthelper.duckdns.org:443 2>/dev/null | openssl x509 -noout -dates
```

## ⚠️ 注意事项

1. **证书自动续期**：acme.sh 会自动续期，但不会自动更新到 NPM
2. **手动更新**：续期后必须手动将新证书更新到 NPM
3. **备份证书**：建议定期备份证书文件
4. **监控到期时间**：设置提醒，避免证书过期

## 📅 维护计划

### 定期检查（建议每月）

1. 检查证书到期时间
2. 查看 acme.sh 日志，确认自动续期正常
3. 验证 HTTPS 访问正常

### 续期后操作（约60-80天后）

1. 检查证书是否已自动续期
2. 获取新证书文件
3. 更新到 NPM
4. 验证 HTTPS 访问正常
5. 设置下一个提醒

## 🔗 相关资源

- **acme.sh 文档**：https://github.com/acmesh-official/acme.sh
- **Let's Encrypt 文档**：https://letsencrypt.org/docs/
- **Nginx Proxy Manager**：https://nginxproxymanager.com/

## 📞 故障排除

### 证书续期失败

```bash
# 查看详细日志
acme.sh --renew -d icthelper.duckdns.org --debug

# 检查 DNS 记录
dig icthelper.duckdns.org
```

### NPM 证书更新后不生效

1. 检查证书格式是否正确
2. 重启 NPM 服务
3. 清除浏览器缓存
4. 检查 NPM 日志

### HTTPS 访问异常

1. 检查证书是否过期
2. 验证 NPM 配置
3. 检查防火墙设置
4. 查看 NPM 错误日志

