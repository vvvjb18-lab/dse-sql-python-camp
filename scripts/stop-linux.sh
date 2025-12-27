#!/bin/bash
echo "正在停止服務..."
pkill -f "python.*app.py"
echo "服務已停止"
