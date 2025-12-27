#!/bin/bash

echo "========================================"
echo "  DSE SQL 訓練營 - Linux 啟動腳本"
echo "========================================"
echo ""

# 檢查Python是否安裝
if ! command -v python3 &> /dev/null; then
    echo "[錯誤] 未檢測到Python，請先安裝Python 3.7+"
    echo "安裝命令: sudo apt-get install python3 python3-pip"
    exit 1
fi

echo "[1/5] 檢查依賴包..."
if ! python3 -c "import flask" 2>/dev/null; then
    echo "[提示] 正在安裝依賴包..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "[錯誤] 依賴包安裝失敗"
        echo "請嘗試: pip3 install --user -r requirements.txt"
        exit 1
    fi
fi

echo "[2/5] 檢查配置文件..."
if [ ! -f "config.py" ]; then
    echo "[錯誤] 未找到config.py文件"
    exit 1
fi

if grep -q "YOUR_API_KEY" config.py; then
    echo "[警告] 請在config.py中設置您的API密鑰！"
    echo ""
fi

echo "[3/5] 檢查端口占用..."
# 檢查5000端口
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "[警告] 端口5000已被占用，嘗試停止現有進程..."
    pkill -f "python.*app.py" 2>/dev/null
    sleep 2
fi


echo "[4/5] 啟動完整後端服務 (端口5000)..."
echo "  後端服務將同時提供:"
echo "  - 靜態文件服務（HTML, JS, CSS等）"
echo "  - AI助手API接口"
echo "  - 健康檢查接口"
python3 app.py > backend.log 2>&1 &
BACKEND_PID=$!
sleep 4

# 檢查後端是否啟動成功
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "[錯誤] 後端服務啟動失敗，請查看backend.log"
    cat backend.log
    exit 1
fi

# 測試後端服務是否正常響應
echo "[5/5] 驗證服務狀態..."
sleep 2
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "  ✓ 後端服務健康檢查通過"
else
    echo "  ⚠️  後端服務可能未完全啟動，請稍候..."
    sleep 2
fi

echo ""
echo "========================================"
echo "  服務啟動成功！"
echo "========================================"
echo ""
echo "完整服務地址: http://localhost:5000"
echo ""
echo "主要頁面:"
echo "  - 首頁: http://localhost:5000/index.html"
echo "  - SQL練習: http://localhost:5000/practice.html"
echo "  - Python中心: http://localhost:5000/python-center.html"
echo "  - 互動練習: http://localhost:5000/interactive.html"
echo "  - 學習進度: http://localhost:5000/progress.html"
echo "  - 用戶中心: http://localhost:5000/user-system.html"
echo ""
echo "API接口:"
echo "  - 健康檢查: http://localhost:5000/health"
echo "  - AI聊天: http://localhost:5000/api/chat"
echo ""
echo "後端進程ID: $BACKEND_PID"
echo ""
echo "日誌文件: backend.log"
echo ""
echo "停止服務: 按 Ctrl+C 或運行 ./stop-linux.sh"
echo ""

# 創建停止腳本
cat > stop-linux.sh << 'EOF'
#!/bin/bash
echo "正在停止服務..."
pkill -f "python.*app.py"
echo "服務已停止"
EOF
chmod +x stop-linux.sh

# 等待用戶中斷
trap "echo ''; echo '正在停止服務...'; kill $BACKEND_PID 2>/dev/null; pkill -f 'python.*app.py' 2>/dev/null; echo '服務已停止'; exit" INT TERM

# 顯示實時日誌
echo "========================================"
echo "  實時日誌 (按 Ctrl+C 停止)"
echo "========================================"
echo ""

tail -f backend.log frontend.log 2>/dev/null &
TAIL_PID=$!

wait

