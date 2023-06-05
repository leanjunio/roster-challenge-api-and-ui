# Dockerfile
FROM node:18-alpine

RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the api app
COPY . .

# Expose port and start application
EXPOSE 8080

CMD ["pnpm", "run", "start"]