# INICIO

- [Inicio](./practica-ssh.md#inicio)

## CONFIGURACION DE SSH

- [Configuracion de SSH](./practica-ssh.md#ssh)

## CREACION DE USUARIOS

- [Crear usuarios](./practica-ssh.md#creacion-de-usuarios)

# VPN

1. Instalar WIREGUARD

```bash
# Actualizar e instalar wireguard
sudo apt update
sudo dnf install elrepo-release epel-release wireguard-tools

# Deshabilitar ElRepo (solo si causa problemas de actualización)
sudo dnf config-manager --set-disabled elrepo

# Actualizar
sudo dnf update
```

2. Generar clave privada y pública

```bash
# Generar clave privada
wg genkey | sudo tee /etc/wireguard/private.key

# Dar permisos a la clave privada
sudo chmod go= /etc/wireguard/private.key

# Generar clave pública
sudo cat /etc/wireguard/private.key | wg pubkey | sudo tee /etc/wireguard/public.key

# Rutas de las claves
/etc/wireguard/private.key
/etc/wireguard/public.key
```

# CONFIGURACION DE VPN

1. Configurar el servidor VPN

- [Configuración servidor VPN](../configs/vpn/server.wg0.conf)

2. Configurar el cliente VPN

- [Configuración cliente VPN](../configs/vpn/peer.wg0.conf)

3. Habilitar el reenvio de paquetes en el servidor VPN

```bash
# Comando
sudo sysctl -w net.ipv4.ip_forward=1

# Archivo
/etc/sysctl.conf
- net.ipv4.ip_forward=1
```

4. Asignar las direcciones IP y claves publicas al servidor

```bash
# Asignación
sudo wg set wg0 peer <clave-publica-peer> allowed-ips <ip-vpn-cliente>/32

# Verificación
sudo wg

# Remover
sudo wg set wg0 peer <clave-publica-peer> remove
```

3. Iniciar el servidor y cliente VPN (primero clientes y luego servidor)

```bash
sudo systemctl enable wg-quick@wg0.service

sudo systemctl start wg-quick@wg0.service

sudo systemctl status wg-quick@wg0.service
```

4. Verificar la conexión

```bash
ping -c 5 <ip-vpn-cliente>
```

# MODIFICACIÓN

1. Modificar las configuraciones web (reiniciar después de modificar)

```bash
# Base de datos
/var/lib/pgsql/15/data/postgresql.conf
- listen_addresses = 'localhost,{ip-privada},{ip-vpn}'

/var/lib/pgsql/15/data/pg_hba.conf
- hostssl    {database}    {userdb}    {ip-vpn}    scram-sha-256

# Apps Web
/home/{user}/{laravel-app}/.env
DB_HOST={ip-vpn-db}
```

2. En el servidor Proxy && Load Balancer agregar un nuevo upstream y server pero para vpn

- [Configuración Proxy](../configs/nginx/proxy.conf)
- [Configuración Load Balancer](../configs/nginx/load-balancer.conf)
