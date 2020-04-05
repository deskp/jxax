import getConfig from 'jxax/getConfig';
import systemPreferences from 'jxax/systemPreferences';
import colors from 'ansi-colors';

function run() {
// Read config.
  const config = getConfig();
  const configKeymap = {
    'general.appearance': 'appearance',
    'general.accentColor': 'accentColor',
    'general.highlightColor': 'highlightColor',
    'general.sidebarIconSize': 'sidebarIconSize',
    'general.autoHideMenuBar': 'autoHideMenuBar',
    'general.showScrollBars': 'showScrollBars',
    'general.clickScrollBar': 'clickScrollBar',
    'general.defaultWebBrowser': 'defaultWebBrowser',
    'general.askWhenClosingDocuments': 'askWhenClosingDocuments',
    'general.closeWindowsWhenQuttingApp': 'closeWindowsWhenQuttingApp',
    'general.recentItems': 'recentItems',
    'general.allowHandoff': 'allowHandoff',
    'general.useFontSmoothing': 'useFontSmoothing',
  };

  // Apply config.
  systemPreferences.reopen();
  systemPreferences.navigate('General');
  Object.entries(config).forEach((k, v) => {
    const p = configKeymap[k];
    if (p) systemPreferences[p] = v;
  });

  // Print results.
  console.log(colors.bold.whiteBright(`${colors.greenBright('✔')} Applied`),
    colors.italic.whiteBright('System Preferences/General'),
    colors.bold.whiteBright('settings:'));
  console.log(colors.dim(JSON.stringify({
    appearance: systemPreferences.appearance,
    accentColor: systemPreferences.accentColor,
    highlightColor: systemPreferences.highlightColor,
    sidebarIconSize: systemPreferences.sidebarIconSize,
    autoHideMenuBar: systemPreferences.autoHideMenuBar,
    showScrollBars: systemPreferences.showScrollBars,
    clickScrollBar: systemPreferences.clickScrollBar,
    defaultWebBrowser: systemPreferences.defaultWebBrowser,
    askWhenClosingDocuments: systemPreferences.askWhenClosingDocuments,
    closeWindowsWhenQuttingApp: systemPreferences.closeWindowsWhenQuttingApp,
    recentItems: systemPreferences.recentItems,
    allowHandoff: systemPreferences.allowHandoff,
    useFontSmoothing: systemPreferences.useFontSmoothing,
  }, null, 2)));

  // Close application.
  systemPreferences.quit();
}

run();
