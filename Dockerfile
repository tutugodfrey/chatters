# Node base image
FROM node:alpine

# Set work directory
WORKDIR /app

COPY . /app
RUN npm install

# copy source image after npm install
# COPY . /app

# Arguments
# ARG DATABASE_URL mongodb://127.0.0.1:27017/chatter
ARG DATABASE_URL=supplyatruntime
# ARG TEST_DATABASE_URL=mongodb://127.0.0.1:27017/chatter-test
ARG TEST_DATABASE_URL=supplyatruntime
ARG JWT_SECRET=supplyatruntine
ARG ADMIN_PASS=supplyatruntime
ARG ADMIN_EMAIL=teststutug@yahoo.com
ARG ADMIN_USERNAME=supplyatruntime
ARG ADMIN_NAME=supplyatruntime
ARG APP_PORT=8000

# env variables
ENV DATABASE_URL ${DATABASE_URL}
ENV TEST_DATABASE_URL ${TEST_DATABASE_URL}
ENV JWT_SECRET ${JWT_SECRET}
ENV ADMIN_PASS ${ADMIN_PASS}
ENV ADMIN_EMAIL ${ADMIN_EMAIL}
ENV ADMIN_USERNAME ${ADMIN_USERNAME}
ENV ADMIN_NAME ${ADMIN_NAME}
ENV APP_PORT ${APP_PORT}

LABEL maintainer=godfrey_tutu@yahoo.com
# provision volue for the
## Seed database with admin user
# RUN npm run seed

# export port for listening
EXPOSE $APP_PORT

# start the application
CMD ["npm", "start"]
