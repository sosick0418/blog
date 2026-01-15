/**
 * LLM Configuration Module
 * Handles configuration for LLM providers (currently Gemini)
 */

// Default configuration values
const DEFAULTS = {
  PROVIDER: 'gemini',
  MODEL: 'gemini-2.5-flash',
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
};

/**
 * Get the configured LLM provider
 * @returns {string} Provider name (default: 'gemini')
 */
export const PROVIDER = process.env.LLM_PROVIDER || DEFAULTS.PROVIDER;

/**
 * Get the configured model name
 * @returns {string} Model name (default: 'gemini-2.5-flash')
 */
export const MODEL = process.env.LLM_MODEL || DEFAULTS.MODEL;

/**
 * Get the API key for Gemini
 * @returns {string|undefined} API key or undefined if not set
 */
export const API_KEY = process.env.GEMINI_API_KEY;

/**
 * Maximum number of retry attempts for API calls
 */
export const MAX_RETRIES = DEFAULTS.MAX_RETRIES;

/**
 * Base delay in milliseconds between retries (used with exponential backoff)
 */
export const RETRY_DELAY_MS = DEFAULTS.RETRY_DELAY_MS;

/**
 * Check if the LLM is properly configured with an API key
 * @returns {boolean} True if API key is set
 */
export function isConfigured() {
  return Boolean(API_KEY);
}

/**
 * Get provider-specific configuration settings
 * @returns {Object} Provider configuration object
 */
export function getProviderConfig() {
  return {
    provider: PROVIDER,
    model: MODEL,
    apiKey: API_KEY,
    maxRetries: MAX_RETRIES,
    retryDelayMs: RETRY_DELAY_MS,
    isConfigured: isConfigured(),
  };
}

export default {
  PROVIDER,
  MODEL,
  API_KEY,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  isConfigured,
  getProviderConfig,
};
