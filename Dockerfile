From node:18-alpine3.14

# Update system
RUN apk update

# Install unzip
RUN apk add unzip

# Install wget to downoad mini-api-gateway
RUN apk add  wget

# Create folder if not exists
RUN mkdir -p /app
RUN mkdir -p /tmp

# Download mini-api-gateway and unzip it
WORKDIR /tmp

RUN wget https://github.com/AZIRARM/mini-api-gateway/archive/refs/tags/0.0.1.zip -P /tmp/
RUN unzip 0.0.1.zip -d /app
RUN rm -f 0.0.1.zip

RUN mv /app/mini-api-gateway-0.0.1 /app/mini-api-gateway

WORKDIR /app/mini-api-gateway


#Build application
RUN npm install

#Expose port
expose 9000

#Run
CMD [ "node", "/app/mini-api-gateway/server.js" ]