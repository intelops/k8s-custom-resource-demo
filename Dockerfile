# build environment
FROM node:18.12-alpine as builder
WORKDIR /app
COPY . .
RUN npm install -g npm@latest && npm install --production=false && \
    npm run build && \
    rm -rf src/ && \
    rm -rf manifests && \
    rm -rf node_modules && \
    npm install

# production environment
FROM node:18.12-alpine
WORKDIR /server
COPY --from=builder /app/dist /server/dist
COPY --from=builder /app/node_modules /server/node_modules

ENV NODE_ENV=production
EXPOSE 5000
CMD [ "node", "dist/app.js" ]