# CLOUDFLARE SSL

1. Crear cuenta en Cloudflare

- [Crear cuenta](https://www.cloudflare.com/)

2. Tener un dominio ya comprado

3. Agregar el dominio a Cloudflare -> add site

3.1 Irse a SSL/TLS

3.2 Poner el modo de SSL en Full (strict)

3.3 Irse a origin server -> authenticated origin pulls

3.4 Crear un certificado en origin server -> create certificate

3.5 Generar certificado con RSA 2048 y listar los dominios (\*.dominio y dominio)

3.6 Copiar las claves PEM y PRIVATE KEY y guardarlas

- [SSL NGINX](../configs/nginx/ssl.conf)
