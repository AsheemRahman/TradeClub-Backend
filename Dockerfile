# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start app
CMD ["npm", "start"]