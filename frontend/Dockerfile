FROM node:18-alpine

WORKDIR /app

# Copy package.json first
COPY package.json ./

# Attempt to copy package-lock.json if it exists, but don't fail if it doesn't
COPY package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
 Hartman
