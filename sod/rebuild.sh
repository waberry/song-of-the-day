#!/bin/bash

# Set strict mode


# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
handle_error() {
    log "Error occurred in line $1"
    exit 1
}

# Set up error handling
trap 'handle_error $LINENO' ERR

# Ensure script is run as root
if [ "$(id -u)" != "0" ]; then
   log "This script must be run as root" 1>&2
   exit 1
fi

log "Stopping and removing Docker containers, networks, and volumes..."
docker-compose down -v || { log "Failed to stop Docker containers"; exit 1; }

log "Pruning Docker system..."
docker system prune -af --volumes || { log "Failed to prune Docker system"; exit 1; }

log "Building Docker images..."
docker-compose build || { log "Failed to build Docker images"; exit 1; }

log "Starting Docker containers..."
docker-compose up -d || { log "Failed to start Docker containers"; exit 1; }

log "Docker environment setup complete."