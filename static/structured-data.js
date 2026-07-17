/* Structured Data plug-in for Micro.blog — JavaScript fallback.
   Some custom themes never render plug-in HTML partials, so the Hugo
   partial can't inject JSON-LD server-side. This script rebuilds the
   same schema.org data in the browser from the page's own metadata
   (og:/article: meta tags, rel=me links, and feed.json) and injects it
   into the head. It does nothing when JSON-LD is already present. */
(function () {
  "use strict";

  function init() {
    if (document.querySelector('script[type="application/ld+json"]')) {
      return; // the Hugo partial (or the theme) already provides structured data
    }

    var canonical = document.querySelector('link[rel="canonical"]');
    var pageURL = metaContent("og:url") || (canonical && canonical.href) || location.href;
    var lang = document.documentElement.lang || "en";

    fetchFeed().then(function (feed) {
      var siteURL = (feed && feed.home_page_url) || location.origin + "/";
      var siteName = (feed && feed.title) || document.title;

      var author = { "@type": "Person", "name": siteName, "url": siteURL };
      if (feed && feed.icon) {
        author.image = feed.icon;
      }
      var sameAs = collectRelMe(siteURL);
      if (sameAs.length) {
        author.sameAs = sameAs;
      }

      var schema;
      if (metaContent("og:type") === "article") {
        schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          mainEntityOfPage: { "@type": "WebPage", "@id": pageURL },
          url: pageURL,
          headline: headline(),
          inLanguage: lang,
          author: author,
          publisher: author
        };
        var description = trimText(metaContent("og:description"));
        if (description) {
          schema.description = truncate(description, 500);
        }
        var published = metaContent("article:published_time");
        if (published) {
          schema.datePublished = published;
        }
        var modified = metaContent("article:modified_time");
        if (modified) {
          schema.dateModified = modified;
        }
        var images = metaContents("og:image");
        if (images.length) {
          schema.image = images;
        }
      } else {
        schema = {
          "@context": "https://schema.org",
          "@type": location.pathname === "/" ? "WebSite" : "WebPage",
          name: metaContent("og:title") || document.title || siteName,
          url: pageURL,
          inLanguage: lang,
          author: author
        };
        if (location.pathname === "/") {
          schema.publisher = author;
          var siteDescription = trimText(metaContent("og:description") || metaContent("description", "name"));
          if (siteDescription) {
            schema.description = siteDescription;
          }
        }
      }

      var tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.setAttribute("data-mb-structured-data", "js");
      tag.text = JSON.stringify(schema);
      document.head.appendChild(tag);
    });
  }

  function headline() {
    var title = metaContent("og:title");
    if (!title) {
      // title-less microposts: fall back to the description, then the page title
      title = trimText(metaContent("og:description")) || document.title;
    }
    return truncate(trimText(title), 110);
  }

  function metaContent(name, attr) {
    var el = document.querySelector("meta[" + (attr || "property") + '="' + name + '"]');
    return el ? el.getAttribute("content") : null;
  }

  function metaContents(name) {
    return Array.prototype.map.call(
      document.querySelectorAll('meta[property="' + name + '"]'),
      function (el) { return el.getAttribute("content"); }
    ).filter(Boolean);
  }

  function collectRelMe(siteURL) {
    var seen = {};
    var urls = [];
    Array.prototype.forEach.call(
      document.querySelectorAll('link[rel~="me"], a[rel~="me"]'),
      function (el) {
        var href = el.href;
        if (href && !seen[href] && href !== siteURL) {
          seen[href] = true;
          urls.push(href);
        }
      }
    );
    return urls;
  }

  function fetchFeed() {
    if (typeof fetch !== "function") {
      return Promise.resolve(null);
    }
    return fetch("/feed.json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function trimText(text) {
    return text ? text.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "") : "";
  }

  function truncate(text, max) {
    return text.length > max ? text.slice(0, max - 1) + "…" : text;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
