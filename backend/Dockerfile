# backend/Dockerfile
FROM node:18-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy init script first and set permissions
COPY init-db.sh .
RUN chmod +x init-db.sh

# Copy the rest of the files
COPY . .

# Start the application with the init script
CMD /bin/sh -c "./init-db.sh && npm start"
