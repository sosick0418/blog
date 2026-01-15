/**
 * Coupang Product Data Module
 *
 * Provides functions to fetch and manage product data.
 * Supports both manual JSON data and future API integration.
 *
 * Status: Manual data mode - API integration pending credentials
 */

import { createRequire } from 'module';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the products JSON data file
const PRODUCTS_FILE = join(__dirname, '..', 'products.json');

// In-memory cache for products
let productsCache = null;

/**
 * Load products from the JSON data file
 *
 * @returns {Promise<Array>} Array of products or empty array on failure
 */
async function loadProductsFromFile() {
  try {
    const data = await readFile(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.products || [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('[Coupang Products] No products.json file found. Create one with sample products.');
    } else {
      console.error('[Coupang Products] Error loading products:', error.message);
    }
    return [];
  }
}

/**
 * Validate that a product has required fields
 *
 * @param {object} product - Product object to validate
 * @returns {boolean} True if product has required fields
 */
function validateProduct(product) {
  const requiredFields = ['productId', 'name', 'price'];
  const missingFields = requiredFields.filter(field => !product[field]);

  if (missingFields.length > 0) {
    console.warn(`[Coupang Products] Product missing required fields: ${missingFields.join(', ')}`, product);
    return false;
  }

  return true;
}

/**
 * Get all products from the data source
 *
 * Reads from JSON file in manual mode.
 * Will support API fetching when credentials are available.
 *
 * @param {object} options - Fetch options
 * @param {boolean} options.useCache - Use cached data if available (default: true)
 * @param {string} options.category - Filter by category (optional)
 * @returns {Promise<Array>} Array of product objects
 *
 * @example
 * const products = await getProducts();
 * const electronics = await getProducts({ category: 'electronics' });
 */
export async function getProducts(options = {}) {
  const { useCache = true, category = null } = options;

  try {
    // Return cached data if available and requested
    if (useCache && productsCache !== null) {
      let products = productsCache;
      if (category) {
        products = products.filter(p => p.category === category);
      }
      return products;
    }

    // Load from file (manual mode)
    const products = await loadProductsFromFile();

    // Validate all products
    const validProducts = products.filter(validateProduct);

    if (validProducts.length !== products.length) {
      console.warn(`[Coupang Products] ${products.length - validProducts.length} invalid products filtered out`);
    }

    // Update cache
    productsCache = validProducts;

    // Apply category filter if requested
    if (category) {
      return validProducts.filter(p => p.category === category);
    }

    return validProducts;
  } catch (error) {
    console.error('[Coupang Products] Error fetching products:', error.message);
    return [];
  }
}

/**
 * Get a single product by ID
 *
 * @param {string} productId - The product ID to fetch
 * @returns {Promise<object|null>} Product object or null if not found
 *
 * @example
 * const product = await getProduct('1234567890');
 * if (product) {
 *   console.log(product.name);
 * }
 */
export async function getProduct(productId) {
  try {
    if (!productId) {
      console.warn('[Coupang Products] No productId provided');
      return null;
    }

    const products = await getProducts();
    const product = products.find(p => p.productId === productId);

    if (!product) {
      console.log(`[Coupang Products] Product not found: ${productId}`);
    }

    return product || null;
  } catch (error) {
    console.error(`[Coupang Products] Error fetching product ${productId}:`, error.message);
    return null;
  }
}

/**
 * Clear the products cache
 *
 * Useful for forcing a fresh load from the data source.
 */
export function clearCache() {
  productsCache = null;
  console.log('[Coupang Products] Cache cleared');
}

/**
 * Get the count of available products
 *
 * @returns {Promise<number>} Number of products
 */
export async function getProductCount() {
  const products = await getProducts();
  return products.length;
}

// Default export for 11ty data file compatibility
export default {
  getProducts,
  getProduct,
  clearCache,
  getProductCount
};
