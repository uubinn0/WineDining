FROM nginx:alpine
ARG IMAGE_TAG=latest
COPY --from=rlatmddbsk75/winedining-frontend:${IMAGE_TAG} /usr/share/nginx/html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
#COPY nginx.conf /etc/nginx/conf.d/nginx.conf
RUN mkdir -p /etc/letsencrypt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]