import { isObject, isEmpty } from 'lodash';
import { join, validate } from '@utils';

/**
 * Screen edges.
 *
 * @enum {string}
 */
export const ScreenEdges = {
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
};

/**
 * Minimization effects.
 *
 * @enum {string}
 */
export const MinimizeEffects = {
  GENIE: 'genie',
  SCALE: 'scale',
};

/**
 * Tabs when opening documents preferences.
 *
 * @enum {string}
 */
export const TabsWhenOpeningDocumentsPreferences = {
  ALWAYS: 'always',
  IN_FULL_SCREEN_ONLY: 'inFullScreenOnly',
  MANUALLY: 'manually',
};

/**
 * Double-click window's title bar actions.
 *
 * @enum {string}
 */
export const DoubleClickTitleBarActions = {
  NONE: 'none',
  ZOOM: 'zoom',
  MINIMIZE: 'minimize',
};

// Helper function generates inclusion constraints.
function inclusion(vals) {
  return {
    inclusion: {
      within: isObject(vals) ? Object.values(vals) : vals,
      message: `is invalid, must be within [${join(vals)}]`,
    },
  };
}

/**
 * The _System Preferences/Dock_ settings' constraints.
 */
const constraints = {
  size: {
    numericality: {
      noStrings: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 1,
    },
  },
  magnification: { type: 'boolean' },
  magnificationSize: {
    numericality: {
      noStrings: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 1,
    },
  },
  location: inclusion(ScreenEdges),
  minimizeEffect: inclusion(MinimizeEffects),
  preferTabsWhenOpeningDocuments: inclusion(TabsWhenOpeningDocumentsPreferences),
  doubleClickTitleBar: inclusion(DoubleClickTitleBarActions),
  minimizeToAppIcon: { type: 'boolean' },
  animate: { type: 'boolean' },
  autohide: { type: 'boolean' },
  showOpenIndicators: { type: 'boolean' },
  showRecentApps: { type: 'boolean' },
};

/**
 * @typedef {object} SysPrefsDockSettings The _System Preferences/Dock_ settings object.
 *
 * @property {number} size Size/height of the items (between 0.0 (minimum) and 1.0 (maximum)).
 * @property {boolean} magnification Is magnification on or off?
 * @property {boolean} magnificationSize Maximum magnification size when magnification is on
 * (between 0.0 (minimum) and 1.0 (maximum)).
 * @property {ScreenEdges} location Location on screen.
 * @property {MinimizeEffects} minimizeEffect Minimization effect.
 * @property {TabsWhenOpeningDocumentsPreferences} preferTabsWhenOpeningDocuments Prefer tabs when
 * opening documents.
 * @property {DoubleClickTitleBarActions} doubleClickTitleBar Double-click window's title bar to.
 * @property {boolean} minimizeToAppIcon Minimize windows to application icon.
 * @property {boolean} animate Is the animation of opening applications on or off?
 * @property {boolean} autohide Is autohiding the dock on or off?
 * @property {boolean} showOpenIndicators Show indicators for opening applications.
 * @property {boolean} showRecentApps Show recent applications in Dock.
 */

/**
 * Validate a _System Preferences/Dock_ settings object.
 *
 * @param {SysPrefsDockSettings} settings The settings object.
 */
export function validateConfigureDock(settings) {
  if (!isObject(settings) || isEmpty(Object.values(settings))) {
    return { '.': ['no argument'] };
  }
  return validate(settings, constraints);
}
