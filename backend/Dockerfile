FROM oven/bun:1.0.15

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy schema.prisma and generate client
COPY schema.prisma ./
COPY migrations ./migrations

# Generate Prisma client with explicit output
ENV PRISMA_GENERATE_DATAPROXY=false
RUN mkdir -p /app/node_modules/.prisma/client
RUN bunx prisma generate

# Copy the rest of the backend application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application with Prisma generate
CMD bunx prisma generate && bun run index.ts 