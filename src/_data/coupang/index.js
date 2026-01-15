/**
 * Coupang Partners Data Module
 *
 * Main entry point for Coupang data integration.
 * Provides functions for generating affiliate links and transforming product data.
 *
 * Status: Skeleton implementation - API integration pending credentials
 */

import config from './config.js';

/**
 * Generate an affiliate link for a Coupang product
 *
 * @param {string} productId - Coupang product ID
 * @param {object} options - Optional parameters
 * @param {string} options.subId - Tracking identifier for this link
 * @returns {string} Affiliate link URL
 *
 * @example
 * generateAffiliateLink('12345678', { subId: 'review-post-1' })
 * // Returns: https://link.coupang.com/re/AFFSDP?lptag=AF1234&subid=review-post-1&pageKey=12345678
 */
export function generateAffiliateLink(productId, options = {}) {
  const { subId = config.affiliateLink.defaultSubId } = options;
  const partnerId = config.partnerId;

  if (!partnerId) {
    console.warn('[Coupang] Partner ID not configured. Set COUPANG_PARTNER_ID environment variable.');
    // Return a placeholder link for development
    return `https://www.coupang.com/vp/products/${productId}`;
  }

  // Construct affiliate link with tracking parameters
  const params = new URLSearchParams({
    lptag: partnerId,
    subid: subId,
    pageKey: productId
  });

  return `${config.affiliateLink.baseUrl}/re/AFFSDP?${params.toString()}`;
}

/**
 * Transform raw product data to post frontmatter format
 *
 * @param {object} rawData - Raw product data from API or manual entry
 * @param {string} rawData.productId - Product ID
 * @param {string} rawData.productName - Product name
 * @param {number} rawData.productPrice - Price in KRW
 * @param {number} rawData.productRating - Rating (1-5)
 * @param {string} rawData.productImage - Image URL
 * @param {string} rawData.productUrl - Original product URL (optional)
 * @param {object} options - Transform options
 * @param {string} options.subId - Tracking identifier
 * @returns {object} Product data in post frontmatter format
 *
 * @example
 * transformProductData({
 *   productId: '12345678',
 *   productName: '삼성 갤럭시 버즈',
 *   productPrice: 159000,
 *   productRating: 4.5,
 *   productImage: 'https://example.com/image.jpg'
 * })
 */
export function transformProductData(rawData, options = {}) {
  const {
    productId,
    productName,
    productPrice,
    productRating,
    productImage,
    productUrl
  } = rawData;

  // Log transformation for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Coupang] Transforming product data for: ${productName || productId}`);
  }

  return {
    name: productName || '',
    price: productPrice || 0,
    rating: productRating || 0,
    affiliateLink: productId ? generateAffiliateLink(productId, options) : (productUrl || ''),
    image: productImage || ''
  };
}

/**
 * Check if API integration is available
 *
 * @returns {boolean} True if API credentials are configured
 */
export function isApiAvailable() {
  const available = config.isApiEnabled();

  if (!available) {
    console.log('[Coupang] API not available. Configure COUPANG_ACCESS_KEY and COUPANG_SECRET_KEY.');
    console.log('[Coupang] Using manual product entry mode. See DISCOVERY.md for details.');
  }

  return available;
}

// Default export for 11ty data file compatibility
export default {
  generateAffiliateLink,
  transformProductData,
  isApiAvailable,
  config
};
