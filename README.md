# Trig Identities Practice

Interactive quiz app for learning trigonometric identities. Built with React + Vite, deployed on GitHub Pages.

## Features
- 5 sections: Simplify, Evaluate, Verify, Double/Half Angle, Sum/Difference & Product
- 75+ randomized problems with step-by-step explanations
- Score tracking per section and overall accuracy
- Light/Dark mode toggle

## Quick Start (local dev)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to GitHub Pages

### One-time setup

1. Create a new repo on GitHub (e.g. `trig-identities-practice`)

2. In `vite.config.js`, make sure the `base` matches your repo name:
   ```js
   base: '/trig-identities-practice/',
   ```

3. Push this code to the repo:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/trig-identities-practice.git
   git push -u origin main
   ```

4. In your GitHub repo, go to **Settings → Pages**:
   - Source: **GitHub Actions**
   - That's it — the included workflow handles the rest

5. After the action runs (~1-2 min), your site is live at:
   ```
   https://YOUR_USERNAME.github.io/trig-identities-practice/
   ```

### Updating

Just push to `main` — the GitHub Action auto-rebuilds and redeploys.

```bash
git add .
git commit -m "update"
git push
```
