# ==========================
# Stage 1: Build React App
# ==========================
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the React application
RUN npm run build

# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:stable-alpine

# Copy build output to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]