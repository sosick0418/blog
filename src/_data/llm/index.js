/**
 * LLM Module - Main Entry Point
 * Re-exports all LLM functionality for easy importing
 */

// Re-export configuration functions
export { isConfigured, getProviderConfig } from './config.js';

// Re-export Gemini functions
export { generateContent, generateProductReview, initClient } from './gemini.js';

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

export default {
  isConfigured: (await import('./config.js')).isConfigured,
  getProviderConfig: (await import('./config.js')).getProviderConfig,
  generateContent: (await import('./gemini.js')).generateContent,
  generateProductReview: (await import('./gemini.js')).generateProductReview,
  testConnection,
};
