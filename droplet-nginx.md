## INICIO

1. Actualizar los droplets

```bash
dnf update
```

2. Reiniciar

```bash
reboot
```

3. Instalar nano vim y net-tools

```bash
dnf install nano vim net-tools -y
```

4. Actualizar despues de instalar

```bash
dnf update -y && dnf upgrade -y
```

## PUERTOS

1. Editar el archivo `/etc/ssh/sshd_config`

```bash
nano /etc/ssh/sshd_config
```

2. Cambiar el puerto de escucha del ssh para el droplet 3

```bash
Port 44114
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

## CONFIGURACION DE CARPETA .SSH Y ACCESO SSH ENTRE DROPLETS

1. Crear carpeta .ssh y archivo authorized_keys en ambos droplets despues de haber creado el usuario

```bash
# Puedes crear la carpeta de .ssh para el usuario creado en cualquier directorio, siempre y cuando sea dentro del directorio home del usuario
# Por default puedes crear solamente: ~/.ssh
# Por ejemplo: ~/.profile/.ssh o ~/.config/.ssh
# cd $_ es para cambiar al ultimo directorio creado

# Opcional
mkdir ~/{carpeta}
cd $_

mkdir .ssh
cd $_

# Crear el archivo authorized_keys y pegar el contenido de la llave publica del droplet 1 con la que se conectara el cliente SSH (OpenSSH) con el usuario recien creado
nano authorized_keys

# Asignar permisos para el directorio y el archivo
chmod 700 -R ~/{ruta_.ssh}
chmod 600 ~/{ruta_.ssh}/authorized_keys
```

2. configurar el `sshd_config` del droplet 3 para el acceso a los usuarios desde el cliente SSH (OpenSSH)

```bash
AddressFamily inet
PermitRootLogin no
AllowUsers {user}@{ip_droplet_1}
MaxAuthTries 3
MaxSessions 3

# Default: /home/{user}/.ssh/authorized_keys
# Por ejemplo: /home/{user}/.profile/.ssh/authorized_keys o /home/{user}/.config/.ssh/authorized_keys
AuthorizedKeysFile /home/{user}/{ruta_ssh}/authorized_keys
```

3. Reiniciar el servicio ssh

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
```

4. Archivo de configuracion de nginx default.conf

```nginx
[/etc/nginx/conf.d/default.conf](./default.conf)
```

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
-
# Instalar el repositorio de EPEL
sudo dnf install epel-release -y

# Agregar el repositorio de Remi
sudo dnf install dnf-utils http://rpms.remirepo.net/enterprise/remi-release-9.rpm -y

# Reiniciar la lista de modulos de PHP
sudo dnf module list reset php -y

# Habilitar el modulo de PHP en mi caso es 8.2
sudo dnf module enable php:remi-8.2

# Instalar PHP
sudo dnf install php php-common php-xml php-json curl unzip php-fpm php-mysqlnd php-opcache php-gd  php-mbstring php-zip -y

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
- memory_limit = 512M
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
