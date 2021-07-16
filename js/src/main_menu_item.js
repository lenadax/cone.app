import $ from 'jquery'

/* cone Main Menu Item */

export class MainMenuItem extends cone.ViewPortAware {

    constructor(elem) {
        super(elem);
        this.elem = elem;
        this.children = elem.data('menu-items');
        if(!this.children){
            return;
        }
        this.menu = $(`
            <div class="cone-mainmenu-dropdown">
                <ul class="mainmenu-dropdown">
                </ul>
            </div>
        `);
        this.dd = $('ul', this.menu);
        this.arrow = $('i.dropdown-arrow', this.elem);
        this.render_dd();

        this._toggle = this.mouseenter_toggle.bind(this);

        if(this.vp_state === cone.VP_MOBILE){
            this.mv_to_mobile();
        } else {
            this.elem.off().on('mouseenter mouseleave', this._toggle);
            this.menu.off().on('mouseenter mouseleave', () => {
                this.menu.toggle();
            })
        }
    }

    render_dd() {
        for (let i in this.children) {
            let menu_item = this.children[i];
            let dd_item = $(`
              <li class="${menu_item.selected ? 'active': ''}">
                <a href="${menu_item.url}"
                   title="${menu_item.title}">
                  <i class="${menu_item.icon}"></i>
                  <span>
                    ${menu_item.title ? menu_item.title : '&nbsp;'}
                  </span>
                </a>
              </li>
            `);
            this.dd.append(dd_item);
        }
        this.menu.appendTo('#layout');
    }

    mv_to_mobile() {
        if(cone.main_menu_sidebar) {
            return;
        }
        this.menu.off().detach().appendTo(this.elem).css('left', '0');
        this.elem.off();
        this.arrow.off().on('click', () => {
            this.menu.slideToggle('fast');
            cone.toggle_arrow(this.arrow);
        });
    }

    mv_to_top() {
        this.menu.detach().appendTo('#layout');
        this.arrow.off();
        this.elem.off().on('mouseenter mouseleave', this._toggle);
        this.menu.off().on('mouseenter mouseleave', () => {
            this.menu.toggle();
        })
    }

    mouseenter_toggle(e) {
        this.menu.offset({left: this.elem.offset().left});
        if(e.type === 'mouseenter') {
            this.menu.css('display', 'block');
        } else {
            this.menu.css('display', 'none');
        }
    }
}