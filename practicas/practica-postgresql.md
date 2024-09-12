# INICIO

- [Inicio](./practica-ssh.md#inicio)

## CONFIGURACION DE SSH

- [Configuracion de SSH](./practica-ssh.md#ssh)

## CREACION DE USUARIOS

- [Crear usuarios](./practica-ssh.md#creacion-de-usuarios)

# POSTGRESQL

1. Instalar postgresql

```bash
# Instalar repo postgresql
sudo dnf install https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Deshabilitar el modulo postgresql por defecto
sudo dnf update -y
sudo dnf -qy module disable postgresql

# Instalar postgresql
sudo dnf update -y
# Instalación con server local
sudo dnf install postgresql15 postgresql15-server glibc-all-langpacks postgresql15-contrib -y
# Instalación cliente
sudo dnf install postgresql15 glibc-all-langpacks -y

# Inicializar la base de datos
sudo dnf update -y
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb

# Habilitar y arrancar el servicio
sudo systemctl enable postgresql-15
sudo systemctl start postgresql-15

# Instalar pdo de postgresql para php
sudo dnf install php-pgsql -y
```

2. Configurar usuario postgresql

```bash
# Entrar a la consola de postgresql
sudo -i -u postgres psql

# Cambiar la contraseña del usuario postgres
ALTER USER postgres PASSWORD 'tucontraseña';

# Crear un usuario
CREATE USER {user} WITH PASSWORD 'tucontraseña';

# Asignar rol
ALTER ROLE {user} WITH LOGIN;
ALTER ROLE {user} WITH CREATEDB;
ALTER ROLE {user} WITH SUPERUSER;

# Crear base de datos
CREATE DATABASE {db} WITH OWNER {user};

# Dar privilegios de la base de datos al usuario
GRANT ALL PRIVILEGES ON DATABASE {db} TO {user};

# Salir de la consola de postgresql
\q
```

3. Configurar postgresql

```bash
# Instalar open SSL
sudo dnf install openssl

# Generar SSL
openssl req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj "/CN={ip-privada-bd}"

# Cambiar permisos de los archivos (OPCIONAL)
sudo chmod 644 *.crt
sudo chmod 600 *.key

# Mover los archivos a la carpeta de postgresql
sudo mv * /var/lib/pgsql/15/data/

# Cambiar propietario de los archivos
# postgres:postgres
# {user}:nginx
sudo chown -R postgres:postgres /var/lib/pgsql/15/data/*

# Editar el archivo postgresql.conf
/var/lib/pgsql/15/data/postgresql.conf
- listen_addresses = 'localhost,{ip-privada},{otra-ip}'
- port = {puerto personalizado}
- max_connections = 100
- password_encryption = scram-sha-256
- ssl = on
- ssl_cert_file = '/var/lib/pgsql/15/data/server.crt'
- ssl_key_file = '/var/lib/pgsql/15/data/server.key'

# Configurar el archivo pg_hba.conf
/var/lib/pgsql/15/data/pg_hba.conf
- hostssl    {database}    {userdb}    {ip-privada, 127.0.0.1/32, otra-ip}    scram-sha-256

# Reiniciar el servicio
sudo systemctl restart postgresql-15

# Conectar a la base de datos
# Acceder a postgres y conectarse a la base de datos
sudo su - postgres
psql -h {host} -p {port} -U {userdb} -d {database}

# Conectar a la base de datos directamente
sudo -i -u postgres psql -h {host} -p {port} -U {userdb} -d {database}

# Copiar el contenido del server.crt al droplet web
# BD
sudo cat /var/lib/pgsql/15/data/server.crt

# WEB
mkdir .postgresql && cd $_
nano root.crt
sudo chmod 644 *.crt
sudo setsebool -P httpd_can_network_connect on
sudo chcon -R -t httpd_sys_rw_content_t /home/{user}/.postgresql
```

4. Agregar las variables de entorno

```bash
# Configurar el archivo .env
DB_CONNECTION=pgsql
DB_HOST={host}
DB_PORT={port}
DB_DATABASE={database}
DB_USERNAME={user}
DB_PASSWORD={password}
# Full: para checar todo / CA: checar solo el certificado y no host
DB_SSLMODE={verify-full / verify-ca}
```

5. Correr migraciones y/o seeders en laravel

```bash
php artisan migrate:fresh --seed
```
