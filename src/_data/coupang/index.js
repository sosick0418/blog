/**
 * Coupang Partners Data Module
 *
 * Main entry point for Coupang data integration.
 * Provides functions for generating affiliate links and transforming product data.
 *
 * Status: Manual data mode - API integration pending credentials
 */

import config from './config.js';
import { getProducts, getProduct } from './products.js';

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
 * Supports both products.json schema and legacy API response format.
 *
 * @param {object} rawData - Raw product data from products.json or API
 * @param {string} rawData.productId - Product ID (required)
 * @param {string} rawData.name - Product name (products.json format)
 * @param {string} rawData.productName - Product name (API format, fallback)
 * @param {number} rawData.price - Price in KRW (products.json format)
 * @param {number} rawData.productPrice - Price in KRW (API format, fallback)
 * @param {string} rawData.imageUrl - Image URL (products.json format)
 * @param {string} rawData.productImage - Image URL (API format, fallback)
 * @param {string} rawData.category - Product category
 * @param {string} rawData.description - Product description
 * @param {number} rawData.rating - Product rating (optional)
 * @param {object} options - Transform options
 * @param {string} options.subId - Tracking identifier
 * @returns {object} Product data with nested product object for templates
 *
 * @example
 * transformProductData({
 *   productId: '12345678',
 *   name: '삼성 갤럭시 버즈',
 *   price: 159000,
 *   imageUrl: '/images/buds.jpg',
 *   category: 'electronics'
 * })
 * // Returns: { product: { name, price, rating, affiliateLink, image }, category }
 */
export function transformProductData(rawData, options = {}) {
  const {
    productId,
    // Support both products.json and legacy API field names
    name,
    productName,
    price,
    productPrice,
    imageUrl,
    productImage,
    category = 'general',
    description = '',
    rating,
    productRating
  } = rawData;

  const productNameValue = name || productName || '';
  const productPriceValue = price || productPrice || 0;
  const productImageValue = imageUrl || productImage || '';
  const productRatingValue = rating || productRating || 0;

  return {
    product: {
      name: productNameValue,
      price: productPriceValue,
      rating: productRatingValue,
      affiliateLink: productId ? generateAffiliateLink(productId, options) : '',
      image: productImageValue
    },
    category,
    description
  };
}

/**
 * Create complete post frontmatter from product data
 *
 * Generates all frontmatter fields needed for a product review post,
 * including SEO-friendly title and layout configuration.
 *
 * @param {object} product - Product data from products.json
 * @param {object} options - Frontmatter options
 * @param {string} options.title - Custom title (default: auto-generated from product name)
 * @param {string} options.layout - Template layout (default: 'post.njk')
 * @param {string} options.subId - Affiliate tracking ID
 * @param {Array<string>} options.tags - Additional tags
 * @returns {object} Complete frontmatter object ready for markdown file
 *
 * @example
 * createPostFrontmatter({
 *   productId: '12345678',
 *   name: '삼성 갤럭시 버즈2 프로',
 *   price: 159000,
 *   imageUrl: '/images/buds.jpg',
 *   category: 'electronics',
 *   description: '삼성 프리미엄 무선 이어폰'
 * })
 */
export function createPostFrontmatter(product, options = {}) {
  const {
    title,
    layout = 'post.njk',
    subId,
    tags = []
  } = options;

  const transformed = transformProductData(product, { subId });

  // Generate SEO-friendly title from product name
  const postTitle = title || `${product.name} 리뷰 - 상세 분석 및 구매 가이드`;

  return {
    title: postTitle,
    layout,
    date: new Date().toISOString(),
    product: transformed.product,
    category: transformed.category,
    description: transformed.description || `${product.name}의 상세 리뷰와 구매 가이드`,
    tags: ['review', transformed.category, ...tags].filter(Boolean)
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

// Re-export product functions for convenience
export { getProducts, getProduct };

// Default export for 11ty data file compatibility
export default {
  generateAffiliateLink,
  transformProductData,
  createPostFrontmatter,
  isApiAvailable,
  getProducts,
  getProduct,
  config
};
