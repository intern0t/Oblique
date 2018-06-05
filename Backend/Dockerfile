FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1338
CMD [ "npm", "start" ]
