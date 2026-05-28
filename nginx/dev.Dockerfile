FROM nginx:1.29.0-alpine3.22 AS server

#RUN mkdir -p /etc/nginx && chmod 755 /etc/nginx
COPY ./nginx/dev.nginx.conf /etc/nginx/nginx.conf

EXPOSE 54110

CMD ["nginx", "-g", "daemon off;"]
