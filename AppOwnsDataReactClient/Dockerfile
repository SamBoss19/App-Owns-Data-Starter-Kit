# ---- Build stage (compile the TypeScript/React bundle with webpack) ----
FROM node:18-alpine AS build
WORKDIR /src
COPY AppOwnsDataReactClient/package.json AppOwnsDataReactClient/npm-shrinkwrap.json ./
RUN npm install
COPY AppOwnsDataReactClient/ ./
RUN npm run build      # webpack emits wwwroot/index.html + wwwroot/js/bundle.js

# ---- Runtime stage (serve the static SPA with nginx) ----
FROM nginx:alpine AS final
COPY AppOwnsDataReactClient/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/wwwroot /usr/share/nginx/html
EXPOSE 5000
