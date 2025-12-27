#!/bin/bash
# 自動配置防火牆以允許公網訪問

echo "========================================"
echo "  配置防火牆以允許公網訪問"
echo "========================================"
echo ""

PORT=5000

# 檢測防火牆類型並配置
if command -v ufw > /dev/null; then
    echo "[檢測] UFW 防火牆"
    echo "[配置] 開放端口 $PORT..."
    
    sudo ufw allow $PORT/tcp
    sudo ufw reload
    
    echo ""
    echo "✓ 已配置 UFW 防火牆"
    echo "  查看狀態: sudo ufw status"
    
elif command -v firewall-cmd > /dev/null; then
    echo "[檢測] firewalld 防火牆"
    echo "[配置] 開放端口 $PORT..."
    
    sudo firewall-cmd --add-port=$PORT/tcp --permanent
    sudo firewall-cmd --reload
    
    echo ""
    echo "✓ 已配置 firewalld 防火牆"
    echo "  查看狀態: sudo firewall-cmd --list-ports"
    
elif command -v iptables > /dev/null; then
    echo "[檢測] iptables 防火牆"
    echo "[配置] 開放端口 $PORT..."
    
    sudo iptables -I INPUT -p tcp --dport $PORT -j ACCEPT
    sudo iptables-save > /dev/null 2>&1 || echo "注意：需要手動保存 iptables 規則"
    
    echo ""
    echo "✓ 已配置 iptables 防火牆"
    echo "  注意：重啟後規則可能丟失，建議使用 ufw 或 firewalld"
    
else
    echo "⚠️  無法自動檢測防火牆類型"
    echo ""
    echo "請手動配置防火牆："
    echo ""
    echo "UFW:"
    echo "  sudo ufw allow $PORT/tcp"
    echo ""
    echo "firewalld:"
    echo "  sudo firewall-cmd --add-port=$PORT/tcp --permanent"
    echo "  sudo firewall-cmd --reload"
    echo ""
    echo "iptables:"
    echo "  sudo iptables -I INPUT -p tcp --dport $PORT -j ACCEPT"
    exit 1
fi

echo ""
echo "========================================"
echo "  配置完成"
echo "========================================"
echo ""
echo "請確保："
echo "1. 服務正在運行: python3 app.py"
echo "2. 路由器端口映射已配置"
echo "3. 測試訪問: http://59.148.148.76:$PORT/health"
echo ""

