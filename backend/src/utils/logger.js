/**
 * Simple logger utility
 */

const log = (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[LUXORA]', ...args);
  }
};

const error = (...args) => {
  console.error('[LUXORA ERROR]', ...args);
};

const warn = (...args) => {
  console.warn('[LUXORA WARN]', ...args);
};

module.exports = {
  log,
  error,
  warn
};