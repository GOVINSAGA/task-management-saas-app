FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose API port
EXPOSE 5002

# Start the server
CMD ["node", "server.js"]
