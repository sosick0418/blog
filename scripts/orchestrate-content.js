#!/usr/bin/env node

/**
 * Content Orchestration Script
 *
 * Orchestrates content generation and git operations for n8n automation.
 * Wraps generate-post.js and adds git commit/push capabilities.
 *
 * Usage:
 *   node scripts/orchestrate-content.js --product-json '{"productId":"123",...}'
 *   node scripts/orchestrate-content.js --file products.json
 *   node scripts/orchestrate-content.js --help
 *
 * Options:
 *   --product-json <json>  Product data as JSON string
 *   --file <path>          Product data from JSON file
 *   --dry-run              Skip git push (for testing)
 *   --skip-git             Skip all git operations (for local testing)
 *   --no-llm               Skip LLM content generation
 *   --force                Overwrite existing files
 *   --verbose              Enable detailed logging to stderr
 *   --help                 Show this help message
 *
 * Output:
 *   JSON result to stdout:
 *   - { "success": true, "file": "path/to/post.md", "commit": "abc123", "timestamp": "ISO8601" }
 *   - { "success": false, "error": "ERROR_CODE", "message": "detailed message", "timestamp": "ISO8601" }
 *
 * Error Codes:
 *   - POST_GENERATION_FAILED: Failed to generate post content
 *   - GIT_ADD_FAILED: Failed to stage file with git add
 *   - GIT_COMMIT_FAILED: Failed to create git commit
 *   - GIT_PUSH_FAILED: Failed to push to remote
 *   - INVALID_INPUT: Invalid or missing input parameters
 *   - FILE_READ_FAILED: Failed to read input file
 */

import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// Configuration
const GIT_BRANCH = process.env.GIT_BRANCH || 'main';
const POSTS_DIR = path.join(PROJECT_ROOT, 'src', 'posts');

/**
 * Parse command line arguments
 *
 * @param {Array} args - Process arguments
 * @returns {object} Parsed options
 */
function parseArgs(args) {
  const options = {
    dryRun: false,
    skipGit: false,
    noLlm: false,
    force: false,
    help: false,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--skip-git':
        options.skipGit = true;
        break;
      case '--no-llm':
        options.noLlm = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--product-json':
        options.productJson = nextArg;
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
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Content Orchestration Script - Generate posts and commit to git

Usage:
  node scripts/orchestrate-content.js --product-json '<json>' [options]
  node scripts/orchestrate-content.js --file <path> [options]
  npm run orchestrate -- --product-json '<json>'

Options:
  --product-json <json>  Product data as JSON string
                         Required fields: productId, productName
                         Optional: productPrice, productRating, productImage, category

  --file <path>          Product data from JSON file (array or {products: []})

  --category <cat>       Set category for the post (default: general)

  --dry-run              Generate post and commit, but skip git push
                         Useful for testing the full workflow locally

  --skip-git             Skip all git operations (no add, commit, or push)
                         Useful for testing post generation only

  --no-llm               Skip LLM content generation, use placeholder template

  --force                Overwrite existing post files

  --verbose, -v          Enable detailed logging to stderr
                         Useful for debugging without breaking JSON output

  --help                 Show this help message

Output Format (JSON to stdout):
  Success:
    {
      "success": true,
      "file": "src/posts/product-name.md",
      "commit": "abc123",
      "timestamp": "2026-01-15T09:00:00.000Z"
    }

  Failure:
    {
      "success": false,
      "error": "ERROR_CODE",
      "message": "Detailed error message",
      "timestamp": "2026-01-15T09:00:00.000Z"
    }

Error Codes:
  POST_GENERATION_FAILED  - Failed to generate post content
  GIT_ADD_FAILED          - Failed to stage file with git add
  GIT_COMMIT_FAILED       - Failed to create git commit
  GIT_PUSH_FAILED         - Failed to push to remote
  INVALID_INPUT           - Invalid or missing input parameters
  FILE_READ_FAILED        - Failed to read input file

Environment Variables:
  GIT_BRANCH             Branch to push to (default: main)
  GEMINI_API_KEY         Required for LLM content generation

Examples:
  # Generate post with git commit and push
  node scripts/orchestrate-content.js --product-json '{"productId":"123","productName":"Test"}'

  # Test without pushing
  node scripts/orchestrate-content.js --product-json '{"productId":"123","productName":"Test"}' --dry-run

  # Test without any git operations
  node scripts/orchestrate-content.js --product-json '{"productId":"123","productName":"Test"}' --skip-git

  # Verbose mode for debugging
  node scripts/orchestrate-content.js --product-json '{"productId":"123","productName":"Test"}' --verbose

  # From file, skip LLM
  node scripts/orchestrate-content.js --file products.json --no-llm --skip-git
`);
}

/**
 * Output JSON result with timestamp
 *
 * @param {object} result - Result object
 */
function outputResult(result) {
  const output = {
    ...result,
    timestamp: new Date().toISOString()
  };
  console.log(JSON.stringify(output));
}

/**
 * Output structured error result
 *
 * @param {string} errorCode - Error code (e.g., POST_GENERATION_FAILED)
 * @param {string} message - Detailed error message
 */
function outputError(errorCode, message) {
  outputResult({
    success: false,
    error: errorCode,
    message: message
  });
}

/**
 * Verbose logger - only logs when verbose mode is enabled
 *
 * @param {string} message - Message to log
 * @param {object} options - Options containing verbose flag
 */
function verboseLog(message, options) {
  if (options && options.verbose) {
    process.stderr.write(`[VERBOSE] ${message}\n`);
  }
}

/**
 * Run shell command and return output
 *
 * @param {string} command - Command to run
 * @param {object} options - execSync options
 * @returns {string} Command output
 */
function runCommand(command, options = {}) {
  return execSync(command, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    ...options
  }).trim();
}

/**
 * Run generate-post.js script
 *
 * @param {object} product - Product data
 * @param {object} options - Generation options
 * @returns {Promise<string|null>} Generated file path or null on failure
 */
async function generatePost(product, options) {
  return new Promise((resolve, reject) => {
    const args = [
      path.join(__dirname, 'generate-post.js'),
      '--product', product.productId,
      '--name', product.productName
    ];

    if (product.productPrice) {
      args.push('--price', String(product.productPrice));
    }

    if (product.productRating) {
      args.push('--rating', String(product.productRating));
    }

    if (product.productImage) {
      args.push('--image', product.productImage);
    }

    if (product.category || options.category) {
      args.push('--category', product.category || options.category);
    }

    if (options.noLlm) {
      args.push('--no-llm');
    }

    if (options.force) {
      args.push('--force');
    }

    // Capture stderr for logging, we need to parse stdout for file path
    const child = spawn('node', args, {
      cwd: PROJECT_ROOT,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      // Forward to stderr so it doesn't mix with our JSON output
      process.stderr.write(data);
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`generate-post.js exited with code ${code}`));
        return;
      }

      // Parse output to find generated file path
      // Looking for: [Success] Generated post: /path/to/file.md
      const match = stdout.match(/\[Success\] Generated post: (.+\.md)/);
      if (match) {
        resolve(match[1]);
      } else {
        // Try to find any .md file path in the output
        const mdMatch = stdout.match(/(\/[^\s]+\.md|src\/posts\/[^\s]+\.md)/);
        if (mdMatch) {
          resolve(mdMatch[1]);
        } else {
          reject(new Error('Could not determine generated file path'));
        }
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Run git add operation
 *
 * @param {string} filePath - Path to the file to stage
 * @param {object} options - Options (verbose)
 * @throws {object} Error object with code and message
 */
function gitAdd(filePath, options) {
  try {
    verboseLog(`Staging file: ${filePath}`, options);
    runCommand(`git add "${filePath}"`);
    verboseLog('File staged successfully', options);
  } catch (error) {
    const err = new Error(`Failed to stage file: ${error.message}`);
    err.code = 'GIT_ADD_FAILED';
    throw err;
  }
}

/**
 * Run git commit operation
 *
 * @param {string} productName - Product name for commit message
 * @param {object} options - Options (verbose)
 * @returns {string} Commit hash
 * @throws {object} Error object with code and message
 */
function gitCommit(productName, options) {
  try {
    const commitMessage = `content: auto-generated post for ${productName}`;
    verboseLog(`Creating commit: ${commitMessage}`, options);
    runCommand(`git commit -m "${commitMessage}"`);
    const commitHash = runCommand('git rev-parse --short HEAD');
    verboseLog(`Commit created: ${commitHash}`, options);
    return commitHash;
  } catch (error) {
    const err = new Error(`Failed to create commit: ${error.message}`);
    err.code = 'GIT_COMMIT_FAILED';
    throw err;
  }
}

/**
 * Run git push operation
 *
 * @param {object} options - Options (dryRun, verbose)
 * @throws {object} Error object with code and message
 */
function gitPush(options) {
  if (options.dryRun) {
    process.stderr.write(`[Git] Dry-run: skipped push to origin/${GIT_BRANCH}\n`);
    verboseLog('Push skipped due to --dry-run flag', options);
    return;
  }

  try {
    verboseLog(`Pushing to origin/${GIT_BRANCH}`, options);
    runCommand(`git push origin ${GIT_BRANCH}`);
    process.stderr.write(`[Git] Pushed to origin/${GIT_BRANCH}\n`);
    verboseLog('Push completed successfully', options);
  } catch (error) {
    const err = new Error(`Failed to push to remote: ${error.message}`);
    err.code = 'GIT_PUSH_FAILED';
    throw err;
  }
}

/**
 * Run git operations with individual error handling
 *
 * @param {string} filePath - Path to the generated file
 * @param {string} productName - Product name for commit message
 * @param {object} options - Options (dryRun, verbose)
 * @returns {string} Commit hash
 * @throws {object} Error object with code and message
 */
function runGitOperations(filePath, productName, options) {
  verboseLog('Starting git operations', options);

  // Stage the file
  gitAdd(filePath, options);

  // Create commit
  const commitHash = gitCommit(productName, options);

  // Push to remote
  gitPush(options);

  return commitHash;
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Show help
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Validate input
  if (!options.productJson && !options.file) {
    showHelp();
    outputError('INVALID_INPUT', 'Either --product-json or --file is required');
    process.exit(1);
  }

  let product;

  // Parse product data
  if (options.productJson) {
    try {
      verboseLog('Parsing product JSON from command line', options);
      product = JSON.parse(options.productJson);
      verboseLog(`Parsed product: ${product.productName}`, options);
    } catch (error) {
      outputError('INVALID_INPUT', `Invalid JSON: ${error.message}`);
      process.exit(1);
    }
  } else if (options.file) {
    try {
      const filePath = path.isAbsolute(options.file)
        ? options.file
        : path.join(process.cwd(), options.file);

      verboseLog(`Reading product data from file: ${filePath}`, options);
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // Support both array and object with 'products' key
      if (Array.isArray(data)) {
        product = data[0]; // Take first product for single execution
      } else if (data.products && Array.isArray(data.products)) {
        product = data.products[0];
      } else {
        product = data; // Assume it's a single product object
      }
      verboseLog(`Loaded product: ${product.productName}`, options);
    } catch (error) {
      outputError('FILE_READ_FAILED', `Failed to read file: ${error.message}`);
      process.exit(1);
    }
  }

  // Validate product data
  if (!product.productId || !product.productName) {
    outputError('INVALID_INPUT', 'Product must have productId and productName');
    process.exit(1);
  }

  process.stderr.write(`[Orchestrator] Processing: ${product.productName}\n`);
  verboseLog(`Options: dryRun=${options.dryRun}, skipGit=${options.skipGit}, noLlm=${options.noLlm}`, options);

  let filePath = null;
  let commitHash = null;

  // Step 1: Generate the post
  try {
    verboseLog('Starting post generation', options);
    filePath = await generatePost(product, options);

    if (!filePath) {
      outputError('POST_GENERATION_FAILED', 'Post generation returned no file path');
      process.exit(1);
    }
    verboseLog(`Post generated: ${filePath}`, options);
  } catch (error) {
    outputError('POST_GENERATION_FAILED', `Failed to generate post: ${error.message}`);
    process.exit(1);
  }

  // Determine relative path for output
  const relativePath = filePath.startsWith(PROJECT_ROOT)
    ? filePath.substring(PROJECT_ROOT.length + 1)
    : filePath;

  // Step 2: Run git operations (if not skipped)
  if (!options.skipGit) {
    try {
      commitHash = runGitOperations(filePath, product.productName, options);
      process.stderr.write(`[Orchestrator] Committed: ${commitHash}\n`);
    } catch (error) {
      // Error has a code property set by git functions
      outputError(error.code || 'GIT_ERROR', error.message);
      process.exit(1);
    }
  } else {
    process.stderr.write(`[Orchestrator] Skipped git operations\n`);
    verboseLog('Git operations skipped due to --skip-git flag', options);
  }

  // Output success result
  outputResult({
    success: true,
    file: relativePath,
    commit: commitHash
  });
}

// Run main
main().catch(error => {
  outputError('UNEXPECTED_ERROR', `Unexpected error: ${error.message}`);
  process.exit(1);
});
