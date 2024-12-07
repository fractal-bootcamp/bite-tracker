FROM node:20-slim

# Set working directory
WORKDIR /app

# Install OpenSSL - required for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Install dependencies including TypeScript
RUN npm install
RUN npm install -g typescript@5.7.2

# Copy TypeScript config first
COPY tsconfig.json ./
RUN echo "=== TypeScript Config ===" && \
    cat tsconfig.json

# Copy prisma schema
COPY migrations ./migrations
COPY schema.prisma ./

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Show directory contents before build
RUN echo "=== Directory contents before build ===" && \
    ls -la

# Build TypeScript
RUN echo "=== Starting TypeScript build ===" && \
    tsc --version && \
    tsc && \
    echo "=== Directory contents after build ===" && \
    ls -la dist

# Expose the port your app runs on
EXPOSE 4000

# Command to run migrations and start the server
CMD npx prisma migrate deploy && npx prisma generate && node dist/index.js
