/**
 * The JXA core application module provides APIs for accessing the current OSA application running
 * the script, other scriptable applications and builtin JXA functions.
 */

import { isObject, isFunction } from 'lodash';
import { isDevelopment } from '@utils';

/**
 * @typedef {object} FilePath The OSA file path object.
 *
 * When you need to interact with files, such as a document in TextEdit, you will need a file path
 * object, not just a string with a path in it. You can use the Path constructor to instantiate
 * file paths.
 *
 * @property {() => string} toString Get the string value of the file path.
 */

/**
 * @typedef {[number, number, number]} Color A list of three integers, each from 0 to 65535,
 * representing red, green, and blue color components.
 */

/**
 * The OSA application that is running the script (OSAScript).
 */
const app = global.Application.currentApplication();
app.strictPropertyScope = true;
app.strictCommandScope = true;
app.strictParameterType = true;

export default app;

/**
 * Get access to a scriptable application.
 *
 * @param {(string|number)} url The application's name, bundle ID, path or process ID.
 * @returns {object} The scriptable application's object specifier.
 */
export function access(url) {
  return global.Application(url);
}

/**
 * Pause for a fixed amount of time.
 *
 * @param {number} secs The number of seconds to delay.
 */
export function delay(secs) {
  global.delay(secs);
}

/**
 * Retry a function til it succeeded or attempts exceeded opts.maxAttempts. Between each retry
 * attempt there's a delay of opts.delayInterval seconds.
 *
 * @param {() => any} fn The function to execute.
 * @param {object} opts Options.
 * @param {number} opts.maxAttempts The maximum attempts allowed (first invocation is inclusive)
 * (default is retry.defaultOpts.maxAttempts = 3).
 * @param {number} opts.delayInterval The delay in seconds between each retry attempt (default is
 * retry.defaultOpts.delayInterval = 0.5).
 * @returns {any} Returns of fn.
 */
export function retry(fn, opts = {}) {
  if (isDevelopment()) { // Validate arguments.
    if (!isFunction(fn)) throw new Error('retry.fn must be a function.');
    if (!isObject(opts)) throw new Error('retry.opts must be an object.');
  }

  const { maxAttempts, delayInterval } = { ...retry.defaultOpts, ...opts };
  let attempts = 0;

  for (;;) {
    attempts += 1;

    try {
      return fn();
    } catch (e) {
      if (attempts >= maxAttempts) {
        throw e;
      }
      delay(delayInterval);
    }
  }
}

/**
 * Retry default options.
 */
retry.defaultOpts = {
  maxAttempts: 3,
  delayInterval: 0.5,
};
