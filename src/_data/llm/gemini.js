/**
 * Gemini API Client Module
 * Handles communication with Google's Gemini API for content generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  API_KEY,
  MODEL,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  isConfigured,
} from './config.js';

// Singleton client instance
let client = null;

/**
 * Initialize the Gemini client with API key
 * @returns {GoogleGenerativeAI} Initialized client
 * @throws {Error} If API key is not configured
 */
export function initClient() {
  if (!isConfigured()) {
    throw new Error(
      'Gemini API key not configured. Set GEMINI_API_KEY environment variable.'
    );
  }

  if (!client) {
    client = new GoogleGenerativeAI(API_KEY);
  }

  return client;
}

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
function getBackoffDelay(attempt) {
  return RETRY_DELAY_MS * Math.pow(2, attempt);
}

/**
 * Check if an error is a rate limit error
 * @param {Error} error - Error to check
 * @returns {boolean} True if rate limit error
 */
function isRateLimitError(error) {
  // Check for 429 status code or rate limit message
  return (
    error.status === 429 ||
    error.message?.includes('429') ||
    error.message?.toLowerCase().includes('rate limit') ||
    error.message?.toLowerCase().includes('quota exceeded')
  );
}

/**
 * Generate content using Gemini API
 * @param {string} prompt - The prompt to send to the model
 * @param {Object} options - Generation options
 * @param {number} [options.maxOutputTokens=8192] - Maximum tokens in response
 * @param {number} [options.temperature=0.7] - Temperature for generation (0-2)
 * @returns {Promise<string>} Generated text content
 * @throws {Error} If generation fails after all retries
 */
export async function generateContent(prompt, options = {}) {
  const { maxOutputTokens = 8192, temperature = 0.7 } = options;

  const genAI = initClient();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      maxOutputTokens,
      temperature,
    },
  });

  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;

      // Check if we should retry (rate limit errors)
      if (isRateLimitError(error) && attempt < MAX_RETRIES - 1) {
        const delay = getBackoffDelay(attempt);
        console.log(
          `Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`
        );
        await sleep(delay);
        continue;
      }

      // For non-rate-limit errors, don't retry
      if (!isRateLimitError(error)) {
        throw error;
      }
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed to generate content after ${MAX_RETRIES} attempts. Last error: ${lastError.message}`
  );
}

/**
 * Generate a product review using Gemini
 * @param {Object} productData - Product information
 * @param {string} productData.name - Product name
 * @param {string} [productData.description] - Product description
 * @param {number} [productData.price] - Product price
 * @param {string} [productData.category] - Product category
 * @param {string} systemPrompt - System prompt with instructions for review generation
 * @returns {Promise<string>} Generated markdown review content
 */
export async function generateProductReview(productData, systemPrompt) {
  if (!productData || !productData.name) {
    throw new Error('Product data with name is required');
  }

  if (!systemPrompt) {
    throw new Error('System prompt is required');
  }

  // Construct the full prompt with product data
  const productContext = `
Product Information:
- Name: ${productData.name}
${productData.description ? `- Description: ${productData.description}` : ''}
${productData.price ? `- Price: ${productData.price.toLocaleString()}원` : ''}
${productData.category ? `- Category: ${productData.category}` : ''}
`.trim();

  const fullPrompt = `${systemPrompt}

${productContext}`;

  return generateContent(fullPrompt, {
    maxOutputTokens: 8192,
    temperature: 0.7,
  });
}

export default {
  initClient,
  generateContent,
  generateProductReview,
};
