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

1. In Micro.blog, go to **Design → Edit Custom Themes → Plug-ins**.
2. Find **Structured Data** in the plug-in directory and install it, or install it manually with this repository's URL.

That's it — the markup is added automatically. It works alongside any theme, because Micro.blog renders plug-in partials inside the page head after the theme is applied.

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

## Verifying it works

After installing, run any post URL through:

- [Schema Markup Validator](https://validator.schema.org)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

You should see the `BlogPosting` (or `WebSite` for your home page) object with your details filled in.

## License

MIT — see [LICENSE](LICENSE).
