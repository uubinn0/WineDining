FROM nginx:1.26-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /etc/letsencrypt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]