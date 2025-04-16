FROM node:22-slim

WORKDIR /app

# Install OpenSSL as suggested by Prisma error message
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4520

CMD ["sh", "-c", "npm run migrate:deploy && npx prisma db seed &&npm run start:prod"]