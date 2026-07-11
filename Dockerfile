# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm i

# Copy all files
COPY . .

# Pass environment variables to the build process
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

ARG VITE_BASE44_APP_ID
ENV VITE_BASE44_APP_ID=$VITE_BASE44_APP_ID

ARG VITE_BASE44_APP_BASE_URL
ENV VITE_BASE44_APP_BASE_URL=$VITE_BASE44_APP_BASE_URL

ARG VITE_SITE_KEY
ENV VITE_SITE_KEY=$VITE_SITE_KEY

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]