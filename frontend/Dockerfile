FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code to the container
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js image for serving
FROM node:18-alpine

WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=build /app/dist /app/dist

# Expose port 3001 (or any port you prefer)
EXPOSE 3001

# Start serve on port 3001
CMD ["serve", "-s", "dist", "-l", "3001"]