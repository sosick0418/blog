/**
 * 11ty Configuration
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
export default function(eleventyConfig) {
  // Passthrough copy for static assets (when added later)
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copy CNAME file for GitHub Pages custom domain
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Add dateToISO filter for sitemap
  eleventyConfig.addFilter("dateToISO", (date) => {
    return new Date(date).toISOString().split('T')[0];
  });

  // Add Korean date format filter
  eleventyConfig.addFilter("dateKorean", (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  });

  // Add number format filter for price display
  eleventyConfig.addFilter("numberFormat", (num) => {
    if (num === undefined || num === null) return '';
    return num.toLocaleString('ko-KR');
  });

  return {
    // Directory configuration
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
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
