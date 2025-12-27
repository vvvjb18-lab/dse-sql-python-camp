#!/bin/bash
# NPM 配置恢复脚本
# 用于从备份恢复 Nginx Proxy Manager 的配置数据

set -e  # 遇到错误立即退出

# 配置变量
BACKUP_DIR="/home/yivh/backups/npm"
TARGET_DIR="/home/yivh/nginx-proxy-manager"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "NPM 配置恢复脚本"
echo "=========================================="
echo ""

# 检查备份目录
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ 错误：备份目录不存在: $BACKUP_DIR${NC}"
    exit 1
fi

# 列出可用的备份文件
echo "可用的备份文件："
echo ""
BACKUP_FILES=($(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null))
if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    echo -e "${RED}❌ 错误：未找到备份文件${NC}"
    exit 1
fi

for i in "${!BACKUP_FILES[@]}"; do
    FILE_SIZE=$(du -h "${BACKUP_FILES[$i]}" | cut -f1)
    FILE_DATE=$(stat -c %y "${BACKUP_FILES[$i]}" | cut -d' ' -f1)
    echo "  [$((i+1))] $(basename "${BACKUP_FILES[$i]}") ($FILE_SIZE, $FILE_DATE)"
done

echo ""
read -p "请选择要恢复的备份文件编号 (1-${#BACKUP_FILES[@]}): " SELECTION

if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUP_FILES[@]} ]; then
    echo -e "${RED}❌ 错误：无效的选择${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUP_FILES[$((SELECTION-1))]}"

echo ""
echo -e "${YELLOW}⚠️  警告：此操作将覆盖现有的 NPM 配置！${NC}"
echo "备份文件: $(basename "$SELECTED_BACKUP")"
echo "目标目录: $TARGET_DIR"
echo ""
read -p "确认要继续吗？(yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "操作已取消"
    exit 0
fi

# 停止 NPM 容器（如果正在运行）
echo ""
echo -e "${YELLOW}🛑 停止 NPM 容器...${NC}"
if sudo docker ps | grep -q " npm "; then
    sudo docker stop npm
    echo -e "${GREEN}✅ 容器已停止${NC}"
else
    echo "容器未运行，跳过"
fi

# 备份当前配置（以防万一）
if [ -d "$TARGET_DIR" ]; then
    CURRENT_BACKUP="$BACKUP_DIR/current_before_restore_$(date +%Y%m%d_%H%M%S).tar.gz"
    echo ""
    echo -e "${YELLOW}💾 备份当前配置...${NC}"
    tar -czf "$CURRENT_BACKUP" -C "$(dirname $TARGET_DIR)" "$(basename $TARGET_DIR)" 2>/dev/null
    echo -e "${GREEN}✅ 当前配置已备份到: $(basename "$CURRENT_BACKUP")${NC}"
fi

# 恢复备份
echo ""
echo -e "${YELLOW}📦 恢复备份文件...${NC}"
mkdir -p "$(dirname $TARGET_DIR)"
tar -xzf "$SELECTED_BACKUP" -C "$(dirname $TARGET_DIR)"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 恢复完成！${NC}"
    echo ""
    echo "已恢复的目录: $TARGET_DIR"
    echo ""
    echo -e "${YELLOW}💡 提示：请重新启动 NPM 容器${NC}"
    echo "运行命令:"
    echo "sudo docker run -d \\"
    echo "  --name=npm \\"
    echo "  --restart=unless-stopped \\"
    echo "  --network=host \\"
    echo "  -v /home/yivh/nginx-proxy-manager/data:/data \\"
    echo "  -v /home/yivh/nginx-proxy-manager/letsencrypt:/etc/letsencrypt \\"
    echo "  jc21/nginx-proxy-manager:latest"
    echo ""
    echo "=========================================="
    echo -e "${GREEN}恢复成功完成！${NC}"
    echo "=========================================="
else
    echo -e "${RED}❌ 恢复失败！${NC}"
    exit 1
fi

