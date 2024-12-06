FROM oven/bun:1.0.15

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install



# Copy schema.prisma and generate client
COPY schema.prisma ./
COPY migrations ./migrations

# Generate Prisma client using direct path
RUN ./node_modules/.bin/prisma generate

# Copy the rest of the backend application
COPY . .

# Expose the port your app runs on
EXPOSE 3000
RUN echo "=== Node Modules ==="

RUN echo $(ls -la) || true
RUN echo $(ls -la node_modules/.prisma) || true
RUN echo $(ls -la node_modules/.prisma/client) || true

# Start the application
CMD ./node_modules/.bin/prisma generate && bun run index.ts 