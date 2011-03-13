from webob.exc import HTTPFound
from yafowil.base import factory
from yafowil.controller import Controller
from cone.tile import Tile
from cone.app.browser.ajax import AjaxAction
from cone.app.browser.ajax import AjaxEvent
from cone.app.browser.utils import make_url


class Form(Tile):
    """A form tile.
    """

    form = None # yafowil compound expected.
    ajax = True # render ajax form related by default.
    
    def prepare(self):
        """Responsible to prepare ``self.form``.
        """
        raise NotImplementedError(u"``prepare`` function must be provided "
                                  u"by deriving object.")
    
    def prepare_ajax(self):
        """Set ajax class attribute on self.form.
        """
        if not self.ajax:
            return
        if self.form.attrs.get('class') \
          and self.form.attrs['class'].find('ajax') == -1:
            self.form.attrs['class'] += ' ajax'
        else:
            self.form.attrs['class'] = 'ajax'
    
    @property
    def ajax_request(self):
        """Flag whether request was made via XMLHTTPRequest.
        """
        return bool(self.request.params.get('ajax'))
    
    def __call__(self, model, request):
        self.model = model
        self.request = request
        return self._process_form()
    
    def _process_form(self):
        self.prepare()
        if not self.show:
            return ''
        controller = Controller(self.form, self.request)
        if not controller.next:
            return controller.rendered
        if isinstance(controller.next, HTTPFound):
            self.redirect(controller.next)
            return
        if isinstance(controller.next, AjaxAction) \
          or isinstance(controller.next, AjaxEvent):
            self.request['cone.app.continuation'] = [controller.next]
            return ''
        if isinstance(controller.next, list):
            # we assume here a list of AjaxAction and/or AjaxEvent instances
            self.request['cone.app.continuation'] = controller.next
            return ''
        return controller.next