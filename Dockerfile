# Use Node.js as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if present)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm@10.4.1

# Install the dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose the port that the application will use (e.g., 3000)
EXPOSE 3000

# Run the app in production mode (you can adjust this if needed)
CMD ["pnpm", "start:prod"]
