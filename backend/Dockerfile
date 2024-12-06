FROM oven/bun:1.0.15

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
RUN echo "=== After copying package files ===" && ls -la

# Install dependencies
RUN bun install
RUN echo "=== After installing dependencies ===" && ls -la && echo "=== Node Modules ===" && ls -la node_modules/.prisma || true

# Copy schema.prisma and generate client
COPY schema.prisma ./
COPY migrations ./migrations
RUN echo "=== After copying Prisma files ===" && ls -la && echo "=== Migrations ===" && ls -la migrations

# Generate Prisma client with explicit output
ENV PRISMA_GENERATE_DATAPROXY=false
RUN mkdir -p /app/node_modules/.prisma/client
RUN bunx prisma generate
RUN echo "=== After generating Prisma client ===" && ls -la && echo "=== Prisma Client ===" && ls -la node_modules/.prisma/client || true

# Copy the rest of the backend application
COPY . .
RUN echo "=== Final directory structure ===" && ls -la && echo "=== Final Prisma Client ===" && ls -la node_modules/.prisma/client || true

# Expose the port your app runs on
EXPOSE 3000

# Start the application with Prisma generate
CMD echo "=== Runtime directory check ===" && ls -la && \
    echo "=== Runtime Prisma client check ===" && ls -la node_modules/.prisma/client || true && \
    bunx prisma generate && \
    echo "=== After runtime generation ===" && ls -la node_modules/.prisma/client || true && \
    bun run index.ts 