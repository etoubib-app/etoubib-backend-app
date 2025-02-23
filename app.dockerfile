# Use Node.js as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package.json pnpm-lock.yaml scripts ./

# Install make and bash
RUN apk add --no-cache make bash

# Install development dependencies
RUN npm install -g pnpm@10.4.1

# Install the dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the NestJS source code
COPY . .

# Copy .env.example and rename it as .env
COPY .env.example .env

# List the files in the /app directory to check what was copied
RUN ls -al /app

# Expose the port the app runs on
EXPOSE 3000

# Run the app in development mode
CMD ["npm", "run", "start:dev"]