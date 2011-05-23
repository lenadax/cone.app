import os
import cone.app
from pyramid.testing import DummyRequest
from plone.testing import Layer
from cone.app.security import authenticate

DATADIR = os.path.join(os.path.dirname(__file__), 'tests', 'data', 'ugm')

class Security(Layer):
    """Test layer with dummy authentication for security testing.
    """

    def login(self, login):
        request = self.current_request
        if not request:
            request = self.new_request()
        else:
            self.logout()
        res = authenticate(request, login, 'secret')
        if res:
            request.environ['HTTP_COOKIE'] = res[0][1]
        
    auth_env_keys = [
        'HTTP_COOKIE',
        'paste.cookies',
        'REMOTE_USER_TOKENS',
        'REMOTE_USER_DATA',
        'cone.app.user.roles',
    ]
    
    def logout(self):
        request = self.current_request
        if request:
            environ = request.environ
            for key in self.auth_env_keys:
                if environ.has_key(key):
                    del environ[key]
    
    def defaults(self):
        return {'request': self.current_request, 'registry': self.registry}
    
    def new_request(self):
        request = self.current_request
        auth = dict()
        if request:
            environ = request.environ
            for key in self.auth_env_keys:
                if environ.has_key(key):
                    auth[key] = environ[key]
        request = DummyRequest()
        request.environ['SERVER_NAME'] = 'testcase'
        request.environ['AUTH_TYPE'] = 'cookie'
        request.environ.update(auth)
        self.current_request = request
        return request
    
    def make_app(self):
        settings = {
            'cone.admin_user': 'admin',
            'cone.admin_password': 'admin',
            'cone.secret_password': '12345',
            'cone.plugins': 'node.ext.ugm',
            'cone.root.title': 'cone',
            'cone.root.default_child': None,
            'cone.root.mainmenu_empty_title': False,
            'node.ext.ugm.users_file': os.path.join(DATADIR, 'users'),
            'node.ext.ugm.groups_file': os.path.join(DATADIR, 'groups'),
            'node.ext.ugm.roles_file': os.path.join(DATADIR, 'roles'),
            'node.ext.ugm.datadir': os.path.join(DATADIR, 'userdata'),
        }
        self.app = cone.app.main({}, **settings)
        self.registry = self.app.registry
    
    def setUp(self, args=None):
        self.make_app()
        self.current_request = None
        import pyramid.threadlocal
        pyramid.threadlocal.manager.default = self.defaults
        print "Security set up."

    def tearDown(self):
        import pyramid.threadlocal
        pyramid.threadlocal.manager.default = pyramid.threadlocal.defaults
        print "Security torn down."

security = Security()