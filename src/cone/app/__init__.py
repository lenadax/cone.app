import os
import model
import pyramid_zcml
from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from cone.app.model import (
    AppRoot,
    AppSettings,
    Properties,
)

# XXX: is this needed anywhere? If not, let's remove it.
APP_PATH = os.environ.get('APP_PATH', '')

# configuration
cfg = Properties()

# authentication providers (expect ``node.ext.ugm.Ugm`` like API)
cfg.auth = list()

# used main template
cfg.main_template = 'cone.app.browser:templates/main.pt'

# default node icon
cfg.default_node_icon = 'static/images/default_node_icon.png'

# JS resources
cfg.js = Properties()
cfg.js.public = [
    'static/cdn/jquery.min.js',
    'static/cdn/jquery.tools.min.js',
    '++resource++bdajax/bdajax.js',
]
cfg.js.protected = [
    '++resource++yafowil.widget.datetime/jquery-ui-1.8.1.custom.min.js',
    'tiny_mce/jquery.tinymce.js',
    '++resource++yafowil.widget.datetime/widget.js',
    '++resource++yafowil.widget.richtext/widget.js',
    '++resource++yafowil.widget.dict/widget.js',
    'static/cone.app.js',
]

# CSS Resources
cfg.css = Properties()
cfg.css.public = [
    'static/style.css',
    '++resource++bdajax/bdajax.css',
]
cfg.css.protected = [
    '++resource++yafowil.widget.datetime/jquery-ui-1.8.1.custom.css',
    '++resource++yafowil.widget.dict/widget.css',
    '++resource++yafowil.widget.datetime',
]

# cfg.layout used to enable/disable tiles in main template
cfg.layout = Properties()
cfg.layout.livesearch = True
cfg.layout.personaltools = True
cfg.layout.mainmenu = True
cfg.layout.pathbar = True
cfg.layout.sidebar_left = ['navtree']

root = AppRoot()
root.factories['settings'] = AppSettings


def configure_root(settings):
    root.metadata.title = settings.get('cone.root.title', 'CONE')
    root.properties.default_child = settings.get('cone.root.default_child')
    root.properties.mainmenu_empty_title = \
        settings.get('cone.root.mainmenu_empty_title', False)
    root.properties.in_navtree = False
    root.properties.editable = False


def register_plugin_config(key, factory):
    factories = root['settings'].factories
    if key in factories:
        raise ValueError(u"Config with name '%s' already registered." % key)
    factories[key] = factory


def register_plugin(key, factory):
    factories = root.factories
    if key in factories:
        raise ValueError(u"Plugin with name '%s' already registered." % key)
    root.factories[key] = factory


main_hooks = list()

def register_main_hook(callback):
    """Register function to get called on application startup.
    """
    main_hooks.append(callback)


def get_root(environ=None):
    return root


def auth_tkt_factory(**kwargs):
    from cone.app.security import groups_callback
    kwargs.setdefault('callback', groups_callback)
    return AuthTktAuthenticationPolicy(**kwargs)


def acl_factory(**kwargs):
    return ACLAuthorizationPolicy()


def main(global_config, **settings):
    """Returns WSGI application.
    """
    # set authentication related application properties
    import cone.app.security as security
    security.ADMIN_USER = settings.get('cone.admin_user', 'admin')
    security.ADMIN_PASSWORD = settings.get('cone.admin_password', 'admin')
    security.AUTH_IMPL = settings.get('cone.auth_impl', None)
    secret_password = settings.get('cone.secret_password', 'secret')
    
    configure_root(settings)
    
    if settings.get('testing.hook_global_registry'):
        from zope.component import getGlobalSiteManager
        globalreg = getGlobalSiteManager()
        config = Configurator(registry=globalreg)
        config.setup_registry(
            root_factory=get_root,
            settings=settings,
            authentication_policy=auth_tkt_factory(secret=secret_password),
            authorization_policy=acl_factory())
        config.hook_zca()
    else:
        config = Configurator(
            root_factory=get_root,
            settings=settings,
            authentication_policy=auth_tkt_factory(secret=secret_password),
            authorization_policy=acl_factory())
    
    config.include(pyramid_zcml)
    config.begin()
    config.load_zcml('configure.zcml')
    
    # read plugin configurator
    plugins = settings.get('cone.plugins', '')
    plugins = plugins.split('\n')
    plugins = [pl for pl in plugins if pl]
    for plugin in plugins:
        config.load_zcml('%s:configure.zcml' % plugin) #pragma NO COVERAGE
    
    # end config
    config.end()
    
    # execute main hooks
    for hook in main_hooks:
        hook(config, global_config, settings)
    
    # return wsgi app
    return config.make_wsgi_app()