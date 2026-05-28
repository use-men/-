#!/bin/bash
set -e

echo "=== 学生点名系统部署脚本 ==="

# 1. 安装 Docker
if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo systemctl enable docker
    sudo systemctl start docker
fi

# 2. 安装 Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo "安装 Docker Compose..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

# 3. 克隆或更新代码
if [ -d "/opt/roll-call" ]; then
    echo "更新代码..."
    cd /opt/roll-call
    git pull origin main
else
    echo "克隆代码..."
    sudo git clone https://github.com/use-men/-.git /opt/roll-call
    cd /opt/roll-call
    sudo git submodule update --init --recursive
fi

# 4. 创建环境变量文件
if [ ! -f ".env" ]; then
    echo "创建 .env 文件..."
    cat > .env << 'EOF'
DB_PASSWORD=root123
DB_NAME=roll_call
EOF
fi

# 5. 启动服务
echo "启动 Docker 服务..."
sudo docker compose down
sudo docker compose up -d --build

# 6. 等待 MySQL 就绪
echo "等待 MySQL 启动..."
sleep 15

# 7. 检查服务状态
echo "=== 服务状态 ==="
sudo docker compose ps

echo ""
echo "=== 部署完成 ==="
echo "前端访问: http://$(hostname -I | awk '{print $1}')"
echo "后端API: http://$(hostname -I | awk '{print $1}'):3001"
