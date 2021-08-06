import $ from 'jquery'
import {
    ViewPortAware,
    VP_SMALL,
    VP_MEDIUM
} from './viewport.js';
import {layout} from './layout.js';

export class Searchbar extends ViewPortAware {

    static initialize(context) {
        let elem = $('#cone-searchbar', context);
        /* istanbul ignore if */
        if (!elem.length) {
            return;
        } else {
            layout.searchbar = new Searchbar(elem);
        }

        return layout.searchbar;
    }

    constructor(elem) {
        super();
        this.elem = elem;
        this.search_text = $('#livesearch-input', this.elem);
        this.search_group = $('#livesearch-group', this.elem);
        this.dd = $('#cone-livesearch-dropdown', this.elem);

        if(this.vp_state === VP_SMALL || this.vp_state === VP_MEDIUM) {
            this.dd.addClass('dropdown-menu-end');
            this.search_text.detach().prependTo(this.dd);
        }
    }

    viewport_changed(e) {
        super.viewport_changed(e);
        if(this.vp_state === VP_SMALL || this.vp_state === VP_MEDIUM) {
            this.dd.addClass('dropdown-menu-end');
            this.search_text.detach().prependTo(this.dd);
        } else {
            this.search_text.detach().prependTo(this.search_group);
            this.dd.removeClass('dropdown-menu-end');
        }
    }
}