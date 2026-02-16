FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA + data mount
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Data directory where capabilities.json will be mounted
RUN mkdir -p /data

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
