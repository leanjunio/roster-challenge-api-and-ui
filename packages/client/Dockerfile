# Dockerfile
FROM node:18-alpine as build

RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the client app
COPY . .

RUN pnpm run build

FROM nginx:stable-alpine as production

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port and start application
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
