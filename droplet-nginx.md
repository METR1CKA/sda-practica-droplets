## INICIO

1. Actualizar los droplets

```bash
dnf update -y
```

2. Reiniciar

```bash
reboot
```

## AUMENTAR LA MEMORIA RAM

1. Apagar el droplet desde el panel de Digital Ocean

2. Aumentar la capacidad de memoria ram desde el panel de digital ocean

3. Encender el droplet

## CREACION DE USUARIOS

1. Crear usuarios en el droplet 3 para acceso a ssh, web e instalacion

```bash
# Crear el usuario
adduser {user}

# Asignar una contraseña al usuario creado
passwd {user}

# Cambiar al usuario creado para probar el acceso
su {user}
```

2. Agregar el usuario de instalacion al grupo wheel para acceso a sudo

```bash
# Opcional, agregar el usuario al grupo wheel para acceso a sudo
# wheel es el grupo que permite el acceso a sudo
# gpasswd es para agregar el usuario al grupo
# -a es para agregar
gpasswd -a {user} wheel

# Para eliminar el usuario del grupo wheel
gpasswd -d {user} wheel

# Opcional
# Asignar al usuario creado como propietario de su directorio en home, esto es opcional, se ejecuta como root antes de cambiar al usuario creado
chown -R {user}:{user} /home/{user}
```

## NGINX

1. Instalacion de nginx

```bash
# Instalar los prerequisitos de YUM
sudo yum install yum-utils

# Crear el archivo de repositorio de nginx
nano /etc/yum.repos.d/nginx.repo

# Agregar el contenido
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

# Actualizar los repositorios
sudo yum update -y

# Instalar nginx
sudo yum install nginx
```

2. Reiniciar y habilitar nginx

```bash
# Comprobar el estado del servicio
sudo systemctl status nginx
sudo service nginx status

# Iniciar el servicio
sudo systemctl start nginx
sudo service nginx start

# Habilitar el servicio para que inicie con el sistema
sudo systemctl enable nginx
sudo service nginx enable
```

3. Comprobar las conexiones

```bash
# Mostrar las conexiones
# -p muestra el proceso o PID y el nombre del programa al que pertenece cada conexión
# -t muestra la tabla de conexiones TCP
# -o muestra una columna de temporizadores
# -n muestra las direcciones IP y los números de puerto en lugar de los nombres de host y los servicios
sudo netstat -ptona

# Checar conexion de puerto en caso de cambiar el puerto de escucha
sudo netstat -tuln | grep {puerto}

# Cambiar el puerto de escucha de nginx
sudo semanage port -a -t http_port_t -p tcp {port}
```

4. Archivo de configuracion de nginx default.conf

- [/etc/nginx/conf.d/default.conf](./laravel.conf)

5. Reiniciar el servicio de nginx

```bash
# Reiniciar el servicio
sudo systemctl restart nginx
sudo service nginx restart

# Comprobar la configuracion de nginx
sudo nginx -t

# Recargar la configuracion de nginx
sudo nginx -s reload

# Agregar al usuario al grupo de nginx
sudo gpasswd -a {user} nginx
```

## PHP Y COMPOSER

1. Instalacion de PHP y Composer

```bash
# Actualizar los repositorios
sudo dnf update -y

# Instalar el repositorio de EPEL
sudo dnf install epel-release -y

# Agregar el repositorio de Remi
sudo dnf install dnf-utils http://rpms.remirepo.net/enterprise/remi-release-9.rpm -y

# Reiniciar la lista de modulos de PHP
sudo dnf module list reset php -y

# Habilitar el modulo de PHP en mi caso es 8.2
sudo dnf module enable php:remi-8.2

# Instalar PHP
sudo dnf install php php-common php-xml php-json curl unzip php-fpm php-mysqlnd php-opcache php-gd php-pgsql php-mbstring php-zip -y

# Actualizar la cache de los repositorios
sudo dnf makecache

# Descargar el instalador de composer
sudo curl -sS https://getcomposer.org/installer | php

# Mover el instalador a la carpeta de binarios
sudo mv composer.phar /usr/local/bin/composer

# Asignar permisos de ejecucion
sudo chmod +x /usr/local/bin/composer
```

2. Configuracion de PHP

```bash
# Editar el archivo de configuracion de PHP
/etc/php.ini
- date.timezone = America/Monterrey
- cgi.fix_pathinfo = 0
- expose_php = Off
# Opcional
- memory_limit = 256M
- upload_max_filesize = 5M

# Editar el archivo de configuracion de PHP-FPM
/etc/php-fpm.d/www.conf
- user = {user}
- group = nginx

- listen.owner = {user},nginx
- listen.group = nginx
- listen.mode = 0660

- security.limit_extensions = .php .php3 .php4 .php5 .php7

# Reiniciar el servicio de PHP-FPM
sudo systemctl start php-fpm

# Habilitar el servicio para que inicie con el sistema
sudo systemctl enable php-fpm
```

## LARAVEL

1. Configurar proyecto de Laravel

```bash
# Instalar node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

nvm ls-remote
nvm install {node-version}

source ~/.bashrc

# Clonar el repositorio de Laravel
sudo dnf install git unzip -y
git clone {repo}

# Crear el archivo .env en base a el archivo de .env.example añadiendo
APP_ENV=production
APP_URL=http://{ip}
ASSET_URL=http://{ip}

# Instalar las dependencias de composer
composer install

# Instalar las dependencias de node
npm install

# Borrar cache y generar key
php artisan optimize:clear
php artisan key:generate

# Construir los archivos de node
npm run build
```

2. Configurar permisos en el proyecto de Laravel

```bash
# Asignar permisos al usuario de nginx
sudo chmod 750 /home/{user}
sudo chown -R {user}:nginx /home/{user}

# Habilitar el acceso a la red para el usuario de nginx
sudo setsebool -P httpd_can_network_connect on

# Cambiar las etiquetas de SELinux
sudo chcon -R -t httpd_sys_rw_content_t /home/{user}/{project-laravel-folder}

# Reiniciar el servicio de nginx y php-fpm
sudo systemctl restart nginx
sudo systemctl restart php-fpm

# Cambiar el contexto de SELinux
sudo setenforce 1

# Cambiar los permisos del proyecto de laravel
sudo chmod -R 750 /home/{user}/{project-laravel-folder}
sudo chmod -R 770 /home/{user}/{project-laravel-folder}/storage
sudo chmod -R 770 /home/{user}/{project-laravel-folder}/bootstrap/cache
```

3. Comprobar logs

```bash
# Comprobar los logs de nginx
sudo tail -f /var/log/nginx/error.log

# Comprobar los logs de php-fpm
sudo tail -f /var/log/php-fpm/error.log

# Comprobar los logs journalctl
sudo journalctl -u nginx
sudo journalctl -u php-fpm
```
