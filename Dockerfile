FROM node:14.18.0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build

# start app
CMD ["node", "server.js"]