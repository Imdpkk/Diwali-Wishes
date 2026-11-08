# Interactive Diwali Wishes

A responsive Diwali greeting website built with plain HTML, CSS and JavaScript.

## Features
- Royal black-and-gold festive design
- Interactive diya lighting animation
- Canvas fireworks (click the fireworks button)
- Soft looping background music from `Music.mp3` with browser autoplay fallback
- Personal greeting by visitor name
- Share/copy a personalized URL using `?to=Name`
- Responsive layout and reduced-motion support

## Run locally
1. Download and extract the project folder.
2. Open `index.html` in a modern browser, or run a local server from this folder:
   - Python: `python -m http.server 8000`
   - Then open `http://localhost:8000`

Clipboard and native sharing work best on HTTPS or localhost. Music attempts autoplay at a low volume; browsers may block audible autoplay until the visitor interacts with the page.

## Deploy on GitHub Pages
1. Create a new GitHub repository, for example `diwali-wishes`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish and open the URL shown in Settings → Pages.

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Other**. Build command: leave blank. Output directory: `.`
4. Deploy. Vercel will provide a public HTTPS link.

## Personalizing
- Change the sender name in the footer of `index.html`.
- Change the default greeting in `index.html`.
- To send a named greeting, open the deployed URL with `?to=FriendName`, for example `https://your-site.example/?to=Priya`.

No backend or database is required. Visitor names are kept in the page URL and are not stored.
