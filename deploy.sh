#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="nano-banana"
CONTAINER_NAME="nano-banana-app"
PORT=7429

echo "🍌 Nano Banana Deployment Script"
echo "================================="

# Pull latest changes from git
echo "📥 Pulling latest changes from git..."
if git pull > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Successfully pulled latest changes${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Failed to pull from git${NC}"
fi

# Find environment file
ENV_FILE=""
if [ -f ".env" ]; then
    ENV_FILE=".env"
elif [ -f ".env.local" ]; then
    ENV_FILE=".env.local"
else
    echo -e "${RED}❌ Error: No environment file found!${NC}"
    echo "Please create .env file with your GEMINI_API_KEY"
    echo "Optionally add DISCORD_WEBHOOK_URL for Discord logging"
    exit 1
fi

echo "📋 Using environment file: $ENV_FILE"

# Check environment file content
if grep -q "GEMINI_API_KEY" "$ENV_FILE"; then
    echo -e "${GREEN}✅ GEMINI_API_KEY found in $ENV_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: GEMINI_API_KEY not found in $ENV_FILE${NC}"
fi

if grep -q "DISCORD_WEBHOOK_URL" "$ENV_FILE"; then
    echo -e "${GREEN}✅ DISCORD_WEBHOOK_URL found in $ENV_FILE (Discord logging enabled)${NC}"
else
    echo -e "${BLUE}ℹ️  DISCORD_WEBHOOK_URL not found in $ENV_FILE (Discord logging disabled)${NC}"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    exit 1
fi

# Stop and remove existing container
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME > /dev/null
fi

if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
    echo "🗑️  Removing existing container..."
    docker rm $CONTAINER_NAME > /dev/null
fi

# Build the Docker image
echo "🔨 Building Docker image..."
if docker build -t $IMAGE_NAME . 2>&1 | grep -E "(ERROR|error)" > /dev/null; then
    echo -e "${RED}❌ Error building Docker image:${NC}"
    docker build -t $IMAGE_NAME .
    exit 1
else
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
fi

# Run the container with port mapping
echo "🚀 Starting container..."
if docker run -d \
    --name $CONTAINER_NAME \
    --env-file "$ENV_FILE" \
    -p $PORT:$PORT \
    $IMAGE_NAME > /dev/null; then
    
    echo -e "${GREEN}✅ Container started${NC}"
    
    # Give the container a moment to start
    echo "⏳ Waiting for application to start..."
    sleep 3
    
    # Debug information
    echo -e "\n${BLUE}🔍 Container Status:${NC}"
    docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo -e "\n${BLUE}📋 Container Logs:${NC}"
    docker logs $CONTAINER_NAME --tail 20
    
    echo -e "\n${BLUE}🌐 Environment Variables Check:${NC}"
    docker exec $CONTAINER_NAME printenv | grep -E "(PORT|GEMINI_API_KEY|DISCORD_WEBHOOK_URL)" || echo "No relevant env vars found"
    
    echo -e "\n${BLUE}🔌 Port Check:${NC}"
    if docker exec $CONTAINER_NAME sh -c "command -v netstat" > /dev/null 2>&1; then
        docker exec $CONTAINER_NAME netstat -tlnp 2>/dev/null | grep $PORT || echo "Port $PORT not listening inside container"
    else
        echo "netstat not available, checking if process is running..."
        docker exec $CONTAINER_NAME ps aux | grep -E "(bun|node|index)" || echo "No bun/node process found"
    fi
    
    # Test the connection
    echo -e "\n${BLUE}🧪 Testing Connection:${NC}"
    sleep 2
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200\|404\|500"; then
        echo -e "${GREEN}✅ App is responding on port $PORT${NC}"
    else
        echo -e "${YELLOW}⚠️  App not responding on port $PORT${NC}"
        echo "This might be normal if your app takes time to start or doesn't have a root route"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo ""
    echo "🌐 Access your app at: http://localhost:$PORT"
    echo "📋 Container name: $CONTAINER_NAME"
    echo ""
    echo "Useful commands:"
    echo "  View logs:         docker logs $CONTAINER_NAME"
    echo "  Follow logs:       docker logs -f $CONTAINER_NAME"
    echo "  Stop app:          docker stop $CONTAINER_NAME"
    echo "  Restart app:       docker restart $CONTAINER_NAME"
    echo "  Shell into app:    docker exec -it $CONTAINER_NAME sh"
    echo "  Check processes:   docker exec $CONTAINER_NAME ps aux"
    echo ""
    
    # Final port reminder
    DOCKER_PORT=$(docker port $CONTAINER_NAME 2>/dev/null | grep $PORT | cut -d: -f2)
    if [ ! -z "$DOCKER_PORT" ]; then
        echo -e "${GREEN}✅ Port mapping confirmed: localhost:$DOCKER_PORT -> container:$PORT${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Could not confirm port mapping${NC}"
    fi
    
else
    echo -e "${RED}❌ Error: Failed to start container${NC}"
    echo "Container logs:"
    docker logs $CONTAINER_NAME 2>/dev/null || echo "No logs available"
    exit 1
fi