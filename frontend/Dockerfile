FROM node:20-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start application in development mode for live reloading
CMD ["npm", "run", "dev"]
