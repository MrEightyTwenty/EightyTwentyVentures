# EightyTwentyVentures — Static Site

A clean, dark, brand-aligned static site ready for Netlify. Built as a foundation you can expand without ripping things out.

## File structure

```
.
├── index.html              # Landing page (hero, framework, features, signup)
├── playbook.html           # The Playbook hub (links to two sub-pages)
├── playbook-intraday.html  # Short-term order flow playbook
├── playbook-position.html  # Long-term equity position playbook
├── briefing.html           # Blog index (card grid + filters)
├── 404.html                # Branded not-found page
├── style.css               # All styling (CSS custom properties at top)
├── netlify.toml            # Netlify config (headers, redirects)
├── assets/
│   └── logo.png            # Bull/bear emblem
└── README.md
```

## Deploy to Netlify

1. **Drag-and-drop method (fastest)**: zip the whole folder, drop it on app.netlify.com/drop. Done.
2. **Git method (recommended)**: push this folder to a GitHub repo, connect it in Netlify. Every push auto-deploys.

No build step required. This is plain HTML/CSS/JS.

## Newsletter signups (Netlify Forms)

The signup forms are already wired up. On first deploy, Netlify auto-detects them. You'll see submissions under **Forms** in your Netlify dashboard. Each form on the site has a unique name so you can see which page drove the signup:

- `newsletter` — main hero signup
- `newsletter-footer` — final CTA on home
- `newsletter-playbook` — playbook hub
- `newsletter-intraday` — intraday sub-page
- `newsletter-position` — position sub-page
- `newsletter-briefing` — briefing top
- `newsletter-briefing-foot` — briefing bottom

To pipe these into ConvertKit, Mailchimp, or similar later, set up a Netlify Function or use a Zapier/Make integration on the form-submission event. No code changes needed in the HTML.

## How to add a Briefing post

In `briefing.html`, find the `<div class="briefing-grid">` block. Each post is one `<a class="briefing-card">` element. Duplicate one, then:

1. Update `href` to point to the actual post URL.
2. Update the `<span class="category">` and `data-cat` attribute. Valid categories: `macro`, `regime`, `cot`, `sectors`, `education`. To add a new category, also add a new filter button at the top of the same file.
3. Update the date (replace the `Sample post` span with something like `Jan 12, 2026`).
4. Update the title `<h3>` and dek `<p>`.

The sample cards in there now are placeholders. Replace them as real posts go up.

## How to customize the look

All design tokens live at the top of `style.css` in the `:root` block. Change them once and they propagate everywhere.

Most likely things to touch:

```css
--gold: #C9A84C;         /* Brand accent */
--bg-primary: #0A0A0A;   /* Page background */
--text-primary: #E8E6E1; /* Main text */
--font-serif: 'Georgia', 'Times New Roman', serif;
```

## Swapping the logo

Replace `assets/logo.png` with any image of the same approximate aspect ratio. The hero references it at `width: 280px`. For best results use a transparent PNG or SVG at 2x density (560px wide for the file, displayed at 280px).

## Editing the wordmark

The "EightyTwentyVentures" wordmark on the hero is HTML text, not an image. Find this in `index.html`:

```html
<h1 class="hero-brand">
  <span class="eighty">Eighty</span><span class="twenty">Twenty</span><span class="eighty">Ventures</span>
</h1>
```

The `.twenty` span is what gets the gold color. Adjust the markup to change which words highlight.

## Future dashboard integration

This site is intentionally lightweight. When you're ready to embed the Vital Few Index dashboard or any other React/iframe widget, add a new page (e.g. `dashboard.html`) and embed the iframe inside the existing layout structure. The nav and footer markup are copy-paste from any existing page.

## Editorial notes

The copy follows the EightyTwenty editorial standards:
- No em dashes anywhere (commas, periods, colons, or parentheses instead)
- Friend-to-friend register, concept then data then implication
- No P&L claims, no urgency, no guru aesthetic
- Sentence case headings throughout

Keep these in mind when editing.

## Legal placeholders

The footer legal pages (Privacy Policy, Terms of Service, Risk Disclosure, Subscription Policy) currently link to `#`. Build out those pages and update the hrefs when ready.
