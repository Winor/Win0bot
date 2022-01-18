FROM node:16-alpine
WORKDIR /app
RUN apk add ffmpeg python2 --no-cache --update
ADD ./ ./
RUN echo 'DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_URL}:${POSTGRESQL_PORT_NUMBER}/mydb?schema=public"' > .env
RUN npm install --also="dev"
RUN npm run build
CMD "npm" "run" "helm-start"