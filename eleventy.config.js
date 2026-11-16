// OpenShore marketing site — clean, single-tenant Eleventy build. This site
// owns its own Cloudflare Pages deploy target with no co-tenant, so there is
// no shared-branch machinery here. Standard Eleventy defaults, output to
// _site.

export default function (eleventyConfig) {
  // Verbatim assets (styles, fonts, favicon, robots.txt, og image) copy to root.
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  // The web app (index.html and its assets/), built from openshore.code.ai/app
  // and published here by that repo's "Publish web app" workflow, served at
  // /os-code/app/ (2026-11-16; at the root from 2026-11-07). The site's home
  // is OpenShore for Enterprise.
  eleventyConfig.addPassthroughCopy({ "src/webapp": "os-code/app" });

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
