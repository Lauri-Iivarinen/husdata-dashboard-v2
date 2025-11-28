FROM node:22.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#CMD ["npm", "start"]

#COPY build ./
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]