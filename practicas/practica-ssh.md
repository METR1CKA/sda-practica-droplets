# INICIO

> `sudo` solo se utiliza para ejecutar comandos no autorizados por el usuario, no es necesario siempre ponerlo, solo cuando no seas usuario root o de bajos privilegios detro del grupo sudo/wheel/etc.

> Configurar los accesos y demas con root, los usuarios creados solo podran conectarse por ssh

1. Actualizar los droplets

```bash
sudo dnf update
sudo dnf upgrade

dnf update -y && dnf upgrade -y
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

## AUMENTAR LA MEMORIA RAM

1. Apagar el droplet desde el panel de Digital Ocean

2. Aumentar la capacidad de memoria ram desde el panel de digital ocean

3. Encender el droplet

# SSH

## PUERTOS

1. Editar el archivo `/etc/ssh/sshd_config`

```bash
nano /etc/ssh/sshd_config
```

2. Cambiar el puerto de escucha del ssh para el droplet 1

```bash
Port 55113
```

3. Cambiar el puerto de escucha del ssh para el droplet 2

```bash
Port 60112
```

## REINICIAR SERVICIO SSH

1. Reiniciar el servicio ssh

```bash
systemctl restart sshd
```

o usar

```bash
service sshd restart
```

2. Verificar el estado del servicio

```bash
systemctl status sshd
```

o usar

```bash
service sshd status
```

> Ambos comandos funcionan igual

## CREACION DE USUARIOS

1. Crear un usuario para acceso ssh diferente a root, aplicar en ambos droplets

```bash
# Forma de crear el usuario
adduser {user}

# Asignar una contraseña al usuario creado
passwd {user}

# Borrar un usuario
userdel -r {user}

# Opcional, agregar el usuario al grupo wheel para acceso a sudo
# wheel es el grupo que permite el acceso a sudo
# gpasswd es para agregar el usuario al grupo
# -a es para agregar
gpasswd -a {user} wheel

# Para eliminar el usuario del grupo wheel
gpasswd -d {user} wheel

# Asignar al usuario creado como propietario de su directorio en home, esto es opcional, se ejecuta como root antes de cambiar al usuario creado
chown -R {user}:{user} /home/{user}

# Cambiar al usuario creado para probar el acceso
su {user}

# Dirigirse al directorio home del usuario
cd

# Salir del usuario creado
exit
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

# Crear el archivo authorized_keys y pegar el contenido de la llave publica con la que se conectara el cliente SSH (PuTTY/OpenSSH) con el usuario recien creado
touch authorized_keys

# Otra forma de crear el archivo es copiando el contenido de authorized_keys de root a nuestra carpeta .ssh
# Esta opcion crea el archivo con los permisos por default
cat /root/.ssh/authorized_keys > ~/{ruta_.ssh}/authorized_keys

# Otra forma es copiar el archivo de la llave publica de root a nuestra carpeta .ssh en caso de que no exista
# Esta opcion copia el archivo con los permisos por default del archivo original
cp /root/.ssh/authorized_keys ~/{ruta_.ssh}/authorized_keys

# Asignar permisos para el directorio y el archivo
chmod 700 -R ~/{ruta_.ssh}
chmod 600 ~/{ruta_.ssh}/authorized_keys
```

2. configurar el `sshd_config` de ambos droplets para el acceso a los usuarios desde el cliente SSH (PuTTY/OpenSSH)

```bash
AddressFamily inet
PermitRootLogin no
AllowUsers {user}
MaxAuthTries 3
MaxSessions 3

# Default: /home/{user}/.ssh/authorized_keys
# Por ejemplo: /home/{user}/.profile/.ssh/authorized_keys o /home/{user}/.config/.ssh/authorized_keys
AuthorizedKeysFile /home/{user}/{ruta_ssh}/authorized_keys
```

3. Reiniciar el servicio ssh

## CREACION DE LLAVES SSH

1. Crear llave ssh en el droplet 1

```bash
# Acceder como el usuario creado
su {user}

# -f ruta y nombre del archivo personzalizado donde guardaras tus llaves, -C comentario
# Ejemplo: ~/.profile/.ssh/droplet o ~/.config/.ssh/droplet
# Por defecto: ~/.ssh/id_rsa y ~/.ssh/id_rsa.pub
ssh-keygen -f {ruta_ssh/nombre_archivo} -C "{tu-comentario}"

# O ejecutar para usar la ruta por defecto
ssh-keygen -C "{tu-comentario}"

# Salir como el usuario creado
exit

# Cambiar los permisos de las llaves siendo root
chmod 644 ~/{ruta_.ssh/nombre_archivo}.pub
chmod 600 ~/{ruta_.ssh/nombre_archivo}
```

2. Copiar el contenido de la llave publica generada del droplet 1 y pegarla en el archivo `authorized_keys` del droplet 2

```bash
# Acceder como el usuario creado
su {user}

# Una forma de copiar el contenido de la llave publica es con el comando ssh-copy-id
# -i es para especificar la ruta de la llave publica
# Por defecto: ~/.ssh/id_rsa.pub
ssh-copy-id -i ~/{ruta_.ssh/nombre_archivo}.pub {user}@{ip_privada_droplet_2}

# Otra forma es copiar el contenido de la llave publica despues de ejecutar cat y pegarla en el archivo authorized_keys del droplet 2
# Por ejemplo: ~/.profile/.ssh/id_rsa.pub o ~/.config/.ssh/id_rsa.pub
# Por defecto: ~/.ssh/id_rsa.pub
cat {ruta_ssh/nombre_archivo}.pub
```

3. Reiniciar el servicio ssh

## CONFIGURACION DE ACCESO SSH ENTRE DROPLET 1 Y DROPLET 2

1. Configurar el archivo `sshd_config`

```bash
# Dropet 1: Comentar la linea de ListenAddress o ponerle 0.0.0.0 para que escuche en todas las interfaces

#ListenAddress 0.0.0.0
ListenAddress 0.0.0.0
#ListenAddress ::

# Droplet 2: Descomentar la linea de ListenAddress y ponerle la ip privada del droplet 2 (interfaz privada)

ListenAddress {ip_privada_droplet_2}
```

2. Reiniciar el servicio ssh

## CONFIGURACION DE GOOGLE-AUTHENTICATOR

1. Instalar epel-release para poder instalar los paquetes de google-authenticator y qrencode

```bash
# Installar Epel
# Ejecutar los comandos de actualizar antes de instalar los paquetes
dnf install epel-release

# Instalar google-authenticator y qrencode
dnf install google-authenticator qrencode qrencode-libs
```

2. Generar key de google-authenticator

```bash
# Generar la key de google-authenticator
# Poner la ruta .ssh de tu usuario creado
google-authenticator -s ~/{ruta_.ssh}/google_authenticator

# Despues de generar la key, se mostrara un codigo QR, escanearlo con la aplicacion de google-authenticator en tu dispositivo movil, responder y
# Si no tienes la aplicacion, puedes copiar el codigo secreto y la url del codigo QR para agregarlo manualmente
Do you want authentication tokens to be time-based (y/n) y

# Arrojara el qr para escanearlo con la aplicacion de google-authenticator, junto con la secret key y el codigo de emergencia

# Preguntara si quieres actualizar el archivo ~/.profile/.ssh/google_authenticator, responder y
Do you want me to update your "/home/fernando/.profile/.ssh/google_authenticator" file? (y/n) y

# Pregrunta si quieres deshabilitar el uso de la misma key de autenticacion, responder y
Do you want to disallow multiple uses of the same authentication
token? This restricts you to one login about every 30s, but it increases
your chances to notice or even prevent man-in-the-middle attacks (y/n) y

# Pregunta si quieres aumentar el tiempo de uso de la misma key de autenticacion, responder n
By default, a new token is generated every 30 seconds by the mobile app.
In order to compensate for possible time-skew between the client and the server,
we allow an extra token before and after the current time. This allows for a
time skew of up to 30 seconds between authentication server and client. If you
experience problems with poor time synchronization, you can increase the window
from its default size of 3 permitted codes (one previous code, the current
code, the next code) to 17 permitted codes (the 8 previous codes, the current
code, and the 8 next codes). This will permit for a time skew of up to 4 minutes
between client and server.
Do you want to do so? (y/n) n

# Pregunta si quieres habilitar el rate-limiting, responder y
If the computer that you are logging into isn't hardened against brute-force
login attempts, you can enable rate-limiting for the authentication module.
By default, this limits attackers to no more than 3 login attempts every 30s.
Do you want to enable rate-limiting? (y/n) y
```

> Realizar una sola vez la autenticacion de google-authenticator en el usuario creado
> Realizarla mas de una vez no reemplazara la anterior para el mismo usuario
> En caso de realizarla mas de una vez, deberas volver a generar otro usuario siguiendo los mismos pasos y borrando al anterior

3. Realizar backup de `sshd_config` y `sshd` para el uso de google-authenticator

```bash
# Restaurar el contexto de seguridad de SELinux a sus valores predeterminados en la carpeta .ssh
restorecon -Rv ~/{ruta_ssh}/

# Crear una copia de seguridad del archivo sshd
cp /etc/pam.d/sshd /etc/pam.d/sshd.bak

# Crear una copia de seguridad del archivo sshd_config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

4. Configurar el PAM para el uso de google-authenticator

```bash
# Editar el archivo /etc/pam.d/sshd
nano /etc/pam.d/sshd

# Cambiar las siguientes configuraciones
#auth       substack     password-auth
auth       required     pam_google_authenticator.so secret=/home/${USER}/{ruta_ssh}/google_authenticator nullok
auth       required     pam_permit.so
```

> El `secret` es la ruta (absoluta o relativa) del archivo google_authenticator

5. Configurar el SSH para el uso de google-authenticator

```bash
# Editar el archivo /etc/ssh/sshd_config.d/50-redhat.conf
nano /etc/ssh/sshd_config.d/50-redhat.conf

# Cambiar las siguientes configuraciones en el archivo 50-redhat.conf
ChallengeResponseAuthentication yes

# Editar el archivo /etc/ssh/sshd_config
nano /etc/ssh/sshd_config

# Cambiar las siguientes configuraciones en el archivo sshd_config
PasswordAuthentication no
KbdInteractiveAuthentication yes
AuthenticationMethods publickey,password publickey,keyboard-interactive
```

6. Reiniciar el servicio ssh y verificar el estado

```bash
# Puedes comprobar errores con
sudo journalctl -u sshd
```

7. Probar el acceso ssh con google-authenticator

8. Una vez dentro probar la conexion SSH con el segundo droplet

```bash
# Ejemplo: ssh fer@10.21.11.32 -p 60112 -i ~/.ssh/id_rsa
ssh {user}@{ip_privada_droplet_2} -p {puerto_ssh_droplet_2} -i ~/{ruta_.ssh/nombre_archivo}

# Otra forma de probar la conexion SSH con el segundo droplet
# Crear un archivo de configuracion llamado config en la carpeta .ssh
# Probar la conexion usando: ssh {nombre_host}
Host *
  ServerAliveInterval 60
Host {nombre_host}
  HostName {ip_privada_droplet_2}
  Port {puerto_ssh_droplet_2}
  User {user}
  IdentityFile ~/{ruta_.ssh/nombre_archivo}
```

## EXTRA

1. Firewall

```bash
# Instalar firewalld y habilitar el servicio
sudo dnf install firewalld -y

# Habilitar el servicio
sudo systemctl enable firewalld

# Inicializar el servicio antes de configurar las reglas de ssh_config
sudo systemctl start firewalld

# Remover servicios por default
sudo firewall-cmd --zone=public --remove-service=cockpit --permanent
sudo firewall-cmd --zone=public --remove-service=ssh --permanent
sudo firewall-cmd --zone=public --remove-service=dhcpv6-client --permanent

# Agregar servicios personalizados
sudo firewall-cmd --zone=public --add-port={port}/tcp --permanent
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent

# Recargar las reglas
sudo firewall-cmd --reload

# Verificar el estado del servicio
sudo firewall-cmd --state

# Verificar el estado del servicio
sudo firewall-cmd --list-all
```

2. Añadir Fail2Ban

```bash
# Instalar Fail2Ban (root)
dnf install epel-release -y
dnf install fail2ban -y

# Habilitar Fail2Ban
systemctl enable fail2ban.service
systemctl status fail2ban.service

# Configurar Fail2Ban
cd /etc/fail2ban
cp jail.conf jail.local
cd jail.d

# Archivo de configuracion de sshd
nano sshd.conf

[sshd]
enabled = true
filter = sshd
port = {puerto_ssh}
bantime = 21600
maxretry = 3
ignoreip = 127.0.0.1
logpath = /var/log/auth.log

# Reiniciar Fail2Ban
fail2ban-client status sshd
fail2ban-client status
service status
service fail2ban status
service fail2ban restart
service fail2ban status
fail2ban-client status sshd

# Desbanear una IP
sudo fail2ban-client set sshd unbanip {remote-ip-address}
```
