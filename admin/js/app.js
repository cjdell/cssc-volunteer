/* APP
-------------------------------- */
var angular = require('angular'),
  router = require('angular-ui-router'),
  ngDialog = require('./lib/ngDialog');

window._ = require('underscore'); // Restangular wants _ in global scope

require('angular-animate'); // Pollutes global scope, could do with improving
require('restangular');

var app = angular.module('go-angular-starter', ['ngLocale', 'ngAnimate', 'restangular', router, ngDialog]);

/* SERVICES
-------------------------------- */
app.factory('Authenticator', require('./services/authenticator'));
app.factory('Uploader', require('./services/uploader'));
app.factory('Utility', require('./services/utility'));

/* API
-------------------------------- */
app.factory('AuthApi', require('./api/auth'));
app.factory('UserApi', require('./api/user'));
app.factory('DocumentApi', require('./api/document'));

/* DIRECTIVES
-------------------------------- */
app.directive('match', require('./directives/match'));
app.directive('fileUpload', require('./directives/file_upload'));
app.directive('input', require('./directives/blur_focus'));
app.directive('select', require('./directives/blur_focus'));
app.directive('wizard', require('./directives/wizard'));
app.directive('tinyMce', require('./directives/tiny_mce'));

/* CONTROLLERS
-------------------------------- */
var AuthControllers = require('./controllers/auth'),
  UserControllers = require('./controllers/user'),
  DocumentControllers = require('./controllers/document');

app.controller('SignInController', AuthControllers.SignInController);
app.controller('RegisterController', AuthControllers.RegisterController);

app.controller('UsersController', UserControllers.UsersController);
app.controller('UserController', UserControllers.UserController);

app.controller('DocumentsController', DocumentControllers.DocumentsController);
app.controller('DocumentController', DocumentControllers.DocumentController);

app.run(require('./run/auth'));
app.run(require('./run/item_count'));
app.run(require('./run/permissions'));
app.run(require('./run/promise'));
app.run(require('./run/state_class'));

app.config(require('./config/http'));
app.config(require('./config/router'));

app.config(require('./config/restangular'));

// Manual Angular bootstrap call, less magic
angular.bootstrap(window.document.body, ['go-angular-starter']);