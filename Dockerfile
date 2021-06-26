FROM node:14
WORKDIR /app
RUN apt update || : && apt install ffmpeg -y
ADD ./dist ./
COPY package.json ./
RUN npm install
CMD [ "node", "index.js" ]