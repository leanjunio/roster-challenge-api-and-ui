# Dockerfile
FROM node:18-alpine

RUN npm install -g pnpm
RUN npm install -g vercel

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN pnpm install

RUN mkdir api

# Copy the rest of the api app
COPY . .

# Expose port and start application
EXPOSE 8000

ARG VERCEL_TOKEN

ENV VERCEL_TOKEN=$VERCEL_TOKEN

# vercel dev --token {{ token }} --yes --listen 8000 --cwd ./packages 
CMD ["sh", "-c", "vercel dev --token ${VERCEL_TOKEN} --yes --listen 8000"]
