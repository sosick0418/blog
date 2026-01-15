import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to products.json in the Next.js data directory
const PRODUCTS_FILE = process.env.PRODUCTS_FILE ||
  path.join(__dirname, '../../../src/data/products.json');

/**
 * Ensure products.json exists
 */
function ensureFile() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Read all products from JSON file
 * @returns {Array} Products array
 */
export function readProducts() {
  ensureFile();
  const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  return JSON.parse(content);
}

/**
 * Write products to JSON file
 * @param {Array} products - Products array
 */
export function writeProducts(products) {
  ensureFile();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
}

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Object|null} Product or null
 */
export function getProductById(productId) {
  const products = readProducts();
  return products.find(p => p.productId === productId) || null;
}

/**
 * Add a new product
 * @param {Object} product - Product data
 * @returns {Object} Created product
 */
export function addProduct(product) {
  const products = readProducts();

  // Check for duplicate
  if (products.find(p => p.productId === product.productId)) {
    const error = new Error(`Product with ID ${product.productId} already exists`);
    error.code = 'DUPLICATE_PRODUCT';
    error.status = 409;
    throw error;
  }

  // Add timestamps
  const newProduct = {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(newProduct);
  writeProducts(products);

  return newProduct;
}

/**
 * Update an existing product
 * @param {string} productId - Product ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated product
 */
export function updateProduct(productId, updates) {
  const products = readProducts();
  const index = products.findIndex(p => p.productId === productId);

  if (index === -1) {
    const error = new Error(`Product with ID ${productId} not found`);
    error.code = 'PRODUCT_NOT_FOUND';
    error.status = 404;
    throw error;
  }

  products[index] = {
    ...products[index],
    ...updates,
    productId, // Prevent ID change
    updatedAt: new Date().toISOString()
  };

  writeProducts(products);
  return products[index];
}

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {boolean} Success
 */
export function deleteProduct(productId) {
  const products = readProducts();
  const index = products.findIndex(p => p.productId === productId);

  if (index === -1) {
    const error = new Error(`Product with ID ${productId} not found`);
    error.code = 'PRODUCT_NOT_FOUND';
    error.status = 404;
    throw error;
  }

  products.splice(index, 1);
  writeProducts(products);
  return true;
}

/**
 * Get products by category
 * @param {string} category - Category slug
 * @returns {Array} Products in category
 */
export function getProductsByCategory(category) {
  const products = readProducts();
  return products.filter(p => p.category === category);
}

/**
 * Create URL-friendly slug from product name
 * Handles Korean characters and special characters like +
 * @param {string} name - Product name
 * @returns {string} Slug
 */
export function slugify(name) {
  return name
    .replace(/[+]/g, '-')           // Replace + with -
    .replace(/[^\w\s가-힣-]/g, '')   // Remove special chars except Korean
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/-+/g, '-')            // Replace multiple - with single -
    .replace(/^-|-$/g, '')          // Remove leading/trailing -
    .toLowerCase();
}
