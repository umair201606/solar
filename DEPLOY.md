# Deployment

The site runs on an AWS EC2 VM. Deploy = push to GitHub `main`, then pull + rebuild SSR on the VM.

## Server

- Host: `ubuntu@13.212.196.17`
- SSH key: `fyp.pem` (kept locally in `~/Sheraz/fyp.pem`, not in the repo)
- Connect: `ssh -i ~/Sheraz/fyp.pem ubuntu@13.212.196.17`
- Note: the VM's security group only allows SSH from whitelisted IPs. If the connection times out, your current IP isn't whitelisted (add it in the AWS EC2 security group, inbound port 22).

## Deploy steps

1. Locally, commit and push to `main`:
   ```bash
   git add -A
   git commit -m "your message"
   git push origin main
   ```

2. SSH into the VM and pull + rebuild SSR:
   ```bash
   ssh -i ~/Sheraz/fyp.pem ubuntu@13.212.196.17
   cd <project-dir-on-vm>        # the folder containing artisan
   git pull origin main
   npm ci                        # only if package.json changed
   npm run build:ssr             # vite build && vite build --ssr -> bootstrap/ssr/ssr.js
   php artisan inertia:stop-ssr  # stop the old SSR node process
   # restart SSR: depends on how it's supervised on this box
   #   - pm2:        pm2 restart ssr   (or: pm2 start "php artisan inertia:start-ssr" --name ssr)
   #   - manual:     nohup php artisan inertia:start-ssr > storage/logs/ssr.log 2>&1 &
   php artisan optimize:clear && php artisan config:cache && php artisan route:cache
   ```

## Notes

- `public/build` and `bootstrap/ssr` are gitignored — they are built on the VM, never committed.
- Some content images under `public/images/vibrant_images/` are gitignored; blog images that must ship are force-added (`git add -f`).
