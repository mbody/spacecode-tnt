# use the alpine version to reduce size
FROM node:25-alpine

#Install codelab as it will not be install by default
WORKDIR /usr/src/app/codelab

COPY codelab/package*.json ./

#Install codelab modules
RUN rm -rf node_modules
RUN npm install

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN rm -rf node_modules
RUN npm install

# Bundle app source
COPY . .

EXPOSE 80

CMD npm start
