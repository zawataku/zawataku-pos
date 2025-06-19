FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000
RUN npx prisma generate
CMD ["npm", "run", "dev"]