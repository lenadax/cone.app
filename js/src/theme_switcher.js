import $ from 'jquery'
import {createCookie, readCookie} from './cookie_functions.js';
import {layout} from './layout.js';

export const default_themes = [
    '/static/light.css',
    '/static/dark.css'
];

export class ThemeSwitcher {

    static initialize(context, modes) {
        let elem = $('#switch_mode', context);
        if (!elem.length) {
            layout.theme_switcher = null;
        } else {
            layout.theme_switcher = new ThemeSwitcher(elem, modes);
        }
        return layout.theme_switcher;
    }

    constructor(elem, modes) {
        this.elem = elem;
        this.modes = modes;
        this.link = $('head #colormode-styles');
        this.elem.off('click').on('click', this.switch_theme.bind(this));
        let current = readCookie('modeswitch');
        if (!current) {
            current = modes[0];
        }
        this.current = current;
    }

    get current() {
        return this.link.attr('href');
    }

    set current(value) {
        this.link.attr('href', value);
        createCookie('modeswitch', value, null);
        let checked = value === this.modes[0] ? false : true;
        this.elem.prop('checked', checked);
    }

    switch_theme(e) {
        e.stopPropagation();
        let modes = this.modes;
        this.current = this.current === modes[0] ? modes[1] : modes[0];
    }
};
