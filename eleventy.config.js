// OpenShore marketing site — clean, single-tenant Eleventy build. This site
// owns its own Cloudflare Pages deploy target with no co-tenant, so there is
// no shared-branch machinery here. Standard Eleventy defaults, output to
// _site.

export default function (eleventyConfig) {
  // Verbatim assets (styles, fonts, favicon, robots.txt, og image) copy to root.
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

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
