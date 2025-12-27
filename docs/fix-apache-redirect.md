# 修复 Apache 重定向到 IP:5000 的问题

## 问题诊断

根据 `curl -I http://icthelper.myftp.org` 的结果，Apache 服务器返回了：
```
HTTP/1.1 302 Found
Location: http://59.148.148.76:5000
```

这说明 Apache 配置中有重定向规则，将请求重定向到了 IP:5000。

## 解决方案

### 方法1：修改 Apache 虚拟主机配置

找到 Apache 的虚拟主机配置文件（通常在 `/etc/apache2/sites-available/` 或 `/etc/apache2/sites-enabled/`），查找包含 `icthelper.myftp.org` 的配置。

**需要修改的内容：**

1. **移除或注释掉重定向到 IP:5000 的规则**
   ```apache
   # 删除或注释掉类似这样的规则：
   # Redirect / http://59.148.148.76:5000
   # RewriteRule ^(.*)$ http://59.148.148.76:5000$1 [R=302,L]
   ```

2. **添加 HTTP 到 HTTPS 重定向（如果需要）**
   ```apache
   <VirtualHost *:80>
       ServerName icthelper.myftp.org
       
       # 允许 SSL 证书验证路径
       Alias /.well-known/acme-challenge /var/www/html/.well-known/acme-challenge
       <Directory "/var/www/html/.well-known/acme-challenge">
           Options None
           AllowOverride None
           Require all granted
       </Directory>
       
       # HTTP 到 HTTPS 重定向（只对根路径和主要页面）
       RewriteEngine On
       RewriteCond %{HTTPS} off
       RewriteCond %{REQUEST_URI} !^/.well-known/acme-challenge
       RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
   </VirtualHost>
   ```

3. **配置反向代理到后端（如果使用）**
   ```apache
   <VirtualHost *:443>
       ServerName icthelper.myftp.org
       
       # SSL 配置
       SSLEngine on
       SSLCertificateFile /path/to/cert.pem
       SSLCertificateKeyFile /path/to/key.pem
       
       # 反向代理到后端（如果需要）
       ProxyPreserveHost On
       ProxyPass /api http://127.0.0.1:5000/api
       ProxyPassReverse /api http://127.0.0.1:5000/api
       
       # 静态文件直接服务
       DocumentRoot /home/yivh/桌面/web surver
       <Directory "/home/yivh/桌面/web surver">
           Options Indexes FollowSymLinks
           AllowOverride None
           Require all granted
       </Directory>
   </VirtualHost>
   ```

### 方法2：使用 .htaccess 文件（如果允许）

在项目根目录创建或修改 `.htaccess` 文件：

```apache
# 允许 SSL 证书验证
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # 允许 /.well-known/acme-challenge 路径
    RewriteCond %{REQUEST_URI} ^/.well-known/acme-challenge
    RewriteRule ^ - [L]
    
    # HTTP 到 HTTPS 重定向
    RewriteCond %{HTTPS} off
    RewriteCond %{HTTP_HOST} ^icthelper\.myftp\.org$
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</IfModule>
```

## 查找配置文件

运行以下命令查找配置文件：

```bash
# 查找包含重定向规则的配置文件
sudo grep -r "59.148.148.76" /etc/apache2/
sudo grep -r "Redirect\|RewriteRule" /etc/apache2/sites-enabled/
sudo grep -r "icthelper.myftp.org" /etc/apache2/
```

## 修改后重启 Apache

```bash
sudo systemctl restart apache2
# 或
sudo service apache2 restart
```

## 验证修复

```bash
curl -I http://icthelper.myftp.org
```

应该看到：
```
HTTP/1.1 301 Moved Permanently
Location: https://icthelper.myftp.org/
```

而不是：
```
Location: http://59.148.148.76:5000
```

## 注意事项

1. **备份配置文件**：修改前先备份
   ```bash
   sudo cp /etc/apache2/sites-available/your-site.conf /etc/apache2/sites-available/your-site.conf.bak
   ```

2. **检查语法**：修改后检查配置语法
   ```bash
   sudo apache2ctl configtest
   ```

3. **查看错误日志**：如果出现问题，查看日志
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```

