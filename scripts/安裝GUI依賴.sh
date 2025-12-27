#!/bin/bash
# 快速安裝 GUI 依賴（Ubuntu/Debian）

echo "正在安裝 python3-tk（需要輸入密碼）..."
sudo apt-get update
sudo apt-get install -y python3-tk

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 安裝成功！"
    echo "現在可以雙擊桌面圖標啟動 GUI 服務管理器了"
else
    echo ""
    echo "✗ 安裝失敗，請手動運行："
    echo "sudo apt-get install python3-tk"
fi

