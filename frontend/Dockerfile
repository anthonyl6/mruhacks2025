# Use Node 22.19.0 Alpine for smaller image size
FROM node:22.19.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies (including dev dependencies for build)
RUN yarn install

# Copy source code
COPY . .

# # Build the application
# RUN yarn build

# Expose port
EXPOSE 3002

# Start the application
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "3002"]
