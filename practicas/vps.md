# Actualizar sistema y creación de usuario

## 1. Actualizar el sistema

sudo dnf update

## 2. Crear un usuario

adduser user
passwd user

## 3. Agregar usuario al grupo sudo

usermod -aG wheel user

# Instalación de herramientas esenciales

## Instalar nano y net-tools

dnf install nano
sudo dnf install net-tools

# Configuración de puertos estándar

- **Puerto estándar**: 62623
- **Formato de fecha**: m-d-y
- **Rango de puertos permitidos**: 1024 a 65535

# Configuración del firewall del sistema

## Instalación y habilitación del firewall

sudo dnf install firewalld -y
firewall-cmd --state
sudo systemctl enable firewalld
sudo systemctl start firewalld

## Verificación del firewall

sudo firewall-cmd --list-all

# Creación de claves SSH (Pública y Privada) en PuttyGen

## Guardar información en Dropbox

### Instrucciones para crear y reemplazar las claves SSH en el servidor como usuario

cd
mkdir -p .ssh
cd .ssh/

cat authorized_keys

# Pegar el contenido de la clave pública generada en PuttyGen

## Asignar permisos para creación de claves SSH

chmod -R go= ~/.ssh

# Guardar claves en Pageant

# Configuración de SELinux para el puerto SSH

- Añadir puerto a SELinux:

```bash
semanage port -a -t ssh_port_t -p tcp 2222
```

# Configuración de SSH en el servidor

## Editar archivo de configuración de SSH

nano /etc/ssh/sshd_config

### Parámetros recomendados:

- Port (Número de puerto a utilizar)
- AddressFamily inet

### Configuración de logs:

- SyslogFacility AUTH
- LogLevel INFO

### Autenticación:

- LoginGraceTime 2m
- PermitRootLogin yes
- StrictModes yes
- MaxAuthTries 3
- MaxSessions 4

### Claves públicas y autenticación de usuario:

- PubkeyAuthentication yes
- AuthorizedKeysFile .ssh/authorized_keys
- AllowUsers user

### Para deshabilitar autenticación mediante contraseña:

- PasswordAuthentication no
- PermitEmptyPasswords no

## Reiniciar el servicio SSH para aplicar cambios

service sshd restart

## Verificar puertos activos

netstat -ptona

# Configuración avanzada del firewall

## Eliminar servicios por defecto en el firewall

sudo firewall-cmd --zone=public --remove-service=cockpit --permanent
sudo firewall-cmd --zone=public --remove-service=ssh --permanent
sudo firewall-cmd --zone=public --remove-service=dhcpv6-client --permanent

## Añadir puertos y servicios necesarios

sudo firewall-cmd --zone=public --add-port=52263/tcp --permanent
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent

## Verificar y recargar la configuración del firewall

firewall-cmd --state
sudo firewall-cmd --list-all
sudo firewall-cmd --reload
sudo firewall-cmd --list-all

# Instalación y configuración de NGINX

## Documentación para instalar NGINX en Rocky Linux:

https://nginx.org/en/linux_packages.html#RHEL

## Agregar repositorios y actualizar NGINX

sudo yum install yum-utils
nano /etc/yum.repos.d/nginx.repo

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

## Habilitar el repositorio principal y proceder con la instalación de NGINX

sudo yum-config-manager --enable nginx-mainline
sudo yum install nginx

## Habilitar y arrancar el servicio de NGINX

systemctl enable nginx # Para iniciar en cada reinicio
systemctl start nginx

# Instalación de paquetes adicionales

## Git

dnf install git

## Node.js

# Usar uno de los siguientes comandos según la versión deseada:

# curl -fsSL https://rpm.nodesource.com/setup_noversion.x | bash -

# curl -fsSL https://rpm.nodesource.com/setup_14.x | bash -

# Repositorio y configuración para Node.js v18

sudo yum install https://rpm.nodesource.com/pub_18.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
sudo yum install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1

# Configuración de Fail2Ban para proteger SSH

## Documentación de referencia:

https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-rocky-linux-8

## Instalación de Fail2Ban y configuración de servicio

sudo dnf install epel-release -y
sudo dnf install fail2ban -y
systemctl enable fail2ban.service
systemctl start fail2ban.service

## Configuración de Fail2Ban en archivo local

cd /etc/fail2ban
sudo cp jail.conf jail.local
cd jail.d
nano sshd.conf

### Configuraciones recomendadas:

[sshd]
enabled = true
filter = sshd
port = (puerto SSH configurado)
bantime = 21600 # Tiempo de bloqueo en segundos
maxretry = 3 # Intentos máximos permitidos
ignoreip = 127.0.0.1 # Ignorar IP de localhost
logpath = /var/log/auth.log

## Comandos para verificar estado y servicio de Fail2Ban

fail2ban-client status sshd
fail2ban-client status
service fail2ban status
service fail2ban restart

## Desbloquear IP específica

sudo fail2ban-client set sshd unbanip (dirección IP remota)

# Configuración de SSH en el servidor

## Editar archivo de configuración de SSH

nano /etc/ssh/sshd_config

### Parámetros recomendados:

- Port (Número de puerto a utilizar)
- AddressFamily inet

### Configuración de logs:

- SyslogFacility AUTH
- LogLevel INFO

### Autenticación:

- LoginGraceTime 2m
- PermitRootLogin yes
- StrictModes yes
- MaxAuthTries 3
- MaxSessions 4

### Claves públicas y autenticación de usuario:

- PubkeyAuthentication yes
- AuthorizedKeysFile .ssh/authorized_keys
- AllowUsers user

### Para deshabilitar autenticación mediante contraseña:

- PasswordAuthentication no
- PermitEmptyPasswords no

## Reiniciar el servicio SSH para aplicar cambios

service sshd restart

## Verificar puertos activos

netstat -ptona

# Configuración avanzada del firewall

## Eliminar servicios por defecto en el firewall

sudo firewall-cmd --zone=public --remove-service=cockpit --permanent
sudo firewall-cmd --zone=public --remove-service=ssh --permanent
sudo firewall-cmd --zone=public --remove-service=dhcpv6-client --permanent

## Añadir puertos y servicios necesarios

sudo firewall-cmd --zone=public --add-port=52263/tcp --permanent
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent

## Verificar y recargar la configuración del firewall

firewall-cmd --state
sudo firewall-cmd --list-all
sudo firewall-cmd --reload
sudo firewall-cmd --list-all

# Instalación y configuración de NGINX

## Documentación para instalar NGINX en Rocky Linux:

https://nginx.org/en/linux_packages.html#RHEL

## Agregar repositorios y actualizar NGINX

sudo yum install yum-utils
nano /etc/yum.repos.d/nginx.repo

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

## Habilitar el repositorio principal y proceder con la instalación de NGINX

sudo yum-config-manager --enable nginx-mainline
sudo yum install nginx

## Habilitar y arrancar el servicio de NGINX

systemctl enable nginx # Para iniciar en cada reinicio
systemctl start nginx

# Instalación de paquetes adicionales

## Git

dnf install git

## Node.js

# Usar uno de los siguientes comandos según la versión deseada:

# curl -fsSL https://rpm.nodesource.com/setup_noversion.x | bash -

# curl -fsSL https://rpm.nodesource.com/setup_14.x | bash -

# Repositorio y configuración para Node.js v18

sudo yum install https://rpm.nodesource.com/pub_18.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
sudo yum install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1

# Configuración de Fail2Ban para proteger SSH

## Documentación de referencia:

https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-rocky-linux-8

## Instalación de Fail2Ban y configuración de servicio

sudo dnf install epel-release -y
sudo dnf install fail2ban -y
systemctl enable fail2ban.service
systemctl start fail2ban.service

## Configuración de Fail2Ban en archivo local

cd /etc/fail2ban
sudo cp jail.conf jail.local
cd jail.d
nano sshd.conf

### Configuraciones recomendadas:

[sshd]
enabled = true
filter = sshd
port = (puerto SSH configurado)
bantime = 21600 # Tiempo de bloqueo en segundos
maxretry = 3 # Intentos máximos permitidos
ignoreip = 127.0.0.1 # Ignorar IP de localhost
logpath = /var/log/auth.log

## Comandos para verificar estado y servicio de Fail2Ban

fail2ban-client status sshd
fail2ban-client status
service fail2ban status
service fail2ban restart

## Desbloquear IP específica

sudo fail2ban-client set sshd unbanip (dirección IP remota)

---

Esto cubre las secciones de configuración SSH, firewall avanzado, NGINX, y protección de SSH con Fail2Ban. Indícame cuando quieras que continúe con el siguiente bloque.

Dijiste:
Pasame otros 100
ChatGPT dijo:
ChatGPT
Aquí tienes el siguiente bloque de 100 líneas mejor organizado:

txt
Copiar código

# Agregar usuario al grupo de NGINX

usermod -aG nginx user

# Instalación de PM2 para manejo de procesos de Node.js

## Instalar PM2 globalmente como root

npm install pm2@latest -g

# Instalación de Certbot para certificados SSL

## 1. Instalar snapd

sudo dnf install epel-release
sudo dnf upgrade
sudo yum install snapd
systemctl enable --now snapd.socket
ln -s /var/lib/snapd/snap /snap

## 2. Configurar e instalar Certbot con Snap

snap install core
snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
snap set certbot trust-plugin-with-root=ok

## 3. Instalar plugin DNS para Cloudflare y crear archivo de configuración de token

snap install certbot-dns-cloudflare
mkdir -p .secrets/certbot
cd .secrets/certbot
nano init-cloudflare.ini

### Agregar al archivo `init-cloudflare.ini`:

dns_cloudflare_api_token = token

### Asegurar permisos de acceso al archivo

chmod 600 init-cloudflare.ini

## 4. Generar certificados SSL utilizando Certbot y el plugin de Cloudflare

certbot certonly --dns-cloudflare --preferred-challenges dns --dns-cloudflare-credentials ~/.secrets/certbot/init-cloudflare.ini -d baseball.solidusystems.mx -d admin-baseball.solidusystems.mx -d api-baseball.solidusystems.mx

## 5. Configurar parámetros SSL adicionales

sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

### Rutas de archivos PEM para configuración de NGINX

/etc/letsencrypt/live/baseball.solidusystems.mx/fullchain.pem
/etc/letsencrypt/live/baseball.solidusystems.mx/privkey.pem

# Configuración de NGINX para proyectos específicos

## Crear carpetas para proyecto en home del usuario

mkdir ~/www

# Clonar repositorios necesarios en ~/www/

## Configurar archivo de servidor en NGINX

nano /etc/nginx/conf.d/proyecto.conf

### Ejemplo de configuración para redirección y seguridad SSL:

server {
listen 80;
server_name qa-api.cclaesmeraldaapp.com;
return 301 https://qa-api.cclaesmeraldaapp.com$request_uri;
}

server {
listen 443 ssl http2;
server_name qa-api.cclaesmeraldaapp.com;
ssl_certificate /etc/letsencrypt/live/qa-admin.cclaesmeraldaapp.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/qa-admin.cclaesmeraldaapp.com/privkey.pem;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 5m;
ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_dhparam /etc/ssl/certs/dhparam.pem;
add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";

    charset utf8;
    access_log /var/log/nginx/admin.log main;

    ## Configuraciones adicionales de seguridad
    proxy_hide_header X-Powered-By;
    server_tokens off;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    ## Control de límites y buffers
    client_body_buffer_size 1K;
    client_header_buffer_size 1K;
    client_max_body_size 1K;
    large_client_header_buffers 4 16K;

    ## Configuración de ubicación y archivos
    location / {
        root /user/www/exo-cms-compiled;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

}

upstream api_proyecto {
    server 127.0.0.1:3030;
    keepalive 64;
}

# Configuración adicional de NGINX y firewall

## Configuración de servidor de redirección HTTP a HTTPS

server {
    listen 80 default_server;
    server_name dominio;
    return 301 https://dominio$request_uri;
}

## Configuración para servidor HTTPS

server {
    listen 443 ssl http2 default_server;
    server_name utecan.titulaciondigital-ut.mx;
    ssl_certificate /etc/letsencrypt/live/dominio/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dominio/privkey.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384;
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";

    root /user/www/proyecto;
    access_log /var/log/nginx/proyecto.log main;
    error_log /var/log/nginx/proyecto.error.log;

    ## Headers de seguridad adicionales
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    ## Configuración de ubicación y manejo de archivos
    index index.html index.htm index.php;
    charset utf-8;

    location / {
        proxy_set_header HOST $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_pass http://api_proyecto/;
        proxy_redirect off;
        proxy_read_timeout 240s;
        proxy_buffering off;
        proxy_buffers 8 32k;
        proxy_buffer_size 64k;

        proxy_hide_header X-Powered-By;
        server_tokens off;
    }

    location ~ /\.git {
        deny all;
    }

    if ($host != "dominio") {
        return 404;
    }

}

# Reglas de firewall para puertos HTTP y HTTPS

{
    "inbound_rules": [
        {
            "protocol": "tcp",
            "ports": "443",
            "sources": {
                "addresses": [
                    "173.245.48.0/20",
                    "103.21.244.0/22",
                    "103.22.200.0/22",
                    "103.31.4.0/22",
                    "141.101.64.0/18",
                    "108.162.192.0/18",
                    "190.93.240.0/20",
                    "188.114.96.0/20",
                    "197.234.240.0/22",
                    "198.41.128.0/17",
                    "162.158.0.0/15",
                    "172.64.0.0/13",
                    "131.0.72.0/22",
                    "104.16.0.0/13",
                    "104.24.0.0/14"
                ]
            }
        }
    ]
}

# Configuración de permisos para carpetas de la aplicación

## Asignar permisos a usuario y grupo NGINX

chown -R Us3Rb31SB0l:nginx proyecto
chown -R Us3Rb31SB0l:nginx proyecto/\*

## Configurar contexto de seguridad para archivos y carpetas

chcon -R -t httpd_sys_rw_content_t proyecto
chcon -R -t httpd_sys_rw_content_t proyecto/\*

# Configuración de la API

## Clonar el archivo de entorno y generar clave

cd ~/api
cp .env.example .env
nano .env
adonis key:generate

# Configuración de PM2 para la API

## Arrancar la API con PM2 y definir opciones de reinicio y memoria

pm2 start server.js --name=api --max-memory-restart 512M -i 1

## Para múltiples CPUs

pm2 start server.js --name=api --max-memory-restart 768M -i max

## Monitoreo y configuración de arranque en reinicios

pm2 monit
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u Us3Rb31SB0l --hp /home/Us3Rb31SB0l
pm2 save
pm2 update
pm2 monit

# Reiniciar el servidor para verificar inicio automático de PM2

sudo reboot

## Configuración de PM2 para tareas programadas

module.exports = {
    apps: [
        {
            name: "cron-tableau",
            script: "node",
            args: "ace scheduler:run",
            interpreter: "none",
            watch: false,
            max_memory_restart: "256M",
            instances: 1,
        },
    ],
}

pm2 start ./ace -- run:scheduler
pm2 start filesource_script --name "{app_name}" -- run {script_name}
pm2 start node --interpreter=node --interpreter-args="ace scheduler:run" --name=scheduler --max-memory-restart 1G -i 1
