/**
 * Coupang Affiliate Link Generator
 *
 * Generates affiliate links with proper tracking for Coupang Partners.
 * Includes utilities for parsing product URLs and extracting product IDs.
 */

import config from './config.js';

/**
 * Generate an affiliate link for a Coupang product
 *
 * @param {string} productId - Coupang product ID
 * @param {object} options - Optional parameters
 * @param {string} options.subId - Tracking identifier for this link
 * @param {string} options.campaign - Campaign name for tracking (optional)
 * @returns {string} Affiliate link URL
 *
 * @example
 * generateAffiliateLink('12345678', { subId: 'review-post-1' })
 * // Returns: https://link.coupang.com/re/AFFSDP?lptag=AF1234&subid=review-post-1&pageKey=12345678
 *
 * @example
 * generateAffiliateLink('12345678', { subId: 'homepage', campaign: 'jan2026' })
 * // Returns: https://link.coupang.com/re/AFFSDP?lptag=AF1234&subid=homepage&pageKey=12345678&utm_campaign=jan2026
 */
export function generateAffiliateLink(productId, options = {}) {
  // Validate product ID
  if (!productId || typeof productId !== 'string') {
    throw new Error('[Coupang] Invalid product ID. Product ID must be a non-empty string.');
  }

  // Clean product ID (remove any whitespace)
  const cleanProductId = productId.trim();
  if (!cleanProductId) {
    throw new Error('[Coupang] Invalid product ID. Product ID cannot be empty.');
  }

  const { subId = config.affiliateLink.defaultSubId, campaign } = options;
  const partnerId = config.partnerId;

  if (!partnerId) {
    console.warn('[Coupang] Partner ID not configured. Set COUPANG_PARTNER_ID environment variable.');
    console.warn('[Coupang] Returning direct product URL without affiliate tracking.');
    // Return direct product URL for development/testing
    return `https://www.coupang.com/vp/products/${cleanProductId}`;
  }

  // Construct affiliate link with tracking parameters
  const params = new URLSearchParams({
    lptag: partnerId,
    subid: subId,
    pageKey: cleanProductId
  });

  // Add optional campaign tracking
  if (campaign) {
    params.append('utm_campaign', campaign);
  }

  return `${config.affiliateLink.baseUrl}/re/AFFSDP?${params.toString()}`;
}

/**
 * Parse a Coupang product URL to extract the product ID
 *
 * Supports multiple URL formats:
 * - https://www.coupang.com/vp/products/12345678
 * - https://www.coupang.com/vp/products/12345678?vendorItemId=...
 * - https://m.coupang.com/vm/products/12345678
 * - https://link.coupang.com/re/AFFSDP?...&pageKey=12345678
 *
 * @param {string} url - Coupang product URL
 * @returns {string|null} Product ID if found, null otherwise
 *
 * @example
 * parseProductUrl('https://www.coupang.com/vp/products/12345678?vendorItemId=999')
 * // Returns: '12345678'
 *
 * @example
 * parseProductUrl('https://link.coupang.com/re/AFFSDP?lptag=AF123&pageKey=12345678')
 * // Returns: '12345678'
 */
export function parseProductUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Check if it's a Coupang domain
    if (!hostname.includes('coupang.com')) {
      console.warn('[Coupang] URL is not a Coupang domain:', hostname);
      return null;
    }

    // Pattern 1: Direct product URL
    // https://www.coupang.com/vp/products/12345678
    // https://m.coupang.com/vm/products/12345678
    const productPathMatch = urlObj.pathname.match(/\/v[pm]\/products\/(\d+)/);
    if (productPathMatch) {
      return productPathMatch[1];
    }

    // Pattern 2: Affiliate link with pageKey parameter
    // https://link.coupang.com/re/AFFSDP?pageKey=12345678
    const pageKey = urlObj.searchParams.get('pageKey');
    if (pageKey) {
      return pageKey;
    }

    // Pattern 3: itemId parameter (some affiliate links)
    const itemId = urlObj.searchParams.get('itemId');
    if (itemId) {
      return itemId;
    }

    // Pattern 4: Product ID in path (alternate formats)
    const altPathMatch = urlObj.pathname.match(/\/products?\/(\d+)/);
    if (altPathMatch) {
      return altPathMatch[1];
    }

    console.warn('[Coupang] Could not extract product ID from URL:', url);
    return null;
  } catch (error) {
    console.error('[Coupang] Invalid URL format:', error.message);
    return null;
  }
}

/**
 * Create affiliate link from a Coupang product URL
 *
 * Convenience function that combines parseProductUrl and generateAffiliateLink.
 *
 * @param {string} url - Coupang product URL
 * @param {object} options - Options for affiliate link generation
 * @returns {string} Affiliate link URL
 * @throws {Error} If product ID cannot be extracted from URL
 *
 * @example
 * createAffiliateLinkFromUrl('https://www.coupang.com/vp/products/12345678', { subId: 'blog' })
 * // Returns: https://link.coupang.com/re/AFFSDP?lptag=AF1234&subid=blog&pageKey=12345678
 */
export function createAffiliateLinkFromUrl(url, options = {}) {
  const productId = parseProductUrl(url);

  if (!productId) {
    throw new Error(`[Coupang] Could not extract product ID from URL: ${url}`);
  }

  return generateAffiliateLink(productId, options);
}

// Default export for module compatibility
export default {
  generateAffiliateLink,
  parseProductUrl,
  createAffiliateLinkFromUrl
};
