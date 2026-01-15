import { Router } from 'express';
import { deploy, getStatus, hasChanges } from '../services/git.js';

export const deployRouter = Router();

/**
 * GET /api/deploy/status
 * Get current git status
 */
deployRouter.get('/status', (req, res) => {
  const status = getStatus();
  res.json({
    success: true,
    git: status
  });
});

/**
 * POST /api/deploy
 * Trigger deployment manually
 *
 * Body:
 * {
 *   message: "Optional commit message",
 *   dryRun: false
 * }
 */
deployRouter.post('/', (req, res, next) => {
  try {
    const { message = 'manual deployment', dryRun = false } = req.body;

    if (!hasChanges()) {
      return res.json({
        success: true,
        deployed: false,
        reason: 'no_changes',
        message: 'No changes to deploy'
      });
    }

    const result = deploy(message, dryRun);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
});
