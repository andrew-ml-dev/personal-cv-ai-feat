FROM node:20-alpine AS builder

ARG VITE_BACKEND_URL=http://backend:8000
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

WORKDIR /app

# Only copy the manifest first to take advantage of cached npm installs
COPY package*.json ./
RUN npm ci

# Copy the rest of the source and build the Vite app
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

# Use nginx to serve the built static assets
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
