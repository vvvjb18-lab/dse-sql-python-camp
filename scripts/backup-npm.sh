#!/bin/bash
# NPM 配置备份脚本
# 用于备份 Nginx Proxy Manager 的所有配置数据

set -e  # 遇到错误立即退出

# 配置变量
BACKUP_DIR="/home/yivh/backups/npm"
SOURCE_DIR="/home/yivh/nginx-proxy-manager"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/npm_backup_$TIMESTAMP.tar.gz"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "NPM 配置备份脚本"
echo "=========================================="
echo ""

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ 错误：源目录不存在: $SOURCE_DIR${NC}"
    exit 1
fi

# 创建备份目录
mkdir -p "$BACKUP_DIR"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 错误：无法创建备份目录: $BACKUP_DIR${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 开始备份 NPM 配置...${NC}"
echo "源目录: $SOURCE_DIR"
echo "备份文件: $BACKUP_FILE"
echo ""

# 执行备份
tar -czf "$BACKUP_FILE" -C "$(dirname $SOURCE_DIR)" "$(basename $SOURCE_DIR)" 2>/dev/null

if [ $? -eq 0 ]; then
    # 获取备份文件大小
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo -e "${GREEN}✅ 备份完成！${NC}"
    echo ""
    echo "备份文件: $BACKUP_FILE"
    echo "文件大小: $BACKUP_SIZE"
    echo ""
    
    # 列出最近的备份文件
    echo "最近的备份文件："
    ls -lht "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -5 | awk '{print $9, "(" $5 ")"}'
    
    # 清理旧备份（保留最近10个）
    echo ""
    echo -e "${YELLOW}🧹 清理旧备份（保留最近10个）...${NC}"
    cd "$BACKUP_DIR"
    ls -t *.tar.gz 2>/dev/null | tail -n +11 | xargs -r rm -f
    echo -e "${GREEN}✅ 清理完成${NC}"
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}备份成功完成！${NC}"
    echo "=========================================="
else
    echo -e "${RED}❌ 备份失败！${NC}"
    exit 1
fi

