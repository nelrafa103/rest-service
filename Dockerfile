FROM node:18

WORKDIR /app

EXPOSE 8080

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


CMD ["npm","run", "start:dev", "--host", "0.0.0.0", "--port", "8080"]

