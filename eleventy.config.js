/**
 * 11ty Configuration
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
export default function(eleventyConfig) {
  // Passthrough copy for static assets (when added later)
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    // Directory configuration
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    // Template formats
    templateFormats: ["njk", "md", "html"],
    // Default template engine for HTML files
    htmlTemplateEngine: "njk",
    // Default template engine for Markdown files
    markdownTemplateEngine: "njk"
  };
}
