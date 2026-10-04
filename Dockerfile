FROM node:22-alpine
WORKDIR /app
COPY . .
# runtime state (db.json, owner credentials) lives on a volume; robots.json stays in the image
ENV PORT=8787 AGON_DATA_DIR=/state
VOLUME /state
EXPOSE 8787
CMD ["node", "server.js"]
