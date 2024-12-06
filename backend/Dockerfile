FROM oven/bun:1.0.15

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy schema.prisma first (it's in the root of backend, not in a prisma directory)
COPY schema.prisma ./

# Generate Prisma client
RUN bunx prisma generate

# Copy the rest of the backend application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "index.ts"] 