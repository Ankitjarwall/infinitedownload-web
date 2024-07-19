# ![Infinitedownload.store](https://i.postimg.cc/x85RSW-35/infintedownload-store-ui-1.png)

## 🔗 Links
- **[Demo](https://www.infinitedownload.store/)**

## 🖥️ Requirements
- Static Web Hosting - Example: **[Jink](https://clients.jink.host/link.php?id=5)**

## 📂 Download

1. Install Git on your system if you haven't already.
2. Run `git clone https://git.cdak.ws/cdak/Stream.git`

## 🔧 Setup
1. Install Node.js if you haven't already from [nodejs.org](https://nodejs.org)
2. Download the script using instructions above.
3. Open a terminal in the script directory.
4. Run `npm install` to install dependencies, then `npm run dev` to start the dev server.
5. Open `http://localhost:5173` in your browser.
6. **(Optional)** Change the site logo by replacing `/public/logo.png` with your own logo.
7. **(Optional)** Change the site icon by replacing `/public/icon.png` with your own icon, use a square (1:1) image for best results.
8. **(Optional)** Change the site name by replacing `Infinite download` in `/.env` and `/index.html`.
9. **(Optional)** Add any advertisement codes in `/index.html` (Like [Adsterra](https://beta.publishers.adsterra.com/referral/fMYMsgM7NM))
10. Run `npm run build` in the terminal to build the production files
11. Upload the contents of the `/dist` folder to production. (**Jink**, Netlify, etc.)
12. Configure nginx to work with SPA. Add this in your server block or vhost

```nginx
location / {
   try_files $uri $uri/ /index.html;
}
```
