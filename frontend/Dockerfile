# Use Node 22.19.0 Alpine for smaller image size
FROM node:22.19.0-alpine

# Install required packages and Bun
RUN apk add --no-cache curl bash unzip
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies (including dev dependencies for build)
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 3002

# Start the application
CMD ["bun", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3002"]
