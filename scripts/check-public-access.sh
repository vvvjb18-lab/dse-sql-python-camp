#!/bin/bash
# 公網訪問診斷腳本

echo "========================================"
echo "  公網訪問診斷工具"
echo "========================================"
echo ""

# 獲取內網 IP
LOCAL_IP=$(hostname -I | awk '{print $1}')
PUBLIC_IP="59.148.148.76"
PORT=5000

echo "📋 基本信息："
echo "  公網 IP: $PUBLIC_IP"
echo "  內網 IP: $LOCAL_IP"
echo "  服務端口: $PORT"
echo ""

# 1. 檢查服務是否運行
echo "🔍 [1/6] 檢查服務狀態..."
if ps aux | grep -E "python.*app.py" | grep -v grep > /dev/null; then
    PID=$(ps aux | grep -E "python.*app.py" | grep -v grep | awk '{print $2}')
    echo "  ✓ 服務正在運行 (PID: $PID)"
else
    echo "  ✗ 服務未運行"
    echo "  請先啟動服務: python3 app.py"
    exit 1
fi

# 2. 檢查端口監聽
echo ""
echo "🔍 [2/6] 檢查端口監聽..."
if ss -tlnp 2>/dev/null | grep ":$PORT " > /dev/null || netstat -tlnp 2>/dev/null | grep ":$PORT " > /dev/null; then
    LISTEN_INFO=$(ss -tlnp 2>/dev/null | grep ":$PORT " || netstat -tlnp 2>/dev/null | grep ":$PORT ")
    echo "  ✓ 端口 $PORT 正在監聽"
    echo "  $LISTEN_INFO"
    
    # 檢查是否監聽在 0.0.0.0
    if echo "$LISTEN_INFO" | grep "0.0.0.0:$PORT" > /dev/null; then
        echo "  ✓ 服務監聽在 0.0.0.0（正確配置）"
    else
        echo "  ⚠️  警告：服務可能只監聽在 localhost，無法從外網訪問"
    fi
else
    echo "  ✗ 端口 $PORT 未監聽"
    exit 1
fi

# 3. 檢查本地連接
echo ""
echo "🔍 [3/6] 測試本地連接..."
if curl -s http://localhost:$PORT/health > /dev/null 2>&1 || python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:$PORT/health', timeout=2)" 2>/dev/null; then
    echo "  ✓ 本地連接正常"
else
    echo "  ✗ 本地連接失敗"
    echo "  請檢查服務是否正常啟動"
fi

# 4. 檢查內網連接
echo ""
echo "🔍 [4/6] 測試內網連接..."
if curl -s http://$LOCAL_IP:$PORT/health > /dev/null 2>&1 || python3 -c "import urllib.request; urllib.request.urlopen('http://$LOCAL_IP:$PORT/health', timeout=2)" 2>/dev/null; then
    echo "  ✓ 內網連接正常 ($LOCAL_IP:$PORT)"
else
    echo "  ⚠️  內網連接失敗，但這可能是正常的（取決於網絡配置）"
fi

# 5. 檢查防火牆
echo ""
echo "🔍 [5/6] 檢查防火牆狀態..."
if command -v ufw > /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | head -1)
    echo "  UFW 狀態: $UFW_STATUS"
    if echo "$UFW_STATUS" | grep -i "active" > /dev/null; then
        if sudo ufw status | grep "$PORT" > /dev/null; then
            echo "  ✓ 端口 $PORT 已在防火牆規則中"
        else
            echo "  ⚠️  端口 $PORT 可能被防火牆阻止"
            echo "  建議運行: sudo ufw allow $PORT/tcp"
        fi
    fi
elif command -v firewall-cmd > /dev/null; then
    echo "  檢測到 firewalld"
    if sudo firewall-cmd --list-ports 2>/dev/null | grep "$PORT" > /dev/null; then
        echo "  ✓ 端口 $PORT 已開放"
    else
        echo "  ⚠️  端口 $PORT 可能被防火牆阻止"
        echo "  建議運行: sudo firewall-cmd --add-port=$PORT/tcp --permanent && sudo firewall-cmd --reload"
    fi
else
    echo "  ⚠️  無法自動檢測防火牆類型"
    echo "  請手動檢查 iptables 或防火牆設置"
fi

# 6. 檢查端口映射
echo ""
echo "🔍 [6/6] 端口映射檢查..."
echo "  請確認路由器/防火牆配置："
echo "  - 外部端口: $PORT"
echo "  - 內部 IP: $LOCAL_IP"
echo "  - 內部端口: $PORT"
echo "  - 協議: TCP"
echo ""

# 測試公網連接（如果可能）
echo "🌐 測試公網連接..."
echo "  嘗試從外部訪問: http://$PUBLIC_IP:$PORT/health"
echo ""

# 總結
echo "========================================"
echo "  診斷總結"
echo "========================================"
echo ""
echo "✓ 如果服務運行正常，但仍無法從公網訪問，請檢查："
echo ""
echo "1. 路由器端口映射配置："
echo "   外部端口 $PORT → 內部 $LOCAL_IP:$PORT (TCP)"
echo ""
echo "2. 防火牆規則："
echo "   sudo ufw allow $PORT/tcp"
echo "   或"
echo "   sudo firewall-cmd --add-port=$PORT/tcp --permanent"
echo ""
echo "3. 服務提供商防火牆："
echo "   某些 ISP 可能阻止入站連接"
echo "   請聯繫服務提供商確認"
echo ""
echo "4. 測試命令："
echo "   從外部網絡訪問: curl http://$PUBLIC_IP:$PORT/health"
echo "   或使用在線工具: https://www.yougetsignal.com/tools/open-ports/"
echo ""
echo "5. 檢查服務監聽地址："
echo "   確保 app.py 中 host='0.0.0.0'（不是 '127.0.0.1'）"
echo ""

