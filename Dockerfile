FROM node:20
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install --production
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "pm2-runtime", "ecosystem.config.js" ]
