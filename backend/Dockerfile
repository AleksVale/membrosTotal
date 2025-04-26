FROM node:22-slim

WORKDIR /app

# Install OpenSSL as suggested by Prisma error message
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

# Copy .env file first (if it exists)
COPY .env* ./

# Copy the rest of the application
COPY . .

# Make sure the .env file is properly used
RUN if [ -f .env ]; then echo ".env file found"; else echo "No .env file found - using environment variables"; fi

RUN npm run build

EXPOSE 4520

# Print environment variables for debugging (you can remove this in production)
CMD ["sh", "-c", "echo 'DATABASE_URL=' $DATABASE_URL && echo '.env file contents:' && cat .env 2>/dev/null || echo 'No .env file' && npm run migrate:deploy && npx prisma db seed && npm run start:prod"]