#!/bin/bash

# Create necessary directories
mkdir -p server/controllers server/models server/routes server/middleware server/utils server/config
mkdir -p client/src/components client/src/pages client/src/context client/src/services client/public

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Create .env files
cd ../server
cp .env.example .env
cd ../client
cp .env.example .env

echo "Project initialization complete! Please update the .env files with your credentials." 