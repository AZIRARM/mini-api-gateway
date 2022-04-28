[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](./license.md)

# mini-api-gateway
Minimal Api Gateway very easy to use

# Settings
## Configuration
```
[
  {
    "apiName": "UsersApi",
    "apiUrl": "http://192.168.0.12:8080/users",
    "apiDescription": "Api to manage Users",
    "apiVersion": "0.0.1",
    "authenticationType": "api-key",
    "authenticationSecret": "TEST-SECRET-TO-GENERATE",
  }
]

```

I.E : <i>In apiUrl you need to set ip adress of your service, not localhost or 127.0.0.1 (only if your service is runing in same container that mini-api-gateway).</i>

Because localhost/127.0.0.1 correspond to internal adess of your container.


You can declare as many APIs as you want.
Each API has its own access configuration, two types: token, api-key, generated or filled in by you (example when launching the docker container if you decide to embed this code in a docker).

Each API has routes, each route is characterized by the HTTP method, its path, its content type, whether or not it has a body... .

The routes of each api do not need to be configured, the gateway takes the headers, the body, the parameters from the client calling mini-api-gateway.

## Server parameters
you can change the server port by setting the environment variable: GATEWAY_PORT

# How to use

### token

Today two authentication : token (in query param of url) and by api-key (in the headers of the request)

```
curl --location --request GET 'http://localhost:3000?api=UsersApi&path=/&token=TEST-SECRET-TO-GENERATE'
```

### api-key
```
curl --location --request GET 'http://localhost:3000?api=UsersApi&path=/' \
--header 'api-key: TEST-SECRET-TO-GENERATE'
```

<<<<<<< HEAD
# Docker container
You can find an image on docker hub.

## Configuration
3000 is the default port you can change it by setting environment variable <b>GATEWAY_PORT</b>.

* You need in this version to set a volume (-v option) this volume.<br>
* You must declare a volume that points to folder that contains the configuration file of your api gateway.<br>
* This obligation will only be of short duration, a feature being tested to integrate management via a web dashboard.
However, this volume will always be recommended so as not to lose your configuration.<br>
=======
### In docker
```
FROM ubuntu:latest
RUN apt-get update
#RUN apt-get upgrade
RUN apt-get install unzip -y

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_17.x | bash
RUN apt-get install --yes nodejs
RUN apt-get install --yes npm
>>>>>>> origin/develop


# Install wget to downoad mini-api-gateway
RUN apt-get install --yes wget

# Install check dependencies installed
RUN node -v
RUN npm -v
RUN npm i -g nodemon
RUN nodemon -v

# Create folder if not exists
RUN mkdir -p /app
RUN mkdir -p /tmp

# Download mini-api-gateway and unzip it
WORKDIR /tmp
RUN wget https://github.com/AZIRARM/mini-api-gateway/archive/refs/tags/0.0.1.zip -P /tmp/
RUN unzip 0.0.1.zip -d /app
RUN rm -f 0.0.1.zip


WORKDIR /app/mini-api-gateway-0.0.1

#Copy your configuration
COPY confs/settings.json /app/mini-api-gateway-0.0.1/confs/settings.json


#Build application
RUN npm install

#Set default port
ENV GATEWAY_PORT 10900

#Expose port
expose 10900

#Run
CMD [ "node", "/app/mini-api-gateway-0.0.1/server.js" ]

```
