/**
 * Coupang Partners Configuration
 *
 * This module exports configuration for Coupang Partners API integration.
 * All sensitive values should be set via environment variables.
 */

const config = {
  // Partner ID assigned by Coupang Partners
  partnerId: process.env.COUPANG_PARTNER_ID || '',

  // API credentials (required for API access after 150,000 KRW sales threshold)
  accessKey: process.env.COUPANG_ACCESS_KEY || '',
  secretKey: process.env.COUPANG_SECRET_KEY || '',

  // API configuration
  api: {
    // Base URL for Coupang Partners API
    baseUrl: 'https://api-gateway.coupang.com',
    // API version
    version: 'v2',
    // Endpoints (relative to baseUrl)
    endpoints: {
      deeplink: '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink',
      search: '/v2/providers/affiliate_open_api/apis/openapi/v1/productSearch',
      goldbox: '/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox',
      bestCategories: '/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories'
    }
  },

  // Affiliate link configuration
  affiliateLink: {
    // Base URL for generated affiliate links
    baseUrl: 'https://link.coupang.com',
    // Default tracking parameters
    defaultSubId: 'techblog'
  },

  // Check if API credentials are configured
  isApiEnabled() {
    return !!(this.accessKey && this.secretKey && this.partnerId);
  }
};

export default config;
