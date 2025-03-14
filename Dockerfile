FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Debug file structure
RUN ls -la && \
    ls -la routes/ && \
    ls -la controllers/ && \
    ls -la models/ && \
    ls -la utils/

# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app
USER nodeuser

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "server.js"]