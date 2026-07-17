# Structured Data plug-in for Micro.blog

Adds [schema.org](https://schema.org) JSON-LD structured data to the `<head>` of every page of your Micro.blog site — no theme changes required.

Structured data helps search engines build rich results for your posts, and it gives AI assistants and answer engines (Google AI Overviews, ChatGPT, Perplexity, and other LLM-based crawlers) a clean, machine-readable description of your site, your posts, and you as the author, making your content easier to attribute and cite correctly.

## What it emits

| Page | Schema type |
| --- | --- |
| Home page | `WebSite` with site name, description, author, and publisher |
| Blog posts | `BlogPosting` with headline, dates, description, images, keywords, word count, author, and publisher |
| Static pages | `WebPage` |
| Category pages | `CollectionPage` |

Details:

- **Author** is emitted as a `Person` built from your Micro.blog account (name, avatar), with `sameAs` links to your Micro.blog profile and any Twitter/GitHub/Instagram usernames configured on your blog. You can add more profile URLs (Mastodon, Bluesky, LinkedIn, …) in the plug-in settings.
- **Title-less microposts** get a `headline` derived from the first ~100 characters of the post text, so short posts are still valid.
- **Photo posts** use Micro.blog's `photos` metadata for the `image` property; other posts fall back to the first inline image.
- **`articleBody`** (on by default) includes the full plain text of each post, which gives LLM crawlers the complete content without needing to parse your theme's HTML. Turn it off in the plug-in settings if you prefer smaller pages.
- All JSON is generated with Hugo's `jsonify`, so titles, quotes, and HTML in your content are always safely escaped.

## Installation

1. In Micro.blog, go to **Design → Edit Custom Themes**.
2. Click **New Plug-in** (this is the correct button even for installing — not "New Theme").
3. Give it a title (e.g. "Structured Data"), paste this repository's clone URL (`https://github.com/gr36/mb_structureddata.git`), pick your blog in the **Site** dropdown, and click **Add Plug-in**.
4. Once it's registered in the official directory you'll instead find it under **Design → Plug-ins → Find Plug-ins**.

After installing, a **Settings** button for the plug-in appears on the **Design → Plug-ins** page.

> **Note:** if you add the repository as a *theme* instead of a plug-in, Micro.blog ignores `plugin.json` — you get no settings screen and no structured data. Make sure it shows up in your Plug-ins list.

### Custom themes

Micro.blog's built-in themes render plug-in partials inside the page `<head>` automatically (via `microblog_head.html`). If you use a **custom theme with its own hand-written head template**, it must include the standard plug-in loop or no HTML plug-in can inject anything. Check your theme's head template for this, and add it just before `</head>` if it's missing:

```go-html-template
{{ range $filename := .Site.Params.plugins_html }}
  {{ partial $filename $ }}
{{ end }}
```

(If your theme already shows plug-in CSS — `<link>` tags with `?v=` versions — but not plug-in HTML, this loop is exactly what's missing.)

## Settings

All settings are optional; sensible defaults come from your Micro.blog account.

| Setting | Purpose |
| --- | --- |
| Author name | Override the name from your Micro.blog account |
| Author URL | Point the author at an about page instead of the site root |
| Extra profile URLs | Comma-separated URLs added to the author's `sameAs` list |
| Publisher / organization name | Publish under an organization instead of yourself |
| Publisher logo URL | Logo used with the organization publisher |
| Include full post text | Toggle `articleBody` on posts (on by default) |

## Troubleshooting

- **No Settings button on the Plug-ins page** — the repo was probably added as a theme, not a plug-in. Remove it and reinstall via **Edit Custom Themes → New Plug-in** with the clone URL.
- **Plug-in installed but no `<script type="application/ld+json">` in the page source** — your custom theme is missing the `plugins_html` loop; see "Custom themes" above.
- **Updated the plug-in but the site didn't change** — Micro.blog clones the repository when the plug-in is added and doesn't auto-pull. Uninstall and re-add the plug-in (or install the newer version when prompted after a version bump).

## Verifying it works

After installing, run any post URL through:

- [Schema Markup Validator](https://validator.schema.org)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

You should see the `BlogPosting` (or `WebSite` for your home page) object with your details filled in.

## License

MIT — see [LICENSE](LICENSE).
