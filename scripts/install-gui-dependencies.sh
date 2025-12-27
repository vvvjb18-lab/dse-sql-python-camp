#!/bin/bash
# 安裝 GUI 服務管理器所需的依賴

echo "========================================"
echo "  安裝 GUI 服務管理器依賴"
echo "========================================"
echo ""

# 檢測 Linux 發行版
if [ -f /etc/debian_version ]; then
    echo "[檢測] Debian/Ubuntu 系統"
    echo "[安裝] python3-tk..."
    sudo apt-get update
    sudo apt-get install -y python3-tk
elif [ -f /etc/redhat-release ]; then
    echo "[檢測] RedHat/Fedora 系統"
    echo "[安裝] python3-tkinter..."
    sudo dnf install -y python3-tkinter
elif [ -f /etc/arch-release ]; then
    echo "[檢測] Arch Linux 系統"
    echo "[安裝] tk..."
    sudo pacman -S --noconfirm tk
else
    echo "[警告] 無法自動檢測系統類型"
    echo "請手動安裝 Tkinter："
    echo "  - Ubuntu/Debian: sudo apt-get install python3-tk"
    echo "  - Fedora/RHEL: sudo dnf install python3-tkinter"
    echo "  - Arch Linux: sudo pacman -S tk"
    exit 1
fi

echo ""
echo "========================================"
echo "  驗證安裝"
echo "========================================"

python3 -c "import tkinter; print('✓ Tkinter 已成功安裝')" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✓ 安裝完成！"
    echo "========================================"
    echo ""
    echo "現在可以運行服務管理器："
    echo "  python3 service-manager.py"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  ✗ 安裝失敗"
    echo "========================================"
    echo "請檢查錯誤信息並手動安裝"
    exit 1
fi

