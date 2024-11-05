# 🎬 Infinite Download - Movies & Shows Website

Infinite Download is a Netflix-inspired movies and shows streaming platform that connects to TMDb and YouTube for high-quality streaming, trailers, and user engagement features. With options like watch history, wishlist, favorites, original audio, and a smooth UI experience, Infinite Download brings your favorite entertainment content directly to your browser.

![Infinite Download - Streaming UI](https://i.postimg.cc/x85RSW-35/infintedownload-store-ui-1.png)

## 🔗 Live Demo
Explore the live site here: [Infinite Download Demo](https://www.infinitedownload.store/)

## 📜 Features

- **Netflix-Style User Interface**: A sleek, responsive, and immersive UI inspired by Netflix for an enjoyable user experience across devices.
- **Movie & Show Trailers**: Play trailers directly from YouTube with seamless integration.
- **Comprehensive Library**: Access a wide range of movies and shows with details fetched from TMDb.
- **User Watch History**: View previously watched content with recent titles displayed in an organized history section.
- **Wishlist & Favorites**: Add movies and shows to your wishlist and favorites for easy access.
- **Requests for New Content**: Users can request movies or shows, increasing engagement and making content management easy.
- **Original Audio Support**: Enjoy movies and shows in their original audio for an authentic viewing experience.
- **SEO-Optimized and Monetizable**: Easily integrate advertisement codes to generate revenue through Adsterra, Google Ads, and more.
- **Static Web Hosting Compatible**: Works seamlessly with popular hosts like Hostinger, Jink, Netlify, and others.

## 🖥️ Requirements

To run Infinite Download on a static hosting provider, here are some recommended setups:
- **Static Web Hosting**: Example: [Hostinger](https://cart.hostinger.com/pay/aec3380f-099b-4ce8-9970-6a9f028555ef?_ga=GA1.3.942352702.1711283207)
- **Node.js**: Ensure Node.js is installed for development setup and production builds.

## 📂 Download

1. **Download Source Code**: [Get the code here](https://github.com/Ankitjarwall/infnitedownload) (If unable to download, contact us for support).
2. **Install Git** (if not already installed): [Download Git](https://git-scm.com/downloads)

## 🔧 Setup Instructions

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org) if it’s not installed.
2. **Download & Open the Code**:
   - Download the script using the link above.
   - Navigate to the code directory and open a terminal.
3. **Install Dependencies**:
   ```bash
   npm install
4. Start Development Server:
```bash
npm run dev
```
5. Access Local Server:
Visit http://localhost:5173 in your browser.
Here's a formatted `README.md` file with the provided content:

```markdown
# 🌟 Optional Customizations 🌟

- **Change Site Logo:** Replace `/public/logo.png` with your logo image.
- **Change Site Icon:** Replace `/public/icon.png` with your custom icon (use a square image for best results).
- **Update Site Name:** Modify the site name in both `/.env` and `/index.html` by replacing "Infinite Download".
- **Add Advertisements:** Embed ad codes (such as from Adsterra) directly into `/index.html`.

---

# 🏗️ Production Deployment 🌟

1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Upload to Hosting:** 
   Upload the contents of the `/dist` folder to your preferred hosting provider (e.g., Jink, Netlify, etc.).

3. **Configure Nginx for SPA:**
   Add the following to your `nginx.conf` server block to enable single-page application (SPA) support:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

---

# 📈 SEO and Monetization

Optimize your Infinite Download platform by integrating SEO strategies and monetization options:

- **SEO-Ready Pages:** Ensure that your movie and show metadata from TMDb improves search engine indexing.
- **Ad Integration:** Place advertisement codes to monetize traffic through platforms like Adsterra, Google AdSense, and others.

---

# 🚀 Infinite Download – Your Gateway to Endless Entertainment

Infinite Download brings the excitement of streaming to your screen with a professional, user-friendly, and customizable platform. Get started with our intuitive setup, and bring a Netflix-like experience to your users today!

For more help, reach out through our support email or visit the [Infinite Download Website](https://infinitedownload.store).
