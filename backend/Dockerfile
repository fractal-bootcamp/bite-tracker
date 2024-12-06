# FROM oven/bun:1.0.15

# WORKDIR /app

# # Copy package files
# COPY package.json bun.lockb ./

# # Install dependencies
# RUN bun install



# # Copy schema.prisma and generate client
# COPY schema.prisma ./
# COPY migrations ./migrations

# # Generate Prisma client using direct path
# RUN bunx prisma generate

# # Copy the rest of the backend application
# COPY . .

# # Expose the port your app runs on
# EXPOSE 3000
# RUN echo "=== Node Modules ==="

# RUN echo $(ls -la) || true
# RUN echo $(ls -la node_modules/.prisma) || true
# RUN echo $(ls -la node_modules/.prisma/client) || true

# # Start the application
# CMD ./node_modules/.bin/prisma generate && bun run index.ts 
# Use Node.js LTS (Long Term Support) version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install OpenSSL - required for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install module-alias

# Copy prisma schema
COPY migrations ./migrations

COPY schema.prisma ./

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Add module-alias import to the built index.js
RUN sed -i '1i require("module-alias/register");' dist/index.js

# Expose the port your app runs on
EXPOSE 4000

# Command to run migrations and start the server
CMD npx prisma migrate deploy && npx prisma generate && npm start
