FROM node:20-alpine

WORKDIR /app

# Copy package.json first
COPY package.json ./

# Attempt to copy package-lock.json if it exists, but don't fail if it doesn't
COPY package-lock.json* ./

# Use legacy-peer-deps to ignore conflicts if any
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
