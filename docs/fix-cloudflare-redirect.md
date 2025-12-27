# 修复 Cloudflare 重定向问题

## 问题诊断

域名 `icthelper.myftp.org` 使用 Cloudflare DNS，重定向到 `http://59.148.148.76:5000` 可能是在 **Cloudflare 层面**设置的，而不是在 Apache 服务器上。

## 解决方案

### 方法1：检查 Cloudflare Page Rules（页面规则）

Page Rules 可以设置重定向，这是最常见的原因。

**步骤：**

1. **登录 Cloudflare 控制面板**
   - 访问：https://dash.cloudflare.com
   - 选择域名：`icthelper.myftp.org`

2. **检查 Page Rules**
   - 左侧菜单：**Rules** → **Page Rules**
   - 查找是否有规则匹配 `icthelper.myftp.org` 或 `*`
   - 检查是否有重定向到 `http://59.148.148.76:5000` 的规则

3. **删除或修改重定向规则**
   - 如果找到重定向规则，点击 **Edit** 或 **Delete**
   - 删除重定向到 IP:5000 的规则
   - 如果需要 HTTP 到 HTTPS 重定向，应该设置为：
     - **URL Pattern**: `http://icthelper.myftp.org/*`
     - **Setting**: `Forwarding URL` → `301 - Permanent Redirect`
     - **Destination URL**: `https://icthelper.myftp.org/$1`

### 方法2：检查 Cloudflare Workers

Workers 可以修改请求和响应。

**步骤：**

1. **检查 Workers**
   - 左侧菜单：**Workers & Pages**
   - 查看是否有 Worker 绑定到 `icthelper.myftp.org`
   - 检查 Worker 代码中是否有重定向逻辑

2. **修改或删除 Worker**
   - 如果找到相关 Worker，编辑或删除它

### 方法3：检查 Transform Rules（转换规则）

Transform Rules 可以修改请求头。

**步骤：**

1. **检查 Transform Rules**
   - 左侧菜单：**Rules** → **Transform Rules**
   - 查看是否有规则修改 Location 头或进行重定向

2. **删除相关规则**
   - 如果找到导致重定向的规则，删除它

### 方法4：检查 DNS 设置

确保 DNS 记录正确指向服务器。

**步骤：**

1. **检查 DNS 记录**
   - 左侧菜单：**DNS** → **Records**
   - 确保 `icthelper.myftp.org` 的 A 记录指向正确的 IP
   - 如果使用 CNAME，确保指向正确的域名

2. **检查代理状态**
   - 确保代理状态（橙色云朵）设置正确
   - 如果不需要 Cloudflare 代理，可以关闭（灰色云朵）

### 方法5：检查 SSL/TLS 设置

SSL 设置可能影响重定向。

**步骤：**

1. **检查 SSL/TLS 设置**
   - 左侧菜单：**SSL/TLS**
   - **SSL/TLS encryption mode** 应该设置为：
     - `Full` 或 `Full (strict)`（如果服务器有有效证书）
     - 或 `Flexible`（如果服务器没有 SSL 证书）

2. **检查 Always Use HTTPS**
   - 左侧菜单：**SSL/TLS** → **Edge Certificates**
   - 检查 **Always Use HTTPS** 是否启用
   - 如果启用，这会将 HTTP 重定向到 HTTPS（这是正确的）

### 方法6：清除 Cloudflare 缓存

修改配置后，清除缓存确保生效。

**步骤：**

1. **清除缓存**
   - 左侧菜单：**Caching** → **Configuration**
   - 点击 **Purge Everything** 清除所有缓存

2. **等待生效**
   - Cloudflare 更改通常几分钟内生效
   - 可以等待 5-10 分钟后测试

## 推荐的 Cloudflare 配置

### 正确的 Page Rule 配置（如果需要）

如果需要在 Cloudflare 层面设置 HTTP 到 HTTPS 重定向：

1. **创建 Page Rule**
   - **URL Pattern**: `http://icthelper.myftp.org/*`
   - **Setting 1**: `Forwarding URL`
     - **Status Code**: `301 - Permanent Redirect`
     - **Destination URL**: `https://icthelper.myftp.org/$1`

2. **确保 SSL/TLS 设置正确**
   - **SSL/TLS encryption mode**: `Full` 或 `Full (strict)`
   - **Always Use HTTPS**: 启用

### 不应该有的配置

- ❌ 重定向到 `http://59.148.148.76:5000`
- ❌ 重定向到任何 IP 地址
- ❌ Worker 或 Transform Rule 修改 Location 头指向 IP:5000

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

## 快速检查清单

在 Cloudflare 控制面板中检查：

- [ ] **Page Rules** - 是否有重定向到 IP:5000 的规则？
- [ ] **Workers** - 是否有 Worker 进行重定向？
- [ ] **Transform Rules** - 是否有规则修改 Location 头？
- [ ] **DNS** - A 记录是否正确？
- [ ] **SSL/TLS** - Always Use HTTPS 是否启用？
- [ ] **缓存** - 是否已清除缓存？

## 如果仍然无法解决

如果修改 Cloudflare 配置后仍然跳转到 IP:5000，可能是：

1. **服务器层面的配置** - 需要检查远程服务器（34.199.8.144）的 Apache 配置
2. **缓存未清除** - 等待更长时间或清除浏览器缓存
3. **其他中间件** - 可能有其他代理或负载均衡器在中间

