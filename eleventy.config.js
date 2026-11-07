// OpenShore marketing site — clean, single-tenant Eleventy build. This site
// owns its own Cloudflare Pages deploy target with no co-tenant, so there is
// no shared-branch machinery here. Standard Eleventy defaults, output to
// _site.

export default function (eleventyConfig) {
  // Verbatim assets (styles, fonts, favicon, robots.txt, og image) copy to root.
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  // The web app at the site's root (index.html and its assets/), built from
  // openshore.code.ai/app and published here by that repo's "Publish web app"
  // workflow. The site's own pages live under /about/, so nothing collides.
  eleventyConfig.addPassthroughCopy({ "src/webapp": "." });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
