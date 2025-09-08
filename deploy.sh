#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
    exit 1
fi

echo "📋 Using environment file: $ENV_FILE"

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
if docker build -t $IMAGE_NAME . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Error: Failed to build Docker image${NC}"
    exit 1
fi

# Run the container with port mapping
echo "🚀 Starting container..."
if docker run -d \
    --name $CONTAINER_NAME \
    --env-file "$ENV_FILE" \
    -p $PORT:$PORT \
    $IMAGE_NAME > /dev/null; then
    
    echo -e "${GREEN}✅ Success! Nano Banana is running${NC}"
    echo ""
    echo "🌐 Access your app at: http://localhost:$PORT"
    echo "📋 Container name: $CONTAINER_NAME"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker logs $CONTAINER_NAME"
    echo "  Follow logs:  docker logs -f $CONTAINER_NAME"
    echo "  Stop app:     docker stop $CONTAINER_NAME"
    echo ""
else
    echo -e "${RED}❌ Error: Failed to start container${NC}"
    exit 1
fi