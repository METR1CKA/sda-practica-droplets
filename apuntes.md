URL: https://www.ssh.com/academy/ssh/config

AddressFamily {any, inet, inet6} # Familia de direcciones ip, any de todas, inet de ipv4, inet6 de ipv6

Hostkeys para configuracion de redes lan

```bash
#HostKey /etc/ssh/ssh_host_rsa_key
#HostKey /etc/ssh/ssh_host_ecdsa_key
#HostKey /etc/ssh/ssh_host_ed25519_key
```

Logging es para auditorias y logs

```bash
# Logging
#SyslogFacility AUTH
#LogLevel INFO
```

Tarea

2 droplets
