# 修复远程 Apache 服务器重定向问题

## 问题诊断

根据 `curl` 结果：
- 域名 `icthelper.myftp.org` 解析到：`34.199.8.144`（远程服务器）
- 服务器返回：`Server: Apache`
- 重定向到：`http://59.148.148.76:5000`

**问题不在本地，而是在远程服务器上的 Apache 配置！**

## 解决方案

### 选项1：通过 SSH 登录远程服务器修改配置

1. **登录远程服务器**
   ```bash
   ssh user@34.199.8.144
   # 或
   ssh user@icthelper.myftp.org
   ```

2. **查找 Apache 配置文件**
   ```bash
   sudo grep -r "59.148.148.76\|Redirect.*5000\|RewriteRule.*5000" /etc/apache2/
   sudo grep -r "icthelper.myftp.org" /etc/apache2/sites-enabled/
   ```

3. **修改配置文件**（通常在 `/etc/apache2/sites-available/` 或 `/etc/apache2/sites-enabled/`）

   找到类似这样的配置并修改：
   ```apache
   # 删除或注释掉这行：
   # Redirect / http://59.148.148.76:5000
   # 或
   # RewriteRule ^(.*)$ http://59.148.148.76:5000$1 [R=302,L]
   
   # 替换为正确的配置：
   <VirtualHost *:80>
       ServerName icthelper.myftp.org
       
       # 允许 SSL 证书验证
       Alias /.well-known/acme-challenge /var/www/html/.well-known/acme-challenge
       <Directory "/var/www/html/.well-known/acme-challenge">
           Options None
           AllowOverride None
           Require all granted
       </Directory>
       
       # HTTP 到 HTTPS 重定向
       RewriteEngine On
       RewriteCond %{HTTPS} off
       RewriteCond %{REQUEST_URI} !^/.well-known/acme-challenge
       RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
   </VirtualHost>
   ```

4. **重启 Apache**
   ```bash
   sudo apache2ctl configtest
   sudo systemctl restart apache2
   ```

### 选项2：通过 Web 控制面板修改

如果使用 cPanel、Plesk 或其他控制面板：

1. 登录控制面板
2. 找到 "重定向" 或 "URL 重写" 设置
3. 删除或修改重定向到 `http://59.148.148.76:5000` 的规则
4. 添加 HTTP 到 HTTPS 的重定向规则

### 选项3：使用 .htaccess 文件（如果允许）

如果无法修改 Apache 主配置，可以尝试在网站根目录创建或修改 `.htaccess` 文件：

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

**注意**：`.htaccess` 的优先级可能低于 Apache 主配置，如果主配置中有重定向规则，`.htaccess` 可能不会生效。

### 选项4：配置反向代理（推荐）

如果远程服务器需要代理到本地 Flask 后端，应该使用反向代理而不是重定向：

```apache
<VirtualHost *:80>
    ServerName icthelper.myftp.org
    
    # 允许 SSL 证书验证
    Alias /.well-known/acme-challenge /var/www/html/.well-known/acme-challenge
    
    # HTTP 到 HTTPS 重定向
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteCond %{REQUEST_URI} !^/.well-known/acme-challenge
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName icthelper.myftp.org
    
    # SSL 配置
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    # 反向代理到后端（如果需要）
    ProxyPreserveHost On
    ProxyPass /api http://59.148.148.76:5000/api
    ProxyPassReverse /api http://59.148.148.76:5000/api
    
    # 静态文件直接服务
    DocumentRoot /var/www/html
    <Directory "/var/www/html">
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
```

## 验证修复

修改后，运行：
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

## 需要的信息

要提供更精确的修复方案，需要：
1. 远程服务器的访问方式（SSH、控制面板等）
2. Apache 配置文件的位置和内容
3. 是否有权限修改 Apache 配置

