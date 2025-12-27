#!/bin/bash
# SSL 证书检查脚本
# 用于检查 icthelper.duckdns.org 的证书状态

DOMAIN="icthelper.duckdns.org"
CERT_PATH="$HOME/.acme.sh/${DOMAIN}_ecc"

echo "=========================================="
echo "SSL 证书状态检查 - $DOMAIN"
echo "=========================================="
echo ""

# 检查证书文件是否存在
if [ -d "$CERT_PATH" ]; then
    echo "✅ 证书目录存在: $CERT_PATH"
else
    echo "❌ 证书目录不存在: $CERT_PATH"
    exit 1
fi

# 检查证书文件
if [ -f "$CERT_PATH/${DOMAIN}.cer" ]; then
    echo "✅ 证书文件存在: ${DOMAIN}.cer"
else
    echo "❌ 证书文件不存在: ${DOMAIN}.cer"
    exit 1
fi

if [ -f "$CERT_PATH/${DOMAIN}.key" ]; then
    echo "✅ 私钥文件存在: ${DOMAIN}.key"
else
    echo "❌ 私钥文件不存在: ${DOMAIN}.key"
    exit 1
fi

echo ""
echo "----------------------------------------"
echo "证书详细信息"
echo "----------------------------------------"

# 显示证书有效期
echo ""
echo "📅 证书有效期："
openssl x509 -in "$CERT_PATH/${DOMAIN}.cer" -noout -dates 2>/dev/null || echo "⚠️  无法读取证书信息"

# 计算剩余天数
CERT_END_DATE=$(openssl x509 -in "$CERT_PATH/${DOMAIN}.cer" -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$CERT_END_DATE" ]; then
    CERT_END_EPOCH=$(date -d "$CERT_END_DATE" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$CERT_END_DATE" +%s 2>/dev/null)
    CURRENT_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($CERT_END_EPOCH - $CURRENT_EPOCH) / 86400 ))
    
    echo ""
    if [ $DAYS_LEFT -gt 30 ]; then
        echo "✅ 证书剩余有效期: $DAYS_LEFT 天"
    elif [ $DAYS_LEFT -gt 0 ]; then
        echo "⚠️  证书剩余有效期: $DAYS_LEFT 天（建议准备续期）"
    else
        echo "❌ 证书已过期！请立即续期！"
    fi
fi

# 显示证书主题
echo ""
echo "📋 证书信息："
openssl x509 -in "$CERT_PATH/${DOMAIN}.cer" -noout -subject -issuer 2>/dev/null || echo "⚠️  无法读取证书信息"

# 测试 HTTPS 连接
echo ""
echo "----------------------------------------"
echo "HTTPS 连接测试"
echo "----------------------------------------"
echo ""

if curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "https://$DOMAIN" > /dev/null 2>&1; then
    echo "✅ HTTPS 访问正常"
    
    # 检查证书链
    echo ""
    echo "🔗 证书链验证："
    if echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | grep -q "Verify return code: 0"; then
        echo "✅ 证书链验证通过"
    else
        echo "⚠️  证书链验证失败"
    fi
else
    echo "❌ HTTPS 访问失败"
fi

# 显示 acme.sh 信息
echo ""
echo "----------------------------------------"
echo "acme.sh 信息"
echo "----------------------------------------"
echo ""

if command -v acme.sh >/dev/null 2>&1; then
    echo "✅ acme.sh 已安装"
    acme.sh --info -d "$DOMAIN" 2>/dev/null || echo "⚠️  无法获取 acme.sh 信息"
else
    echo "⚠️  acme.sh 未找到"
fi

# 检查续期任务
echo ""
echo "----------------------------------------"
echo "自动续期任务"
echo "----------------------------------------"
echo ""

if crontab -l 2>/dev/null | grep -q "acme.sh.*$DOMAIN"; then
    echo "✅ 自动续期任务已设置"
    echo ""
    echo "续期任务："
    crontab -l 2>/dev/null | grep "acme.sh.*$DOMAIN"
else
    echo "⚠️  未找到自动续期任务"
fi

echo ""
echo "=========================================="
echo "检查完成"
echo "=========================================="
echo ""
echo "💡 提示："
echo "   - 证书通常在到期前 60 天自动续期"
echo "   - 续期后需要手动更新到 NPM"
echo "   - 建议每 30 天检查一次证书状态"
echo ""

