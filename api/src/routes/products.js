import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  readProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  slugify
} from '../services/data.js';
import { generateReviewContent } from '../services/llm.js';
import { deploy } from '../services/git.js';

export const productsRouter = Router();

/**
 * GET /api/products
 * List all products
 */
productsRouter.get('/', (req, res, next) => {
  try {
    const products = readProducts();
    const { category } = req.query;

    const filtered = category
      ? products.filter(p => p.category === category)
      : products;

    res.json({
      success: true,
      count: filtered.length,
      products: filtered
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID
 */
productsRouter.get('/:id', (req, res, next) => {
  try {
    const product = getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'PRODUCT_NOT_FOUND',
        message: `Product with ID ${req.params.id} not found`
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/products
 * Create a new product (without LLM generation)
 */
productsRouter.post('/', (req, res, next) => {
  try {
    const {
      productId,
      name,
      price,
      imageUrl,
      category,
      description,
      affiliateUrl,
      rating,
      specs,
      pros,
      cons,
      content
    } = req.body;

    // Validation
    if (!productId || !name) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'productId and name are required'
      });
    }

    const product = addProduct({
      productId,
      name,
      price: price || 0,
      imageUrl: imageUrl || `https://placehold.co/600x600/1e293b/94a3b8?text=${encodeURIComponent(name)}`,
      category: category || 'electronics',
      description: description || `${name} 상세 리뷰`,
      affiliateUrl: affiliateUrl || '',
      rating: rating || 4,
      specs: specs || [],
      pros: pros || [],
      cons: cons || [],
      content: content || ''
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/products/generate
 * Generate product with LLM content and auto-deploy
 *
 * Body:
 * {
 *   productId: "coupang-product-id",
 *   name: "제품명",
 *   price: 50000,
 *   imageUrl: "https://...",
 *   category: "electronics",
 *   affiliateUrl: "https://link.coupang.com/...",
 *   rating: 4,
 *   autoDeploy: true,
 *   dryRun: false
 * }
 */
productsRouter.post('/generate', async (req, res, next) => {
  try {
    const {
      productId,
      name,
      price,
      imageUrl,
      category,
      affiliateUrl,
      rating,
      autoDeploy = true,
      dryRun = false
    } = req.body;

    // Validation
    if (!productId || !name) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'productId and name are required'
      });
    }

    console.log(`[Generate] Starting for: ${name}`);

    // Generate content with LLM
    console.log('[Generate] Generating content with LLM...');
    const generatedContent = await generateReviewContent({
      name,
      price,
      category,
      rating,
      imageUrl
    });

    // Create product object
    const product = addProduct({
      productId,
      name,
      price: price || 0,
      imageUrl: imageUrl || `https://placehold.co/600x600/1e293b/94a3b8?text=${encodeURIComponent(name)}`,
      category: category || 'electronics',
      description: generatedContent.description,
      affiliateUrl: affiliateUrl || '',
      rating: rating || 4,
      specs: generatedContent.specs,
      pros: generatedContent.pros,
      cons: generatedContent.cons,
      content: generatedContent.content
    });

    console.log(`[Generate] Product created: ${product.productId}`);

    // Auto-deploy if enabled
    let deployResult = null;
    if (autoDeploy) {
      console.log('[Generate] Auto-deploying...');
      try {
        deployResult = deploy(name, dryRun);
        console.log('[Generate] Deploy result:', deployResult);
      } catch (gitError) {
        console.error('[Generate] Deploy failed:', gitError.message);
        deployResult = { deployed: false, error: gitError.message };
      }
    }

    res.status(201).json({
      success: true,
      product,
      generated: {
        description: generatedContent.description,
        specsCount: generatedContent.specs.length,
        prosCount: generatedContent.pros.length,
        consCount: generatedContent.cons.length,
        hasContent: !!generatedContent.content
      },
      deploy: deployResult
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product
 */
productsRouter.put('/:id', (req, res, next) => {
  try {
    const product = updateProduct(req.params.id, req.body);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product
 */
productsRouter.delete('/:id', (req, res, next) => {
  try {
    deleteProduct(req.params.id);

    res.json({
      success: true,
      message: `Product ${req.params.id} deleted`
    });
  } catch (error) {
    next(error);
  }
});
