# Dockerfile
FROM node:18-alpine

# Install PostgreSQL client for development
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["sh", "-c", "chown -R node:node /app && npm run dev -- --host --watch"]
