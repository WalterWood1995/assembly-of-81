@echo off
rem AGON Robotpedia - start the server and a Cloudflare quick tunnel.
rem The public https://....trycloudflare.com address is printed below; it changes on every start.
cd /d "%~dp0"
set AGON_TRUST_PROXY=1
start "agon-server" /min node server.js
timeout /t 2 >nul
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8787 --no-autoupdate
