import $ from 'jquery';
import {layout} from '../src/public/layout.js';
import {Toolbar} from '../src/public/toolbar.js';
import {Topnav} from '../src/public/topnav.js';
import * as helpers from './helpers.js';

QUnit.module('toolbar', () => {
    QUnit.module('constructor', hooks=> {
        hooks.beforeEach(() => {
            helpers.create_layout_elem();
            helpers.create_topnav_elem();
            helpers.create_toolbar_elem();
        });
        hooks.afterEach(() => {
            $('#layout').remove();
        });
    
        QUnit.test('true', assert=> {
            assert.ok(true);
        });
    });

    QUnit.module('methods', hooks => {
        hooks.beforeEach(() => {
            helpers.create_layout_elem();
            helpers.create_topnav_elem();
            helpers.create_toolbar_elem();
        });
        hooks.afterEach(() => {
            $('#layout').remove();
        });

        QUnit.test('viewport_changed()', assert => {
            // initialize
            Topnav.initialize();
            Toolbar.initialize();
    
            // set viewport mobile
            helpers.set_vp('mobile');
    
            // toggle mobile menu
            layout.topnav.toggle_button.trigger('click');
            assert.strictEqual(layout.topnav.content.css('display'), 'flex');
            // trigger bootstrap dropdown
            layout.toolbar.dropdowns.trigger('show.bs.dropdown');
            assert.strictEqual(layout.topnav.content.css('display'), 'none');
    
            // set viewport desktop
            helpers.set_vp('large');
    
            assert.strictEqual(layout.topnav.content.css('display'), 'contents');
            // trigger bootstrap dropdown
            layout.toolbar.dropdowns.trigger('show.bs.dropdown');
            assert.strictEqual(layout.topnav.content.css('display'), 'contents');
        });
    
        QUnit.test.skip('mark_as_read', assert => {
            // initialize
            Topnav.initialize();
            Toolbar.initialize();
    
            assert.ok($('li.notification.unread').length > 0);
            $('#noti_mark_read').trigger('click');
            assert.strictEqual($('li.notification.unread').length, 0);
        });
    
        QUnit.test('handle_dropdown', assert => {
            // initialize
            Topnav.initialize();
            Toolbar.initialize();
    
            $('#notifications > i').trigger('click');
            assert.strictEqual($('#notifications > ul').css('display'), 'flex');
    
            $('#notifications > i').trigger('click');
            assert.strictEqual($('#notifications > ul').css('display'), 'none');
        });

        QUnit.test('sort_priority', assert => {
            let date1 = 'August 06, 2021 09:00:00',
                date2 = 'August 05, 2021 10:24:00',
                date3 = 'August 04, 2021 10:24:00',
                date4 = 'August 03, 2021 10:24:00';

            helpers.create_noti_elem(date2, 'high');
            helpers.create_noti_elem(date4, 'medium');
            helpers.create_noti_elem(date3, 'low');
            helpers.create_noti_elem(date1);

            // initialize
            Topnav.initialize();
            Toolbar.initialize();

            $('#noti_sort_priority').trigger('click');
            assert.ok(
                $('i.arrow-small', '#noti_sort_priority')
                .hasClass('bi-arrow-down')
            );

            for (let item of $('li.notification', '#notifications')){
                let elem = $(item);
                if (elem.hasClass('high')){
                    assert.strictEqual(elem.css('order'), '0');
                } else if (elem.hasClass('medium')){
                    assert.strictEqual(elem.css('order'), '1');
                } else if (elem.hasClass('low')){
                    assert.strictEqual(elem.css('order'), '2');
                } else {
                    assert.strictEqual(elem.css('order'), '3');
                }
            }

            $('#noti_sort_priority').trigger('click');
            assert.ok(
                $('i.arrow-small', '#noti_sort_priority')
                .hasClass('bi-arrow-up')
            );

            for (let item of $('li.notification', '#notifications')){
                let elem = $(item);
                if (elem.hasClass('high')){
                    assert.strictEqual(elem.css('order'), '3');
                } else if (elem.hasClass('medium')){
                    assert.strictEqual(elem.css('order'), '2');
                } else if (elem.hasClass('low')){
                    assert.strictEqual(elem.css('order'), '1');
                } else {
                    assert.strictEqual(elem.css('order'), '0');
                }
            }
        });

        QUnit.test.only('sort_date', assert => {
            let date0 = 'August 06, 2021 09:00:00',
                date1 = 'August 05, 2021 10:24:00',
                date2 = 'August 04, 2021 10:24:00',
                date3 = 'August 03, 2021 10:24:00';

            helpers.create_noti_elem(date1, '', '1');
            helpers.create_noti_elem(date2, '', '2');
            helpers.create_noti_elem(date3, '', '3');
            helpers.create_noti_elem(date0, '', '0');

            // initialize
            Topnav.initialize();
            Toolbar.initialize();

            $('#noti_sort_date').trigger('click');

            let notis = $('li.notification');

            for (let i=0; i<4; i++) {
                let elem = notis[i];
                assert.strictEqual($(elem).attr('id'), $(elem).css('order'));
            }

            $('#noti_sort_date').trigger('click');

            for (let i=3; i>=0; i--) {
                let elem = notis[i];
                // assert.strictEqual($(elem).css('order'), i);
                console.log($(elem).css('order'));
                console.log(i)
            }
        });
    });
});
