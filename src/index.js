import systemPreferences from 'jxax/systemPreferences';

systemPreferences.activate();
systemPreferences.navigate('General');
systemPreferences.appearance = 'Dark';
systemPreferences.accentColor = 'Blue';
systemPreferences.highlightColor = 'Blue';
systemPreferences.sidebarIconSize = 'Small';
systemPreferences.autoHideMenuBar = false;
systemPreferences.showScrollBars = 'Automatically based on mouse or trackpad';
systemPreferences.clickScrollBar = 'Jump to the next page';

console.log(JSON.stringify({
    appearance: systemPreferences.appearance,
    accentColor: systemPreferences.accentColor,
    highlightColor: systemPreferences.highlightColor,
    sidebarIconSize: systemPreferences.sidebarIconSize,
    autoHideMenuBar: systemPreferences.autoHideMenuBar,
    showScrollBars: systemPreferences.showScrollBars,
    clickScrollBar: systemPreferences.clickScrollBar
}, null, 2));
