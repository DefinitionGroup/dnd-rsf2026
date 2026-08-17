# The Aquarium Solution — landing-page builder

Next.js 16 (App Router) + embedded Sanity Studio. Editors compose product landing
pages from blocks; the site renders them in five languages (`en` primary, `de`,
`fr`, `pl`, `ja`) with localized slugs.

- Sanity project `z5112m0c` · dataset `production`
- Live site origin: `NEXT_PUBLIC_SITE_URL` (placeholder `https://www.theaquariumsolution.com`)
- Design notes on the stack choices: [`docs/BetterIdeas.md`](docs/BetterIdeas.md)
- Block authoring contract: [`blocks/CONTRACT.md`](blocks/CONTRACT.md)
- Planning map (wayfinder): [`.scratch/pagebuilder/map.md`](.scratch/pagebuilder/map.md)

## Quick start

```bash
pnpm install
cp .env.example .env.local     # fill in the Sanity project + a Viewer token
pnpm placeholders              # generates /public/images placeholders (demo mode + seed)
pnpm dev                       # http://localhost:3000 → /en ; Studio at /studio
```

No `.env.local`? The site runs in **demo mode** from `content/demo.ts` (three
product pages + home + contact) and `/studio` shows a setup notice.

## Scripts

| Script | What |
|---|---|
| `pnpm dev` / `build` / `start` | Next.js |
| `pnpm typegen` | `sanity schemas extract` + `sanity typegen generate` → `sanity.types.ts` (runs before `build`) |
| `pnpm typegen:watch` | keep types fresh while editing schema/queries |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit` |
| `pnpm sanity:schema:deploy` | deploy the schema to the Content Lake |
| `pnpm sanity:seed` / `sanity:seed:dry` | seed the dataset from the demo content (uploads images, idempotent ids) |
| `pnpm placeholders` | regenerate the placeholder JPGs |

## Where things live

```
app/(site)/[locale]/…        locale routes (home, [slug], not-found) + layout with SanityLive/VisualEditing
app/(studio)/studio/…        embedded Studio (NextStudio)
app/api/{contact,draft-mode,revalidate}
blocks/<name>/{schema,Component,demo}   self-contained page-builder blocks (16)
blocks/schemas.ts · registry.tsx · types.ts · CONTRACT.md
sanity/schemaTypes/…         page, product, testimonial, menu, siteSettings, objects, fields
sanity/lib/{queries,loaders,live,client,image,video}.ts
sanity/presentation/resolve.ts
content/{demo,demo-products,demo-helpers}.ts   demo-mode content in resolved query shape
lib/{i18n,site,translations,page-metadata,motion}.ts
scripts/{seed-sanity.ts,make-placeholders.mjs}
sanity.config.ts · sanity.cli.ts (typegen config) · sanity.types.ts (generated)
```

## Environment

See `.env.example`. `SANITY_API_READ_TOKEN` must be a **Viewer** token (it is
exposed to the browser in draft mode). CORS origins need *Allow credentials*:
`pnpm exec sanity cors add https://<deploy-origin> --credentials`.
