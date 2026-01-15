#!/usr/bin/env node

/**
 * Post Generation Script
 *
 * Generates markdown blog post files from Coupang product data.
 * Supports both single product generation and batch processing from JSON file.
 *
 * Usage:
 *   node scripts/generate-post.js --product <productId> [options]
 *   node scripts/generate-post.js --file <products.json> [options]
 *   node scripts/generate-post.js --help
 *
 * Options:
 *   --product <id>    Generate post for a single product ID
 *   --file <path>     Generate posts from JSON file containing product array
 *   --force           Overwrite existing files without prompting
 *   --category <cat>  Set category for the post (default: general)
 *   --subid <id>      Set tracking subId for affiliate links
 *   --help            Show this help message
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Coupang modules
import { generateAffiliateLink } from '../src/_data/coupang/affiliate.js';

// Configuration
const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');

/**
 * Convert Korean text to URL-safe slug
 *
 * @param {string} text - Text to convert
 * @returns {string} URL-safe slug
 */
function slugify(text) {
  if (!text) return 'untitled';

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace Korean characters with romanization or keep as-is for file names
    // For simplicity, we'll keep Korean but make it URL-safe
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\uAC00-\uD7A3가-힣-]/g, '') // Keep only words, Korean, and hyphens
    .replace(/--+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-+/, '')             // Trim hyphens from start
    .replace(/-+$/, '');            // Trim hyphens from end
}

/**
 * Generate frontmatter YAML from product data
 *
 * @param {object} product - Product data
 * @param {object} options - Generation options
 * @returns {string} YAML frontmatter string
 */
function generateFrontmatter(product, options = {}) {
  const {
    productId,
    productName,
    productPrice = 0,
    productRating = 4,
    productImage = ''
  } = product;

  const category = options.category || product.category || 'general';
  const subId = options.subId || slugify(productName);

  const affiliateLink = generateAffiliateLink(productId, { subId });

  const date = new Date().toISOString().split('T')[0];

  return `---
title: "${productName} 리뷰"
description: "${productName} 상세 리뷰 및 구매 가이드"
date: ${date}
category: ${category}
product:
  name: "${productName}"
  price: ${productPrice}
  rating: ${productRating}
  affiliateLink: "${affiliateLink}"
  image: "${productImage}"
---`;
}

/**
 * Generate placeholder content structure for LLM to fill
 *
 * @param {object} product - Product data
 * @returns {string} Markdown content with placeholders
 */
function generateContentPlaceholder(product) {
  const { productName } = product;

  return `
<!-- LLM content placeholder -->
<!-- Product: ${productName} -->

## 제품 소개

[AI가 작성할 제품 소개 섹션]

- 제품 개요 및 주요 특징
- 타겟 사용자층
- 경쟁 제품과의 차별점

## 장점

[AI가 작성할 장점 섹션]

### 장점 1
- 상세 설명

### 장점 2
- 상세 설명

### 장점 3
- 상세 설명

## 단점

[AI가 작성할 단점 섹션]

### 단점 1
- 상세 설명

### 단점 2
- 상세 설명

## 구매 추천

[AI가 작성할 구매 추천 섹션]

**추천 대상:**
- [대상 1]
- [대상 2]
- [대상 3]

**비추천 대상:**
- [대상 1]
- [대상 2]

## 총평

[AI가 작성할 총평 섹션]

<!-- End LLM content -->
`;
}

/**
 * Generate complete markdown post content
 *
 * @param {object} product - Product data
 * @param {object} options - Generation options
 * @returns {string} Complete markdown content
 */
function generatePostContent(product, options = {}) {
  const frontmatter = generateFrontmatter(product, options);
  const content = generateContentPlaceholder(product);

  return `${frontmatter}\n${content}`;
}

/**
 * Write post file to disk
 *
 * @param {object} product - Product data
 * @param {object} options - Generation options
 * @returns {string} Path to written file
 */
function writePostFile(product, options = {}) {
  const { productName, productId } = product;
  const slug = slugify(productName) || `product-${productId}`;
  const filename = `${slug}.md`;
  const filepath = path.join(POSTS_DIR, filename);

  // Check if file exists
  if (fs.existsSync(filepath) && !options.force) {
    console.error(`[Error] File already exists: ${filepath}`);
    console.error('Use --force flag to overwrite existing files.');
    return null;
  }

  // Ensure posts directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  // Generate and write content
  const content = generatePostContent(product, options);
  fs.writeFileSync(filepath, content, 'utf8');

  console.log(`[Success] Generated post: ${filepath}`);
  return filepath;
}

/**
 * Load products from JSON file
 *
 * @param {string} filepath - Path to JSON file
 * @returns {Array} Array of product objects
 */
function loadProductsFromFile(filepath) {
  const absolutePath = path.isAbsolute(filepath)
    ? filepath
    : path.join(process.cwd(), filepath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const data = JSON.parse(content);

  // Support both array and object with 'products' key
  if (Array.isArray(data)) {
    return data;
  }

  if (data.products && Array.isArray(data.products)) {
    return data.products;
  }

  throw new Error('Invalid JSON format. Expected array or object with "products" key.');
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Post Generation Script - Generate blog posts from Coupang product data

Usage:
  node scripts/generate-post.js --product <productId> [options]
  node scripts/generate-post.js --file <products.json> [options]
  npm run generate:post -- --product <productId>

Options:
  --product <id>     Generate post for a single product ID
                     Requires additional product data via --name and --price
  --name <name>      Product name (required with --product)
  --price <price>    Product price in KRW (optional, default: 0)
  --rating <rating>  Product rating 1-5 (optional, default: 4)
  --image <url>      Product image URL (optional)

  --file <path>      Generate posts from JSON file containing product array
                     JSON format: [{ productId, productName, productPrice, ... }]

  --category <cat>   Set category for the post (default: general)
  --subid <id>       Set tracking subId for affiliate links

  --force            Overwrite existing files without prompting
  --help             Show this help message

Examples:
  # Generate single product post
  node scripts/generate-post.js --product 12345 --name "Samsung Galaxy Buds" --price 299000

  # Generate from JSON file
  node scripts/generate-post.js --file products.json --category electronics

  # Force overwrite
  node scripts/generate-post.js --file products.json --force

JSON File Format:
  [
    {
      "productId": "12345678",
      "productName": "Product Name",
      "productPrice": 99000,
      "productRating": 4.5,
      "productImage": "https://example.com/image.jpg",
      "category": "electronics"
    }
  ]
`);
}

/**
 * Parse command line arguments
 *
 * @param {Array} args - Process arguments
 * @returns {object} Parsed options
 */
function parseArgs(args) {
  const options = {
    force: false,
    category: 'general'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      case '--product':
        options.productId = nextArg;
        i++;
        break;
      case '--name':
        options.productName = nextArg;
        i++;
        break;
      case '--price':
        options.productPrice = parseInt(nextArg, 10) || 0;
        i++;
        break;
      case '--rating':
        options.productRating = parseFloat(nextArg) || 4;
        i++;
        break;
      case '--image':
        options.productImage = nextArg;
        i++;
        break;
      case '--file':
        options.file = nextArg;
        i++;
        break;
      case '--category':
        options.category = nextArg;
        i++;
        break;
      case '--subid':
        options.subId = nextArg;
        i++;
        break;
    }
  }

  return options;
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Show help
  if (options.help || args.length === 0) {
    showHelp();
    process.exit(0);
  }

  console.log('[Post Generator] Starting...\n');

  let products = [];

  // Load from file
  if (options.file) {
    try {
      products = loadProductsFromFile(options.file);
      console.log(`[Info] Loaded ${products.length} products from ${options.file}\n`);
    } catch (error) {
      console.error(`[Error] Failed to load file: ${error.message}`);
      process.exit(1);
    }
  }

  // Single product from command line
  if (options.productId) {
    if (!options.productName) {
      console.error('[Error] --name is required when using --product');
      console.error('Example: --product 12345 --name "Product Name"');
      process.exit(1);
    }

    products.push({
      productId: options.productId,
      productName: options.productName,
      productPrice: options.productPrice || 0,
      productRating: options.productRating || 4,
      productImage: options.productImage || '',
      category: options.category
    });
  }

  // Validate products
  if (products.length === 0) {
    console.error('[Error] No products to process. Use --product or --file option.');
    showHelp();
    process.exit(1);
  }

  // Process each product
  let successCount = 0;
  let failCount = 0;

  for (const product of products) {
    // Validate required fields
    if (!product.productId) {
      console.error(`[Error] Missing productId for product: ${product.productName || 'unknown'}`);
      failCount++;
      continue;
    }

    if (!product.productName) {
      console.error(`[Error] Missing productName for product ID: ${product.productId}`);
      failCount++;
      continue;
    }

    // Generate post
    const result = writePostFile(product, {
      force: options.force,
      category: product.category || options.category,
      subId: options.subId
    });

    if (result) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n[Post Generator] Complete');
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed: ${failCount}`);

  process.exit(failCount > 0 ? 1 : 0);
}

// Run main
main().catch(error => {
  console.error('[Error] Unexpected error:', error.message);
  process.exit(1);
});
