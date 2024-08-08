FROM node:18-alpine
WORKDIR /app

# Install necessary tools
RUN apk add --no-cache postgresql-client

# Copy package files
COPY sod-t3/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY sod-t3 .

# Make sure the script is executable
RUN chmod +x /app/start-dev.sh

EXPOSE 3000
CMD ["/bin/sh", "/app/start-dev.sh"]
