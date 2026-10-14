# Shivansh Bhardwaj: portfolio

Single-page portfolio for an entry-level AI/ML engineer. Every result on the page links to the file in a public GitHub repository that produced it.

- **Live:** https://shivansh-bhardwaj-portfolio.vercel.app
- **Resume (PDF):** https://shivansh-bhardwaj-portfolio.vercel.app/Shivansh_Bhardwaj_Resume.pdf

## Stack

Built with Next.js (App Router, static rendering), TypeScript, Tailwind CSS v4 via `@tailwindcss/postcss`, Archivo and Fragment Mono through `next/font`, and Phosphor icons. Motion is CSS only.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # runs the content guards before and after next build
npm run start
```

## Content

All facts live in `content/content.json` and are read through `lib/content.ts`. Components never hard-code a fact or number. Each metric carries `source` (a repo-relative path) and `sourceUrl` (the public file on GitHub); `<Metric>` and `<SourceLink>` render them.

Copy edits made on top of the compiled content are recorded in `content.json` under `_meta.edits`.

## Guards and checks

- `scripts/check-content.mjs` (runs in `prebuild` and `postbuild`): fails on em or en dashes, phone-like numbers or personal-data words, unsourced metrics, any model metric for the credit-risk project, use of the synthetic SHAP image, links into gitignored folders, hover or press transforms and shadows, scroll listeners, and banned motion or icon libraries. To also check for one specific private number, set `PRIVATE_PHONE_DIGITS` in your local shell; never commit it.
- `npm run check:links`: requests every source and repository URL and expects HTTP 200. Run it before deploying.
- `npm run derive-assets`: rebuilds the two-row hero crop, the Open Graph grid and the static Archivo Expanded Bold font used by the generated OG image and icons.

## Deploy

Hosted on Vercel and deployed with the CLI from the project root:

```bash
vercel deploy --prod --yes
```

The build runs the same content guards as a local build.

## Environment

- `NEXT_PUBLIC_SITE_URL` (optional): canonical site URL for metadata, sitemap and JSON-LD. On Vercel it falls back to `VERCEL_PROJECT_PRODUCTION_URL`.

## Licences

Archivo and Fragment Mono are under the SIL Open Font License (`public/assets/fonts/OFL.txt`). Project figures come from the author's own repositories.
