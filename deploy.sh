#!/usr/bin/env bash
# ============================================
# Agro360 - Deployment Helper Script
# ============================================
# Usage:
#   ./deploy.sh local       # Run locally with Docker Compose
#   ./deploy.sh build       # Build Docker images only
#   ./deploy.sh stop        # Stop all services
#   ./deploy.sh logs        # View logs
#   ./deploy.sh health      # Check service health
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log()   { echo -e "${GREEN}[AGRO360]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check prerequisites
check_prereqs() {
    log "Checking prerequisites..."
    command -v docker >/dev/null 2>&1 || error "Docker is not installed. Install from https://docs.docker.com/get-docker/"
    command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || error "Docker Compose is not installed."
    
    if [ ! -f backend/.env ]; then
        warn "backend/.env not found. Copying from .env.example..."
        cp backend/.env.example backend/.env
        warn "Please edit backend/.env with your actual credentials before deploying!"
    fi
    
    log "All prerequisites met."
}

# Build images
build() {
    log "Building Docker images..."
    docker compose build --no-cache
    log "Build complete!"
}

# Start services locally
start_local() {
    check_prereqs
    log "Starting Agro360 with Docker Compose..."
    docker compose up -d --build
    
    log "Waiting for services to become healthy..."
    sleep 10
    
    health_check
    
    echo ""
    log "==================================="
    log "  Agro360 is running!"
    log "  Frontend: http://localhost"
    log "  Backend:  http://localhost:5001"
    log "  API Health: http://localhost:5001/api/health"
    log "==================================="
}

# Stop services
stop() {
    log "Stopping Agro360..."
    docker compose down
    log "Services stopped."
}

# View logs
logs() {
    docker compose logs -f --tail=100
}

# Health check
health_check() {
    log "Running health checks..."
    
    # Backend
    if curl -sf http://localhost:5001/api/health > /dev/null 2>&1; then
        log "Backend: ${GREEN}HEALTHY${NC}"
    else
        warn "Backend: NOT READY (may still be starting)"
    fi
    
    # Frontend
    if curl -sf http://localhost/ > /dev/null 2>&1; then
        log "Frontend: ${GREEN}HEALTHY${NC}"
    else
        warn "Frontend: NOT READY (may still be starting)"
    fi
}

# Main
case "${1:-help}" in
    local|start)
        start_local
        ;;
    build)
        check_prereqs
        build
        ;;
    stop)
        stop
        ;;
    logs)
        logs
        ;;
    health)
        health_check
        ;;
    *)
        echo "Usage: $0 {local|build|stop|logs|health}"
        echo ""
        echo "Commands:"
        echo "  local   - Build and start all services with Docker Compose"
        echo "  build   - Build Docker images only"
        echo "  stop    - Stop all running services"
        echo "  logs    - Tail logs from all services"
        echo "  health  - Check health of running services"
        ;;
esac
