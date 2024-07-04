# CLOUDFLARE SSL

1. Crear cuenta en Cloudflare

- [Crear cuenta](https://www.cloudflare.com/)

2. Tener un dominio ya comprado

3. Agregar el dominio a Cloudflare -> add site

4. Copiar los server names a los DNS de tu dominio

4.1 Irse a SSL/TLS

4.2 Poner el modo de SSL en Full (strict)

4.3 Irse a origin server -> authenticated origin pulls

4.4 Crear un certificado en origin server -> create certificate

4.5 Generar certificado con RSA 2048 y listar los dominios (\*.dominio y dominio)

4.6 Copiar las claves PEM y PRIVATE KEY y guardarlas

- [SSL NGINX](../configs/nginx/ssl.conf)
