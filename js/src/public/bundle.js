import $ from 'jquery';
import {Sidebar} from './sidebar.js';
import {MainMenuSidebar, MainMenuTop} from './mainmenu.js';
import {Searchbar} from './searchbar.js';
import {Content} from './content.js';
import {Topnav} from './topnav.js';
import {Navtree} from './navtree.js';
import {ThemeSwitcher} from './theme.js';
import {MobileNav} from './mobilenav.js';
import {Toolbar} from './toolbar.js';
import {Personaltools} from './personaltools.js';

export * from './viewport.js';

export * from './layout.js';
export * from './content.js';
export * from './mainmenu.js';
export * from './navtree.js';
export * from './searchbar.js';
export * from './sidebar.js';
export * from './theme.js';
export * from './topnav.js';
export * from './mobilenav.js';
export * from './personaltools.js';
export * from './toolbar.js';
export * from './utils.js';

export * from './scrollbar.js';

$(function() {
    bdajax.register(Topnav.initialize, true);
    bdajax.register(MainMenuTop.initialize, true);
    bdajax.register(Searchbar.initialize, true);
    bdajax.register(Toolbar.initialize, true);
    bdajax.register(Personaltools.initialize, true);
    bdajax.register(ThemeSwitcher.initialize, true);
    bdajax.register(Sidebar.initialize, true);
    bdajax.register(MainMenuSidebar.initialize, true);
    bdajax.register(Navtree.initialize, true);
    bdajax.register(Content.initialize, true);
    bdajax.register(MobileNav.initialize, true);
});