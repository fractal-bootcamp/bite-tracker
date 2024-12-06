FROM oven/bun:1.0.15

WORKDIR /app

# Context: This Dockerfile should be built from the root directory with:
# docker build -f backend/Dockerfile ./backend

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the backend application
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "index.ts"] 