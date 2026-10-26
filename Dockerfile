FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npx", "nest", "start", "ai-trading-backend" ]