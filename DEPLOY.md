# Deployment

The site runs on a Google Cloud VM. Deploy = push to GitHub `main` → CI/CD auto-deploys.

## Servers

### Production (GCP)
- Host: `ubuntu@34.18.23.219`
- SSH key: `~/.ssh/solarkon_key`
- Connect: `ssh -i ~/.ssh/solarkon_key ubuntu@34.18.23.219`
- Always prefix commands with `sudo` to avoid permission errors.

### Previous (AWS — decommissioned)
- Host: `ubuntu@13.212.196.175`
- SSH key: `/Users/apple/fyp.pem`

## CI/CD

On push to `main`, GitHub Actions:
1. SSHes into GCP
2. `git pull`, `composer install`, `npm ci`, `npm run build:ssr`
3. `php artisan migrate --force` (only runs new migrations)
4. `php artisan config:cache && php artisan route:cache`
5. Restarts nginx + SSR service

## Manual Deploy

```bash
ssh -i ~/.ssh/solarkon_key ubuntu@34.18.23.219
cd /var/www/solar
sudo git pull origin main
sudo composer install --no-dev --optimize-autoloader
sudo npm ci
sudo npm run build:ssr
sudo php artisan migrate --force
sudo php artisan config:cache
sudo php artisan route:cache
sudo systemctl restart nginx
sudo systemctl restart solar-ssr
```

## Services on GCP

| Service | Status | Management |
|---------|--------|------------|
| nginx | running | `sudo systemctl restart nginx` |
| PHP 8.5-FPM | running | `sudo systemctl reload php8.5-fpm` |
| solar-ssr (Inertia SSR) | running | `sudo systemctl restart solar-ssr` |
| certbot renew timer | active | `sudo certbot renew` |

## Seeding Products (one-time)

If products table is empty:
```bash
ssh -i ~/.ssh/solarkon_key ubuntu@34.18.23.219
cd /var/www/solar
sudo php artisan db:seed --class=CatalogSeeder --force
sudo php artisan db:seed --class=ProductSeeder --force
sudo php artisan db:seed --class=PriceHistorySeeder --force
```

## SSL / HTTPS

Domain: `solarkon.org` + `www.solarkon.org` → `34.18.23.219`

To obtain/renew SSL certs:
```bash
ssh -i ~/.ssh/solarkon_key ubuntu@34.18.23.219
sudo certbot --nginx -d solarkon.org -d www.solarkon.org
```

Certs auto-renew via systemd timer.

## Project Structure

- **Path**: `/var/www/solar`
- **Database**: SQLite at `database/database.sqlite`
- **Build output**: `public/build/` + `bootstrap/ssr/` (gitignored)
- **SSR entry**: `bootstrap/ssr/app.js`
- **Key files not in git**: `.env` (production), `database/database.sqlite` (production data)

## Migrating to a New VM

If you need to migrate to another VM:

1. **Provision the new VM** (Ubuntu 26.04):
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nginx php8.5-fpm php8.5-bcmath php8.5-curl php8.5-gd php8.5-mbstring php8.5-xml php8.5-zip php8.5-sqlite3 sqlite3 git unzip curl supervisor
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
   sudo php -r 'copy("https://getcomposer.org/installer", "composer-setup.php");'
   sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer --quiet
   sudo php -r 'unlink("composer-setup.php");'
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Clone the project**:
   ```bash
   sudo mkdir -p /var/www/solar && sudo chown ubuntu:www-data /var/www/solar
   cd /var/www/solar && git clone https://github.com/sheraz7355/solar.git .
   ```

3. **Restore .env and database** from the old VM:
   ```bash
   scp -i <old-key> ubuntu@<old-ip>:/var/www/solar/.env /tmp/
   scp -i <old-key> ubuntu@<old-ip>:/var/www/solar/database/database.sqlite /tmp/
   sudo cp /tmp/.env /var/www/solar/.env
   sudo cp /tmp/database.sqlite /var/www/solar/database/database.sqlite
   ```

4. **Install deps & build**:
   ```bash
   cd /var/www/solar
   sudo composer install --no-dev --optimize-autoloader
   sudo npm ci
   sudo npm run build:ssr
   sudo php artisan migrate --force
   sudo php artisan config:cache && sudo php artisan route:cache
   ```

5. **Set up nginx** — copy the config from the old VM or use:
   ```nginx
   server {
       server_name solarkon.org www.solarkon.org _;
       root /var/www/solar/public;
       index index.php index.html index.htm;
       location / { try_files $uri $uri/ /index.php?$query_string; }
       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.5-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
       }
       location ~ /\.ht { deny all; }
       listen 80;
   }
   ```

6. **Set up SSR service** (`/etc/systemd/system/solar-ssr.service`):
   ```ini
   [Unit]
   Description=Inertia SSR Server for Solarkon
   After=network.target
   [Service]
   Type=simple
   User=ubuntu
   Group=www-data
   WorkingDirectory=/var/www/solar
   ExecStart=/usr/bin/php artisan inertia:start-ssr
   Restart=always
   RestartSec=3
   StandardOutput=append:/var/www/solar/storage/logs/ssr.log
   StandardError=append:/var/www/solar/storage/logs/ssr.log
   [Install]
   WantedBy=multi-user.target
   ```

7. **Fix permissions**:
   ```bash
   sudo chown -R ubuntu:www-data /var/www/solar
   sudo chmod -R 775 /var/www/solar/storage /var/www/solar/database
   sudo systemctl enable --now solar-ssr nginx php8.5-fpm
   ```

8. **Set up SSL** (after DNS pointed):
   ```bash
   sudo certbot --nginx -d solarkon.org -d www.solarkon.org
   ```

## Permissions Note

Always use `sudo` for commands on the VM. The `www-data` user needs write access to `storage/` and `database/`. This is handled by making `www-data` the group owner with `775` permissions.
