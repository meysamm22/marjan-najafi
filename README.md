# Marjan Najafi — Portfolio

Personal website of Marjan Najafi Dehkordi, UI/UX designer in Frankfurt am Main: CV details and the Tebeto doctor appointment app case study, in English and German.

Built with [Astro](https://astro.build) as a static site. Fonts are self-hosted.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`.

## Where things live

| What | Where |
| --- | --- |
| Text, English and German | `src/i18n/en.json`, `src/i18n/de.json` |
| Language-independent data (survey numbers, benchmark, Figma link) | `src/data/profile.ts` |
| Home page | `src/views/HomeView.astro` |
| Case study page | `src/views/TebetoView.astro` |
| Colours, type and shared styles | `src/styles/global.css` |
| Scroll and interaction behaviour | `src/scripts/motion.ts` |
| Hi-fi screens shown in the gallery | `src/assets/tebeto/screens/` |

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.
