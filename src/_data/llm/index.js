/**
 * LLM Module - Main Entry Point
 * Re-exports all LLM functionality for easy importing
 */

// Re-export configuration functions
export { isConfigured, getProviderConfig } from './config.js';

// Re-export Gemini functions
export { generateContent, generateProductReview, initClient } from './gemini.js';

// Re-export prompt functions
export {
  SYSTEM_PROMPT,
  buildUserPrompt,
  buildMetaDescription,
  formatReviewOutput,
} from './prompts.js';

/**
 * Test the LLM connection with a minimal API call
 * Useful for verifying API key is valid and service is accessible
 * @returns {Promise<boolean>} True if connection successful
 * @throws {Error} If connection fails
 */
export async function testConnection() {
  const { generateContent } = await import('./gemini.js');

  try {
    const response = await generateContent('Say "hello" and nothing else.', {
      maxOutputTokens: 10,
      temperature: 0,
    });

    return response.toLowerCase().includes('hello');
  } catch (error) {
    console.error('LLM connection test failed:', error.message);
    throw error;
  }
}

/**
 * Generate a product review using LLM
 * Main entry point for content generation
 * @param {Object} product - Product information
 * @param {string} product.name - Product name
 * @param {number} [product.price] - Product price in KRW
 * @param {string} [product.category] - Product category
 * @param {string} [product.description] - Product description
 * @returns {Promise<string>} Generated markdown review content
 */
export async function generateReview(product) {
  const { generateProductReview } = await import('./gemini.js');
  const { SYSTEM_PROMPT, buildUserPrompt, formatReviewOutput } = await import(
    './prompts.js'
  );

  // Build the full prompt with system context and user prompt
  const systemContext = SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt(product);

  // Combine prompts for generation
  const fullPrompt = `${systemContext}\n\n${userPrompt}`;

  // Generate the review content
  const rawContent = await generateProductReview(product, fullPrompt);

  // Format and clean the output
  return formatReviewOutput(rawContent);
}

export default {
  isConfigured: (await import('./config.js')).isConfigured,
  getProviderConfig: (await import('./config.js')).getProviderConfig,
  generateContent: (await import('./gemini.js')).generateContent,
  generateProductReview: (await import('./gemini.js')).generateProductReview,
  SYSTEM_PROMPT: (await import('./prompts.js')).SYSTEM_PROMPT,
  buildUserPrompt: (await import('./prompts.js')).buildUserPrompt,
  buildMetaDescription: (await import('./prompts.js')).buildMetaDescription,
  formatReviewOutput: (await import('./prompts.js')).formatReviewOutput,
  testConnection,
  generateReview,
};
