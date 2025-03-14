#Imagen base con Node.js y Typescript
FROM node:22-alpine 

RUN apk add --no-cache docker-cli

#Directorio de trabajo en el contenedor
WORKDIR /app
#Copiamos solo package.json y package-lock.json para optimizar el cache
COPY package*.json ./
#Instalacion de dependencias
RUN npm ci
COPY . .
CMD ["npm", "start"]
