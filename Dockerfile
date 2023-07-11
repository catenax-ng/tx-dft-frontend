
# => Build container
FROM node:18.12.1-alpine3.15 as builder

WORKDIR /app

COPY ./package.json .

COPY .env . 

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx

FROM nginxinc/nginx-unprivileged:1.25.1-perl

ARG USERNAME=webuser
ARG USER_UID=1002
ARG USER_GID=$USER_UID

# Create the user

RUN useradd -rm -d /home/sdeuser -s /bin/bash -u $USER_UID  -r -U $USERNAME 

# Nginx config
RUN rm -rf /etc/nginx/conf.d

COPY ./conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

USER webuser

WORKDIR /usr/share/nginx/html

COPY ./env.sh .

EXPOSE 8080

# Start Nginx server

#CMD ["nginx", "-g", "daemon off;"]

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]