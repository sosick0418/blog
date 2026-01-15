import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory
const PROJECT_ROOT = process.env.PROJECT_ROOT ||
  path.join(__dirname, '../../..');

const GIT_BRANCH = process.env.GIT_BRANCH || 'main';

/**
 * Run a git command
 * @param {string} command - Git command
 * @returns {string} Command output
 */
function runGit(command) {
  return execSync(command, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    timeout: 30000
  }).trim();
}

/**
 * Check if there are uncommitted changes
 * @returns {boolean}
 */
export function hasChanges() {
  try {
    const status = runGit('git status --porcelain');
    return status.length > 0;
  } catch (error) {
    console.error('[Git] Failed to check status:', error.message);
    return false;
  }
}

/**
 * Stage file changes
 * @param {string} filePath - Path to stage (relative to project root)
 */
export function stageFile(filePath) {
  try {
    runGit(`git add "${filePath}"`);
    console.log(`[Git] Staged: ${filePath}`);
  } catch (error) {
    const err = new Error(`Failed to stage file: ${error.message}`);
    err.code = 'GIT_ADD_FAILED';
    throw err;
  }
}

/**
 * Create a commit
 * @param {string} message - Commit message
 * @returns {string} Commit hash
 */
export function commit(message) {
  try {
    runGit(`git commit -m "${message}"`);
    const hash = runGit('git rev-parse --short HEAD');
    console.log(`[Git] Committed: ${hash}`);
    return hash;
  } catch (error) {
    // Check if nothing to commit
    if (error.message.includes('nothing to commit')) {
      console.log('[Git] Nothing to commit');
      return null;
    }
    const err = new Error(`Failed to commit: ${error.message}`);
    err.code = 'GIT_COMMIT_FAILED';
    throw err;
  }
}

/**
 * Push to remote
 * @param {boolean} dryRun - Skip actual push if true
 */
export function push(dryRun = false) {
  if (dryRun) {
    console.log(`[Git] Dry-run: skipped push to origin/${GIT_BRANCH}`);
    return;
  }

  try {
    runGit(`git push origin ${GIT_BRANCH}`);
    console.log(`[Git] Pushed to origin/${GIT_BRANCH}`);
  } catch (error) {
    const err = new Error(`Failed to push: ${error.message}`);
    err.code = 'GIT_PUSH_FAILED';
    throw err;
  }
}

/**
 * Full deploy workflow: stage, commit, push
 * @param {string} productName - Product name for commit message
 * @param {boolean} dryRun - Skip push if true
 * @returns {Object} Result with commit hash
 */
export function deploy(productName, dryRun = false) {
  const filePath = 'src/data/products.json';

  // Stage the products.json file
  stageFile(filePath);

  // Create commit
  const commitMessage = `content: add product - ${productName}`;
  const commitHash = commit(commitMessage);

  if (!commitHash) {
    return { deployed: false, reason: 'nothing_to_commit' };
  }

  // Push to remote
  push(dryRun);

  return {
    deployed: true,
    commit: commitHash,
    branch: GIT_BRANCH,
    dryRun
  };
}

/**
 * Get current git status
 * @returns {Object} Git status info
 */
export function getStatus() {
  try {
    const branch = runGit('git branch --show-current');
    const status = runGit('git status --porcelain');
    const lastCommit = runGit('git log -1 --format="%h %s"');

    return {
      branch,
      hasChanges: status.length > 0,
      lastCommit,
      files: status.split('\n').filter(Boolean)
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}
