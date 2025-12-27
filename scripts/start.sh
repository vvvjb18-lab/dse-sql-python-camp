#!/bin/bash

echo "========================================"
echo "  DSE SQL 訓練營 - 啟動腳本"
echo "========================================"
echo ""

# 檢查Python是否安裝
if ! command -v python3 &> /dev/null; then
    echo "[錯誤] 未檢測到Python，請先安裝Python 3.7+"
    exit 1
fi

echo "[1/4] 檢查依賴包..."
if ! python3 -c "import flask" 2>/dev/null; then
    echo "[提示] 正在安裝依賴包..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "[錯誤] 依賴包安裝失敗"
        exit 1
    fi
fi

echo "[2/4] 檢查配置文件..."
if [ ! -f "config.py" ]; then
    echo "[錯誤] 未找到config.py文件"
    exit 1
fi

if grep -q "YOUR_API_KEY" config.py; then
    echo "[警告] 請在config.py中設置您的API密鑰！"
    echo ""
fi

echo "[3/4] 啟動後端服務 (端口5000)..."
python3 app.py &
BACKEND_PID=$!
sleep 3

echo "[4/4] 啟動前端服務 (端口8000)..."
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  服務啟動成功！"
echo "========================================"
echo ""
echo "後端服務: http://localhost:5000"
echo "前端服務: http://localhost:8000"
echo ""
echo "請在瀏覽器中打開:"
echo "  http://localhost:8000/index.html"
echo ""
echo "按 Ctrl+C 停止服務"
echo ""

# 等待用戶中斷
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

