## INICIO

1. Actualizar droplet

```bash
dnf update
```

2. Reiniciar

```bash
reboot
```

## POSTGRESQL

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

# Generar clave privada
openssl genrsa -aes128 -out server.key 2048

# Eliminar la contraseña de la clave
openssl rsa -in server.key -out server.key

# Generar la Solicitud de Firma de Certificado (CSR)
openssl req -new -key server.key -out server.csr

# Genera el Certificado SSL autofirmado
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# Generar el certificado autofirmado directamente
openssl req -new -x509 -nodes -key server.key -days 365 -out server.crt

# Mover los archivos a la carpeta de postgresql
sudo mv server* /var/lib/pgsql/15/data/

# Editar el archivo postgresql.conf
/var/lib/pgsql/15/data/postgresql.conf
- listen_addresses = 'localhost,{ip-privada}'
- port = {puerto personalizado}
- max_connections = 100
- password_encryption = scram-sha-256
- ssl = on
- ssl_cert_file = '/var/lib/pgsql/15/data/server.crt'
- ssl_key_file = '/var/lib/pgsql/15/data/server.key'

# Configurar el archivo pg_hba.conf
/var/lib/pgsql/15/data/pg_hba.conf
- hostssl    database       userdb         {ip-privada-web} or {127.0.0.1}/32           scram-sha-256

# Reiniciar el servicio
sudo systemctl restart postgresql-15

# Conectar a la base de datos
# Acceder a postgres y conectarse a la base de datos
sudo su - postgres
psql -h localhost -p 23455 -U manzano -d db_sda_p1

# Conectar a la base de datos directamente
sudo -i -u postgres psql -h localhost -p 23455 -U manzano -d db_sda_p1
```

3.1 Generacion alterna del certificado

```bash
openssl genrsa -aes128 2048 > server.key

openssl rsa -in server.key -out server.key

chmod 400 server.key

chown postgres.postgres server.key

openssl req -new -x509 -key server.key -days 365 -out server.crt

cp server.crt root.crt
```

4. Agregar las variables de entorno

```bash
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=db_sda_p1
DB_USERNAME=manzano
DB_PASSWORD=
DB_SSLMODE=require
# Solo de manera local
DB_CERT_PATH=/ruta/a/tu/certificado/server.crt
```

5. Correr migraciones y seeders en laravel

```bash
php artisan migrate:fresh --seed
```
