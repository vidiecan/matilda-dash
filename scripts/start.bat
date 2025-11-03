@echo off
docker run --rm -it --name matilda-dash-server -p 8081:80 -v "%cd%/../:/usr/share/nginx/html:ro" nginx:alpine
pause