FROM node:16-alpine
WORKDIR /app
RUN apk add ffmpeg python3 chromium nss freetype harfbuzz ca-certificates ttf-freefont yarn --no-cache --update
RUN ln -s /usr/bin/python3 /usr/bin/python
ADD ./ ./
RUN echo 'DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_URL}:${POSTGRESQL_PORT_NUMBER}/mydb?schema=public"' > .env

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -S pptruser && adduser -S -G pptruser win0bot \
    && mkdir -p /home/win0bot/Downloads /app \
    && chown -R win0bot:pptruser /home/win0bot \
    && chown -R win0bot:pptruser /app

USER win0bot

RUN npm install --also="dev"
RUN npm run build
CMD "npm" "run" "helm-start"