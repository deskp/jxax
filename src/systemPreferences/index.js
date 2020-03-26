import { applicationProcesses } from 'jxax/core/processes';

const $ = Application('System Preferences');
const p = applicationProcesses[$.name()];
const w = p.windows[0];

export default {
    window: w,
    activate: function () {
        $.activate();
    },
    navigate: function (pane) {
        $.currentPane = $.panes.byName(pane);
    },
    quit: function () {
        $.quit();
    },
    get appearance() {
        return w.checkboxes.whose({
            subrole: 'AXToggle',
            value: 1,
            _or: [
                { name: 'Light' },
                { name: 'Dark' },
                { name: 'Auto' }
            ]
        })[0].name();
    },
    set appearance(value) {
        w.checkboxes.whose({ subrole: 'AXToggle', name: value })[0]
            .actions['AXPress'].perform();
    },
    get accentColor() {
        return w.checkboxes.whose({
            subrole: 'AXToggle',
            value: 1,
            _or: [
                { name: 'Blue' },
                { name: 'Purple' },
                { name: 'Pink' },
                { name: 'Red' },
                { name: 'Orange' },
                { name: 'Yellow' },
                { name: 'Green' },
                { name: 'Graphite' },
                { name: 'Other' }
            ]
        })[0].name();
    },
    set accentColor(value) {
        w.checkboxes.whose({ subrole: 'AXToggle', name: value })[0]
            .actions['AXPress'].perform();
    },
    get highlightColor() {
        return w.popUpButtons['Highlight color:'].value();
    },
    set highlightColor(value) {
        const popUpButton = w.popUpButtons['Highlight color:'];
        popUpButton.actions['AXShowMenu'].perform();
        popUpButton.menus[0].menuItems[value].actions['AXPress'].perform();
    },
    get sidebarIconSize() {
        return w.popUpButtons['Sidebar icon size:'].value();
    },
    set sidebarIconSize(value) {
        const popUpButton = w.popUpButtons['Sidebar icon size:'];
        popUpButton.actions['AXShowMenu'].perform();
        popUpButton.menus[0].menuItems[value].actions['AXPress'].perform();
    },
    get autoHideMenuBar() {
        return w.checkboxes['Automatically hide and show the menu bar'].value() !== 0;
    },
    set autoHideMenuBar(value) {
        if (this.autoHideMenuBar === value) return;
        w.checkboxes['Automatically hide and show the menu bar'].actions['AXPress'].perform();
    },
    get showScrollBars() {
        return w.radioGroups[1].radioButtons.whose({ value: 1 })[0].name();
    },
    set showScrollBars(value) {
        w.radioGroups[1].radioButtons[value].actions['AXPress'].perform();
    }
}
