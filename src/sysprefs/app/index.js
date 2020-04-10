import { isFunction, isString, isEmpty } from 'lodash';
import { isDevelopment, nameOf } from '@util';
import { retry } from '@core/app';
import runInApp from '@core/uiAutomation';

export default function runInSystemPrefs(pane, fn) {
  if (isDevelopment()) {
    if (!isString(pane)) throw new Error(`${nameOf({ pane })} must be a string.`);
    if (!isFunction(fn)) throw new Error(`${nameOf({ fn })} must be a function.`);
  }

  return runInApp('System Preferences', (context) => {
    if (!isEmpty(pane)) {
      retry(() => {
        const { app } = context;
        app.currentPane = app.panes.byName(pane);
      });
    }

    return fn(context);
  });
}
