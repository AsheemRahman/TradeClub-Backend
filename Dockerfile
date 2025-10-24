# Base image
FROM node:alpine

# Install ffmpeg (includes ffprobe)
RUN apk update && apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript (creates the 'dist' folder)
RUN npm run build

# Expose port
EXPOSE 8080

# Start app
CMD ["npm", "start"]