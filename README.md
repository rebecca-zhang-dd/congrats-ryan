# Congrats Ryan & Julia

Engagement congrats book (React + Vite).

## Local dev

```bash
npm install
npm run dev
```

## GitHub Pages

Site: **https://rebecca-zhang-dd.github.io/congrats-ryan/**

Pages is set to **legacy** mode: branch `main`, folder **`docs/`**.

After changing the app, rebuild and commit `docs/`:

```bash
npm run deploy:pages
git add docs && git commit -m "Update GitHub Pages build" && git push
```

The build uses base path `/congrats-ryan/` (see `build:pages` in `package.json`). If you rename the GitHub repo, update that path to match: `/YOUR-REPO-NAME/`.
