(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "auth": {
    "abstract": true,
    "templateUrl": "views/layouts/auth.html",
    "url": "/auth"
  },
  "auth.register": {
    "controller": "RegisterController",
    "templateUrl": "views/auth/register.html",
    "url": "/register"
  },
  "auth.sign-in": {
    "controller": "SignInController",
    "templateUrl": "views/auth/sign-in.html",
    "url": "/sign-in/:attemptedStateName/:attemptedStateParams"
  },
  "dashboard": {
    "templateUrl": "views/dashboard/index.html",
    "url": "/"
  },
  "records": {
    "abstract": true,
    "allow": [
      "Admin",
      "Business"
    ],
    "templateUrl": "views/layouts/records.html",
    "url": "/records"
  },
  "records.users": {
    "abstract": true,
    "allow": [
      "Admin"
    ],
    "controller": "UsersController",
    "templateUrl": "views/users/index.html",
    "url": "/users"
  },
  "records.users.new": {
    "allow": [
      "Admin"
    ],
    "controller": "UserController",
    "templateUrl": "views/users/view.html",
    "url": "/new"
  },
  "records.users.view": {
    "allow": [
      "Admin"
    ],
    "controller": "UserController",
    "templateUrl": "views/users/view.html",
    "url": "/{id:[0-9]+}"
  },
  "records.documents": {
    "abstract": true,
    "allow": [
      "Admin"
    ],
    "controller": "DocumentsController",
    "templateUrl": "views/documents/index.html",
    "url": "/documents"
  },
  "records.documents.new": {
    "allow": [
      "Admin"
    ],
    "controller": "DocumentController",
    "templateUrl": "views/documents/view.html",
    "url": "/new"
  },
  "records.documents.view": {
    "allow": [
      "Admin"
    ],
    "controller": "DocumentController",
    "templateUrl": "views/documents/view.html",
    "url": "/{id:[0-9]+}"
  }
}
},{}],2:[function(require,module,exports){
"use strict";
module.exports = ['$http', '$q', function($http, $q) {
  return {
    SignIn: function(email, password) {
      return $http.jsonrpc('/auth', 'AuthApi.SignIn', [{
        Email: email,
        Password: password
      }]);
    },
    Register: function(email, password) {
      return $http.jsonrpc('/auth', 'AuthApi.Register', [{
        Email: email,
        Password: password
      }]);
    }
  };
}];


},{}],3:[function(require,module,exports){
"use strict";
module.exports = ['$http', 'Restangular', function($http, Restangular) {
  var service = Restangular.service('api/documents');
  return {
    EntityNames: {
      SingularPascalCase: 'Document',
      PluralPascalCase: 'Documents',
      SingularCamelCase: 'document',
      PluralCamelCase: 'documents',
      SingularSnakeCase: 'document',
      PluralSnakeCase: 'documents'
    },
    GetAll: function(args) {
      return service.getList();
    },
    GetOne: function(id) {
      return service.one(id).get();
    },
    Post: function(document) {
      return service.post(document);
    },
    Put: function(document) {
      return document.put();
    },
    Delete: function(document) {
      return document.remove();
    }
  };
}];


},{}],4:[function(require,module,exports){
"use strict";
module.exports = ['$http', 'Restangular', function($http, Restangular) {
  var service = Restangular.service('api/users');
  return {
    EntityNames: {
      SingularPascalCase: 'User',
      PluralPascalCase: 'Users',
      SingularCamelCase: 'user',
      PluralCamelCase: 'users',
      SingularSnakeCase: 'user',
      PluralSnakeCase: 'users'
    },
    GetAll: function(args) {
      return service.getList();
    },
    GetOne: function(id) {
      return service.one(id).get();
    },
    Post: function(user) {
      return service.post(user);
    },
    Put: function(user) {
      return user.put();
    },
    Delete: function(user) {
      return user.remove();
    }
  };
}];


},{}],5:[function(require,module,exports){
"use strict";
module.exports = ['$provide', function($provide) {
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q) {
    $delegate.jsonrpc = function(url, method, parameters, config) {
      var deferred = $q.defer();
      var data = {
        "jsonrpc": "2.0",
        "method": method,
        "params": parameters,
        "id": 1
      };
      $delegate.post(url, data, angular.extend({'headers': {'Content-Type': 'application/json'}}, config)).then(succeeded, failed);
      function succeeded(data) {
        if (!data.data.error) {
          deferred.resolve(data.data.result);
        } else {
          console.error(data.data.error);
          deferred.reject(data.data.error);
        }
      }
      function failed(error) {
        if (typeof error.data === 'string') {
          alert(error.data);
        }
        console.error(error);
        deferred.reject(error);
      }
      return deferred.promise;
    };
    return $delegate;
  }]);
}];


},{}],6:[function(require,module,exports){
"use strict";
module.exports = ['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.setRestangularFields({id: 'Id'});
  RestangularProvider.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
      return null;
    }
    return elem;
  });
}];


},{}],7:[function(require,module,exports){
"use strict";
module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/records/users/new');
  var routes = require('../../config/routes.json');
  for (var stateName in routes) {
    var stateInfo = routes[stateName];
    $stateProvider.state(stateName, stateInfo);
  }
}];


},{"../../config/routes.json":1}],8:[function(require,module,exports){
"use strict";
var SignInController = ['$scope', '$state', '$stateParams', 'Authenticator', function($scope, $state, $stateParams, Authenticator) {
  'use strict';
  $scope.user = {};
  console.log($stateParams);
  $scope.signIn = function() {
    if (!$scope.signInForm.$valid) {
      alert('Form is invalid');
      return;
    }
    Authenticator.signIn($scope.user.email, $scope.user.password).then(signedIn, failed);
  };
  $scope.setAdmin = function() {
    $scope.user = {
      email: 'admin@example.com',
      password: 'password'
    };
  };
  $scope.setBusiness = function() {
    $scope.user = {
      email: 'business@example.com',
      password: 'password'
    };
  };
  function signedIn() {
    if ($stateParams.attemptedStateParams)
      $state.go($stateParams.attemptedStateName, JSON.parse(atob(decodeURI($stateParams.attemptedStateParams))));
    else
      $state.go('dashboard');
  }
  function failed(error) {
    alert(error);
  }
}];
var RegisterController = ['$scope', '$state', '$stateParams', 'AuthApi', function($scope, $state, $stateParams, AuthApi) {
  'use strict';
  var user = $scope.user = {};
  $scope.register = function() {
    if ($scope.registerForm.$pristine) {
      alert('Form is empty');
      return;
    }
    if (!$scope.registerForm.$valid) {
      alert('Form is invalid');
      return;
    }
    AuthApi.Register(user.email, user.password).then(registerSuccessful, registerFailed);
  };
  function registerSuccessful() {
    $state.go('auth.sign-in');
  }
  function registerFailed(error) {
    alert(error);
  }
  $scope.$watch('registerForm.password.$viewValue', function() {
    var form = $scope.registerForm;
    if (form.$dirty) {
      form.password.$setValidity('length', form.password.$viewValue && form.password.$viewValue.length >= 3);
    }
  });
}];
module.exports = {
  SignInController: SignInController,
  RegisterController: RegisterController
};


},{}],9:[function(require,module,exports){
"use strict";
var _ = require('underscore'),
    Validate = require('validate-arguments');
var ListController = ['$scope', '$q', 'Api', function($scope, $q, Api) {
  var args = Validate.validate(arguments, ['object', 'object', {
    EntityNames: 'object',
    GetAll: 'function'
  }]);
  if (!args.isValid()) {
    throw args.errorString();
  }
  var ctrl = this;
  ctrl.init = function() {
    console.log('ListController: init');
    ctrl.load();
  };
  ctrl.load = function() {
    Api.GetAll().then(ctrl.loaded, ctrl.failed);
  };
  ctrl.loaded = function(reply) {
    $scope.records = reply;
    $scope.$emit('itemCountDiscovered', Api.EntityNames.SingularPascalCase, $scope.records.length);
  };
  ctrl.failed = function(err) {
    console.error(err);
  };
  $scope.$on('item-saved', (function() {
    return ctrl.load();
  }));
  $scope.$on('item-deleted', (function() {
    return ctrl.load();
  }));
}];
var ItemController = ['$scope', '$q', '$state', '$stateParams', 'Api', function($scope, $q, $state, $stateParams, Api) {
  var args = Validate.validate(arguments, ['object', 'object', 'object', 'object', {
    EntityNames: 'object',
    GetOne: 'function'
  }]);
  if (!args.isValid()) {
    throw args.errorString();
  }
  var ctrl = this;
  ctrl.init = function() {
    console.log('ItemController: init');
    if ($stateParams.id !== undefined) {
      ctrl.load(parseInt($stateParams.id));
    } else {
      ctrl.blank();
    }
  };
  ctrl.load = function(id) {
    Api.GetOne(id).then(ctrl.loaded, ctrl.failed);
  };
  ctrl.blank = function() {
    $scope.record = {};
    beginObserve($scope.record);
  };
  ctrl.new = function() {
    ctrl.goToRecord();
  };
  ctrl.validate = function() {
    return true;
  };
  ctrl.save = function() {
    if (ctrl.validate()) {
      $scope.$emitp('item-saving', $scope.record).then(function(results) {
        if ($scope.record.Id !== undefined) {
          ctrl.update();
        } else {
          ctrl.insert();
        }
      });
    }
  };
  ctrl.update = function() {
    $scope.$emitp('item-updating', $scope.record).then(function(results) {
      return Api.Put($scope.record);
    }).then(ctrl.saved, ctrl.failed);
  };
  ctrl.insert = function() {
    $scope.$emitp('item-inserting', $scope.record).then(function(results) {
      return Api.Post($scope.record);
    }).then(ctrl.saved, ctrl.failed);
  };
  ctrl.delete = function() {
    $scope.$emitp('item-deleting', $scope.record).then(function(results) {
      return Api.Delete($scope.record);
    }).then(ctrl.saved, ctrl.failed);
  };
  ctrl.loaded = function(reply) {
    $scope.record = reply;
    beginObserve($scope.record);
    console.log('Loaded Record:', $scope.record);
  };
  ctrl.failed = function(err) {
    if (err && err.data)
      alert(err.data.Error);
    console.error(err);
  };
  ctrl.saved = function(reply) {
    $scope.record = reply;
    beginObserve($scope.record);
    console.log('Saved Record:', $scope.record);
    $scope.$emit('item-saved', $scope.record);
    ctrl.goToRecord($scope.record.Id);
  };
  ctrl.deleted = function() {
    console.log('Deleted Record:', $scope.record);
    $scope.$emit('item-deleted', $scope.record);
    ctrl.goToRecord();
  };
  ctrl.goToRecord = function(id) {
    if (id) {
      $state.go('records.' + Api.EntityNames.PluralSnakeCase + '.view', {id: id});
    } else {
      $state.go('records.' + Api.EntityNames.PluralSnakeCase + '.new');
    }
  };
  $scope.new = (function() {
    return ctrl.new();
  });
  $scope.save = (function() {
    return ctrl.save();
  });
  $scope.delete = (function() {
    return ctrl.delete();
  });
  function beginObserve(record) {
    record.Changes = {Fields: []};
    Object.observe(record, function(changes) {
      record.Changes.Fields.push(changes[0].name);
    });
  }
}];
module.exports = {
  ListController: ListController,
  ItemController: ItemController
};


},{"underscore":"i/IrWO","validate-arguments":"Bigffj"}],10:[function(require,module,exports){
"use strict";
var angular = require('angular'),
    _ = require('underscore'),
    common = require('./common');
var DocumentsController = ['$injector', '$scope', '$state', '$stateParams', 'DocumentApi', function($injector, $scope, $state, $stateParams, DocumentApi) {
  var ctrl = this;
  $injector.invoke(common.ListController, ctrl, {
    $scope: $scope,
    Api: DocumentApi
  });
  ctrl.init();
}];
var DocumentController = ['$injector', '$scope', '$state', '$stateParams', 'DocumentApi', function($injector, $scope, $state, $stateParams, DocumentApi) {
  var ctrl = this;
  $injector.invoke(common.ItemController, ctrl, {
    $scope: $scope,
    $state: $state,
    $stateParams: $stateParams,
    Api: DocumentApi
  });
  $scope.$on('item-saving', (function(e, record, promises) {
    promises.push($scope.newImage().then((function(savedFileName) {
      record.Changes.NewImageFileName = savedFileName;
    })));
    promises.push($scope.newAttachment().then((function(savedFileName) {
      record.Changes.NewAttachmentFileName = savedFileName;
    })));
  }));
  ctrl.init();
}];
module.exports = {
  DocumentsController: DocumentsController,
  DocumentController: DocumentController
};


},{"./common":9,"angular":"osiaBs","underscore":"i/IrWO"}],11:[function(require,module,exports){
"use strict";
var angular = require('angular'),
    _ = require('underscore'),
    common = require('./common');
var UsersController = ['$injector', '$scope', '$state', '$stateParams', 'UserApi', function($injector, $scope, $state, $stateParams, UserApi) {
  var ctrl = this;
  $injector.invoke(common.ListController, ctrl, {
    $scope: $scope,
    Api: UserApi
  });
  ctrl.init();
}];
var UserController = ['$injector', '$scope', '$state', '$stateParams', 'UserApi', function($injector, $scope, $state, $stateParams, UserApi) {
  var ctrl = this;
  $injector.invoke(common.ItemController, ctrl, {
    $scope: $scope,
    $state: $state,
    $stateParams: $stateParams,
    Api: UserApi
  });
  ctrl.init();
}];
module.exports = {
  UsersController: UsersController,
  UserController: UserController
};


},{"./common":9,"angular":"osiaBs","underscore":"i/IrWO"}],12:[function(require,module,exports){
"use strict";
module.exports = [function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) {
        return;
      }
      elm.on('focus', function() {
        elm.addClass('has-focus');
        ctrl.$hasFocus = true;
      });
      elm.on('blur', function() {
        elm.removeClass('has-focus');
        elm.addClass('has-visited');
        ctrl.$hasFocus = false;
        ctrl.$hasVisited = true;
      });
    }
  };
}];


},{}],13:[function(require,module,exports){
"use strict";
module.exports = ['$q', 'Uploader', 'Utility', function($q, Uploader, Utility) {
  function noFile() {
    var deferred = $q.defer();
    deferred.resolve(null);
    return deferred.promise;
  }
  return {
    scope: {fileUpload: "="},
    templateUrl: 'views/directives/file_upload.html',
    link: function(scope, element, attributes) {
      var inputFile = element.find('input');
      var button = element.find('a');
      element.addClass('file-upload');
      scope.fileUpload = noFile;
      scope.uploading = false;
      button.bind('click', function(e) {
        e.preventDefault();
        inputFile[0].click();
      });
      inputFile.bind('change', function(changeEvent) {
        if (changeEvent.target.files.length === 0)
          return;
        scope.fileUploadIndicator = "Uploading...";
        scope.uploading = true;
        var fileId = Utility.guid();
        var promise = Uploader.uploadBlob(changeEvent.target.files[0], fileId).then(function(savedFileName) {
          scope.fileUploadIndicator = "Upload Complete";
          scope.uploading = false;
          return savedFileName;
        });
        scope.$apply(function() {
          scope.fileUpload = function() {
            scope.fileUpload = noFile;
            return promise;
          };
        });
      });
    }
  };
}];


},{}],14:[function(require,module,exports){
"use strict";
module.exports = function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {match: '='},
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {
        return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('match', currentValue);
      });
    }
  };
};


},{}],15:[function(require,module,exports){
"use strict";
module.exports = [function() {
  var uiTinymceConfig = {
    plugins: 'autoresize',
    width: '100%'
  };
  var generatedIds = 0;
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ngModel) {
      var expression,
          options,
          tinyInstance;
      if (!attrs.id) {
        attrs.$set('id', 'uiTinymce' + generatedIds++);
      }
      options = {
        setup: function(ed) {
          ed.on('init', function(args) {
            ngModel.$render();
          });
          ed.on('ExecCommand', function(e) {
            ed.save();
            ngModel.$setViewValue(elm.val());
            if (!scope.$$phase) {
              scope.$apply();
            }
          });
          ed.on('KeyUp', function(e) {
            console.log(ed.isDirty());
            ed.save();
            ngModel.$setViewValue(elm.val());
            if (!scope.$$phase) {
              scope.$apply();
            }
          });
        },
        mode: 'exact',
        elements: attrs.id
      };
      if (attrs.uiTinymce) {
        expression = scope.$eval(attrs.uiTinymce);
      } else {
        expression = {};
      }
      angular.extend(options, uiTinymceConfig, expression);
      setTimeout(function() {
        tinymce.init(options);
      });
      ngModel.$render = function() {
        if (!tinyInstance) {
          tinyInstance = tinymce.get(attrs.id);
        }
        if (tinyInstance) {
          tinyInstance.setContent(ngModel.$viewValue || '');
        }
      };
    }
  };
}];


},{}],16:[function(require,module,exports){
"use strict";
module.exports = ['$state', '$stateParams', function($state, $stateParams) {
  return {
    restrict: 'C',
    link: function(scope, element, attrs) {
      scope.goToStage = function(toStageIndex) {
        if ($stateParams.stageIndex < toStageIndex) {
          element.addClass('wizard-moved-forward');
          element.removeClass('wizard-moved-backward');
        } else if ($stateParams.stageIndex > toStageIndex) {
          element.addClass('wizard-moved-backward');
          element.removeClass('wizard-moved-forward');
        }
        $state.go($state.current.name, {stageIndex: toStageIndex});
      };
    }
  };
}];


},{}],17:[function(require,module,exports){
"use strict";
var angular = require('angular'),
    router = require('angular-ui-router'),
    ngDialog = require('./lib/ngDialog');
window._ = require('underscore');
require('angular-animate');
require('restangular');
var app = angular.module('go-angular-starter', ['ngLocale', 'ngAnimate', 'restangular', router, ngDialog]);
app.factory('Authenticator', require('./services/authenticator'));
app.factory('Uploader', require('./services/uploader'));
app.factory('Utility', require('./services/utility'));
app.factory('AuthApi', require('./api/auth'));
app.factory('UserApi', require('./api/user'));
app.factory('DocumentApi', require('./api/document'));
app.directive('match', require('./directives/match'));
app.directive('fileUpload', require('./directives/file_upload'));
app.directive('input', require('./directives/blur_focus'));
app.directive('select', require('./directives/blur_focus'));
app.directive('wizard', require('./directives/wizard'));
app.directive('tinyMce', require('./directives/tiny_mce'));
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
angular.bootstrap(window.document.body, ['go-angular-starter']);


},{"./api/auth":2,"./api/document":3,"./api/user":4,"./config/http":5,"./config/restangular":6,"./config/router":7,"./controllers/auth":8,"./controllers/document":10,"./controllers/user":11,"./directives/blur_focus":12,"./directives/file_upload":13,"./directives/match":14,"./directives/tiny_mce":15,"./directives/wizard":16,"./lib/ngDialog":18,"./run/auth":19,"./run/item_count":20,"./run/permissions":21,"./run/promise":22,"./run/state_class":23,"./services/authenticator":24,"./services/uploader":25,"./services/utility":26,"angular":"osiaBs","angular-animate":"iwQJt4","angular-ui-router":"QuQXwQ","restangular":"6pcHiv","underscore":"i/IrWO"}],18:[function(require,module,exports){
"use strict";
var moduleName = 'ngDialog';
(function(window, angular, undefined) {
  'use strict';
  var module = angular.module(moduleName, []);
  var $el = angular.element;
  var isDef = angular.isDefined;
  var style = (document.body || document.documentElement).style;
  var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
  var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
  var forceBodyReload = false;
  module.provider('ngDialog', function() {
    var defaults = this.defaults = {
      className: 'ngdialog-theme-default',
      plain: false,
      showClose: true,
      closeByDocument: true,
      closeByEscape: true,
      appendTo: false
    };
    this.setForceBodyReload = function(_useIt) {
      forceBodyReload = _useIt || false;
    };
    this.setDefaults = function(newDefaults) {
      angular.extend(defaults, newDefaults);
    };
    var globalID = 0,
        dialogsCount = 0,
        closeByDocumentHandler,
        defers = {};
    this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', function($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller) {
      var $body = $document.find('body');
      if (forceBodyReload) {
        $rootScope.$on('$locationChangeSuccess', function() {
          $body = $document.find('body');
        });
      }
      var privateMethods = {
        onDocumentKeydown: function(event) {
          if (event.keyCode === 27) {
            publicMethods.close('$escape');
          }
        },
        setBodyPadding: function(width) {
          var originalBodyPadding = parseInt(($body.css('padding-right') || 0), 10);
          $body.css('padding-right', (originalBodyPadding + width) + 'px');
          $body.data('ng-dialog-original-padding', originalBodyPadding);
        },
        resetBodyPadding: function() {
          var originalBodyPadding = $body.data('ng-dialog-original-padding');
          if (originalBodyPadding) {
            $body.css('padding-right', originalBodyPadding + 'px');
          } else {
            $body.css('padding-right', '');
          }
        },
        closeDialog: function($dialog, value) {
          var id = $dialog.attr('id');
          if (typeof window.Hammer !== 'undefined') {
            window.Hammer($dialog[0]).off('tap', closeByDocumentHandler);
          } else {
            $dialog.unbind('click');
          }
          if (dialogsCount === 1) {
            $body.unbind('keydown');
          }
          if (!$dialog.hasClass("ngdialog-closing")) {
            dialogsCount -= 1;
          }
          if (animationEndSupport) {
            $dialog.unbind(animationEndEvent).bind(animationEndEvent, function() {
              $dialog.scope().$destroy();
              $dialog.remove();
              if (dialogsCount === 0) {
                $body.removeClass('ngdialog-open');
                privateMethods.resetBodyPadding();
              }
              $rootScope.$broadcast('ngDialog.closed', $dialog);
            }).addClass('ngdialog-closing');
          } else {
            $dialog.scope().$destroy();
            $dialog.remove();
            if (dialogsCount === 0) {
              $body.removeClass('ngdialog-open');
              privateMethods.resetBodyPadding();
            }
            $rootScope.$broadcast('ngDialog.closed', $dialog);
          }
          if (defers[id]) {
            defers[id].resolve({
              id: id,
              value: value,
              $dialog: $dialog,
              remainingDialogs: dialogsCount
            });
            delete defers[id];
          }
        }
      };
      var publicMethods = {
        open: function(opts) {
          var self = this;
          var options = angular.copy(defaults);
          opts = opts || {};
          angular.extend(options, opts);
          globalID += 1;
          self.latestID = 'ngdialog' + globalID;
          var defer;
          defers[self.latestID] = defer = $q.defer();
          var scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
          var $dialog,
              $dialogParent;
          $q.when(loadTemplate(options.template)).then(function(template) {
            template = angular.isString(template) ? template : template.data && angular.isString(template.data) ? template.data : '';
            $templateCache.put(options.template, template);
            if (options.showClose) {
              template += '<div class="ngdialog-close"></div>';
            }
            self.$result = $dialog = $el('<div id="ngdialog' + globalID + '" class="ngdialog"></div>');
            $dialog.html('<div class="ngdialog-overlay"></div><div class="ngdialog-content">' + template + '</div>');
            if (options.data && angular.isString(options.data)) {
              var firstLetter = options.data.replace(/^\s*/, '')[0];
              scope.ngDialogData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : options.data;
            } else if (options.data && angular.isObject(options.data)) {
              scope.ngDialogData = angular.fromJson(angular.toJson(options.data));
            }
            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
              var controllerInstance = $controller(options.controller, {
                $scope: scope,
                $element: $dialog
              });
              $dialog.data('$ngDialogControllerController', controllerInstance);
            }
            if (options.className) {
              $dialog.addClass(options.className);
            }
            if (options.appendTo && angular.isString(options.appendTo)) {
              $dialogParent = angular.element(document.querySelector(options.appendTo));
            } else {
              $dialogParent = $body;
            }
            scope.closeThisDialog = function(value) {
              privateMethods.closeDialog($dialog, value);
            };
            $timeout(function() {
              $compile($dialog)(scope);
              var widthDiffs = $window.innerWidth - $body.prop('clientWidth');
              $body.addClass('ngdialog-open');
              var scrollBarWidth = widthDiffs - ($window.innerWidth - $body.prop('clientWidth'));
              if (scrollBarWidth > 0) {
                privateMethods.setBodyPadding(scrollBarWidth);
              }
              $dialogParent.append($dialog);
              $rootScope.$broadcast('ngDialog.opened', $dialog);
            });
            if (options.closeByEscape) {
              $body.bind('keydown', privateMethods.onDocumentKeydown);
            }
            closeByDocumentHandler = function(event) {
              var isOverlay = options.closeByDocument ? $el(event.target).hasClass('ngdialog-overlay') : false;
              var isCloseBtn = $el(event.target).hasClass('ngdialog-close');
              if (isOverlay || isCloseBtn) {
                publicMethods.close($dialog.attr('id'), isCloseBtn ? '$closeButton' : '$document');
              }
            };
            if (typeof window.Hammer !== 'undefined') {
              window.Hammer($dialog[0]).on('tap', closeByDocumentHandler);
            } else {
              $dialog.bind('click', closeByDocumentHandler);
            }
            dialogsCount += 1;
            return publicMethods;
          });
          return {
            id: 'ngdialog' + globalID,
            closePromise: defer.promise,
            close: function(value) {
              privateMethods.closeDialog($dialog, value);
            }
          };
          function loadTemplate(tmpl) {
            if (!tmpl) {
              return 'Empty template';
            }
            if (angular.isString(tmpl) && options.plain) {
              return tmpl;
            }
            return $templateCache.get(tmpl) || $http.get(tmpl, {cache: true});
          }
        },
        openConfirm: function(opts) {
          var defer = $q.defer();
          var options = {
            closeByEscape: false,
            closeByDocument: false
          };
          angular.extend(options, opts);
          options.scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
          options.scope.confirm = function(value) {
            defer.resolve(value);
            openResult.close(value);
          };
          var openResult = publicMethods.open(options);
          openResult.closePromise.then(function(data) {
            if (data) {
              return defer.reject(data.value);
            }
            return defer.reject();
          });
          return defer.promise;
        },
        close: function(id, value) {
          var $dialog = $el(document.getElementById(id));
          if ($dialog.length) {
            privateMethods.closeDialog($dialog, value);
          } else {
            publicMethods.closeAll(value);
          }
          return publicMethods;
        },
        closeAll: function(value) {
          var $all = document.querySelectorAll('.ngdialog');
          angular.forEach($all, function(dialog) {
            privateMethods.closeDialog($el(dialog), value);
          });
        }
      };
      return publicMethods;
    }];
  });
  module.directive('ngDialog', ['ngDialog', function(ngDialog) {
    return {
      restrict: 'A',
      scope: {ngDialogScope: '='},
      link: function(scope, elem, attrs) {
        elem.on('click', function(e) {
          e.preventDefault();
          var ngDialogScope = angular.isDefined(scope.ngDialogScope) ? scope.ngDialogScope : 'noScope';
          if (angular.isDefined(attrs.ngDialogClosePrevious))
            ngDialog.close(attrs.ngDialogClosePrevious);
          ngDialog.open({
            template: attrs.ngDialog,
            className: attrs.ngDialogClass,
            controller: attrs.ngDialogController,
            scope: ngDialogScope,
            data: attrs.ngDialogData,
            showClose: attrs.ngDialogShowClose === 'false' ? false : true,
            closeByDocument: attrs.ngDialogCloseByDocument === 'false' ? false : true,
            closeByEscape: attrs.ngDialogCloseByEscape === 'false' ? false : true
          });
        });
      }
    };
  }]);
})(window, require('angular'));
module.exports = moduleName;


},{"angular":"osiaBs"}],19:[function(require,module,exports){
"use strict";
module.exports = ['$rootScope', '$state', 'Authenticator', function($rootScope, $state, Authenticator) {
  $rootScope.getUser = function() {
    return Authenticator.getUser();
  };
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    var userType = 'Guest';
    if (Authenticator.getUser())
      userType = Authenticator.getUser().Type;
    var allowed = !(toState.allow instanceof Array) || toState.allow.indexOf(userType) !== -1;
    if (!allowed) {
      toParams.attemptedStateParams = encodeURI(btoa(JSON.stringify(toParams)));
      toParams.attemptedStateName = toState.name;
      $state.go("auth.sign-in", toParams);
      event.preventDefault();
    }
  });
  $rootScope.signOut = function() {
    Authenticator.signOut(function() {
      $state.go('dashboard');
    });
  };
}];


},{}],20:[function(require,module,exports){
"use strict";
module.exports = ['$rootScope', function($rootScope) {
  $rootScope.$on("itemCountDiscovered", function(e, type, count) {
    $rootScope.itemCounts = $rootScope.itemCounts || {};
    $rootScope.itemCounts[type] = count;
  });
}];


},{}],21:[function(require,module,exports){
"use strict";
module.exports = ['$rootScope', '$state', 'Authenticator', function($rootScope, $state, Authenticator) {
  $rootScope.canView = function(thing) {
    var user = Authenticator.getUser();
    if (!user)
      return false;
    if (user.Type === 'Admin')
      return true;
    return false;
  };
}];


},{}],22:[function(require,module,exports){
"use strict";
module.exports = ['$rootScope', '$q', function($rootScope, $q) {
  $rootScope.$emitp = function(name, obj) {
    var promises = [];
    this.$emit(name, obj, promises);
    return $q.all(promises);
  };
  $rootScope.$broadcastp = function(name, obj) {
    var promises = [];
    this.$broadcast(name, obj, promises);
    return $q.all(promises);
  };
}];


},{}],23:[function(require,module,exports){
"use strict";
module.exports = ['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.getStateClass = function() {
    return $state.current.name.replace(/\./g, '--');
  };
}];


},{}],24:[function(require,module,exports){
"use strict";
module.exports = ['$http', 'AuthApi', function($http, AuthApi) {
  var user = null;
  return {
    isAuthenticated: function() {
      return user !== null;
    },
    signIn: function(email, password) {
      return AuthApi.SignIn(email, password).then(function(reply) {
        $http.defaults.headers.common['API-Key'] = reply.ApiKey;
        return user = {
          ApiKey: reply.ApiKey,
          Email: reply.Email,
          Name: reply.Name,
          Type: reply.Type
        };
      });
    },
    signOut: function() {
      user = null;
      delete $http.defaults.headers.common['API-Key'];
    },
    getUser: function() {
      return user;
    }
  };
}];


},{}],25:[function(require,module,exports){
"use strict";
module.exports = ['$q', function($q) {
  function uploadBlob(blob, fileId) {
    var deferred = $q.defer();
    if (!(blob instanceof Blob)) {
      console.error("Not a blob!");
      return;
    }
    if (typeof fileId !== 'string') {
      console.error("No file ID!");
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = ajaxSuccess;
    xhr.onerror = ajaxError;
    xhr.open("post", "/upload", true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    if (blob.name)
      xhr.setRequestHeader("X-Upload-File-Name", blob.name);
    if (fileId)
      xhr.setRequestHeader("X-Upload-File-ID", fileId);
    xhr.send(blob);
    return deferred.promise;
    function ajaxSuccess() {
      deferred.resolve(xhr.responseText);
    }
    function ajaxError(error) {
      deferred.reject(error);
    }
  }
  return {uploadBlob: uploadBlob};
}];


},{}],26:[function(require,module,exports){
"use strict";
var _ = require('underscore');
module.exports = [function() {
  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
  }
  function fromPgArray(pgArray) {
    _.map(pgArray.substring(1, pgArray.length - 2).split(','), (function(id) {
      return parseInt(id);
    }));
  }
  function toPgArray(array) {
    return '{' + array.join(',') + '}';
  }
  return {
    guid: guid,
    fromPgArray: fromPgArray,
    toPgArray: toPgArray
  };
}];


},{"underscore":"i/IrWO"}],27:[function(require,module,exports){
(function (process,global){
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $keys = $Object.keys;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  var $preventExtensions = Object.preventExtensions;
  var $seal = Object.seal;
  var $isExtensible = Object.isExtensible;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  var privateNames = $create(null);
  function createPrivateName() {
    var s = newUniqueString();
    privateNames[s] = true;
    return s;
  }
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  var hashProperty = createPrivateName();
  var hashPropertyDescriptor = {value: undefined};
  var hashObjectProperties = {
    hash: {value: undefined},
    self: {value: undefined}
  };
  var hashCounter = 0;
  function getOwnHashObject(object) {
    var hashObject = object[hashProperty];
    if (hashObject && hashObject.self === object)
      return hashObject;
    if ($isExtensible(object)) {
      hashObjectProperties.hash.value = hashCounter++;
      hashObjectProperties.self.value = object;
      hashPropertyDescriptor.value = $create(null, hashObjectProperties);
      $defineProperty(object, hashProperty, hashPropertyDescriptor);
      return hashPropertyDescriptor.value;
    }
    return undefined;
  }
  function freeze(object) {
    getOwnHashObject(object);
    return $freeze.apply(this, arguments);
  }
  function preventExtensions(object) {
    getOwnHashObject(object);
    return $preventExtensions.apply(this, arguments);
  }
  function seal(object) {
    getOwnHashObject(object);
    return $seal.apply(this, arguments);
  }
  Symbol.iterator = Symbol();
  freeze(SymbolValue.prototype);
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name] && !privateNames[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    $defineProperty(Object, 'freeze', {value: freeze});
    $defineProperty(Object, 'preventExtensions', {value: preventExtensions});
    $defineProperty(Object, 'seal', {value: seal});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        var name = names[j];
        if (privateNames[name])
          continue;
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function isObject(x) {
    return x != null && (typeof x === 'object' || typeof x === 'function');
  }
  function toObject(x) {
    if (x == null)
      throw $TypeError();
    return $Object(x);
  }
  function assertObject(x) {
    if (!isObject(x))
      throw $TypeError(x + ' is not an Object');
    return x;
  }
  function checkObjectCoercible(argument) {
    if (argument == null) {
      throw new TypeError('Value cannot be converted to an Object');
    }
    return argument;
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    global.Reflect = global.Reflect || {};
    global.Reflect.global = global.Reflect.global || global;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    assertObject: assertObject,
    createPrivateName: createPrivateName,
    exportStar: exportStar,
    getOwnHashObject: getOwnHashObject,
    privateNames: privateNames,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    toObject: toObject,
    isObject: isObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf,
    checkObjectCoercible: checkObjectCoercible,
    hasOwnProperty: function(o, p) {
      return hasOwnProperty.call(o, p);
    },
    defineProperties: $defineProperties,
    defineProperty: $defineProperty,
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    getOwnPropertyNames: $getOwnPropertyNames,
    keys: $keys
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  'use strict';
  function spread() {
    var rv = [],
        j = 0,
        iterResult;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
      if (typeof valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)] !== 'function') {
        throw new TypeError('Cannot spread non-iterable object.');
      }
      var iter = valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)]();
      while (!(iterResult = iter.next()).done) {
        rv[j++] = iterResult.value;
      }
    }
    return rv;
  }
  $traceurRuntime.spread = spread;
})();
(function() {
  'use strict';
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $getOwnPropertyDescriptor = $traceurRuntime.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $traceurRuntime.getOwnPropertyNames;
  var $getPrototypeOf = Object.getPrototypeOf;
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    do {
      var result = $getOwnPropertyDescriptor(proto, name);
      if (result)
        return result;
      proto = $getPrototypeOf(proto);
    } while (proto);
    return undefined;
  }
  function superCall(self, homeObject, name, args) {
    return superGet(self, homeObject, name).apply(self, args);
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (!descriptor.get)
        return descriptor.value;
      return descriptor.get.call(self);
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
      throw new $TypeError('super prototype must be an Object or null');
    }
    if (superClass === null)
      return null;
    throw new $TypeError('Super expression must either be null or a function');
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  $traceurRuntime.createClass = createClass;
  $traceurRuntime.defaultSuperCall = defaultSuperCall;
  $traceurRuntime.superCall = superCall;
  $traceurRuntime.superGet = superGet;
  $traceurRuntime.superSet = superSet;
})();
(function() {
  'use strict';
  var createPrivateName = $traceurRuntime.createPrivateName;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $create = Object.create;
  var $TypeError = TypeError;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    },
    handleException: function(ex) {
      this.GState = ST_CLOSED;
      this.state = END_STATE;
      throw ex;
    }
  };
  function nextOrThrow(ctx, moveNext, action, x) {
    switch (ctx.GState) {
      case ST_EXECUTING:
        throw new Error(("\"" + action + "\" on executing generator"));
      case ST_CLOSED:
        if (action == 'next') {
          return {
            value: undefined,
            done: true
          };
        }
        throw x;
      case ST_NEWBORN:
        if (action === 'throw') {
          ctx.GState = ST_CLOSED;
          throw x;
        }
        if (x !== undefined)
          throw $TypeError('Sent value to newborn generator');
      case ST_SUSPENDED:
        ctx.GState = ST_EXECUTING;
        ctx.action = action;
        ctx.sent = x;
        var value = moveNext(ctx);
        var done = value === ctx;
        if (done)
          value = ctx.returnValue;
        ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
        return {
          value: value,
          done: done
        };
    }
  }
  var ctxName = createPrivateName();
  var moveNextName = createPrivateName();
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  $defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
  GeneratorFunctionPrototype.prototype = {
    constructor: GeneratorFunctionPrototype,
    next: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'next', v);
    },
    throw: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'throw', v);
    }
  };
  $defineProperties(GeneratorFunctionPrototype.prototype, {
    constructor: {enumerable: false},
    next: {enumerable: false},
    throw: {enumerable: false}
  });
  Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
    return this;
  }));
  function createGeneratorInstance(innerFunction, functionObject, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    var object = $create(functionObject.prototype);
    object[ctxName] = ctx;
    object[moveNextName] = moveNext;
    return object;
  }
  function initGeneratorFunction(functionObject) {
    functionObject.prototype = $create(GeneratorFunctionPrototype.prototype);
    functionObject.__proto__ = GeneratorFunctionPrototype;
    return functionObject;
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = $create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        this.resolve(this.returnValue);
        break;
      case RETHROW_STATE:
        this.reject(this.storedException);
        break;
      default:
        this.reject(getInternalError(this.state));
    }
  };
  AsyncFunctionContext.prototype.handleException = function() {
    this.state = RETHROW_STATE;
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.errback = function(err) {
      handleCatch(ctx, err);
      moveNext(ctx);
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          handleCatch(ctx, ex);
        }
      }
    };
  }
  function handleCatch(ctx, ex) {
    ctx.storedException = ex;
    var last = ctx.tryStack_[ctx.tryStack_.length - 1];
    if (!last) {
      ctx.handleException(ex);
      return;
    }
    ctx.state = last.catch !== undefined ? last.catch : last.finally;
    if (last.finallyFallThrough !== undefined)
      ctx.finallyFallThrough = last.finallyFallThrough;
  }
  $traceurRuntime.asyncWrap = asyncWrap;
  $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
  $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
})();
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime.assertObject($traceurRuntime),
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var ModuleEvaluationError = function ModuleEvaluationError(erroneousModuleName, cause) {
    this.message = this.constructor.name + (cause ? ': \'' + cause + '\'' : '') + ' in ' + erroneousModuleName;
  };
  ($traceurRuntime.createClass)(ModuleEvaluationError, {loadedBy: function(moduleName) {
      this.message += '\n loaded by ' + moduleName;
    }}, {}, Error);
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      try {
        return this.value_ = this.func.call(global);
      } catch (ex) {
        if (ex instanceof ModuleEvaluationError) {
          ex.loadedBy(this.url);
          throw ex;
        }
        throw new ModuleEvaluationError(this.url, ex);
      }
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length && !func.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: function() {
            var $__0 = arguments;
            var depMap = {};
            deps.forEach((function(dep, index) {
              return depMap[dep] = $__0[index];
            }));
            var registryEntry = func.call(this, depMap);
            registryEntry.execute.call(this);
            return registryEntry.exports;
          }
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/utils";
  var $ceil = Math.ceil;
  var $floor = Math.floor;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $pow = Math.pow;
  var $min = Math.min;
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x >>> 0;
  }
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function isCallable(x) {
    return typeof x === 'function';
  }
  function isNumber(x) {
    return typeof x === 'number';
  }
  function toInteger(x) {
    x = +x;
    if ($isNaN(x))
      return 0;
    if (x === 0 || !$isFinite(x))
      return x;
    return x > 0 ? $floor(x) : $ceil(x);
  }
  var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
  function toLength(x) {
    var len = toInteger(x);
    return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
  }
  function checkIterable(x) {
    return !isObject(x) ? undefined : x[Symbol.iterator];
  }
  function isConstructor(x) {
    return isCallable(x);
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    },
    get isObject() {
      return isObject;
    },
    get isCallable() {
      return isCallable;
    },
    get isNumber() {
      return isNumber;
    },
    get toInteger() {
      return toInteger;
    },
    get toLength() {
      return toLength;
    },
    get checkIterable() {
      return checkIterable;
    },
    get isConstructor() {
      return isConstructor;
    },
    get createIteratorResultObject() {
      return createIteratorResultObject;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Array", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Array";
  var $__3 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      isCallable = $__3.isCallable,
      isConstructor = $__3.isConstructor,
      checkIterable = $__3.checkIterable,
      toInteger = $__3.toInteger,
      toLength = $__3.toLength,
      toObject = $__3.toObject;
  function from(arrLike) {
    var mapFn = arguments[1];
    var thisArg = arguments[2];
    var C = this;
    var items = toObject(arrLike);
    var mapping = mapFn !== undefined;
    var k = 0;
    var arr,
        len;
    if (mapping && !isCallable(mapFn)) {
      throw TypeError();
    }
    if (checkIterable(items)) {
      arr = isConstructor(C) ? new C() : [];
      for (var $__4 = items[Symbol.iterator](),
          $__5; !($__5 = $__4.next()).done; ) {
        var item = $__5.value;
        {
          if (mapping) {
            arr[k] = mapFn.call(thisArg, item, k);
          } else {
            arr[k] = item;
          }
          k++;
        }
      }
      arr.length = k;
      return arr;
    }
    len = toLength(items.length);
    arr = isConstructor(C) ? new C(len) : new Array(len);
    for (; k < len; k++) {
      if (mapping) {
        arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
      } else {
        arr[k] = items[k];
      }
    }
    arr.length = len;
    return arr;
  }
  function fill(value) {
    var start = arguments[1] !== (void 0) ? arguments[1] : 0;
    var end = arguments[2];
    var object = toObject(this);
    var len = toLength(object.length);
    var fillStart = toInteger(start);
    var fillEnd = end !== undefined ? toInteger(end) : len;
    fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
    fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
    while (fillStart < fillEnd) {
      object[fillStart] = value;
      fillStart++;
    }
    return object;
  }
  function find(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg);
  }
  function findIndex(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg, true);
  }
  function findHelper(self, predicate) {
    var thisArg = arguments[2];
    var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
    var object = toObject(self);
    var len = toLength(object.length);
    if (!isCallable(predicate)) {
      throw TypeError();
    }
    for (var i = 0; i < len; i++) {
      if (i in object) {
        var value = object[i];
        if (predicate.call(thisArg, value, i, object)) {
          return returnIndex ? i : value;
        }
      }
    }
    return returnIndex ? -1 : undefined;
  }
  return {
    get from() {
      return from;
    },
    get fill() {
      return fill;
    },
    get find() {
      return find;
    },
    get findIndex() {
      return findIndex;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__8;
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/ArrayIterator";
  var $__6 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      toObject = $__6.toObject,
      toUint32 = $__6.toUint32,
      createIteratorResultObject = $__6.createIteratorResultObject;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__8 = {}, Object.defineProperty($__8, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__8, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__8), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Map", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Map";
  var isObject = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils").isObject;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  var deletedSentinel = {};
  function lookupIndex(map, key) {
    if (isObject(key)) {
      var hashObject = getOwnHashObject(key);
      return hashObject && map.objectIndex_[hashObject.hash];
    }
    if (typeof key === 'string')
      return map.stringIndex_[key];
    return map.primitiveIndex_[key];
  }
  function initMap(map) {
    map.entries_ = [];
    map.objectIndex_ = Object.create(null);
    map.stringIndex_ = Object.create(null);
    map.primitiveIndex_ = Object.create(null);
    map.deletedCount_ = 0;
  }
  var Map = function Map() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Map called on incompatible type');
    if ($hasOwnProperty.call(this, 'entries_')) {
      throw new TypeError('Map can not be reentrantly initialised');
    }
    initMap(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__11 = iterable[Symbol.iterator](),
          $__12; !($__12 = $__11.next()).done; ) {
        var $__13 = $traceurRuntime.assertObject($__12.value),
            key = $__13[0],
            value = $__13[1];
        {
          this.set(key, value);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Map, {
    get size() {
      return this.entries_.length / 2 - this.deletedCount_;
    },
    get: function(key) {
      var index = lookupIndex(this, key);
      if (index !== undefined)
        return this.entries_[index + 1];
    },
    set: function(key, value) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index = lookupIndex(this, key);
      if (index !== undefined) {
        this.entries_[index + 1] = value;
      } else {
        index = this.entries_.length;
        this.entries_[index] = key;
        this.entries_[index + 1] = value;
        if (objectMode) {
          var hashObject = getOwnHashObject(key);
          var hash = hashObject.hash;
          this.objectIndex_[hash] = index;
        } else if (stringMode) {
          this.stringIndex_[key] = index;
        } else {
          this.primitiveIndex_[key] = index;
        }
      }
      return this;
    },
    has: function(key) {
      return lookupIndex(this, key) !== undefined;
    },
    delete: function(key) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index;
      var hash;
      if (objectMode) {
        var hashObject = getOwnHashObject(key);
        if (hashObject) {
          index = this.objectIndex_[hash = hashObject.hash];
          delete this.objectIndex_[hash];
        }
      } else if (stringMode) {
        index = this.stringIndex_[key];
        delete this.stringIndex_[key];
      } else {
        index = this.primitiveIndex_[key];
        delete this.primitiveIndex_[key];
      }
      if (index !== undefined) {
        this.entries_[index] = deletedSentinel;
        this.entries_[index + 1] = undefined;
        this.deletedCount_++;
      }
    },
    clear: function() {
      initMap(this);
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      for (var i = 0,
          len = this.entries_.length; i < len; i += 2) {
        var key = this.entries_[i];
        var value = this.entries_[i + 1];
        if (key === deletedSentinel)
          continue;
        callbackFn.call(thisArg, value, key, this);
      }
    },
    entries: $traceurRuntime.initGeneratorFunction(function $__14() {
      var i,
          len,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0, len = this.entries_.length;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < len) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return [key, value];
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__14, this);
    }),
    keys: $traceurRuntime.initGeneratorFunction(function $__15() {
      var i,
          len,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0, len = this.entries_.length;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < len) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return key;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__15, this);
    }),
    values: $traceurRuntime.initGeneratorFunction(function $__16() {
      var i,
          len,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0, len = this.entries_.length;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < len) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return value;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__16, this);
    })
  }, {});
  Object.defineProperty(Map.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Map.prototype.entries
  });
  return {get Map() {
      return Map;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Number", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Number";
  var $__17 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      isNumber = $__17.isNumber,
      toInteger = $__17.toInteger;
  var $abs = Math.abs;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
  var EPSILON = Math.pow(2, -52);
  function NumberIsFinite(number) {
    return isNumber(number) && $isFinite(number);
  }
  ;
  function isInteger(number) {
    return NumberIsFinite(number) && toInteger(number) === number;
  }
  function NumberIsNaN(number) {
    return isNumber(number) && $isNaN(number);
  }
  ;
  function isSafeInteger(number) {
    if (NumberIsFinite(number)) {
      var integral = toInteger(number);
      if (integral === number)
        return $abs(integral) <= MAX_SAFE_INTEGER;
    }
    return false;
  }
  return {
    get MAX_SAFE_INTEGER() {
      return MAX_SAFE_INTEGER;
    },
    get MIN_SAFE_INTEGER() {
      return MIN_SAFE_INTEGER;
    },
    get EPSILON() {
      return EPSILON;
    },
    get isFinite() {
      return NumberIsFinite;
    },
    get isInteger() {
      return isInteger;
    },
    get isNaN() {
      return NumberIsNaN;
    },
    get isSafeInteger() {
      return isSafeInteger;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Object", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Object";
  var $__18 = $traceurRuntime.assertObject($traceurRuntime),
      defineProperty = $__18.defineProperty,
      getOwnPropertyDescriptor = $__18.getOwnPropertyDescriptor,
      getOwnPropertyNames = $__18.getOwnPropertyNames,
      keys = $__18.keys,
      privateNames = $__18.privateNames;
  function is(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    return left !== left && right !== right;
  }
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      var props = keys(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        if (privateNames[name])
          continue;
        target[name] = source[name];
      }
    }
    return target;
  }
  function mixin(target, source) {
    var props = getOwnPropertyNames(source);
    var p,
        descriptor,
        length = props.length;
    for (p = 0; p < length; p++) {
      var name = props[p];
      if (privateNames[name])
        continue;
      descriptor = getOwnPropertyDescriptor(source, props[p]);
      defineProperty(target, props[p], descriptor);
    }
    return target;
  }
  return {
    get is() {
      return is;
    },
    get assign() {
      return assign;
    },
    get mixin() {
      return mixin;
    }
  };
});
System.register("traceur-runtime@0.0.55/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/node_modules/rsvp/lib/rsvp/asap";
  var length = 0;
  function asap(callback, arg) {
    queue[length] = callback;
    queue[length + 1] = arg;
    length += 2;
    if (length === 2) {
      scheduleFlush();
    }
  }
  var $__default = asap;
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < length; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }
    length = 0;
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Promise";
  var async = System.get("traceur-runtime@0.0.55/node_modules/rsvp/lib/rsvp/asap").default;
  var promiseRaw = {};
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function idResolveHandler(x) {
    return x;
  }
  function idRejectHandler(x) {
    throw x;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
    var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 0:
        promise.onResolve_.push(onResolve, deferred);
        promise.onReject_.push(onReject, deferred);
        break;
      case +1:
        promiseEnqueue(promise.value_, [onResolve, deferred]);
        break;
      case -1:
        promiseEnqueue(promise.value_, [onReject, deferred]);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    if (this === $Promise) {
      var promise = promiseInit(new $Promise(promiseRaw));
      return {
        promise: promise,
        resolve: (function(x) {
          promiseResolve(promise, x);
        }),
        reject: (function(r) {
          promiseReject(promise, r);
        })
      };
    } else {
      var result = {};
      result.promise = new C((function(resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
      }));
      return result;
    }
  }
  function promiseSet(promise, status, value, onResolve, onReject) {
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = onResolve;
    promise.onReject_ = onReject;
    return promise;
  }
  function promiseInit(promise) {
    return promiseSet(promise, 0, undefined, [], []);
  }
  var Promise = function Promise(resolver) {
    if (resolver === promiseRaw)
      return;
    if (typeof resolver !== 'function')
      throw new TypeError;
    var promise = promiseInit(this);
    try {
      resolver((function(x) {
        promiseResolve(promise, x);
      }), (function(r) {
        promiseReject(promise, r);
      }));
    } catch (e) {
      promiseReject(promise, e);
    }
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function(onResolve, onReject) {
      if (typeof onResolve !== 'function')
        onResolve = idResolveHandler;
      if (typeof onReject !== 'function')
        onReject = idRejectHandler;
      var that = this;
      var constructor = this.constructor;
      return chain(this, function(x) {
        x = promiseCoerce(constructor, x);
        return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }, onReject);
    }
  }, {
    resolve: function(x) {
      if (this === $Promise) {
        return promiseSet(new $Promise(promiseRaw), +1, x);
      } else {
        return new this(function(resolve, reject) {
          resolve(x);
        });
      }
    },
    reject: function(r) {
      if (this === $Promise) {
        return promiseSet(new $Promise(promiseRaw), -1, r);
      } else {
        return new this((function(resolve, reject) {
          reject(r);
        }));
      }
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var resolutions = [];
      try {
        var count = values.length;
        if (count === 0) {
          deferred.resolve(resolutions);
        } else {
          for (var i = 0; i < values.length; i++) {
            this.resolve(values[i]).then(function(i, x) {
              resolutions[i] = x;
              if (--count === 0)
                deferred.resolve(resolutions);
            }.bind(undefined, i), (function(r) {
              deferred.reject(r);
            }));
          }
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.resolve(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  var $Promise = Promise;
  var $PromiseReject = $Promise.reject;
  function promiseResolve(promise, x) {
    promiseDone(promise, +1, x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, -1, r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 0)
      return;
    promiseEnqueue(value, reactions);
    promiseSet(promise, status, value);
  }
  function promiseEnqueue(value, tasks) {
    async((function() {
      for (var i = 0; i < tasks.length; i += 2) {
        promiseHandle(value, tasks[i], tasks[i + 1]);
      }
    }));
  }
  function promiseHandle(value, handler, deferred) {
    try {
      var result = handler(value);
      if (result === deferred.promise)
        throw new TypeError;
      else if (isPromise(result))
        chain(result, deferred.resolve, deferred.reject);
      else
        deferred.resolve(result);
    } catch (e) {
      try {
        deferred.reject(e);
      } catch (e) {}
    }
  }
  var thenableSymbol = '@@thenable';
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function promiseCoerce(constructor, x) {
    if (!isPromise(x) && isObject(x)) {
      var then;
      try {
        then = x.then;
      } catch (r) {
        var promise = $PromiseReject.call(constructor, r);
        x[thenableSymbol] = promise;
        return promise;
      }
      if (typeof then === 'function') {
        var p = x[thenableSymbol];
        if (p) {
          return p;
        } else {
          var deferred = getDeferred(constructor);
          x[thenableSymbol] = deferred.promise;
          try {
            then.call(x, deferred.resolve, deferred.reject);
          } catch (r) {
            deferred.reject(r);
          }
          return deferred.promise;
        }
      }
    }
    return x;
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Set", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Set";
  var isObject = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils").isObject;
  var Map = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Map").Map;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  function initSet(set) {
    set.map_ = new Map();
  }
  var Set = function Set() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Set called on incompatible type');
    if ($hasOwnProperty.call(this, 'map_')) {
      throw new TypeError('Set can not be reentrantly initialised');
    }
    initSet(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__25 = iterable[Symbol.iterator](),
          $__26; !($__26 = $__25.next()).done; ) {
        var item = $__26.value;
        {
          this.add(item);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Set, {
    get size() {
      return this.map_.size;
    },
    has: function(key) {
      return this.map_.has(key);
    },
    add: function(key) {
      return this.map_.set(key, key);
    },
    delete: function(key) {
      return this.map_.delete(key);
    },
    clear: function() {
      return this.map_.clear();
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      var $__23 = this;
      return this.map_.forEach((function(value, key) {
        callbackFn.call(thisArg, key, key, $__23);
      }));
    },
    values: $traceurRuntime.initGeneratorFunction(function $__27() {
      var $__28,
          $__29;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__28 = this.map_.keys()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__29 = $__28[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__29.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__29.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__29.value;
            default:
              return $ctx.end();
          }
      }, $__27, this);
    }),
    entries: $traceurRuntime.initGeneratorFunction(function $__30() {
      var $__31,
          $__32;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__31 = this.map_.entries()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__32 = $__31[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__32.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__32.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__32.value;
            default:
              return $ctx.end();
          }
      }, $__30, this);
    })
  }, {});
  Object.defineProperty(Set.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  Object.defineProperty(Set.prototype, 'keys', {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  return {get Set() {
      return Set;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/StringIterator", [], function() {
  "use strict";
  var $__35;
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/StringIterator";
  var $__33 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      createIteratorResultObject = $__33.createIteratorResultObject,
      isObject = $__33.isObject;
  var $__36 = $traceurRuntime.assertObject($traceurRuntime),
      hasOwnProperty = $__36.hasOwnProperty,
      toProperty = $__36.toProperty;
  var iteratedString = Symbol('iteratedString');
  var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
  var StringIterator = function StringIterator() {};
  ($traceurRuntime.createClass)(StringIterator, ($__35 = {}, Object.defineProperty($__35, "next", {
    value: function() {
      var o = this;
      if (!isObject(o) || !hasOwnProperty(o, iteratedString)) {
        throw new TypeError('this must be a StringIterator object');
      }
      var s = o[toProperty(iteratedString)];
      if (s === undefined) {
        return createIteratorResultObject(undefined, true);
      }
      var position = o[toProperty(stringIteratorNextIndex)];
      var len = s.length;
      if (position >= len) {
        o[toProperty(iteratedString)] = undefined;
        return createIteratorResultObject(undefined, true);
      }
      var first = s.charCodeAt(position);
      var resultString;
      if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
        resultString = String.fromCharCode(first);
      } else {
        var second = s.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) {
          resultString = String.fromCharCode(first);
        } else {
          resultString = String.fromCharCode(first) + String.fromCharCode(second);
        }
      }
      o[toProperty(stringIteratorNextIndex)] = position + resultString.length;
      return createIteratorResultObject(resultString, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__35, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__35), {});
  function createStringIterator(string) {
    var s = String(string);
    var iterator = Object.create(StringIterator.prototype);
    iterator[toProperty(iteratedString)] = s;
    iterator[toProperty(stringIteratorNextIndex)] = 0;
    return iterator;
  }
  return {get createStringIterator() {
      return createStringIterator;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/String";
  var createStringIterator = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/StringIterator").createStringIterator;
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  function stringPrototypeIterator() {
    var o = $traceurRuntime.checkObjectCoercible(this);
    var s = String(o);
    return createStringIterator(s);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    },
    get stringPrototypeIterator() {
      return stringPrototypeIterator;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/polyfills";
  var Map = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Map").Map;
  var Set = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Set").Set;
  var Promise = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Promise").Promise;
  var $__41 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/String"),
      codePointAt = $__41.codePointAt,
      contains = $__41.contains,
      endsWith = $__41.endsWith,
      fromCodePoint = $__41.fromCodePoint,
      repeat = $__41.repeat,
      raw = $__41.raw,
      startsWith = $__41.startsWith,
      stringPrototypeIterator = $__41.stringPrototypeIterator;
  var $__42 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Array"),
      fill = $__42.fill,
      find = $__42.find,
      findIndex = $__42.findIndex,
      from = $__42.from;
  var $__43 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/ArrayIterator"),
      entries = $__43.entries,
      keys = $__43.keys,
      values = $__43.values;
  var $__44 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Object"),
      assign = $__44.assign,
      is = $__44.is,
      mixin = $__44.mixin;
  var $__45 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Number"),
      MAX_SAFE_INTEGER = $__45.MAX_SAFE_INTEGER,
      MIN_SAFE_INTEGER = $__45.MIN_SAFE_INTEGER,
      EPSILON = $__45.EPSILON,
      isFinite = $__45.isFinite,
      isInteger = $__45.isInteger,
      isNaN = $__45.isNaN,
      isSafeInteger = $__45.isSafeInteger;
  var getPrototypeOf = $traceurRuntime.assertObject(Object).getPrototypeOf;
  function maybeDefine(object, name, descr) {
    if (!(name in object)) {
      Object.defineProperty(object, name, descr);
    }
  }
  function maybeDefineMethod(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function maybeDefineConst(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: false,
      enumerable: false,
      writable: false
    });
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function maybeAddConsts(object, consts) {
    for (var i = 0; i < consts.length; i += 2) {
      var name = consts[i];
      var value = consts[i + 1];
      maybeDefineConst(object, name, value);
    }
  }
  function maybeAddIterator(object, func, Symbol) {
    if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
      return;
    if (object['@@iterator'])
      func = object['@@iterator'];
    Object.defineProperty(object, Symbol.iterator, {
      value: func,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillCollections(global, Symbol) {
    if (!global.Map)
      global.Map = Map;
    var mapPrototype = global.Map.prototype;
    if (mapPrototype.entries) {
      maybeAddIterator(mapPrototype, mapPrototype.entries, Symbol);
      maybeAddIterator(getPrototypeOf(new global.Map().entries()), function() {
        return this;
      }, Symbol);
    }
    if (!global.Set)
      global.Set = Set;
    var setPrototype = global.Set.prototype;
    if (setPrototype.values) {
      maybeAddIterator(setPrototype, setPrototype.values, Symbol);
      maybeAddIterator(getPrototypeOf(new global.Set().values()), function() {
        return this;
      }, Symbol);
    }
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
    maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
    maybeAddFunctions(Array, ['from', from]);
    maybeAddIterator(Array.prototype, values, Symbol);
    maybeAddIterator(getPrototypeOf([].values()), function() {
      return this;
    }, Symbol);
  }
  function polyfillObject(Object) {
    maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
  }
  function polyfillNumber(Number) {
    maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
    maybeAddFunctions(Number, ['isFinite', isFinite, 'isInteger', isInteger, 'isNaN', isNaN, 'isSafeInteger', isSafeInteger]);
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillCollections(global, global.Symbol);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
    polyfillObject(global.Object);
    polyfillNumber(global.Number);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfill-import";
  System.get("traceur-runtime@0.0.55/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.55/src/runtime/polyfill-import" + '');

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"oMfpAn":28}],28:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[17,27])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9jamRlbGwvZ28vc3JjL2Nzc2Mvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9jb25maWcvcm91dGVzLmpzb24iLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2FwaS9hdXRoLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9hcGkvZG9jdW1lbnQuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2FwaS91c2VyLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9jb25maWcvaHR0cC5qcyIsIi9Vc2Vycy9jamRlbGwvZ28vc3JjL2Nzc2MvYWRtaW4vanMvY29uZmlnL3Jlc3Rhbmd1bGFyLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9jb25maWcvcm91dGVyLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9jb250cm9sbGVycy9hdXRoLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9jb250cm9sbGVycy9jb21tb24uanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2NvbnRyb2xsZXJzL2RvY3VtZW50LmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9jb250cm9sbGVycy91c2VyLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9kaXJlY3RpdmVzL2JsdXJfZm9jdXMuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2RpcmVjdGl2ZXMvZmlsZV91cGxvYWQuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2RpcmVjdGl2ZXMvbWF0Y2guanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2RpcmVjdGl2ZXMvdGlueV9tY2UuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2RpcmVjdGl2ZXMvd2l6YXJkLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9mYWtlXzRiODlmZWEuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL2xpYi9uZ0RpYWxvZy5qcyIsIi9Vc2Vycy9jamRlbGwvZ28vc3JjL2Nzc2MvYWRtaW4vanMvcnVuL2F1dGguanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL3J1bi9pdGVtX2NvdW50LmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9ydW4vcGVybWlzc2lvbnMuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL3J1bi9wcm9taXNlLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9ydW4vc3RhdGVfY2xhc3MuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL3NlcnZpY2VzL2F1dGhlbnRpY2F0b3IuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL2FkbWluL2pzL3NlcnZpY2VzL3VwbG9hZGVyLmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9hZG1pbi9qcy9zZXJ2aWNlcy91dGlsaXR5LmpzIiwiL1VzZXJzL2NqZGVsbC9nby9zcmMvY3NzYy9ub2RlX21vZHVsZXMvZXM2aWZ5L25vZGVfbW9kdWxlcy90cmFjZXVyL2Jpbi90cmFjZXVyLXJ1bnRpbWUuanMiLCIvVXNlcnMvY2pkZWxsL2dvL3NyYy9jc3NjL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5q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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiYXV0aFwiOiB7XG4gICAgXCJhYnN0cmFjdFwiOiB0cnVlLFxuICAgIFwidGVtcGxhdGVVcmxcIjogXCJ2aWV3cy9sYXlvdXRzL2F1dGguaHRtbFwiLFxuICAgIFwidXJsXCI6IFwiL2F1dGhcIlxuICB9LFxuICBcImF1dGgucmVnaXN0ZXJcIjoge1xuICAgIFwiY29udHJvbGxlclwiOiBcIlJlZ2lzdGVyQ29udHJvbGxlclwiLFxuICAgIFwidGVtcGxhdGVVcmxcIjogXCJ2aWV3cy9hdXRoL3JlZ2lzdGVyLmh0bWxcIixcbiAgICBcInVybFwiOiBcIi9yZWdpc3RlclwiXG4gIH0sXG4gIFwiYXV0aC5zaWduLWluXCI6IHtcbiAgICBcImNvbnRyb2xsZXJcIjogXCJTaWduSW5Db250cm9sbGVyXCIsXG4gICAgXCJ0ZW1wbGF0ZVVybFwiOiBcInZpZXdzL2F1dGgvc2lnbi1pbi5odG1sXCIsXG4gICAgXCJ1cmxcIjogXCIvc2lnbi1pbi86YXR0ZW1wdGVkU3RhdGVOYW1lLzphdHRlbXB0ZWRTdGF0ZVBhcmFtc1wiXG4gIH0sXG4gIFwiZGFzaGJvYXJkXCI6IHtcbiAgICBcInRlbXBsYXRlVXJsXCI6IFwidmlld3MvZGFzaGJvYXJkL2luZGV4Lmh0bWxcIixcbiAgICBcInVybFwiOiBcIi9cIlxuICB9LFxuICBcInJlY29yZHNcIjoge1xuICAgIFwiYWJzdHJhY3RcIjogdHJ1ZSxcbiAgICBcImFsbG93XCI6IFtcbiAgICAgIFwiQWRtaW5cIixcbiAgICAgIFwiQnVzaW5lc3NcIlxuICAgIF0sXG4gICAgXCJ0ZW1wbGF0ZVVybFwiOiBcInZpZXdzL2xheW91dHMvcmVjb3Jkcy5odG1sXCIsXG4gICAgXCJ1cmxcIjogXCIvcmVjb3Jkc1wiXG4gIH0sXG4gIFwicmVjb3Jkcy51c2Vyc1wiOiB7XG4gICAgXCJhYnN0cmFjdFwiOiB0cnVlLFxuICAgIFwiYWxsb3dcIjogW1xuICAgICAgXCJBZG1pblwiXG4gICAgXSxcbiAgICBcImNvbnRyb2xsZXJcIjogXCJVc2Vyc0NvbnRyb2xsZXJcIixcbiAgICBcInRlbXBsYXRlVXJsXCI6IFwidmlld3MvdXNlcnMvaW5kZXguaHRtbFwiLFxuICAgIFwidXJsXCI6IFwiL3VzZXJzXCJcbiAgfSxcbiAgXCJyZWNvcmRzLnVzZXJzLm5ld1wiOiB7XG4gICAgXCJhbGxvd1wiOiBbXG4gICAgICBcIkFkbWluXCJcbiAgICBdLFxuICAgIFwiY29udHJvbGxlclwiOiBcIlVzZXJDb250cm9sbGVyXCIsXG4gICAgXCJ0ZW1wbGF0ZVVybFwiOiBcInZpZXdzL3VzZXJzL3ZpZXcuaHRtbFwiLFxuICAgIFwidXJsXCI6IFwiL25ld1wiXG4gIH0sXG4gIFwicmVjb3Jkcy51c2Vycy52aWV3XCI6IHtcbiAgICBcImFsbG93XCI6IFtcbiAgICAgIFwiQWRtaW5cIlxuICAgIF0sXG4gICAgXCJjb250cm9sbGVyXCI6IFwiVXNlckNvbnRyb2xsZXJcIixcbiAgICBcInRlbXBsYXRlVXJsXCI6IFwidmlld3MvdXNlcnMvdmlldy5odG1sXCIsXG4gICAgXCJ1cmxcIjogXCIve2lkOlswLTldK31cIlxuICB9LFxuICBcInJlY29yZHMuZG9jdW1lbnRzXCI6IHtcbiAgICBcImFic3RyYWN0XCI6IHRydWUsXG4gICAgXCJhbGxvd1wiOiBbXG4gICAgICBcIkFkbWluXCJcbiAgICBdLFxuICAgIFwiY29udHJvbGxlclwiOiBcIkRvY3VtZW50c0NvbnRyb2xsZXJcIixcbiAgICBcInRlbXBsYXRlVXJsXCI6IFwidmlld3MvZG9jdW1lbnRzL2luZGV4Lmh0bWxcIixcbiAgICBcInVybFwiOiBcIi9kb2N1bWVudHNcIlxuICB9LFxuICBcInJlY29yZHMuZG9jdW1lbnRzLm5ld1wiOiB7XG4gICAgXCJhbGxvd1wiOiBbXG4gICAgICBcIkFkbWluXCJcbiAgICBdLFxuICAgIFwiY29udHJvbGxlclwiOiBcIkRvY3VtZW50Q29udHJvbGxlclwiLFxuICAgIFwidGVtcGxhdGVVcmxcIjogXCJ2aWV3cy9kb2N1bWVudHMvdmlldy5odG1sXCIsXG4gICAgXCJ1cmxcIjogXCIvbmV3XCJcbiAgfSxcbiAgXCJyZWNvcmRzLmRvY3VtZW50cy52aWV3XCI6IHtcbiAgICBcImFsbG93XCI6IFtcbiAgICAgIFwiQWRtaW5cIlxuICAgIF0sXG4gICAgXCJjb250cm9sbGVyXCI6IFwiRG9jdW1lbnRDb250cm9sbGVyXCIsXG4gICAgXCJ0ZW1wbGF0ZVVybFwiOiBcInZpZXdzL2RvY3VtZW50cy92aWV3Lmh0bWxcIixcbiAgICBcInVybFwiOiBcIi97aWQ6WzAtOV0rfVwiXG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFsnJGh0dHAnLCAnJHEnLFxuICBmdW5jdGlvbigkaHR0cCwgJHEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgU2lnbkluOiBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmpzb25ycGMoJy9hdXRoJywgJ0F1dGhBcGkuU2lnbkluJywgW3tcbiAgICAgICAgICBFbWFpbDogZW1haWwsXG4gICAgICAgICAgUGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH1dKTtcbiAgICAgIH0sXG4gICAgICBSZWdpc3RlcjogZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5qc29ucnBjKCcvYXV0aCcsICdBdXRoQXBpLlJlZ2lzdGVyJywgW3tcbiAgICAgICAgICBFbWFpbDogZW1haWwsXG4gICAgICAgICAgUGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH1dKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5dOyIsIm1vZHVsZS5leHBvcnRzID0gWyckaHR0cCcsICdSZXN0YW5ndWxhcicsXG4gIGZ1bmN0aW9uKCRodHRwLCBSZXN0YW5ndWxhcikge1xuICAgIHZhciBzZXJ2aWNlID0gUmVzdGFuZ3VsYXIuc2VydmljZSgnYXBpL2RvY3VtZW50cycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEVudGl0eU5hbWVzOiB7XG4gICAgICAgIFNpbmd1bGFyUGFzY2FsQ2FzZTogJ0RvY3VtZW50JyxcbiAgICAgICAgUGx1cmFsUGFzY2FsQ2FzZTogJ0RvY3VtZW50cycsXG4gICAgICAgIFNpbmd1bGFyQ2FtZWxDYXNlOiAnZG9jdW1lbnQnLFxuICAgICAgICBQbHVyYWxDYW1lbENhc2U6ICdkb2N1bWVudHMnLFxuICAgICAgICBTaW5ndWxhclNuYWtlQ2FzZTogJ2RvY3VtZW50JyxcbiAgICAgICAgUGx1cmFsU25ha2VDYXNlOiAnZG9jdW1lbnRzJ1xuICAgICAgfSxcbiAgICAgIEdldEFsbDogZnVuY3Rpb24oYXJncykge1xuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRMaXN0KCk7XG4gICAgICB9LFxuICAgICAgR2V0T25lOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gc2VydmljZS5vbmUoaWQpLmdldCgpO1xuICAgICAgfSxcbiAgICAgIFBvc3Q6IGZ1bmN0aW9uKGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnBvc3QoZG9jdW1lbnQpO1xuICAgICAgfSxcbiAgICAgIFB1dDogZnVuY3Rpb24oZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnB1dCgpO1xuICAgICAgfSxcbiAgICAgIERlbGV0ZTogZnVuY3Rpb24oZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbJyRodHRwJywgJ1Jlc3Rhbmd1bGFyJyxcbiAgZnVuY3Rpb24oJGh0dHAsIFJlc3Rhbmd1bGFyKSB7XG4gICAgdmFyIHNlcnZpY2UgPSBSZXN0YW5ndWxhci5zZXJ2aWNlKCdhcGkvdXNlcnMnKTtcblxuICAgIHJldHVybiB7XG4gICAgICBFbnRpdHlOYW1lczoge1xuICAgICAgICBTaW5ndWxhclBhc2NhbENhc2U6ICdVc2VyJyxcbiAgICAgICAgUGx1cmFsUGFzY2FsQ2FzZTogJ1VzZXJzJyxcbiAgICAgICAgU2luZ3VsYXJDYW1lbENhc2U6ICd1c2VyJyxcbiAgICAgICAgUGx1cmFsQ2FtZWxDYXNlOiAndXNlcnMnLFxuICAgICAgICBTaW5ndWxhclNuYWtlQ2FzZTogJ3VzZXInLFxuICAgICAgICBQbHVyYWxTbmFrZUNhc2U6ICd1c2VycydcbiAgICAgIH0sXG4gICAgICBHZXRBbGw6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0TGlzdCgpO1xuICAgICAgfSxcbiAgICAgIEdldE9uZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIHNlcnZpY2Uub25lKGlkKS5nZXQoKTtcbiAgICAgIH0sXG4gICAgICBQb3N0OiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnBvc3QodXNlcik7XG4gICAgICB9LFxuICAgICAgUHV0OiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIHJldHVybiB1c2VyLnB1dCgpO1xuICAgICAgfSxcbiAgICAgIERlbGV0ZTogZnVuY3Rpb24odXNlcikge1xuICAgICAgICByZXR1cm4gdXNlci5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5dOyIsIm1vZHVsZS5leHBvcnRzID0gWyckcHJvdmlkZScsXG4gIGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgJHByb3ZpZGUuZGVjb3JhdG9yKCckaHR0cCcsIFsnJGRlbGVnYXRlJywgJyRxJyxcbiAgICAgIGZ1bmN0aW9uKCRkZWxlZ2F0ZSwgJHEpIHtcbiAgICAgICAgJGRlbGVnYXRlLmpzb25ycGMgPSBmdW5jdGlvbih1cmwsIG1ldGhvZCwgcGFyYW1ldGVycywgY29uZmlnKSB7XG4gICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgXCJqc29ucnBjXCI6IFwiMi4wXCIsXG4gICAgICAgICAgICBcIm1ldGhvZFwiOiBtZXRob2QsXG4gICAgICAgICAgICBcInBhcmFtc1wiOiBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgXCJpZFwiOiAxXG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRkZWxlZ2F0ZS5wb3N0KHVybCwgZGF0YSwgYW5ndWxhci5leHRlbmQoe1xuICAgICAgICAgICAgJ2hlYWRlcnMnOiB7XG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBjb25maWcpKS50aGVuKHN1Y2NlZWRlZCwgZmFpbGVkKTtcblxuICAgICAgICAgIGZ1bmN0aW9uIHN1Y2NlZWRlZChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoIWRhdGEuZGF0YS5lcnJvcikge1xuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEuZGF0YS5yZXN1bHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihkYXRhLmRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZGF0YS5kYXRhLmVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmdW5jdGlvbiBmYWlsZWQoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YSk7IC8vIFVzZWZ1bCBmb3IgZGVidWdnaW5nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJGRlbGVnYXRlO1xuICAgICAgfVxuICAgIF0pO1xuICB9XG5dOyIsIm1vZHVsZS5leHBvcnRzID0gWydSZXN0YW5ndWxhclByb3ZpZGVyJyxcbiAgZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuICAgIC8vIFJlY29yZHMgaGF2ZSBJZCBmaWVsZCAoY2FwaXRhbCBJKVxuICAgIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0UmVzdGFuZ3VsYXJGaWVsZHMoe1xuICAgICAgaWQ6ICdJZCdcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSByZXF1ZXN0IGJvZHkgZm9yIERFTEVURVxuICAgIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0UmVxdWVzdEludGVyY2VwdG9yKGZ1bmN0aW9uKGVsZW0sIG9wZXJhdGlvbikge1xuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCJyZW1vdmVcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbGVtO1xuICAgIH0pO1xuICB9XG5dOyIsIm1vZHVsZS5leHBvcnRzID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3JlY29yZHMvdXNlcnMvbmV3Jyk7XG5cbiAgICB2YXIgcm91dGVzID0gcmVxdWlyZSgnLi4vLi4vY29uZmlnL3JvdXRlcy5qc29uJyk7XG5cbiAgICAvLyBBbWVuZCBzdGF0aWMgcm91dGVzIGhlcmUgaWYgZnVuY3Rpb25zIG5lZWRlZCBldGMuXG4gICAgLy8gcm91dGVzW1wicmVjb3Jkcy5jYXRlZ29yaWVzLnZpZXdcIl0ucmVzb2x2ZSA9IHtcbiAgICAvLyAgIGFiYzogZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIHJldHVybiAxMjM7XG4gICAgLy8gICB9XG4gICAgLy8gfTtcblxuICAgIGZvciAodmFyIHN0YXRlTmFtZSBpbiByb3V0ZXMpIHtcbiAgICAgIHZhciBzdGF0ZUluZm8gPSByb3V0ZXNbc3RhdGVOYW1lXTtcblxuICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoc3RhdGVOYW1lLCBzdGF0ZUluZm8pO1xuICAgIH1cbiAgfVxuXTsiLCJ2YXIgU2lnbkluQ29udHJvbGxlciA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnQXV0aGVudGljYXRvcicsXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEF1dGhlbnRpY2F0b3IpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAkc2NvcGUudXNlciA9IHt9O1xuXG4gICAgY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcblxuICAgICRzY29wZS5zaWduSW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghJHNjb3BlLnNpZ25JbkZvcm0uJHZhbGlkKSB7XG4gICAgICAgIGFsZXJ0KCdGb3JtIGlzIGludmFsaWQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBBdXRoZW50aWNhdG9yLnNpZ25Jbigkc2NvcGUudXNlci5lbWFpbCwgJHNjb3BlLnVzZXIucGFzc3dvcmQpLnRoZW4oc2lnbmVkSW4sIGZhaWxlZCk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXRBZG1pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLnVzZXIgPSB7XG4gICAgICAgIGVtYWlsOiAnYWRtaW5AZXhhbXBsZS5jb20nLFxuICAgICAgICBwYXNzd29yZDogJ3Bhc3N3b3JkJ1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldEJ1c2luZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUudXNlciA9IHtcbiAgICAgICAgZW1haWw6ICdidXNpbmVzc0BleGFtcGxlLmNvbScsXG4gICAgICAgIHBhc3N3b3JkOiAncGFzc3dvcmQnXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzaWduZWRJbigpIHtcbiAgICAgIGlmICgkc3RhdGVQYXJhbXMuYXR0ZW1wdGVkU3RhdGVQYXJhbXMpXG4gICAgICAgICRzdGF0ZS5nbygkc3RhdGVQYXJhbXMuYXR0ZW1wdGVkU3RhdGVOYW1lLCBKU09OLnBhcnNlKGF0b2IoZGVjb2RlVVJJKCRzdGF0ZVBhcmFtcy5hdHRlbXB0ZWRTdGF0ZVBhcmFtcykpKSk7XG4gICAgICBlbHNlXG4gICAgICAgICRzdGF0ZS5nbygnZGFzaGJvYXJkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFpbGVkKGVycm9yKSB7XG4gICAgICBhbGVydChlcnJvcik7XG4gICAgfVxuICB9XG5dO1xuXG52YXIgUmVnaXN0ZXJDb250cm9sbGVyID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICdBdXRoQXBpJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQXV0aEFwaSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciB1c2VyID0gJHNjb3BlLnVzZXIgPSB7fTtcblxuICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5yZWdpc3RlckZvcm0uJHByaXN0aW5lKSB7XG4gICAgICAgIGFsZXJ0KCdGb3JtIGlzIGVtcHR5Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkc2NvcGUucmVnaXN0ZXJGb3JtLiR2YWxpZCkge1xuICAgICAgICBhbGVydCgnRm9ybSBpcyBpbnZhbGlkJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgQXV0aEFwaS5SZWdpc3Rlcih1c2VyLmVtYWlsLCB1c2VyLnBhc3N3b3JkKS50aGVuKHJlZ2lzdGVyU3VjY2Vzc2Z1bCwgcmVnaXN0ZXJGYWlsZWQpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlclN1Y2Nlc3NmdWwoKSB7XG4gICAgICAkc3RhdGUuZ28oJ2F1dGguc2lnbi1pbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRmFpbGVkKGVycm9yKSB7XG4gICAgICBhbGVydChlcnJvcik7XG4gICAgfVxuXG4gICAgJHNjb3BlLiR3YXRjaCgncmVnaXN0ZXJGb3JtLnBhc3N3b3JkLiR2aWV3VmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmb3JtID0gJHNjb3BlLnJlZ2lzdGVyRm9ybTtcblxuICAgICAgaWYgKGZvcm0uJGRpcnR5KSB7XG4gICAgICAgIGZvcm0ucGFzc3dvcmQuJHNldFZhbGlkaXR5KCdsZW5ndGgnLCBmb3JtLnBhc3N3b3JkLiR2aWV3VmFsdWUgJiYgZm9ybS5wYXNzd29yZC4kdmlld1ZhbHVlLmxlbmd0aCA+PSAzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNpZ25JbkNvbnRyb2xsZXI6IFNpZ25JbkNvbnRyb2xsZXIsXG4gIFJlZ2lzdGVyQ29udHJvbGxlcjogUmVnaXN0ZXJDb250cm9sbGVyXG59OyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuICBWYWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlLWFyZ3VtZW50cycpO1xuXG52YXIgTGlzdENvbnRyb2xsZXIgPSBbJyRzY29wZScsICckcScsICdBcGknLFxuICBmdW5jdGlvbigkc2NvcGUsICRxLCBBcGkpIHtcbiAgICB2YXIgYXJncyA9IFZhbGlkYXRlLnZhbGlkYXRlKGFyZ3VtZW50cywgWydvYmplY3QnLCAnb2JqZWN0Jywge1xuICAgICAgRW50aXR5TmFtZXM6ICdvYmplY3QnLFxuICAgICAgR2V0QWxsOiAnZnVuY3Rpb24nXG4gICAgfV0pO1xuXG4gICAgaWYgKCFhcmdzLmlzVmFsaWQoKSkge1xuICAgICAgdGhyb3cgYXJncy5lcnJvclN0cmluZygpO1xuICAgIH1cblxuICAgIHZhciBjdHJsID0gdGhpczsgLy8gT25seSB0aW1lIGB0aGlzYCBpcyB1c2VkLiBTYXZlIHVzIGZyb20gY29uZnVzaW9uLi4uXG5cbiAgICBjdHJsLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdMaXN0Q29udHJvbGxlcjogaW5pdCcpO1xuICAgICAgLy8gTG9hZCB0aGUgbGlzdFxuICAgICAgY3RybC5sb2FkKCk7XG4gICAgfTtcblxuICAgIGN0cmwubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgQXBpLkdldEFsbCgpLnRoZW4oY3RybC5sb2FkZWQsIGN0cmwuZmFpbGVkKTtcbiAgICB9O1xuXG4gICAgY3RybC5sb2FkZWQgPSBmdW5jdGlvbihyZXBseSkge1xuICAgICAgJHNjb3BlLnJlY29yZHMgPSByZXBseTtcblxuICAgICAgLy8gY29uc29sZS50YWJsZSgkc2NvcGUucmVjb3Jkcyk7XG5cbiAgICAgICRzY29wZS4kZW1pdCgnaXRlbUNvdW50RGlzY292ZXJlZCcsIEFwaS5FbnRpdHlOYW1lcy5TaW5ndWxhclBhc2NhbENhc2UsICRzY29wZS5yZWNvcmRzLmxlbmd0aCk7XG4gICAgfTtcblxuICAgIGN0cmwuZmFpbGVkID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfTtcblxuICAgICRzY29wZS4kb24oJ2l0ZW0tc2F2ZWQnLCAoKSA9PiBjdHJsLmxvYWQoKSk7XG5cbiAgICAkc2NvcGUuJG9uKCdpdGVtLWRlbGV0ZWQnLCAoKSA9PiBjdHJsLmxvYWQoKSk7XG4gIH1cbl07XG5cbnZhciBJdGVtQ29udHJvbGxlciA9IFsnJHNjb3BlJywgJyRxJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnQXBpJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkcSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEFwaSkge1xuICAgIHZhciBhcmdzID0gVmFsaWRhdGUudmFsaWRhdGUoYXJndW1lbnRzLCBbJ29iamVjdCcsICdvYmplY3QnLCAnb2JqZWN0JywgJ29iamVjdCcsIHtcbiAgICAgIEVudGl0eU5hbWVzOiAnb2JqZWN0JyxcbiAgICAgIEdldE9uZTogJ2Z1bmN0aW9uJ1xuICAgIH1dKTtcblxuICAgIGlmICghYXJncy5pc1ZhbGlkKCkpIHtcbiAgICAgIHRocm93IGFyZ3MuZXJyb3JTdHJpbmcoKTtcbiAgICB9XG5cbiAgICB2YXIgY3RybCA9IHRoaXM7IC8vIE9ubHkgdGltZSBgdGhpc2AgaXMgdXNlZC4gU2F2ZSB1cyBmcm9tIGNvbmZ1c2lvbi4uLlxuXG4gICAgY3RybC5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnSXRlbUNvbnRyb2xsZXI6IGluaXQnKTtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGFuIElELCBsb2FkIHRoZSByZWNvcmQgZnJvbSB0aGUgQVBJLCBvdGhlcndpc2UsIHN0YXJ0IHdpdGggYSBuZXcgaW5zdGFuY2VcbiAgICAgIGlmICgkc3RhdGVQYXJhbXMuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjdHJsLmxvYWQocGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHJsLmJsYW5rKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN0cmwubG9hZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBBcGkuR2V0T25lKGlkKS50aGVuKGN0cmwubG9hZGVkLCBjdHJsLmZhaWxlZCk7XG4gICAgfTtcblxuICAgIGN0cmwuYmxhbmsgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5yZWNvcmQgPSB7fTtcblxuICAgICAgYmVnaW5PYnNlcnZlKCRzY29wZS5yZWNvcmQpO1xuICAgIH07XG5cbiAgICBjdHJsLm5ldyA9IGZ1bmN0aW9uKCkge1xuICAgICAgY3RybC5nb1RvUmVjb3JkKCk7XG4gICAgfTtcblxuICAgIGN0cmwudmFsaWRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBjdHJsLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjdHJsLnZhbGlkYXRlKCkpIHtcbiAgICAgICAgJHNjb3BlLiRlbWl0cCgnaXRlbS1zYXZpbmcnLCAkc2NvcGUucmVjb3JkKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLnJlY29yZC5JZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdHJsLnVwZGF0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdHJsLmluc2VydCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGN0cmwudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUuJGVtaXRwKCdpdGVtLXVwZGF0aW5nJywgJHNjb3BlLnJlY29yZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuIEFwaS5QdXQoJHNjb3BlLnJlY29yZCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oY3RybC5zYXZlZCwgY3RybC5mYWlsZWQpO1xuICAgIH07XG5cbiAgICBjdHJsLmluc2VydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLiRlbWl0cCgnaXRlbS1pbnNlcnRpbmcnLCAkc2NvcGUucmVjb3JkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICByZXR1cm4gQXBpLlBvc3QoJHNjb3BlLnJlY29yZCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oY3RybC5zYXZlZCwgY3RybC5mYWlsZWQpO1xuICAgIH07XG5cbiAgICBjdHJsLmRlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLiRlbWl0cCgnaXRlbS1kZWxldGluZycsICRzY29wZS5yZWNvcmQpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgIHJldHVybiBBcGkuRGVsZXRlKCRzY29wZS5yZWNvcmQpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGN0cmwuc2F2ZWQsIGN0cmwuZmFpbGVkKTtcbiAgICB9O1xuXG4gICAgLy8gQ2FsbGJhY2tzIGFyZSBkZWNsYXJlZCBwcml2YXRlbHlcbiAgICBjdHJsLmxvYWRlZCA9IGZ1bmN0aW9uKHJlcGx5KSB7XG4gICAgICAkc2NvcGUucmVjb3JkID0gcmVwbHk7XG5cbiAgICAgIGJlZ2luT2JzZXJ2ZSgkc2NvcGUucmVjb3JkKTtcblxuICAgICAgY29uc29sZS5sb2coJ0xvYWRlZCBSZWNvcmQ6JywgJHNjb3BlLnJlY29yZCk7XG4gICAgfTtcblxuICAgIGN0cmwuZmFpbGVkID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICBpZiAoZXJyICYmIGVyci5kYXRhKSBhbGVydChlcnIuZGF0YS5FcnJvcik7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfTtcblxuICAgIGN0cmwuc2F2ZWQgPSBmdW5jdGlvbihyZXBseSkge1xuICAgICAgJHNjb3BlLnJlY29yZCA9IHJlcGx5O1xuXG4gICAgICBiZWdpbk9ic2VydmUoJHNjb3BlLnJlY29yZCk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdTYXZlZCBSZWNvcmQ6JywgJHNjb3BlLnJlY29yZCk7XG5cbiAgICAgIC8vIEJyb2FkY2FzdCBzYXZlZCBldmVudFxuICAgICAgJHNjb3BlLiRlbWl0KCdpdGVtLXNhdmVkJywgJHNjb3BlLnJlY29yZCk7XG5cbiAgICAgIGN0cmwuZ29Ub1JlY29yZCgkc2NvcGUucmVjb3JkLklkKTtcbiAgICB9O1xuXG4gICAgY3RybC5kZWxldGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnRGVsZXRlZCBSZWNvcmQ6JywgJHNjb3BlLnJlY29yZCk7XG5cbiAgICAgIC8vIEJyb2FkY2FzdCBkZWxldGVkIGV2ZW50XG4gICAgICAkc2NvcGUuJGVtaXQoJ2l0ZW0tZGVsZXRlZCcsICRzY29wZS5yZWNvcmQpO1xuXG4gICAgICAvLyBHbyB0byBhIGJsYW5rIHJlY29yZFxuICAgICAgY3RybC5nb1RvUmVjb3JkKCk7XG4gICAgfTtcblxuICAgIGN0cmwuZ29Ub1JlY29yZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdyZWNvcmRzLicgKyBBcGkuRW50aXR5TmFtZXMuUGx1cmFsU25ha2VDYXNlICsgJy52aWV3Jywge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzdGF0ZS5nbygncmVjb3Jkcy4nICsgQXBpLkVudGl0eU5hbWVzLlBsdXJhbFNuYWtlQ2FzZSArICcubmV3Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoZXNlIGFyZSB0aGUgbWV0aG9kcyB3ZSBjaG9vc2UgdG8gZXhwb3NlIHRvIHRoZSB2aWV3IHZpYSB0aGUgJHNjb3BlXG4gICAgJHNjb3BlLm5ldyA9ICgpID0+IGN0cmwubmV3KCk7XG4gICAgJHNjb3BlLnNhdmUgPSAoKSA9PiBjdHJsLnNhdmUoKTtcbiAgICAkc2NvcGUuZGVsZXRlID0gKCkgPT4gY3RybC5kZWxldGUoKTtcblxuICAgIGZ1bmN0aW9uIGJlZ2luT2JzZXJ2ZShyZWNvcmQpIHtcbiAgICAgIHJlY29yZC5DaGFuZ2VzID0geyBGaWVsZHM6IFtdIH07XG5cbiAgICAgIE9iamVjdC5vYnNlcnZlKHJlY29yZCwgZnVuY3Rpb24oY2hhbmdlcykge1xuICAgICAgICByZWNvcmQuQ2hhbmdlcy5GaWVsZHMucHVzaChjaGFuZ2VzWzBdLm5hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTGlzdENvbnRyb2xsZXI6IExpc3RDb250cm9sbGVyLFxuICBJdGVtQ29udHJvbGxlcjogSXRlbUNvbnRyb2xsZXJcbn07IiwidmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyksXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG4gIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbnZhciBEb2N1bWVudHNDb250cm9sbGVyID0gWyckaW5qZWN0b3InLCAnJHNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnRG9jdW1lbnRBcGknLFxuICBmdW5jdGlvbigkaW5qZWN0b3IsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIERvY3VtZW50QXBpKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgLy8gSW5oZXJpdCBzaGFyZWQgZnVuY3Rpb25hbGl0eSBmcm9tIHRoZSBMaXN0Q29udHJvbGxlclxuICAgICRpbmplY3Rvci5pbnZva2UoY29tbW9uLkxpc3RDb250cm9sbGVyLCBjdHJsLCB7XG4gICAgICAkc2NvcGU6ICRzY29wZSxcbiAgICAgIEFwaTogRG9jdW1lbnRBcGlcbiAgICB9KTtcblxuICAgIC8vIEJvb3RzdHJhcCB0aGUgY29udHJvbGxlclxuICAgIGN0cmwuaW5pdCgpO1xuICB9XG5dO1xuXG52YXIgRG9jdW1lbnRDb250cm9sbGVyID0gWyckaW5qZWN0b3InLCAnJHNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnRG9jdW1lbnRBcGknLFxuICBmdW5jdGlvbigkaW5qZWN0b3IsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIERvY3VtZW50QXBpKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgLy8gSW5oZXJpdCBzaGFyZWQgZnVuY3Rpb25hbGl0eSBmcm9tIHRoZSBJdGVtQ29udHJvbGxlclxuICAgICRpbmplY3Rvci5pbnZva2UoY29tbW9uLkl0ZW1Db250cm9sbGVyLCBjdHJsLCB7XG4gICAgICAkc2NvcGU6ICRzY29wZSxcbiAgICAgICRzdGF0ZTogJHN0YXRlLFxuICAgICAgJHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXMsXG4gICAgICBBcGk6IERvY3VtZW50QXBpXG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJG9uKCdpdGVtLXNhdmluZycsIChlLCByZWNvcmQsIHByb21pc2VzKSA9PiB7XG4gICAgICBwcm9taXNlcy5wdXNoKCRzY29wZS5uZXdJbWFnZSgpLnRoZW4oc2F2ZWRGaWxlTmFtZSA9PiB7XG4gICAgICAgIHJlY29yZC5DaGFuZ2VzLk5ld0ltYWdlRmlsZU5hbWUgPSBzYXZlZEZpbGVOYW1lO1xuICAgICAgfSkpO1xuXG4gICAgICBwcm9taXNlcy5wdXNoKCRzY29wZS5uZXdBdHRhY2htZW50KCkudGhlbihzYXZlZEZpbGVOYW1lID0+IHtcbiAgICAgICAgcmVjb3JkLkNoYW5nZXMuTmV3QXR0YWNobWVudEZpbGVOYW1lID0gc2F2ZWRGaWxlTmFtZTtcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIEJvb3RzdHJhcCB0aGUgY29udHJvbGxlclxuICAgIGN0cmwuaW5pdCgpO1xuICB9XG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRG9jdW1lbnRzQ29udHJvbGxlcjogRG9jdW1lbnRzQ29udHJvbGxlcixcbiAgRG9jdW1lbnRDb250cm9sbGVyOiBEb2N1bWVudENvbnRyb2xsZXJcbn07IiwidmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyksXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG4gIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbnZhciBVc2Vyc0NvbnRyb2xsZXIgPSBbJyRpbmplY3RvcicsICckc2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICdVc2VyQXBpJyxcbiAgZnVuY3Rpb24oJGluamVjdG9yLCAkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyQXBpKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgLy8gSW5oZXJpdCBzaGFyZWQgZnVuY3Rpb25hbGl0eSBmcm9tIHRoZSBMaXN0Q29udHJvbGxlclxuICAgICRpbmplY3Rvci5pbnZva2UoY29tbW9uLkxpc3RDb250cm9sbGVyLCBjdHJsLCB7XG4gICAgICAkc2NvcGU6ICRzY29wZSxcbiAgICAgIEFwaTogVXNlckFwaVxuICAgIH0pO1xuXG4gICAgLy8gQm9vdHN0cmFwIHRoZSBjb250cm9sbGVyXG4gICAgY3RybC5pbml0KCk7XG4gIH1cbl07XG5cbnZhciBVc2VyQ29udHJvbGxlciA9IFsnJGluamVjdG9yJywgJyRzY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJ1VzZXJBcGknLFxuICBmdW5jdGlvbigkaW5qZWN0b3IsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFVzZXJBcGkpIHtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAvLyBJbmhlcml0IHNoYXJlZCBmdW5jdGlvbmFsaXR5IGZyb20gdGhlIEl0ZW1Db250cm9sbGVyXG4gICAgJGluamVjdG9yLmludm9rZShjb21tb24uSXRlbUNvbnRyb2xsZXIsIGN0cmwsIHtcbiAgICAgICRzY29wZTogJHNjb3BlLFxuICAgICAgJHN0YXRlOiAkc3RhdGUsXG4gICAgICAkc3RhdGVQYXJhbXM6ICRzdGF0ZVBhcmFtcyxcbiAgICAgIEFwaTogVXNlckFwaVxuICAgIH0pO1xuXG4gICAgLy8gQm9vdHN0cmFwIHRoZSBjb250cm9sbGVyXG4gICAgY3RybC5pbml0KCk7XG4gIH1cbl07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBVc2Vyc0NvbnRyb2xsZXI6IFVzZXJzQ29udHJvbGxlcixcbiAgVXNlckNvbnRyb2xsZXI6IFVzZXJDb250cm9sbGVyXG59OyIsIi8vIEFsbG93cyBmb3IgbmljZXIgdmFsaWRhdGlvbiBzbyB0aGF0IHRoZSB1c2VyIGlzbid0IHBlc3RlcmVkIHdpdGggdmFsaWRhdGlvbiBoaW50cyB1bnRpbCB0aGV5IGhhdmUgYmVlbiBnaXZlbiB0aGUgY2hhbmNlIHRvIGNvbXBsZXRlIHRoZSBmb3JtIGlucHV0XG5tb2R1bGUuZXhwb3J0cyA9IFtcblxuICBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRyLCBjdHJsKSB7XG4gICAgICAgIGlmICghY3RybCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsbS5vbignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbG0uYWRkQ2xhc3MoJ2hhcy1mb2N1cycpO1xuICAgICAgICAgIGN0cmwuJGhhc0ZvY3VzID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxtLm9uKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZWxtLnJlbW92ZUNsYXNzKCdoYXMtZm9jdXMnKTtcbiAgICAgICAgICBlbG0uYWRkQ2xhc3MoJ2hhcy12aXNpdGVkJyk7XG4gICAgICAgICAgY3RybC4kaGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgICBjdHJsLiRoYXNWaXNpdGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZWxtLmNsb3Nlc3QoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgZWxtLmFkZENsYXNzKCdoYXMtdmlzaXRlZCcpO1xuXG4gICAgICAgIC8vICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgY3RybC5oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgY3RybC5oYXNWaXNpdGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFsnJHEnLCAnVXBsb2FkZXInLCAnVXRpbGl0eScsXG4gIGZ1bmN0aW9uKCRxLCBVcGxvYWRlciwgVXRpbGl0eSkge1xuICAgIGZ1bmN0aW9uIG5vRmlsZSgpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGZpbGVVcGxvYWQ6IFwiPVwiXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2ZpbGVfdXBsb2FkLmh0bWwnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGlucHV0RmlsZSA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYScpO1xuXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2ZpbGUtdXBsb2FkJyk7XG5cbiAgICAgICAgLy8gRGVmYXVsdCBwcm9taXNlIGlzIHRoYXQgbm8gZmlsZSBoYXMgYmVlbiBjaG9vc2VuXG4gICAgICAgIHNjb3BlLmZpbGVVcGxvYWQgPSBub0ZpbGU7XG5cbiAgICAgICAgc2NvcGUudXBsb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgYnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlucHV0RmlsZVswXS5jbGljaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpbnB1dEZpbGUuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24oY2hhbmdlRXZlbnQpIHtcbiAgICAgICAgICBpZiAoY2hhbmdlRXZlbnQudGFyZ2V0LmZpbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgICAgc2NvcGUuZmlsZVVwbG9hZEluZGljYXRvciA9IFwiVXBsb2FkaW5nLi4uXCI7XG4gICAgICAgICAgc2NvcGUudXBsb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBmaWxlSWQgPSBVdGlsaXR5Lmd1aWQoKTtcblxuICAgICAgICAgIHZhciBwcm9taXNlID0gVXBsb2FkZXIudXBsb2FkQmxvYihjaGFuZ2VFdmVudC50YXJnZXQuZmlsZXNbMF0sIGZpbGVJZCkudGhlbihmdW5jdGlvbihzYXZlZEZpbGVOYW1lKSB7XG4gICAgICAgICAgICBzY29wZS5maWxlVXBsb2FkSW5kaWNhdG9yID0gXCJVcGxvYWQgQ29tcGxldGVcIjtcbiAgICAgICAgICAgIHNjb3BlLnVwbG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICByZXR1cm4gc2F2ZWRGaWxlTmFtZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFdyaXRlIHRoZSB1cGxvYWQgcHJvbWlzZSB0byB0aGUgc2NvcGVcbiAgICAgICAgICAgIHNjb3BlLmZpbGVVcGxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2NvcGUuZmlsZVVwbG9hZCA9IG5vRmlsZTtcbiAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5dOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1hdGNoOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKGN0cmwuJHByaXN0aW5lICYmIGFuZ3VsYXIuaXNVbmRlZmluZWQoY3RybC4kbW9kZWxWYWx1ZSkpIHx8IHNjb3BlLm1hdGNoID09PSBjdHJsLiRtb2RlbFZhbHVlO1xuICAgICAgfSwgZnVuY3Rpb24oY3VycmVudFZhbHVlKSB7XG4gICAgICAgIGN0cmwuJHNldFZhbGlkaXR5KCdtYXRjaCcsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gW1xuXG4gIGZ1bmN0aW9uKCkge1xuICAgIHZhciB1aVRpbnltY2VDb25maWcgPSB7XG4gICAgICBwbHVnaW5zOiAnYXV0b3Jlc2l6ZScsXG4gICAgICB3aWR0aDogJzEwMCUnXG4gICAgfTtcbiAgICB2YXIgZ2VuZXJhdGVkSWRzID0gMDtcblxuICAgIHJldHVybiB7XG4gICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycywgbmdNb2RlbCkge1xuICAgICAgICB2YXIgZXhwcmVzc2lvbiwgb3B0aW9ucywgdGlueUluc3RhbmNlO1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIGFuIElEIGlmIG5vdCBwcmVzZW50XG4gICAgICAgIGlmICghYXR0cnMuaWQpIHtcbiAgICAgICAgICBhdHRycy4kc2V0KCdpZCcsICd1aVRpbnltY2UnICsgZ2VuZXJhdGVkSWRzKyspO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAvLyBVcGRhdGUgbW9kZWwgd2hlbiBjYWxsaW5nIHNldENvbnRlbnQgKHN1Y2ggYXMgZnJvbSB0aGUgc291cmNlIGVkaXRvciBwb3B1cClcbiAgICAgICAgICBzZXR1cDogZnVuY3Rpb24oZWQpIHtcbiAgICAgICAgICAgIGVkLm9uKCdpbml0JywgZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICBuZ01vZGVsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gVXBkYXRlIG1vZGVsIG9uIGJ1dHRvbiBjbGlja1xuICAgICAgICAgICAgZWQub24oJ0V4ZWNDb21tYW5kJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBlZC5zYXZlKCk7XG4gICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShlbG0udmFsKCkpO1xuICAgICAgICAgICAgICBpZiAoIXNjb3BlLiQkcGhhc2UpIHtcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBVcGRhdGUgbW9kZWwgb24ga2V5cHJlc3NcbiAgICAgICAgICAgIGVkLm9uKCdLZXlVcCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZWQuaXNEaXJ0eSgpKTtcbiAgICAgICAgICAgICAgZWQuc2F2ZSgpO1xuICAgICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZWxtLnZhbCgpKTtcbiAgICAgICAgICAgICAgaWYgKCFzY29wZS4kJHBoYXNlKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kZTogJ2V4YWN0JyxcbiAgICAgICAgICBlbGVtZW50czogYXR0cnMuaWRcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoYXR0cnMudWlUaW55bWNlKSB7XG4gICAgICAgICAgZXhwcmVzc2lvbiA9IHNjb3BlLiRldmFsKGF0dHJzLnVpVGlueW1jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwcmVzc2lvbiA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5ndWxhci5leHRlbmQob3B0aW9ucywgdWlUaW55bWNlQ29uZmlnLCBleHByZXNzaW9uKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbnltY2UuaW5pdChvcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmdNb2RlbC4kcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCF0aW55SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRpbnlJbnN0YW5jZSA9IHRpbnltY2UuZ2V0KGF0dHJzLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRpbnlJbnN0YW5jZSkge1xuICAgICAgICAgICAgdGlueUluc3RhbmNlLnNldENvbnRlbnQobmdNb2RlbC4kdmlld1ZhbHVlIHx8ICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFsnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsXG4gIGZ1bmN0aW9uKCRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQycsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgc2NvcGUuZ29Ub1N0YWdlID0gZnVuY3Rpb24odG9TdGFnZUluZGV4KSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSBjbGFzcyB0byBwZXJmb3JtIHRoZSBjb3JyZWN0IENTUyBhbmltYXRpb25zXG4gICAgICAgICAgaWYgKCRzdGF0ZVBhcmFtcy5zdGFnZUluZGV4IDwgdG9TdGFnZUluZGV4KSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCd3aXphcmQtbW92ZWQtZm9yd2FyZCcpO1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnd2l6YXJkLW1vdmVkLWJhY2t3YXJkJyk7XG4gICAgICAgICAgfSBlbHNlIGlmICgkc3RhdGVQYXJhbXMuc3RhZ2VJbmRleCA+IHRvU3RhZ2VJbmRleCkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnd2l6YXJkLW1vdmVkLWJhY2t3YXJkJyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCd3aXphcmQtbW92ZWQtZm9yd2FyZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICRzdGF0ZS5nbygkc3RhdGUuY3VycmVudC5uYW1lLCB7XG4gICAgICAgICAgICBzdGFnZUluZGV4OiB0b1N0YWdlSW5kZXhcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzY29wZS5nb0ZvcndhcmRzVG8gPSBmdW5jdGlvbihzdGF0ZU5hbWUpIHtcbiAgICAgICAgLy8gICBlbGVtZW50LmFkZENsYXNzKCd3aXphcmQtbW92ZWQtZm9yd2FyZCcpO1xuICAgICAgICAvLyAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3dpemFyZC1tb3ZlZC1iYWNrd2FyZCcpO1xuXG4gICAgICAgIC8vICAgJHN0YXRlLmdvKHN0YXRlTmFtZSk7XG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgLy8gc2NvcGUuZ29CYWNrd2FyZHNUbyA9IGZ1bmN0aW9uKHN0YXRlTmFtZSkge1xuICAgICAgICAvLyAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3dpemFyZC1tb3ZlZC1iYWNrd2FyZCcpO1xuICAgICAgICAvLyAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3dpemFyZC1tb3ZlZC1mb3J3YXJkJyk7XG5cbiAgICAgICAgLy8gICAkc3RhdGUuZ28oc3RhdGVOYW1lKTtcbiAgICAgICAgLy8gfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXTsiLCIvKiBBUFBcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKSxcbiAgcm91dGVyID0gcmVxdWlyZSgnYW5ndWxhci11aS1yb3V0ZXInKSxcbiAgbmdEaWFsb2cgPSByZXF1aXJlKCcuL2xpYi9uZ0RpYWxvZycpO1xuXG53aW5kb3cuXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTsgLy8gUmVzdGFuZ3VsYXIgd2FudHMgXyBpbiBnbG9iYWwgc2NvcGVcblxucmVxdWlyZSgnYW5ndWxhci1hbmltYXRlJyk7IC8vIFBvbGx1dGVzIGdsb2JhbCBzY29wZSwgY291bGQgZG8gd2l0aCBpbXByb3ZpbmdcbnJlcXVpcmUoJ3Jlc3Rhbmd1bGFyJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZ28tYW5ndWxhci1zdGFydGVyJywgWyduZ0xvY2FsZScsICduZ0FuaW1hdGUnLCAncmVzdGFuZ3VsYXInLCByb3V0ZXIsIG5nRGlhbG9nXSk7XG5cbi8qIFNFUlZJQ0VTXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuYXBwLmZhY3RvcnkoJ0F1dGhlbnRpY2F0b3InLCByZXF1aXJlKCcuL3NlcnZpY2VzL2F1dGhlbnRpY2F0b3InKSk7XG5hcHAuZmFjdG9yeSgnVXBsb2FkZXInLCByZXF1aXJlKCcuL3NlcnZpY2VzL3VwbG9hZGVyJykpO1xuYXBwLmZhY3RvcnkoJ1V0aWxpdHknLCByZXF1aXJlKCcuL3NlcnZpY2VzL3V0aWxpdHknKSk7XG5cbi8qIEFQSVxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmFwcC5mYWN0b3J5KCdBdXRoQXBpJywgcmVxdWlyZSgnLi9hcGkvYXV0aCcpKTtcbmFwcC5mYWN0b3J5KCdVc2VyQXBpJywgcmVxdWlyZSgnLi9hcGkvdXNlcicpKTtcbmFwcC5mYWN0b3J5KCdEb2N1bWVudEFwaScsIHJlcXVpcmUoJy4vYXBpL2RvY3VtZW50JykpO1xuXG4vKiBESVJFQ1RJVkVTXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuYXBwLmRpcmVjdGl2ZSgnbWF0Y2gnLCByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbWF0Y2gnKSk7XG5hcHAuZGlyZWN0aXZlKCdmaWxlVXBsb2FkJywgcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2ZpbGVfdXBsb2FkJykpO1xuYXBwLmRpcmVjdGl2ZSgnaW5wdXQnLCByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvYmx1cl9mb2N1cycpKTtcbmFwcC5kaXJlY3RpdmUoJ3NlbGVjdCcsIHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9ibHVyX2ZvY3VzJykpO1xuYXBwLmRpcmVjdGl2ZSgnd2l6YXJkJywgcmVxdWlyZSgnLi9kaXJlY3RpdmVzL3dpemFyZCcpKTtcbmFwcC5kaXJlY3RpdmUoJ3RpbnlNY2UnLCByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvdGlueV9tY2UnKSk7XG5cbi8qIENPTlRST0xMRVJTXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xudmFyIEF1dGhDb250cm9sbGVycyA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvYXV0aCcpLFxuICBVc2VyQ29udHJvbGxlcnMgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3VzZXInKSxcbiAgRG9jdW1lbnRDb250cm9sbGVycyA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvZG9jdW1lbnQnKTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ25JbkNvbnRyb2xsZXInLCBBdXRoQ29udHJvbGxlcnMuU2lnbkluQ29udHJvbGxlcik7XG5hcHAuY29udHJvbGxlcignUmVnaXN0ZXJDb250cm9sbGVyJywgQXV0aENvbnRyb2xsZXJzLlJlZ2lzdGVyQ29udHJvbGxlcik7XG5cbmFwcC5jb250cm9sbGVyKCdVc2Vyc0NvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcnMuVXNlcnNDb250cm9sbGVyKTtcbmFwcC5jb250cm9sbGVyKCdVc2VyQ29udHJvbGxlcicsIFVzZXJDb250cm9sbGVycy5Vc2VyQ29udHJvbGxlcik7XG5cbmFwcC5jb250cm9sbGVyKCdEb2N1bWVudHNDb250cm9sbGVyJywgRG9jdW1lbnRDb250cm9sbGVycy5Eb2N1bWVudHNDb250cm9sbGVyKTtcbmFwcC5jb250cm9sbGVyKCdEb2N1bWVudENvbnRyb2xsZXInLCBEb2N1bWVudENvbnRyb2xsZXJzLkRvY3VtZW50Q29udHJvbGxlcik7XG5cbmFwcC5ydW4ocmVxdWlyZSgnLi9ydW4vYXV0aCcpKTtcbmFwcC5ydW4ocmVxdWlyZSgnLi9ydW4vaXRlbV9jb3VudCcpKTtcbmFwcC5ydW4ocmVxdWlyZSgnLi9ydW4vcGVybWlzc2lvbnMnKSk7XG5hcHAucnVuKHJlcXVpcmUoJy4vcnVuL3Byb21pc2UnKSk7XG5hcHAucnVuKHJlcXVpcmUoJy4vcnVuL3N0YXRlX2NsYXNzJykpO1xuXG5hcHAuY29uZmlnKHJlcXVpcmUoJy4vY29uZmlnL2h0dHAnKSk7XG5hcHAuY29uZmlnKHJlcXVpcmUoJy4vY29uZmlnL3JvdXRlcicpKTtcblxuYXBwLmNvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZy9yZXN0YW5ndWxhcicpKTtcblxuLy8gTWFudWFsIEFuZ3VsYXIgYm9vdHN0cmFwIGNhbGwsIGxlc3MgbWFnaWNcbmFuZ3VsYXIuYm9vdHN0cmFwKHdpbmRvdy5kb2N1bWVudC5ib2R5LCBbJ2dvLWFuZ3VsYXItc3RhcnRlciddKTsiLCIvKlxuICogbmdEaWFsb2cgLSBlYXN5IG1vZGFscyBhbmQgcG9wdXAgd2luZG93c1xuICogaHR0cDovL2dpdGh1Yi5jb20vbGlrZWFzdG9yZS9uZ0RpYWxvZ1xuICogKGMpIDIwMTMgTUlUIExpY2Vuc2UsIGh0dHBzOi8vbGlrZWFzdG9yZS5jb21cbiAqL1xuXG52YXIgbW9kdWxlTmFtZSA9ICduZ0RpYWxvZyc7XG5cbihmdW5jdGlvbih3aW5kb3csIGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtdKTtcblxuICB2YXIgJGVsID0gYW5ndWxhci5lbGVtZW50O1xuICB2YXIgaXNEZWYgPSBhbmd1bGFyLmlzRGVmaW5lZDtcbiAgdmFyIHN0eWxlID0gKGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5zdHlsZTtcbiAgdmFyIGFuaW1hdGlvbkVuZFN1cHBvcnQgPSBpc0RlZihzdHlsZS5hbmltYXRpb24pIHx8IGlzRGVmKHN0eWxlLldlYmtpdEFuaW1hdGlvbikgfHwgaXNEZWYoc3R5bGUuTW96QW5pbWF0aW9uKSB8fCBpc0RlZihzdHlsZS5Nc0FuaW1hdGlvbikgfHwgaXNEZWYoc3R5bGUuT0FuaW1hdGlvbik7XG4gIHZhciBhbmltYXRpb25FbmRFdmVudCA9ICdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kIG1vekFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kJztcbiAgdmFyIGZvcmNlQm9keVJlbG9hZCA9IGZhbHNlO1xuXG4gIG1vZHVsZS5wcm92aWRlcignbmdEaWFsb2cnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICBwbGFpbjogZmFsc2UsXG4gICAgICBzaG93Q2xvc2U6IHRydWUsXG4gICAgICBjbG9zZUJ5RG9jdW1lbnQ6IHRydWUsXG4gICAgICBjbG9zZUJ5RXNjYXBlOiB0cnVlLFxuICAgICAgYXBwZW5kVG86IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuc2V0Rm9yY2VCb2R5UmVsb2FkID0gZnVuY3Rpb24oX3VzZUl0KSB7XG4gICAgICBmb3JjZUJvZHlSZWxvYWQgPSBfdXNlSXQgfHwgZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0RGVmYXVsdHMgPSBmdW5jdGlvbihuZXdEZWZhdWx0cykge1xuICAgICAgYW5ndWxhci5leHRlbmQoZGVmYXVsdHMsIG5ld0RlZmF1bHRzKTtcbiAgICB9O1xuXG4gICAgdmFyIGdsb2JhbElEID0gMCxcbiAgICAgIGRpYWxvZ3NDb3VudCA9IDAsXG4gICAgICBjbG9zZUJ5RG9jdW1lbnRIYW5kbGVyLFxuICAgICAgZGVmZXJzID0ge307XG5cbiAgICB0aGlzLiRnZXQgPSBbJyRkb2N1bWVudCcsICckdGVtcGxhdGVDYWNoZScsICckY29tcGlsZScsICckcScsICckaHR0cCcsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgJyR3aW5kb3cnLCAnJGNvbnRyb2xsZXInLFxuICAgICAgZnVuY3Rpb24oJGRvY3VtZW50LCAkdGVtcGxhdGVDYWNoZSwgJGNvbXBpbGUsICRxLCAkaHR0cCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICR3aW5kb3csICRjb250cm9sbGVyKSB7XG4gICAgICAgIHZhciAkYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChmb3JjZUJvZHlSZWxvYWQpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByaXZhdGVNZXRob2RzID0ge1xuICAgICAgICAgIG9uRG9jdW1lbnRLZXlkb3duOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICAgICAgICAgIHB1YmxpY01ldGhvZHMuY2xvc2UoJyRlc2NhcGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgc2V0Qm9keVBhZGRpbmc6IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ2luYWxCb2R5UGFkZGluZyA9IHBhcnNlSW50KCgkYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnKSB8fCAwKSwgMTApO1xuICAgICAgICAgICAgJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgKG9yaWdpbmFsQm9keVBhZGRpbmcgKyB3aWR0aCkgKyAncHgnKTtcbiAgICAgICAgICAgICRib2R5LmRhdGEoJ25nLWRpYWxvZy1vcmlnaW5hbC1wYWRkaW5nJywgb3JpZ2luYWxCb2R5UGFkZGluZyk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHJlc2V0Qm9keVBhZGRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG9yaWdpbmFsQm9keVBhZGRpbmcgPSAkYm9keS5kYXRhKCduZy1kaWFsb2ctb3JpZ2luYWwtcGFkZGluZycpO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsQm9keVBhZGRpbmcpIHtcbiAgICAgICAgICAgICAgJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0Jywgb3JpZ2luYWxCb2R5UGFkZGluZyArICdweCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBjbG9zZURpYWxvZzogZnVuY3Rpb24oJGRpYWxvZywgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICRkaWFsb2cuYXR0cignaWQnKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkhhbW1lciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgd2luZG93LkhhbW1lcigkZGlhbG9nWzBdKS5vZmYoJ3RhcCcsIGNsb3NlQnlEb2N1bWVudEhhbmRsZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJGRpYWxvZy51bmJpbmQoJ2NsaWNrJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaWFsb2dzQ291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgJGJvZHkudW5iaW5kKCdrZXlkb3duJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghJGRpYWxvZy5oYXNDbGFzcyhcIm5nZGlhbG9nLWNsb3NpbmdcIikpIHtcbiAgICAgICAgICAgICAgZGlhbG9nc0NvdW50IC09IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbmltYXRpb25FbmRTdXBwb3J0KSB7XG4gICAgICAgICAgICAgICRkaWFsb2cudW5iaW5kKGFuaW1hdGlvbkVuZEV2ZW50KS5iaW5kKGFuaW1hdGlvbkVuZEV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkZGlhbG9nLnNjb3BlKCkuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkZGlhbG9nLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGlmIChkaWFsb2dzQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICRib2R5LnJlbW92ZUNsYXNzKCduZ2RpYWxvZy1vcGVuJyk7XG4gICAgICAgICAgICAgICAgICBwcml2YXRlTWV0aG9kcy5yZXNldEJvZHlQYWRkaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmdEaWFsb2cuY2xvc2VkJywgJGRpYWxvZyk7XG4gICAgICAgICAgICAgIH0pLmFkZENsYXNzKCduZ2RpYWxvZy1jbG9zaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkZGlhbG9nLnNjb3BlKCkuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgJGRpYWxvZy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgaWYgKGRpYWxvZ3NDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRib2R5LnJlbW92ZUNsYXNzKCduZ2RpYWxvZy1vcGVuJyk7XG4gICAgICAgICAgICAgICAgcHJpdmF0ZU1ldGhvZHMucmVzZXRCb2R5UGFkZGluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmdEaWFsb2cuY2xvc2VkJywgJGRpYWxvZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVmZXJzW2lkXSkge1xuICAgICAgICAgICAgICBkZWZlcnNbaWRdLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgJGRpYWxvZzogJGRpYWxvZyxcbiAgICAgICAgICAgICAgICByZW1haW5pbmdEaWFsb2dzOiBkaWFsb2dzQ291bnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGRlbGV0ZSBkZWZlcnNbaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcHVibGljTWV0aG9kcyA9IHtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnM6XG4gICAgICAgICAgICogLSB0ZW1wbGF0ZSB7U3RyaW5nfSAtIGlkIG9mIG5nLXRlbXBsYXRlLCB1cmwgZm9yIHBhcnRpYWwsIHBsYWluIHN0cmluZyAoaWYgZW5hYmxlZClcbiAgICAgICAgICAgKiAtIHBsYWluIHtCb29sZWFufSAtIGVuYWJsZSBwbGFpbiBzdHJpbmcgdGVtcGxhdGVzLCBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAgICogLSBzY29wZSB7T2JqZWN0fVxuICAgICAgICAgICAqIC0gY29udHJvbGxlciB7U3RyaW5nfVxuICAgICAgICAgICAqIC0gY2xhc3NOYW1lIHtTdHJpbmd9IC0gZGlhbG9nIHRoZW1lIGNsYXNzXG4gICAgICAgICAgICogLSBzaG93Q2xvc2Uge0Jvb2xlYW59IC0gc2hvdyBjbG9zZSBidXR0b24sIGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgICAqIC0gY2xvc2VCeUVzY2FwZSB7Qm9vbGVhbn0gLSBkZWZhdWx0IHRydWVcbiAgICAgICAgICAgKiAtIGNsb3NlQnlEb2N1bWVudCB7Qm9vbGVhbn0gLSBkZWZhdWx0IHRydWVcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGlhbG9nXG4gICAgICAgICAgICovXG4gICAgICAgICAgb3BlbjogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBhbmd1bGFyLmNvcHkoZGVmYXVsdHMpO1xuXG4gICAgICAgICAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsIG9wdHMpO1xuXG4gICAgICAgICAgICBnbG9iYWxJRCArPSAxO1xuXG4gICAgICAgICAgICBzZWxmLmxhdGVzdElEID0gJ25nZGlhbG9nJyArIGdsb2JhbElEO1xuXG4gICAgICAgICAgICB2YXIgZGVmZXI7XG4gICAgICAgICAgICBkZWZlcnNbc2VsZi5sYXRlc3RJRF0gPSBkZWZlciA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgIHZhciBzY29wZSA9IGFuZ3VsYXIuaXNPYmplY3Qob3B0aW9ucy5zY29wZSkgPyBvcHRpb25zLnNjb3BlLiRuZXcoKSA6ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgdmFyICRkaWFsb2csICRkaWFsb2dQYXJlbnQ7XG5cbiAgICAgICAgICAgICRxLndoZW4obG9hZFRlbXBsYXRlKG9wdGlvbnMudGVtcGxhdGUpKS50aGVuKGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gYW5ndWxhci5pc1N0cmluZyh0ZW1wbGF0ZSkgP1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDpcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5kYXRhICYmIGFuZ3VsYXIuaXNTdHJpbmcodGVtcGxhdGUuZGF0YSkgP1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlLmRhdGEgOlxuICAgICAgICAgICAgICAgICcnO1xuXG4gICAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChvcHRpb25zLnRlbXBsYXRlLCB0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0Nsb3NlKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgKz0gJzxkaXYgY2xhc3M9XCJuZ2RpYWxvZy1jbG9zZVwiPjwvZGl2Pic7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZWxmLiRyZXN1bHQgPSAkZGlhbG9nID0gJGVsKCc8ZGl2IGlkPVwibmdkaWFsb2cnICsgZ2xvYmFsSUQgKyAnXCIgY2xhc3M9XCJuZ2RpYWxvZ1wiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAkZGlhbG9nLmh0bWwoJzxkaXYgY2xhc3M9XCJuZ2RpYWxvZy1vdmVybGF5XCI+PC9kaXY+PGRpdiBjbGFzcz1cIm5nZGlhbG9nLWNvbnRlbnRcIj4nICsgdGVtcGxhdGUgKyAnPC9kaXY+Jyk7XG5cbiAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBhbmd1bGFyLmlzU3RyaW5nKG9wdGlvbnMuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RMZXR0ZXIgPSBvcHRpb25zLmRhdGEucmVwbGFjZSgvXlxccyovLCAnJylbMF07XG4gICAgICAgICAgICAgICAgc2NvcGUubmdEaWFsb2dEYXRhID0gKGZpcnN0TGV0dGVyID09PSAneycgfHwgZmlyc3RMZXR0ZXIgPT09ICdbJykgPyBhbmd1bGFyLmZyb21Kc29uKG9wdGlvbnMuZGF0YSkgOiBvcHRpb25zLmRhdGE7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kYXRhICYmIGFuZ3VsYXIuaXNPYmplY3Qob3B0aW9ucy5kYXRhKSkge1xuICAgICAgICAgICAgICAgIHNjb3BlLm5nRGlhbG9nRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24oYW5ndWxhci50b0pzb24ob3B0aW9ucy5kYXRhKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jb250cm9sbGVyICYmIChhbmd1bGFyLmlzU3RyaW5nKG9wdGlvbnMuY29udHJvbGxlcikgfHwgYW5ndWxhci5pc0FycmF5KG9wdGlvbnMuY29udHJvbGxlcikgfHwgYW5ndWxhci5pc0Z1bmN0aW9uKG9wdGlvbnMuY29udHJvbGxlcikpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXJJbnN0YW5jZSA9ICRjb250cm9sbGVyKG9wdGlvbnMuY29udHJvbGxlciwge1xuICAgICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgICAgICRlbGVtZW50OiAkZGlhbG9nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGRpYWxvZy5kYXRhKCckbmdEaWFsb2dDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXJJbnN0YW5jZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAkZGlhbG9nLmFkZENsYXNzKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChvcHRpb25zLmFwcGVuZFRvICYmIGFuZ3VsYXIuaXNTdHJpbmcob3B0aW9ucy5hcHBlbmRUbykpIHtcbiAgICAgICAgICAgICAgICAkZGlhbG9nUGFyZW50ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5hcHBlbmRUbykpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRkaWFsb2dQYXJlbnQgPSAkYm9keTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNjb3BlLmNsb3NlVGhpc0RpYWxvZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJpdmF0ZU1ldGhvZHMuY2xvc2VEaWFsb2coJGRpYWxvZywgdmFsdWUpO1xuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRjb21waWxlKCRkaWFsb2cpKHNjb3BlKTtcblxuICAgICAgICAgICAgICAgIHZhciB3aWR0aERpZmZzID0gJHdpbmRvdy5pbm5lcldpZHRoIC0gJGJvZHkucHJvcCgnY2xpZW50V2lkdGgnKTtcbiAgICAgICAgICAgICAgICAkYm9keS5hZGRDbGFzcygnbmdkaWFsb2ctb3BlbicpO1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxCYXJXaWR0aCA9IHdpZHRoRGlmZnMgLSAoJHdpbmRvdy5pbm5lcldpZHRoIC0gJGJvZHkucHJvcCgnY2xpZW50V2lkdGgnKSk7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbEJhcldpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZU1ldGhvZHMuc2V0Qm9keVBhZGRpbmcoc2Nyb2xsQmFyV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZGlhbG9nUGFyZW50LmFwcGVuZCgkZGlhbG9nKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ25nRGlhbG9nLm9wZW5lZCcsICRkaWFsb2cpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jbG9zZUJ5RXNjYXBlKSB7XG4gICAgICAgICAgICAgICAgJGJvZHkuYmluZCgna2V5ZG93bicsIHByaXZhdGVNZXRob2RzLm9uRG9jdW1lbnRLZXlkb3duKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNsb3NlQnlEb2N1bWVudEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBpc092ZXJsYXkgPSBvcHRpb25zLmNsb3NlQnlEb2N1bWVudCA/ICRlbChldmVudC50YXJnZXQpLmhhc0NsYXNzKCduZ2RpYWxvZy1vdmVybGF5JykgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgaXNDbG9zZUJ0biA9ICRlbChldmVudC50YXJnZXQpLmhhc0NsYXNzKCduZ2RpYWxvZy1jbG9zZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzT3ZlcmxheSB8fCBpc0Nsb3NlQnRuKSB7XG4gICAgICAgICAgICAgICAgICBwdWJsaWNNZXRob2RzLmNsb3NlKCRkaWFsb2cuYXR0cignaWQnKSwgaXNDbG9zZUJ0biA/ICckY2xvc2VCdXR0b24nIDogJyRkb2N1bWVudCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5IYW1tZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkhhbW1lcigkZGlhbG9nWzBdKS5vbigndGFwJywgY2xvc2VCeURvY3VtZW50SGFuZGxlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGRpYWxvZy5iaW5kKCdjbGljaycsIGNsb3NlQnlEb2N1bWVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZGlhbG9nc0NvdW50ICs9IDE7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHB1YmxpY01ldGhvZHM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6ICduZ2RpYWxvZycgKyBnbG9iYWxJRCxcbiAgICAgICAgICAgICAgY2xvc2VQcm9taXNlOiBkZWZlci5wcm9taXNlLFxuICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcml2YXRlTWV0aG9kcy5jbG9zZURpYWxvZygkZGlhbG9nLCB2YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRUZW1wbGF0ZSh0bXBsKSB7XG4gICAgICAgICAgICAgIGlmICghdG1wbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnRW1wdHkgdGVtcGxhdGUnO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcodG1wbCkgJiYgb3B0aW9ucy5wbGFpbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0bXBsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZUNhY2hlLmdldCh0bXBsKSB8fCAkaHR0cC5nZXQodG1wbCwge1xuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zOlxuICAgICAgICAgICAqIC0gdGVtcGxhdGUge1N0cmluZ30gLSBpZCBvZiBuZy10ZW1wbGF0ZSwgdXJsIGZvciBwYXJ0aWFsLCBwbGFpbiBzdHJpbmcgKGlmIGVuYWJsZWQpXG4gICAgICAgICAgICogLSBwbGFpbiB7Qm9vbGVhbn0gLSBlbmFibGUgcGxhaW4gc3RyaW5nIHRlbXBsYXRlcywgZGVmYXVsdCBmYWxzZVxuICAgICAgICAgICAqIC0gc2NvcGUge09iamVjdH1cbiAgICAgICAgICAgKiAtIGNvbnRyb2xsZXIge1N0cmluZ31cbiAgICAgICAgICAgKiAtIGNsYXNzTmFtZSB7U3RyaW5nfSAtIGRpYWxvZyB0aGVtZSBjbGFzc1xuICAgICAgICAgICAqIC0gc2hvd0Nsb3NlIHtCb29sZWFufSAtIHNob3cgY2xvc2UgYnV0dG9uLCBkZWZhdWx0IHRydWVcbiAgICAgICAgICAgKiAtIGNsb3NlQnlFc2NhcGUge0Jvb2xlYW59IC0gZGVmYXVsdCBmYWxzZVxuICAgICAgICAgICAqIC0gY2xvc2VCeURvY3VtZW50IHtCb29sZWFufSAtIGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGlhbG9nXG4gICAgICAgICAgICovXG4gICAgICAgICAgb3BlbkNvbmZpcm06IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICBjbG9zZUJ5RXNjYXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgY2xvc2VCeURvY3VtZW50OiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsIG9wdHMpO1xuXG4gICAgICAgICAgICBvcHRpb25zLnNjb3BlID0gYW5ndWxhci5pc09iamVjdChvcHRpb25zLnNjb3BlKSA/IG9wdGlvbnMuc2NvcGUuJG5ldygpIDogJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICBvcHRpb25zLnNjb3BlLmNvbmZpcm0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICBkZWZlci5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgb3BlblJlc3VsdC5jbG9zZSh2YWx1ZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb3BlblJlc3VsdCA9IHB1YmxpY01ldGhvZHMub3BlbihvcHRpb25zKTtcbiAgICAgICAgICAgIG9wZW5SZXN1bHQuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlci5yZWplY3QoZGF0YS52YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGRlZmVyLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGlhbG9nXG4gICAgICAgICAgICovXG4gICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKGlkLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyICRkaWFsb2cgPSAkZWwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcblxuICAgICAgICAgICAgaWYgKCRkaWFsb2cubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHByaXZhdGVNZXRob2RzLmNsb3NlRGlhbG9nKCRkaWFsb2csIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHB1YmxpY01ldGhvZHMuY2xvc2VBbGwodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcHVibGljTWV0aG9kcztcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgY2xvc2VBbGw6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgJGFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZ2RpYWxvZycpO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJGFsbCwgZnVuY3Rpb24oZGlhbG9nKSB7XG4gICAgICAgICAgICAgIHByaXZhdGVNZXRob2RzLmNsb3NlRGlhbG9nKCRlbChkaWFsb2cpLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHB1YmxpY01ldGhvZHM7XG4gICAgICB9XG4gICAgXTtcbiAgfSk7XG5cbiAgbW9kdWxlLmRpcmVjdGl2ZSgnbmdEaWFsb2cnLCBbJ25nRGlhbG9nJyxcbiAgICBmdW5jdGlvbihuZ0RpYWxvZykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICBuZ0RpYWxvZ1Njb3BlOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG4gICAgICAgICAgZWxlbS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBuZ0RpYWxvZ1Njb3BlID0gYW5ndWxhci5pc0RlZmluZWQoc2NvcGUubmdEaWFsb2dTY29wZSkgPyBzY29wZS5uZ0RpYWxvZ1Njb3BlIDogJ25vU2NvcGUnO1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm5nRGlhbG9nQ2xvc2VQcmV2aW91cykpIG5nRGlhbG9nLmNsb3NlKGF0dHJzLm5nRGlhbG9nQ2xvc2VQcmV2aW91cyk7XG5cbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICB0ZW1wbGF0ZTogYXR0cnMubmdEaWFsb2csXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogYXR0cnMubmdEaWFsb2dDbGFzcyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogYXR0cnMubmdEaWFsb2dDb250cm9sbGVyLFxuICAgICAgICAgICAgICBzY29wZTogbmdEaWFsb2dTY29wZSxcbiAgICAgICAgICAgICAgZGF0YTogYXR0cnMubmdEaWFsb2dEYXRhLFxuICAgICAgICAgICAgICBzaG93Q2xvc2U6IGF0dHJzLm5nRGlhbG9nU2hvd0Nsb3NlID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgICBjbG9zZUJ5RG9jdW1lbnQ6IGF0dHJzLm5nRGlhbG9nQ2xvc2VCeURvY3VtZW50ID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgICBjbG9zZUJ5RXNjYXBlOiBhdHRycy5uZ0RpYWxvZ0Nsb3NlQnlFc2NhcGUgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgXSk7XG5cbn0pKHdpbmRvdywgcmVxdWlyZSgnYW5ndWxhcicpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb2R1bGVOYW1lOyIsIm1vZHVsZS5leHBvcnRzID0gWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdBdXRoZW50aWNhdG9yJyxcbiAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoZW50aWNhdG9yKSB7XG4gICAgJHJvb3RTY29wZS5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQXV0aGVudGljYXRvci5nZXRVc2VyKCk7XG4gICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3RhcnRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgIHZhciB1c2VyVHlwZSA9ICdHdWVzdCc7XG5cbiAgICAgIGlmIChBdXRoZW50aWNhdG9yLmdldFVzZXIoKSkgdXNlclR5cGUgPSBBdXRoZW50aWNhdG9yLmdldFVzZXIoKS5UeXBlO1xuXG4gICAgICB2YXIgYWxsb3dlZCA9ICEodG9TdGF0ZS5hbGxvdyBpbnN0YW5jZW9mIEFycmF5KSB8fCB0b1N0YXRlLmFsbG93LmluZGV4T2YodXNlclR5cGUpICE9PSAtMTtcblxuICAgICAgLy8gQ2hlY2sgdXNlciBpcyBhdXRoZW50aWNhdGVkLi4uXG4gICAgICBpZiAoIWFsbG93ZWQpIHtcbiAgICAgICAgLy8gTG9nIHRoZSBzdGF0ZSB3ZSB3ZXJlIGF0dGVwdGluZyB0byBhY2Nlc3NcbiAgICAgICAgdG9QYXJhbXMuYXR0ZW1wdGVkU3RhdGVQYXJhbXMgPSBlbmNvZGVVUkkoYnRvYShKU09OLnN0cmluZ2lmeSh0b1BhcmFtcykpKTtcbiAgICAgICAgdG9QYXJhbXMuYXR0ZW1wdGVkU3RhdGVOYW1lID0gdG9TdGF0ZS5uYW1lO1xuXG4gICAgICAgIC8vIEdvIHRvIHRoZSBzaWduaW4gc3RhdGUgKGxvZ2luIHZpZXcpXG4gICAgICAgICRzdGF0ZS5nbyhcImF1dGguc2lnbi1pblwiLCB0b1BhcmFtcyk7XG5cbiAgICAgICAgLy8gRG9uJ3QgZG8gdGhlIHRoaW5nIHdlIHdlcmUgZ29pbmcgdG8gZG9cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFwcC13aWRlIGFjY2Vzc2libGUgbWV0aG9kIGZvciBzaWduaW5nIG91dFxuICAgICRyb290U2NvcGUuc2lnbk91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgQXV0aGVudGljYXRvci5zaWduT3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkc3RhdGUuZ28oJ2Rhc2hib2FyZCcpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFsnJHJvb3RTY29wZScsXG4gIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcbiAgICAvLyBJbnZva2VkIHdoZW4gdGhlIGNvdW50IG9mIGEgcGFydGljdWxhciByZWNvcmQgdHlwZSBpcyBkaXNjb3ZlcmVkXG4gICAgJHJvb3RTY29wZS4kb24oXCJpdGVtQ291bnREaXNjb3ZlcmVkXCIsIGZ1bmN0aW9uKGUsIHR5cGUsIGNvdW50KSB7XG4gICAgICAkcm9vdFNjb3BlLml0ZW1Db3VudHMgPSAkcm9vdFNjb3BlLml0ZW1Db3VudHMgfHwge307XG5cbiAgICAgICRyb290U2NvcGUuaXRlbUNvdW50c1t0eXBlXSA9IGNvdW50O1xuICAgIH0pO1xuICB9XG5dOyIsIm1vZHVsZS5leHBvcnRzID0gWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdBdXRoZW50aWNhdG9yJyxcbiAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoZW50aWNhdG9yKSB7XG4gICAgJHJvb3RTY29wZS5jYW5WaWV3ID0gZnVuY3Rpb24odGhpbmcpIHtcbiAgICAgIHZhciB1c2VyID0gQXV0aGVudGljYXRvci5nZXRVc2VyKCk7XG5cbiAgICAgIGlmICghdXNlcikgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBpZiAodXNlci5UeXBlID09PSAnQWRtaW4nKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gIH1cbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbJyRyb290U2NvcGUnLCAnJHEnLFxuICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkcSkge1xuICAgICRyb290U2NvcGUuJGVtaXRwID0gZnVuY3Rpb24obmFtZSwgb2JqKSB7XG4gICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgIHRoaXMuJGVtaXQobmFtZSwgb2JqLCBwcm9taXNlcyk7XG4gICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKVxuICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3RwID0gZnVuY3Rpb24obmFtZSwgb2JqKSB7XG4gICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgIHRoaXMuJGJyb2FkY2FzdChuYW1lLCBvYmosIHByb21pc2VzKTtcbiAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpXG4gICAgfTtcbiAgfVxuXTtcbiIsIm1vZHVsZS5leHBvcnRzID0gWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsXG4gIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSkge1xuICAgICRyb290U2NvcGUuZ2V0U3RhdGVDbGFzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRzdGF0ZS5jdXJyZW50Lm5hbWUucmVwbGFjZSgvXFwuL2csICctLScpOyAvLyBSZXBsYWNlIGRvdHMgd2l0aCBoeXBoZW5zXG4gICAgfTtcbiAgfVxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFsnJGh0dHAnLCAnQXV0aEFwaScsXG4gIGZ1bmN0aW9uKCRodHRwLCBBdXRoQXBpKSB7XG4gICAgdmFyIHVzZXIgPSBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB1c2VyICE9PSBudWxsO1xuICAgICAgfSxcbiAgICAgIHNpZ25JbjogZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKSB7XG4gICAgICAgIHJldHVybiBBdXRoQXBpLlNpZ25JbihlbWFpbCwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24ocmVwbHkpIHtcbiAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVBJLUtleSddID0gcmVwbHkuQXBpS2V5O1xuXG4gICAgICAgICAgcmV0dXJuIHVzZXIgPSB7XG4gICAgICAgICAgICBBcGlLZXk6IHJlcGx5LkFwaUtleSxcbiAgICAgICAgICAgIEVtYWlsOiByZXBseS5FbWFpbCxcbiAgICAgICAgICAgIE5hbWU6IHJlcGx5Lk5hbWUsXG4gICAgICAgICAgICBUeXBlOiByZXBseS5UeXBlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgc2lnbk91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXIgPSBudWxsO1xuICAgICAgICBkZWxldGUgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FQSS1LZXknXTtcbiAgICAgIH0sXG4gICAgICBnZXRVc2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFsnJHEnLFxuICBmdW5jdGlvbigkcSkge1xuICAgIGZ1bmN0aW9uIHVwbG9hZEJsb2IoYmxvYiwgZmlsZUlkKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICBpZiAoIShibG9iIGluc3RhbmNlb2YgQmxvYikpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk5vdCBhIGJsb2IhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZmlsZUlkICE9PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gZmlsZSBJRCFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub25sb2FkID0gYWpheFN1Y2Nlc3M7XG4gICAgICB4aHIub25lcnJvciA9IGFqYXhFcnJvcjtcblxuICAgICAgeGhyLm9wZW4oXCJwb3N0XCIsIFwiL3VwbG9hZFwiLCB0cnVlKTtcblxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik7XG5cbiAgICAgIGlmIChibG9iLm5hbWUpIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1VcGxvYWQtRmlsZS1OYW1lXCIsIGJsb2IubmFtZSk7XG4gICAgICBpZiAoZmlsZUlkKSB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtVXBsb2FkLUZpbGUtSURcIiwgZmlsZUlkKTtcblxuICAgICAgeGhyLnNlbmQoYmxvYik7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXG4gICAgICBmdW5jdGlvbiBhamF4U3VjY2VzcygpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWpheEVycm9yKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwbG9hZEJsb2I6IHVwbG9hZEJsb2JcbiAgICB9O1xuICB9XG5dOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtcblxuICBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBndWlkKCkge1xuICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xuICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xuXG4gICAgICBmdW5jdGlvbiBzNCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXG4gICAgICAgICAgLnRvU3RyaW5nKDE2KVxuICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbVBnQXJyYXkocGdBcnJheSkge1xuICAgICAgXy5tYXAocGdBcnJheS5zdWJzdHJpbmcoMSwgcGdBcnJheS5sZW5ndGggLSAyKS5zcGxpdCgnLCcpLCAoaWQpID0+IHBhcnNlSW50KGlkKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9QZ0FycmF5KGFycmF5KSB7XG4gICAgICByZXR1cm4gJ3snICsgYXJyYXkuam9pbignLCcpICsgJ30nO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBndWlkOiBndWlkLFxuICAgICAgZnJvbVBnQXJyYXk6IGZyb21QZ0FycmF5LFxuICAgICAgdG9QZ0FycmF5OiB0b1BnQXJyYXlcbiAgICB9O1xuICB9XG5dOyIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChnbG9iYWwuJHRyYWNldXJSdW50aW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgdmFyICRjcmVhdGUgPSAkT2JqZWN0LmNyZWF0ZTtcbiAgdmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRmcmVlemUgPSAkT2JqZWN0LmZyZWV6ZTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGtleXMgPSAkT2JqZWN0LmtleXM7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSAkT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyICR0b1N0cmluZyA9ICRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgJHByZXZlbnRFeHRlbnNpb25zID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zO1xuICB2YXIgJHNlYWwgPSBPYmplY3Quc2VhbDtcbiAgdmFyICRpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciB0eXBlcyA9IHtcbiAgICB2b2lkOiBmdW5jdGlvbiB2b2lkVHlwZSgpIHt9LFxuICAgIGFueTogZnVuY3Rpb24gYW55KCkge30sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcoKSB7fSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcigpIHt9LFxuICAgIGJvb2xlYW46IGZ1bmN0aW9uIGJvb2xlYW4oKSB7fVxuICB9O1xuICB2YXIgbWV0aG9kID0gbm9uRW51bTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBuZXdVbmlxdWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuICdfXyQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU5KSArICckJyArICsrY291bnRlciArICckX18nO1xuICB9XG4gIHZhciBzeW1ib2xJbnRlcm5hbFByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEYXRhUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbFZhbHVlcyA9ICRjcmVhdGUobnVsbCk7XG4gIHZhciBwcml2YXRlTmFtZXMgPSAkY3JlYXRlKG51bGwpO1xuICBmdW5jdGlvbiBjcmVhdGVQcml2YXRlTmFtZSgpIHtcbiAgICB2YXIgcyA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICAgIHByaXZhdGVOYW1lc1tzXSA9IHRydWU7XG4gICAgcmV0dXJuIHM7XG4gIH1cbiAgZnVuY3Rpb24gaXNTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzeW1ib2wgPT09ICdvYmplY3QnICYmIHN5bWJvbCBpbnN0YW5jZW9mIFN5bWJvbFZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIHR5cGVPZih2KSB7XG4gICAgaWYgKGlzU3ltYm9sKHYpKVxuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIHJldHVybiB0eXBlb2YgdjtcbiAgfVxuICBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgdmFsdWUgPSBuZXcgU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N5bWJvbCBjYW5ub3QgYmUgbmV3XFwnZWQnKTtcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIHZhciBkZXNjID0gc3ltYm9sVmFsdWVbc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eV07XG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZClcbiAgICAgIGRlc2MgPSAnJztcbiAgICByZXR1cm4gJ1N5bWJvbCgnICsgZGVzYyArICcpJztcbiAgfSkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWU7XG4gIH0pKTtcbiAgZnVuY3Rpb24gU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIga2V5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERhdGFQcm9wZXJ0eSwge3ZhbHVlOiB0aGlzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbEludGVybmFsUHJvcGVydHksIHt2YWx1ZToga2V5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHksIHt2YWx1ZTogZGVzY3JpcHRpb259KTtcbiAgICBmcmVlemUodGhpcyk7XG4gICAgc3ltYm9sVmFsdWVzW2tleV0gPSB0aGlzO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZixcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgdmFyIGhhc2hQcm9wZXJ0eSA9IGNyZWF0ZVByaXZhdGVOYW1lKCk7XG4gIHZhciBoYXNoUHJvcGVydHlEZXNjcmlwdG9yID0ge3ZhbHVlOiB1bmRlZmluZWR9O1xuICB2YXIgaGFzaE9iamVjdFByb3BlcnRpZXMgPSB7XG4gICAgaGFzaDoge3ZhbHVlOiB1bmRlZmluZWR9LFxuICAgIHNlbGY6IHt2YWx1ZTogdW5kZWZpbmVkfVxuICB9O1xuICB2YXIgaGFzaENvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBnZXRPd25IYXNoT2JqZWN0KG9iamVjdCkge1xuICAgIHZhciBoYXNoT2JqZWN0ID0gb2JqZWN0W2hhc2hQcm9wZXJ0eV07XG4gICAgaWYgKGhhc2hPYmplY3QgJiYgaGFzaE9iamVjdC5zZWxmID09PSBvYmplY3QpXG4gICAgICByZXR1cm4gaGFzaE9iamVjdDtcbiAgICBpZiAoJGlzRXh0ZW5zaWJsZShvYmplY3QpKSB7XG4gICAgICBoYXNoT2JqZWN0UHJvcGVydGllcy5oYXNoLnZhbHVlID0gaGFzaENvdW50ZXIrKztcbiAgICAgIGhhc2hPYmplY3RQcm9wZXJ0aWVzLnNlbGYudmFsdWUgPSBvYmplY3Q7XG4gICAgICBoYXNoUHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlID0gJGNyZWF0ZShudWxsLCBoYXNoT2JqZWN0UHJvcGVydGllcyk7XG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBoYXNoUHJvcGVydHksIGhhc2hQcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgICAgcmV0dXJuIGhhc2hQcm9wZXJ0eURlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgIGdldE93bkhhc2hPYmplY3Qob2JqZWN0KTtcbiAgICByZXR1cm4gJGZyZWV6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG4gIGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKG9iamVjdCkge1xuICAgIGdldE93bkhhc2hPYmplY3Qob2JqZWN0KTtcbiAgICByZXR1cm4gJHByZXZlbnRFeHRlbnNpb25zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbiAgZnVuY3Rpb24gc2VhbChvYmplY3QpIHtcbiAgICBnZXRPd25IYXNoT2JqZWN0KG9iamVjdCk7XG4gICAgcmV0dXJuICRzZWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbiAgU3ltYm9sLml0ZXJhdG9yID0gU3ltYm9sKCk7XG4gIGZyZWV6ZShTeW1ib2xWYWx1ZS5wcm90b3R5cGUpO1xuICBmdW5jdGlvbiB0b1Byb3BlcnR5KG5hbWUpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpXG4gICAgICByZXR1cm4gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGlmICghc3ltYm9sVmFsdWVzW25hbWVdICYmICFwcml2YXRlTmFtZXNbbmFtZV0pXG4gICAgICAgIHJ2LnB1c2gobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3ltYm9sID0gc3ltYm9sVmFsdWVzW25hbWVzW2ldXTtcbiAgICAgIGlmIChzeW1ib2wpXG4gICAgICAgIHJ2LnB1c2goc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG5hbWUpIHtcbiAgICByZXR1cm4gJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLnRyYWNldXIgJiYgZ2xvYmFsLnRyYWNldXIub3B0aW9uc1tuYW1lXTtcbiAgfVxuICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN5bSxcbiAgICAgICAgZGVzYztcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIHN5bSA9IG5hbWU7XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgaWYgKHN5bSAmJiAoZGVzYyA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSkpXG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7ZW51bWVyYWJsZTogZmFsc2V9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkY3JlYXRlKGRlc2NyaXB0b3IsIHtlbnVtZXJhYmxlOiB7dmFsdWU6IGZhbHNlfX0pO1xuICAgICAgfVxuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoT2JqZWN0KSB7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jywge3ZhbHVlOiBkZWZpbmVQcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eU5hbWVzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdoYXNPd25Qcm9wZXJ0eScsIHt2YWx1ZTogaGFzT3duUHJvcGVydHl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZnJlZXplJywge3ZhbHVlOiBmcmVlemV9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAncHJldmVudEV4dGVuc2lvbnMnLCB7dmFsdWU6IHByZXZlbnRFeHRlbnNpb25zfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ3NlYWwnLCB7dmFsdWU6IHNlYWx9KTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydFN0YXIob2JqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBuYW1lID0gbmFtZXNbal07XG4gICAgICAgIGlmIChwcml2YXRlTmFtZXNbbmFtZV0pXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIChmdW5jdGlvbihtb2QsIG5hbWUpIHtcbiAgICAgICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gbW9kW25hbWVdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoYXJndW1lbnRzW2ldLCBuYW1lc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuICAgIHJldHVybiB4ICE9IG51bGwgJiYgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH1cbiAgZnVuY3Rpb24gdG9PYmplY3QoeCkge1xuICAgIGlmICh4ID09IG51bGwpXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCk7XG4gICAgcmV0dXJuICRPYmplY3QoeCk7XG4gIH1cbiAgZnVuY3Rpb24gYXNzZXJ0T2JqZWN0KHgpIHtcbiAgICBpZiAoIWlzT2JqZWN0KHgpKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcih4ICsgJyBpcyBub3QgYW4gT2JqZWN0Jyk7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgZnVuY3Rpb24gY2hlY2tPYmplY3RDb2VyY2libGUoYXJndW1lbnQpIHtcbiAgICBpZiAoYXJndW1lbnQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVmFsdWUgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhbiBPYmplY3QnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3VtZW50O1xuICB9XG4gIGZ1bmN0aW9uIHNldHVwR2xvYmFscyhnbG9iYWwpIHtcbiAgICBnbG9iYWwuU3ltYm9sID0gU3ltYm9sO1xuICAgIGdsb2JhbC5SZWZsZWN0ID0gZ2xvYmFsLlJlZmxlY3QgfHwge307XG4gICAgZ2xvYmFsLlJlZmxlY3QuZ2xvYmFsID0gZ2xvYmFsLlJlZmxlY3QuZ2xvYmFsIHx8IGdsb2JhbDtcbiAgICBwb2x5ZmlsbE9iamVjdChnbG9iYWwuT2JqZWN0KTtcbiAgfVxuICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgZ2xvYmFsLiR0cmFjZXVyUnVudGltZSA9IHtcbiAgICBhc3NlcnRPYmplY3Q6IGFzc2VydE9iamVjdCxcbiAgICBjcmVhdGVQcml2YXRlTmFtZTogY3JlYXRlUHJpdmF0ZU5hbWUsXG4gICAgZXhwb3J0U3RhcjogZXhwb3J0U3RhcixcbiAgICBnZXRPd25IYXNoT2JqZWN0OiBnZXRPd25IYXNoT2JqZWN0LFxuICAgIHByaXZhdGVOYW1lczogcHJpdmF0ZU5hbWVzLFxuICAgIHNldFByb3BlcnR5OiBzZXRQcm9wZXJ0eSxcbiAgICBzZXR1cEdsb2JhbHM6IHNldHVwR2xvYmFscyxcbiAgICB0b09iamVjdDogdG9PYmplY3QsXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICAgIHRvUHJvcGVydHk6IHRvUHJvcGVydHksXG4gICAgdHlwZTogdHlwZXMsXG4gICAgdHlwZW9mOiB0eXBlT2YsXG4gICAgY2hlY2tPYmplY3RDb2VyY2libGU6IGNoZWNrT2JqZWN0Q29lcmNpYmxlLFxuICAgIGhhc093blByb3BlcnR5OiBmdW5jdGlvbihvLCBwKSB7XG4gICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKTtcbiAgICB9LFxuICAgIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAgIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAgIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAgIGtleXM6ICRrZXlzXG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIGZ1bmN0aW9uIHNwcmVhZCgpIHtcbiAgICB2YXIgcnYgPSBbXSxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIGl0ZXJSZXN1bHQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZVRvU3ByZWFkID0gJHRyYWNldXJSdW50aW1lLmNoZWNrT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50c1tpXSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlVG9TcHJlYWRbJHRyYWNldXJSdW50aW1lLnRvUHJvcGVydHkoU3ltYm9sLml0ZXJhdG9yKV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IHNwcmVhZCBub24taXRlcmFibGUgb2JqZWN0LicpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXIgPSB2YWx1ZVRvU3ByZWFkWyR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KFN5bWJvbC5pdGVyYXRvcildKCk7XG4gICAgICB3aGlsZSAoIShpdGVyUmVzdWx0ID0gaXRlci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgcnZbaisrXSA9IGl0ZXJSZXN1bHQudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuc3ByZWFkID0gc3ByZWFkO1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgdmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4gIHZhciAkY3JlYXRlID0gJE9iamVjdC5jcmVhdGU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICR0cmFjZXVyUnVudGltZS5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJHRyYWNldXJSdW50aW1lLmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICBmdW5jdGlvbiBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBwcm90byA9ICRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KTtcbiAgICBkbyB7XG4gICAgICB2YXIgcmVzdWx0ID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gICAgICBpZiAocmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgcHJvdG8gPSAkZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH0gd2hpbGUgKHByb3RvKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgcmV0dXJuIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKCFkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlclNldChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHNlbGYsIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBzZXR0ZXIgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge30sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgZGVzY3JpcHRvcnNbbmFtZV0gPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9ycztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBvYmplY3QsIHN0YXRpY09iamVjdCwgc3VwZXJDbGFzcykge1xuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMykge1xuICAgICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjdG9yLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9ICRjcmVhdGUoZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcyksIGdldERlc2NyaXB0b3JzKG9iamVjdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG9iamVjdDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KGN0b3IsICdwcm90b3R5cGUnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0aWVzKGN0b3IsIGdldERlc2NyaXB0b3JzKHN0YXRpY09iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICAgIGlmICgkT2JqZWN0KHByb3RvdHlwZSkgPT09IHByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICAgIHRocm93IG5ldyAkVHlwZUVycm9yKCdzdXBlciBwcm90b3R5cGUgbXVzdCBiZSBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICBpZiAoc3VwZXJDbGFzcyA9PT0gbnVsbClcbiAgICAgIHJldHVybiBudWxsO1xuICAgIHRocm93IG5ldyAkVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbicpO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmF1bHRTdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgYXJncykge1xuICAgIGlmICgkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCkgIT09IG51bGwpXG4gICAgICBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgJ2NvbnN0cnVjdG9yJywgYXJncyk7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzID0gY3JlYXRlQ2xhc3M7XG4gICR0cmFjZXVyUnVudGltZS5kZWZhdWx0U3VwZXJDYWxsID0gZGVmYXVsdFN1cGVyQ2FsbDtcbiAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ2FsbCA9IHN1cGVyQ2FsbDtcbiAgJHRyYWNldXJSdW50aW1lLnN1cGVyR2V0ID0gc3VwZXJHZXQ7XG4gICR0cmFjZXVyUnVudGltZS5zdXBlclNldCA9IHN1cGVyU2V0O1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgY3JlYXRlUHJpdmF0ZU5hbWUgPSAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlUHJpdmF0ZU5hbWU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICR0cmFjZXVyUnVudGltZS5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJHRyYWNldXJSdW50aW1lLmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciBTVF9ORVdCT1JOID0gMDtcbiAgdmFyIFNUX0VYRUNVVElORyA9IDE7XG4gIHZhciBTVF9TVVNQRU5ERUQgPSAyO1xuICB2YXIgU1RfQ0xPU0VEID0gMztcbiAgdmFyIEVORF9TVEFURSA9IC0yO1xuICB2YXIgUkVUSFJPV19TVEFURSA9IC0zO1xuICBmdW5jdGlvbiBnZXRJbnRlcm5hbEVycm9yKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignVHJhY2V1ciBjb21waWxlciBidWc6IGludmFsaWQgc3RhdGUgaW4gc3RhdGUgbWFjaGluZTogJyArIHN0YXRlKTtcbiAgfVxuICBmdW5jdGlvbiBHZW5lcmF0b3JDb250ZXh0KCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuR1N0YXRlID0gU1RfTkVXQk9STjtcbiAgICB0aGlzLnN0b3JlZEV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsbHlGYWxsVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlbnRfID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50cnlTdGFja18gPSBbXTtcbiAgfVxuICBHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBwdXNoVHJ5OiBmdW5jdGlvbihjYXRjaFN0YXRlLCBmaW5hbGx5U3RhdGUpIHtcbiAgICAgIGlmIChmaW5hbGx5U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZpbmFsbHlGYWxsVGhyb3VnaCA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeVN0YWNrXy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSB0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxseUZhbGxUaHJvdWdoID09PSBudWxsKVxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IFJFVEhST1dfU1RBVEU7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe1xuICAgICAgICAgIGZpbmFsbHk6IGZpbmFsbHlTdGF0ZSxcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2g6IGZpbmFsbHlGYWxsVGhyb3VnaFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXRjaFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe2NhdGNoOiBjYXRjaFN0YXRlfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BUcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cnlTdGFja18ucG9wKCk7XG4gICAgfSxcbiAgICBnZXQgc2VudCgpIHtcbiAgICAgIHRoaXMubWF5YmVUaHJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBzZXQgc2VudCh2KSB7XG4gICAgICB0aGlzLnNlbnRfID0gdjtcbiAgICB9LFxuICAgIGdldCBzZW50SWdub3JlVGhyb3coKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIG1heWJlVGhyb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gJ25leHQnO1xuICAgICAgICB0aHJvdyB0aGlzLnNlbnRfO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICAgIHRocm93IHRoaXMuc3RvcmVkRXhjZXB0aW9uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVFeGNlcHRpb246IGZ1bmN0aW9uKGV4KSB7XG4gICAgICB0aGlzLkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgIHRoaXMuc3RhdGUgPSBFTkRfU1RBVEU7XG4gICAgICB0aHJvdyBleDtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIG5leHRPclRocm93KGN0eCwgbW92ZU5leHQsIGFjdGlvbiwgeCkge1xuICAgIHN3aXRjaCAoY3R4LkdTdGF0ZSkge1xuICAgICAgY2FzZSBTVF9FWEVDVVRJTkc6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gZXhlY3V0aW5nIGdlbmVyYXRvclwiKSk7XG4gICAgICBjYXNlIFNUX0NMT1NFRDpcbiAgICAgICAgaWYgKGFjdGlvbiA9PSAnbmV4dCcpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRocm93IHg7XG4gICAgICBjYXNlIFNUX05FV0JPUk46XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgIHRocm93IHg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aHJvdyAkVHlwZUVycm9yKCdTZW50IHZhbHVlIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yJyk7XG4gICAgICBjYXNlIFNUX1NVU1BFTkRFRDpcbiAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0VYRUNVVElORztcbiAgICAgICAgY3R4LmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgY3R4LnNlbnQgPSB4O1xuICAgICAgICB2YXIgdmFsdWUgPSBtb3ZlTmV4dChjdHgpO1xuICAgICAgICB2YXIgZG9uZSA9IHZhbHVlID09PSBjdHg7XG4gICAgICAgIGlmIChkb25lKVxuICAgICAgICAgIHZhbHVlID0gY3R4LnJldHVyblZhbHVlO1xuICAgICAgICBjdHguR1N0YXRlID0gZG9uZSA/IFNUX0NMT1NFRCA6IFNUX1NVU1BFTkRFRDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgZG9uZTogZG9uZVxuICAgICAgICB9O1xuICAgIH1cbiAgfVxuICB2YXIgY3R4TmFtZSA9IGNyZWF0ZVByaXZhdGVOYW1lKCk7XG4gIHZhciBtb3ZlTmV4dE5hbWUgPSBjcmVhdGVQcml2YXRlTmFtZSgpO1xuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICRkZWZpbmVQcm9wZXJ0eShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShHZW5lcmF0b3JGdW5jdGlvbikpO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIG5leHQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHJldHVybiBuZXh0T3JUaHJvdyh0aGlzW2N0eE5hbWVdLCB0aGlzW21vdmVOZXh0TmFtZV0sICduZXh0Jywgdik7XG4gICAgfSxcbiAgICB0aHJvdzogZnVuY3Rpb24odikge1xuICAgICAgcmV0dXJuIG5leHRPclRocm93KHRoaXNbY3R4TmFtZV0sIHRoaXNbbW92ZU5leHROYW1lXSwgJ3Rocm93Jywgdik7XG4gICAgfVxuICB9O1xuICAkZGVmaW5lUHJvcGVydGllcyhHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge2VudW1lcmFibGU6IGZhbHNlfSxcbiAgICBuZXh0OiB7ZW51bWVyYWJsZTogZmFsc2V9LFxuICAgIHRocm93OiB7ZW51bWVyYWJsZTogZmFsc2V9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIG5vbkVudW0oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pKTtcbiAgZnVuY3Rpb24gY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UoaW5uZXJGdW5jdGlvbiwgZnVuY3Rpb25PYmplY3QsIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEdlbmVyYXRvckNvbnRleHQoKTtcbiAgICB2YXIgb2JqZWN0ID0gJGNyZWF0ZShmdW5jdGlvbk9iamVjdC5wcm90b3R5cGUpO1xuICAgIG9iamVjdFtjdHhOYW1lXSA9IGN0eDtcbiAgICBvYmplY3RbbW92ZU5leHROYW1lXSA9IG1vdmVOZXh0O1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uT2JqZWN0KSB7XG4gICAgZnVuY3Rpb25PYmplY3QucHJvdG90eXBlID0gJGNyZWF0ZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUpO1xuICAgIGZ1bmN0aW9uT2JqZWN0Ll9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIHJldHVybiBmdW5jdGlvbk9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uQ29udGV4dCgpIHtcbiAgICBHZW5lcmF0b3JDb250ZXh0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5lcnIgPSB1bmRlZmluZWQ7XG4gICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgY3R4LnJlc3VsdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY3R4LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgY3R4LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUgPSAkY3JlYXRlKEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlKTtcbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgIHRoaXMucmVzb2x2ZSh0aGlzLnJldHVyblZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgIHRoaXMucmVqZWN0KHRoaXMuc3RvcmVkRXhjZXB0aW9uKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnJlamVjdChnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpKTtcbiAgICB9XG4gIH07XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5oYW5kbGVFeGNlcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXRlID0gUkVUSFJPV19TVEFURTtcbiAgfTtcbiAgZnVuY3Rpb24gYXN5bmNXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEFzeW5jRnVuY3Rpb25Db250ZXh0KCk7XG4gICAgY3R4LmNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgY3R4LmVycmJhY2sgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGhhbmRsZUNhdGNoKGN0eCwgZXJyKTtcbiAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgfTtcbiAgICBtb3ZlTmV4dChjdHgpO1xuICAgIHJldHVybiBjdHgucmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBpbm5lckZ1bmN0aW9uLmNhbGwoc2VsZiwgY3R4KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBoYW5kbGVDYXRjaChjdHgsIGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2F0Y2goY3R4LCBleCkge1xuICAgIGN0eC5zdG9yZWRFeGNlcHRpb24gPSBleDtcbiAgICB2YXIgbGFzdCA9IGN0eC50cnlTdGFja19bY3R4LnRyeVN0YWNrXy5sZW5ndGggLSAxXTtcbiAgICBpZiAoIWxhc3QpIHtcbiAgICAgIGN0eC5oYW5kbGVFeGNlcHRpb24oZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjdHguc3RhdGUgPSBsYXN0LmNhdGNoICE9PSB1bmRlZmluZWQgPyBsYXN0LmNhdGNoIDogbGFzdC5maW5hbGx5O1xuICAgIGlmIChsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaCAhPT0gdW5kZWZpbmVkKVxuICAgICAgY3R4LmZpbmFsbHlGYWxsVGhyb3VnaCA9IGxhc3QuZmluYWxseUZhbGxUaHJvdWdoO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5hc3luY1dyYXAgPSBhc3luY1dyYXA7XG4gICR0cmFjZXVyUnVudGltZS5pbml0R2VuZXJhdG9yRnVuY3Rpb24gPSBpbml0R2VuZXJhdG9yRnVuY3Rpb247XG4gICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZSA9IGNyZWF0ZUdlbmVyYXRvckluc3RhbmNlO1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKG9wdF9zY2hlbWUsIG9wdF91c2VySW5mbywgb3B0X2RvbWFpbiwgb3B0X3BvcnQsIG9wdF9wYXRoLCBvcHRfcXVlcnlEYXRhLCBvcHRfZnJhZ21lbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgaWYgKG9wdF9zY2hlbWUpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9zY2hlbWUsICc6Jyk7XG4gICAgfVxuICAgIGlmIChvcHRfZG9tYWluKSB7XG4gICAgICBvdXQucHVzaCgnLy8nKTtcbiAgICAgIGlmIChvcHRfdXNlckluZm8pIHtcbiAgICAgICAgb3V0LnB1c2gob3B0X3VzZXJJbmZvLCAnQCcpO1xuICAgICAgfVxuICAgICAgb3V0LnB1c2gob3B0X2RvbWFpbik7XG4gICAgICBpZiAob3B0X3BvcnQpIHtcbiAgICAgICAgb3V0LnB1c2goJzonLCBvcHRfcG9ydCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRfcGF0aCkge1xuICAgICAgb3V0LnB1c2gob3B0X3BhdGgpO1xuICAgIH1cbiAgICBpZiAob3B0X3F1ZXJ5RGF0YSkge1xuICAgICAgb3V0LnB1c2goJz8nLCBvcHRfcXVlcnlEYXRhKTtcbiAgICB9XG4gICAgaWYgKG9wdF9mcmFnbWVudCkge1xuICAgICAgb3V0LnB1c2goJyMnLCBvcHRfZnJhZ21lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICB9XG4gIDtcbiAgdmFyIHNwbGl0UmUgPSBuZXcgUmVnRXhwKCdeJyArICcoPzonICsgJyhbXjovPyMuXSspJyArICc6KT8nICsgJyg/Oi8vJyArICcoPzooW14vPyNdKilAKT8nICsgJyhbXFxcXHdcXFxcZFxcXFwtXFxcXHUwMTAwLVxcXFx1ZmZmZi4lXSopJyArICcoPzo6KFswLTldKykpPycgKyAnKT8nICsgJyhbXj8jXSspPycgKyAnKD86XFxcXD8oW14jXSopKT8nICsgJyg/OiMoLiopKT8nICsgJyQnKTtcbiAgdmFyIENvbXBvbmVudEluZGV4ID0ge1xuICAgIFNDSEVNRTogMSxcbiAgICBVU0VSX0lORk86IDIsXG4gICAgRE9NQUlOOiAzLFxuICAgIFBPUlQ6IDQsXG4gICAgUEFUSDogNSxcbiAgICBRVUVSWV9EQVRBOiA2LFxuICAgIEZSQUdNRU5UOiA3XG4gIH07XG4gIGZ1bmN0aW9uIHNwbGl0KHVyaSkge1xuICAgIHJldHVybiAodXJpLm1hdGNoKHNwbGl0UmUpKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcvJylcbiAgICAgIHJldHVybiAnLyc7XG4gICAgdmFyIGxlYWRpbmdTbGFzaCA9IHBhdGhbMF0gPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gcGF0aC5zbGljZSgtMSkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHVwID0gMDtcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzZWdtZW50cy5sZW5ndGg7IHBvcysrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW3Bvc107XG4gICAgICBzd2l0Y2ggKHNlZ21lbnQpIHtcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aClcbiAgICAgICAgICAgIG91dC5wb3AoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG91dC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlYWRpbmdTbGFzaCkge1xuICAgICAgd2hpbGUgKHVwLS0gPiAwKSB7XG4gICAgICAgIG91dC51bnNoaWZ0KCcuLicpO1xuICAgICAgfVxuICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgIG91dC5wdXNoKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nU2xhc2ggKyBvdXQuam9pbignLycpICsgdHJhaWxpbmdTbGFzaDtcbiAgfVxuICBmdW5jdGlvbiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cykge1xuICAgIHZhciBwYXRoID0gcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gfHwgJyc7XG4gICAgcGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlVTRVJfSU5GT10sIHBhcnRzW0NvbXBvbmVudEluZGV4LkRPTUFJTl0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBPUlRdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUVVFUllfREFUQV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LkZSQUdNRU5UXSk7XG4gIH1cbiAgZnVuY3Rpb24gY2Fub25pY2FsaXplVXJsKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgdmFyIGJhc2VQYXJ0cyA9IHNwbGl0KGJhc2UpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBDb21wb25lbnRJbmRleC5TQ0hFTUU7IGkgPD0gQ29tcG9uZW50SW5kZXguUE9SVDsgaSsrKSB7XG4gICAgICBpZiAoIXBhcnRzW2ldKSB7XG4gICAgICAgIHBhcnRzW2ldID0gYmFzZVBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF1bMF0gPT0gJy8nKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICB2YXIgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKSArIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIGlzQWJzb2x1dGUobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy8nKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQobmFtZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNhbm9uaWNhbGl6ZVVybCA9IGNhbm9uaWNhbGl6ZVVybDtcbiAgJHRyYWNldXJSdW50aW1lLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlO1xuICAkdHJhY2V1clJ1bnRpbWUucmVtb3ZlRG90U2VnbWVudHMgPSByZW1vdmVEb3RTZWdtZW50cztcbiAgJHRyYWNldXJSdW50aW1lLnJlc29sdmVVcmwgPSByZXNvbHZlVXJsO1xufSkoKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJF9fMiA9ICR0cmFjZXVyUnVudGltZS5hc3NlcnRPYmplY3QoJHRyYWNldXJSdW50aW1lKSxcbiAgICAgIGNhbm9uaWNhbGl6ZVVybCA9ICRfXzIuY2Fub25pY2FsaXplVXJsLFxuICAgICAgcmVzb2x2ZVVybCA9ICRfXzIucmVzb2x2ZVVybCxcbiAgICAgIGlzQWJzb2x1dGUgPSAkX18yLmlzQWJzb2x1dGU7XG4gIHZhciBtb2R1bGVJbnN0YW50aWF0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGJhc2VVUkw7XG4gIGlmIChnbG9iYWwubG9jYXRpb24gJiYgZ2xvYmFsLmxvY2F0aW9uLmhyZWYpXG4gICAgYmFzZVVSTCA9IHJlc29sdmVVcmwoZ2xvYmFsLmxvY2F0aW9uLmhyZWYsICcuLycpO1xuICBlbHNlXG4gICAgYmFzZVVSTCA9ICcnO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVFbnRyeSA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlRW50cnkodXJsLCB1bmNvYXRlZE1vZHVsZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudmFsdWVfID0gdW5jb2F0ZWRNb2R1bGU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlRW50cnksIHt9LCB7fSk7XG4gIHZhciBNb2R1bGVFdmFsdWF0aW9uRXJyb3IgPSBmdW5jdGlvbiBNb2R1bGVFdmFsdWF0aW9uRXJyb3IoZXJyb25lb3VzTW9kdWxlTmFtZSwgY2F1c2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAoY2F1c2UgPyAnOiBcXCcnICsgY2F1c2UgKyAnXFwnJyA6ICcnKSArICcgaW4gJyArIGVycm9uZW91c01vZHVsZU5hbWU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKE1vZHVsZUV2YWx1YXRpb25FcnJvciwge2xvYWRlZEJ5OiBmdW5jdGlvbihtb2R1bGVOYW1lKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgKz0gJ1xcbiBsb2FkZWQgYnkgJyArIG1vZHVsZU5hbWU7XG4gICAgfX0sIHt9LCBFcnJvcik7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKHVybCwgZnVuYykge1xuICAgICR0cmFjZXVyUnVudGltZS5zdXBlckNhbGwodGhpcywgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBbdXJsLCBudWxsXSk7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgfTtcbiAgdmFyICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yO1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciwge2dldFVuY29hdGVkTW9kdWxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlXylcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfID0gdGhpcy5mdW5jLmNhbGwoZ2xvYmFsKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGlmIChleCBpbnN0YW5jZW9mIE1vZHVsZUV2YWx1YXRpb25FcnJvcikge1xuICAgICAgICAgIGV4LmxvYWRlZEJ5KHRoaXMudXJsKTtcbiAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgTW9kdWxlRXZhbHVhdGlvbkVycm9yKHRoaXMudXJsLCBleCk7XG4gICAgICB9XG4gICAgfX0sIHt9LCBVbmNvYXRlZE1vZHVsZUVudHJ5KTtcbiAgZnVuY3Rpb24gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybjtcbiAgICB2YXIgdXJsID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgIHJldHVybiBtb2R1bGVJbnN0YW50aWF0b3JzW3VybF07XG4gIH1cbiAgO1xuICB2YXIgbW9kdWxlSW5zdGFuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpdmVNb2R1bGVTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBNb2R1bGUodW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB2YXIgaXNMaXZlID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBjb2F0ZWRNb2R1bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHVuY29hdGVkTW9kdWxlKS5mb3JFYWNoKChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZ2V0dGVyLFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgaWYgKGlzTGl2ZSA9PT0gbGl2ZU1vZHVsZVNlbnRpbmVsKSB7XG4gICAgICAgIHZhciBkZXNjciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodW5jb2F0ZWRNb2R1bGUsIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3IuZ2V0KVxuICAgICAgICAgIGdldHRlciA9IGRlc2NyLmdldDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0dGVyKSB7XG4gICAgICAgIHZhbHVlID0gdW5jb2F0ZWRNb2R1bGVbbmFtZV07XG4gICAgICAgIGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb2F0ZWRNb2R1bGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29hdGVkTW9kdWxlKTtcbiAgICByZXR1cm4gY29hdGVkTW9kdWxlO1xuICB9XG4gIHZhciBNb2R1bGVTdG9yZSA9IHtcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uKG5hbWUsIHJlZmVyZXJOYW1lLCByZWZlcmVyQWRkcmVzcykge1xuICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibW9kdWxlIG5hbWUgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIG5hbWUpO1xuICAgICAgaWYgKGlzQWJzb2x1dGUobmFtZSkpXG4gICAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgICBpZiAoL1teXFwuXVxcL1xcLlxcLlxcLy8udGVzdChuYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZHVsZSBuYW1lIGVtYmVkcyAvLi4vOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZVswXSA9PT0gJy4nICYmIHJlZmVyZXJOYW1lKVxuICAgICAgICByZXR1cm4gcmVzb2x2ZVVybChyZWZlcmVyTmFtZSwgbmFtZSk7XG4gICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSkge1xuICAgICAgdmFyIG0gPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSk7XG4gICAgICBpZiAoIW0pXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB2YXIgbW9kdWxlSW5zdGFuY2UgPSBtb2R1bGVJbnN0YW5jZXNbbS51cmxdO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbmNlKVxuICAgICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2U7XG4gICAgICBtb2R1bGVJbnN0YW5jZSA9IE1vZHVsZShtLmdldFVuY29hdGVkTW9kdWxlKCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2VzW20udXJsXSA9IG1vZHVsZUluc3RhbmNlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSwgbW9kdWxlKSB7XG4gICAgICBub3JtYWxpemVkTmFtZSA9IFN0cmluZyhub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgfSkpO1xuICAgICAgbW9kdWxlSW5zdGFuY2VzW25vcm1hbGl6ZWROYW1lXSA9IG1vZHVsZTtcbiAgICB9LFxuICAgIGdldCBiYXNlVVJMKCkge1xuICAgICAgcmV0dXJuIGJhc2VVUkw7XG4gICAgfSxcbiAgICBzZXQgYmFzZVVSTCh2KSB7XG4gICAgICBiYXNlVVJMID0gU3RyaW5nKHYpO1xuICAgIH0sXG4gICAgcmVnaXN0ZXJNb2R1bGU6IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcbiAgICAgIHZhciBub3JtYWxpemVkTmFtZSA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkdXBsaWNhdGUgbW9kdWxlIG5hbWVkICcgKyBub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgZnVuYyk7XG4gICAgfSxcbiAgICBidW5kbGVTdG9yZTogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24obmFtZSwgZGVwcywgZnVuYykge1xuICAgICAgaWYgKCFkZXBzIHx8ICFkZXBzLmxlbmd0aCAmJiAhZnVuYy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuYW1lLCBmdW5jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYnVuZGxlU3RvcmVbbmFtZV0gPSB7XG4gICAgICAgICAgZGVwczogZGVwcyxcbiAgICAgICAgICBleGVjdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkX18wID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgdmFyIGRlcE1hcCA9IHt9O1xuICAgICAgICAgICAgZGVwcy5mb3JFYWNoKChmdW5jdGlvbihkZXAsIGluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXBNYXBbZGVwXSA9ICRfXzBbaW5kZXhdO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdmFyIHJlZ2lzdHJ5RW50cnkgPSBmdW5jLmNhbGwodGhpcywgZGVwTWFwKTtcbiAgICAgICAgICAgIHJlZ2lzdHJ5RW50cnkuZXhlY3V0ZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJ5RW50cnkuZXhwb3J0cztcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBbm9ueW1vdXNNb2R1bGU6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kdWxlKGZ1bmMuY2FsbChnbG9iYWwpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgIH0sXG4gICAgZ2V0Rm9yVGVzdGluZzogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyICRfXzAgPSB0aGlzO1xuICAgICAgaWYgKCF0aGlzLnRlc3RpbmdQcmVmaXhfKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1vZHVsZUluc3RhbmNlcykuc29tZSgoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgdmFyIG0gPSAvKHRyYWNldXJAW15cXC9dKlxcLykvLmV4ZWMoa2V5KTtcbiAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgJF9fMC50ZXN0aW5nUHJlZml4XyA9IG1bMV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLnRlc3RpbmdQcmVmaXhfICsgbmFtZSk7XG4gICAgfVxuICB9O1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlJywgbmV3IE1vZHVsZSh7TW9kdWxlU3RvcmU6IE1vZHVsZVN0b3JlfSkpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuTW9kdWxlU3RvcmUgPSBNb2R1bGVTdG9yZTtcbiAgZ2xvYmFsLlN5c3RlbSA9IHtcbiAgICByZWdpc3RlcjogTW9kdWxlU3RvcmUucmVnaXN0ZXIuYmluZChNb2R1bGVTdG9yZSksXG4gICAgZ2V0OiBNb2R1bGVTdG9yZS5nZXQsXG4gICAgc2V0OiBNb2R1bGVTdG9yZS5zZXQsXG4gICAgbm9ybWFsaXplOiBNb2R1bGVTdG9yZS5ub3JtYWxpemVcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLmdldE1vZHVsZUltcGwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGluc3RhbnRpYXRvciA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpO1xuICAgIHJldHVybiBpbnN0YW50aWF0b3IgJiYgaW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlKCk7XG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIjtcbiAgdmFyICRjZWlsID0gTWF0aC5jZWlsO1xuICB2YXIgJGZsb29yID0gTWF0aC5mbG9vcjtcbiAgdmFyICRpc0Zpbml0ZSA9IGlzRmluaXRlO1xuICB2YXIgJGlzTmFOID0gaXNOYU47XG4gIHZhciAkcG93ID0gTWF0aC5wb3c7XG4gIHZhciAkbWluID0gTWF0aC5taW47XG4gIHZhciB0b09iamVjdCA9ICR0cmFjZXVyUnVudGltZS50b09iamVjdDtcbiAgZnVuY3Rpb24gdG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4ID4+PiAwO1xuICB9XG4gIGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgICByZXR1cm4geCAmJiAodHlwZW9mIHggPT09ICdvYmplY3QnIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nKTtcbiAgfVxuICBmdW5jdGlvbiBpc0NhbGxhYmxlKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG4gIH1cbiAgZnVuY3Rpb24gaXNOdW1iZXIoeCkge1xuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ251bWJlcic7XG4gIH1cbiAgZnVuY3Rpb24gdG9JbnRlZ2VyKHgpIHtcbiAgICB4ID0gK3g7XG4gICAgaWYgKCRpc05hTih4KSlcbiAgICAgIHJldHVybiAwO1xuICAgIGlmICh4ID09PSAwIHx8ICEkaXNGaW5pdGUoeCkpXG4gICAgICByZXR1cm4geDtcbiAgICByZXR1cm4geCA+IDAgPyAkZmxvb3IoeCkgOiAkY2VpbCh4KTtcbiAgfVxuICB2YXIgTUFYX1NBRkVfTEVOR1RIID0gJHBvdygyLCA1MykgLSAxO1xuICBmdW5jdGlvbiB0b0xlbmd0aCh4KSB7XG4gICAgdmFyIGxlbiA9IHRvSW50ZWdlcih4KTtcbiAgICByZXR1cm4gbGVuIDwgMCA/IDAgOiAkbWluKGxlbiwgTUFYX1NBRkVfTEVOR1RIKTtcbiAgfVxuICBmdW5jdGlvbiBjaGVja0l0ZXJhYmxlKHgpIHtcbiAgICByZXR1cm4gIWlzT2JqZWN0KHgpID8gdW5kZWZpbmVkIDogeFtTeW1ib2wuaXRlcmF0b3JdO1xuICB9XG4gIGZ1bmN0aW9uIGlzQ29uc3RydWN0b3IoeCkge1xuICAgIHJldHVybiBpc0NhbGxhYmxlKHgpO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHZhbHVlLCBkb25lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGRvbmU6IGRvbmVcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHRvT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRvT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IHRvVWludDMyKCkge1xuICAgICAgcmV0dXJuIHRvVWludDMyO1xuICAgIH0sXG4gICAgZ2V0IGlzT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIGlzT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IGlzQ2FsbGFibGUoKSB7XG4gICAgICByZXR1cm4gaXNDYWxsYWJsZTtcbiAgICB9LFxuICAgIGdldCBpc051bWJlcigpIHtcbiAgICAgIHJldHVybiBpc051bWJlcjtcbiAgICB9LFxuICAgIGdldCB0b0ludGVnZXIoKSB7XG4gICAgICByZXR1cm4gdG9JbnRlZ2VyO1xuICAgIH0sXG4gICAgZ2V0IHRvTGVuZ3RoKCkge1xuICAgICAgcmV0dXJuIHRvTGVuZ3RoO1xuICAgIH0sXG4gICAgZ2V0IGNoZWNrSXRlcmFibGUoKSB7XG4gICAgICByZXR1cm4gY2hlY2tJdGVyYWJsZTtcbiAgICB9LFxuICAgIGdldCBpc0NvbnN0cnVjdG9yKCkge1xuICAgICAgcmV0dXJuIGlzQ29uc3RydWN0b3I7XG4gICAgfSxcbiAgICBnZXQgY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoKSB7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3Q7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheVwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheVwiO1xuICB2YXIgJF9fMyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiKSxcbiAgICAgIGlzQ2FsbGFibGUgPSAkX18zLmlzQ2FsbGFibGUsXG4gICAgICBpc0NvbnN0cnVjdG9yID0gJF9fMy5pc0NvbnN0cnVjdG9yLFxuICAgICAgY2hlY2tJdGVyYWJsZSA9ICRfXzMuY2hlY2tJdGVyYWJsZSxcbiAgICAgIHRvSW50ZWdlciA9ICRfXzMudG9JbnRlZ2VyLFxuICAgICAgdG9MZW5ndGggPSAkX18zLnRvTGVuZ3RoLFxuICAgICAgdG9PYmplY3QgPSAkX18zLnRvT2JqZWN0O1xuICBmdW5jdGlvbiBmcm9tKGFyckxpa2UpIHtcbiAgICB2YXIgbWFwRm4gPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBpdGVtcyA9IHRvT2JqZWN0KGFyckxpa2UpO1xuICAgIHZhciBtYXBwaW5nID0gbWFwRm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgayA9IDA7XG4gICAgdmFyIGFycixcbiAgICAgICAgbGVuO1xuICAgIGlmIChtYXBwaW5nICYmICFpc0NhbGxhYmxlKG1hcEZuKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChjaGVja0l0ZXJhYmxlKGl0ZW1zKSkge1xuICAgICAgYXJyID0gaXNDb25zdHJ1Y3RvcihDKSA/IG5ldyBDKCkgOiBbXTtcbiAgICAgIGZvciAodmFyICRfXzQgPSBpdGVtc1tTeW1ib2wuaXRlcmF0b3JdKCksXG4gICAgICAgICAgJF9fNTsgISgkX181ID0gJF9fNC5uZXh0KCkpLmRvbmU7ICkge1xuICAgICAgICB2YXIgaXRlbSA9ICRfXzUudmFsdWU7XG4gICAgICAgIHtcbiAgICAgICAgICBpZiAobWFwcGluZykge1xuICAgICAgICAgICAgYXJyW2tdID0gbWFwRm4uY2FsbCh0aGlzQXJnLCBpdGVtLCBrKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyW2tdID0gaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcnIubGVuZ3RoID0gaztcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICAgIGxlbiA9IHRvTGVuZ3RoKGl0ZW1zLmxlbmd0aCk7XG4gICAgYXJyID0gaXNDb25zdHJ1Y3RvcihDKSA/IG5ldyBDKGxlbikgOiBuZXcgQXJyYXkobGVuKTtcbiAgICBmb3IgKDsgayA8IGxlbjsgaysrKSB7XG4gICAgICBpZiAobWFwcGluZykge1xuICAgICAgICBhcnJba10gPSB0eXBlb2YgdGhpc0FyZyA9PT0gJ3VuZGVmaW5lZCcgPyBtYXBGbihpdGVtc1trXSwgaykgOiBtYXBGbi5jYWxsKHRoaXNBcmcsIGl0ZW1zW2tdLCBrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycltrXSA9IGl0ZW1zW2tdO1xuICAgICAgfVxuICAgIH1cbiAgICBhcnIubGVuZ3RoID0gbGVuO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gZmlsbCh2YWx1ZSkge1xuICAgIHZhciBzdGFydCA9IGFyZ3VtZW50c1sxXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgIHZhciBlbmQgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChvYmplY3QubGVuZ3RoKTtcbiAgICB2YXIgZmlsbFN0YXJ0ID0gdG9JbnRlZ2VyKHN0YXJ0KTtcbiAgICB2YXIgZmlsbEVuZCA9IGVuZCAhPT0gdW5kZWZpbmVkID8gdG9JbnRlZ2VyKGVuZCkgOiBsZW47XG4gICAgZmlsbFN0YXJ0ID0gZmlsbFN0YXJ0IDwgMCA/IE1hdGgubWF4KGxlbiArIGZpbGxTdGFydCwgMCkgOiBNYXRoLm1pbihmaWxsU3RhcnQsIGxlbik7XG4gICAgZmlsbEVuZCA9IGZpbGxFbmQgPCAwID8gTWF0aC5tYXgobGVuICsgZmlsbEVuZCwgMCkgOiBNYXRoLm1pbihmaWxsRW5kLCBsZW4pO1xuICAgIHdoaWxlIChmaWxsU3RhcnQgPCBmaWxsRW5kKSB7XG4gICAgICBvYmplY3RbZmlsbFN0YXJ0XSA9IHZhbHVlO1xuICAgICAgZmlsbFN0YXJ0Kys7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gZmluZChwcmVkaWNhdGUpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcbiAgICByZXR1cm4gZmluZEhlbHBlcih0aGlzLCBwcmVkaWNhdGUsIHRoaXNBcmcpO1xuICB9XG4gIGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcbiAgICByZXR1cm4gZmluZEhlbHBlcih0aGlzLCBwcmVkaWNhdGUsIHRoaXNBcmcsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGZpbmRIZWxwZXIoc2VsZiwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIHJldHVybkluZGV4ID0gYXJndW1lbnRzWzNdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChzZWxmKTtcbiAgICB2YXIgbGVuID0gdG9MZW5ndGgob2JqZWN0Lmxlbmd0aCk7XG4gICAgaWYgKCFpc0NhbGxhYmxlKHByZWRpY2F0ZSkpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiBvYmplY3QpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2ldO1xuICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIG9iamVjdCkpIHtcbiAgICAgICAgICByZXR1cm4gcmV0dXJuSW5kZXggPyBpIDogdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHVybkluZGV4ID8gLTEgOiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgZnJvbSgpIHtcbiAgICAgIHJldHVybiBmcm9tO1xuICAgIH0sXG4gICAgZ2V0IGZpbGwoKSB7XG4gICAgICByZXR1cm4gZmlsbDtcbiAgICB9LFxuICAgIGdldCBmaW5kKCkge1xuICAgICAgcmV0dXJuIGZpbmQ7XG4gICAgfSxcbiAgICBnZXQgZmluZEluZGV4KCkge1xuICAgICAgcmV0dXJuIGZpbmRJbmRleDtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzg7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIjtcbiAgdmFyICRfXzYgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiksXG4gICAgICB0b09iamVjdCA9ICRfXzYudG9PYmplY3QsXG4gICAgICB0b1VpbnQzMiA9ICRfXzYudG9VaW50MzIsXG4gICAgICBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCA9ICRfXzYuY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3Q7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMgPSAxO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMgPSAyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTID0gMztcbiAgdmFyIEFycmF5SXRlcmF0b3IgPSBmdW5jdGlvbiBBcnJheUl0ZXJhdG9yKCkge307XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKEFycmF5SXRlcmF0b3IsICgkX184ID0ge30sIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX184LCBcIm5leHRcIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRvT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfO1xuICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgaXMgbm90IGFuIEFycmF5SXRlcmF0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfO1xuICAgICAgdmFyIGl0ZW1LaW5kID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXztcbiAgICAgIHZhciBsZW5ndGggPSB0b1VpbnQzMihhcnJheS5sZW5ndGgpO1xuICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IEluZmluaXR5O1xuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gaW5kZXggKyAxO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoYXJyYXlbaW5kZXhdLCBmYWxzZSk7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoW2luZGV4LCBhcnJheVtpbmRleF1dLCBmYWxzZSk7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoaW5kZXgsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fOCwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgJF9fOCksIHt9KTtcbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlJdGVyYXRvcihhcnJheSwga2luZCkge1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChhcnJheSk7XG4gICAgdmFyIGl0ZXJhdG9yID0gbmV3IEFycmF5SXRlcmF0b3I7XG4gICAgaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfID0gb2JqZWN0O1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gMDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfID0ga2luZDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpO1xuICB9XG4gIGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTKTtcbiAgfVxuICBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICByZXR1cm4gZW50cmllcztcbiAgICB9LFxuICAgIGdldCBrZXlzKCkge1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL01hcFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9NYXBcIjtcbiAgdmFyIGlzT2JqZWN0ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIpLmlzT2JqZWN0O1xuICB2YXIgZ2V0T3duSGFzaE9iamVjdCA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25IYXNoT2JqZWN0O1xuICB2YXIgJGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIGRlbGV0ZWRTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBsb29rdXBJbmRleChtYXAsIGtleSkge1xuICAgIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICB2YXIgaGFzaE9iamVjdCA9IGdldE93bkhhc2hPYmplY3Qoa2V5KTtcbiAgICAgIHJldHVybiBoYXNoT2JqZWN0ICYmIG1hcC5vYmplY3RJbmRleF9baGFzaE9iamVjdC5oYXNoXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuIG1hcC5zdHJpbmdJbmRleF9ba2V5XTtcbiAgICByZXR1cm4gbWFwLnByaW1pdGl2ZUluZGV4X1trZXldO1xuICB9XG4gIGZ1bmN0aW9uIGluaXRNYXAobWFwKSB7XG4gICAgbWFwLmVudHJpZXNfID0gW107XG4gICAgbWFwLm9iamVjdEluZGV4XyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbWFwLnN0cmluZ0luZGV4XyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbWFwLnByaW1pdGl2ZUluZGV4XyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbWFwLmRlbGV0ZWRDb3VudF8gPSAwO1xuICB9XG4gIHZhciBNYXAgPSBmdW5jdGlvbiBNYXAoKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gYXJndW1lbnRzWzBdO1xuICAgIGlmICghaXNPYmplY3QodGhpcykpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNYXAgY2FsbGVkIG9uIGluY29tcGF0aWJsZSB0eXBlJyk7XG4gICAgaWYgKCRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdlbnRyaWVzXycpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNYXAgY2FuIG5vdCBiZSByZWVudHJhbnRseSBpbml0aWFsaXNlZCcpO1xuICAgIH1cbiAgICBpbml0TWFwKHRoaXMpO1xuICAgIGlmIChpdGVyYWJsZSAhPT0gbnVsbCAmJiBpdGVyYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKHZhciAkX18xMSA9IGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKSxcbiAgICAgICAgICAkX18xMjsgISgkX18xMiA9ICRfXzExLm5leHQoKSkuZG9uZTsgKSB7XG4gICAgICAgIHZhciAkX18xMyA9ICR0cmFjZXVyUnVudGltZS5hc3NlcnRPYmplY3QoJF9fMTIudmFsdWUpLFxuICAgICAgICAgICAga2V5ID0gJF9fMTNbMF0sXG4gICAgICAgICAgICB2YWx1ZSA9ICRfXzEzWzFdO1xuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKE1hcCwge1xuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW50cmllc18ubGVuZ3RoIC8gMiAtIHRoaXMuZGVsZXRlZENvdW50XztcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgaW5kZXggPSBsb29rdXBJbmRleCh0aGlzLCBrZXkpO1xuICAgICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzLmVudHJpZXNfW2luZGV4ICsgMV07XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHZhciBvYmplY3RNb2RlID0gaXNPYmplY3Qoa2V5KTtcbiAgICAgIHZhciBzdHJpbmdNb2RlID0gdHlwZW9mIGtleSA9PT0gJ3N0cmluZyc7XG4gICAgICB2YXIgaW5kZXggPSBsb29rdXBJbmRleCh0aGlzLCBrZXkpO1xuICAgICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5lbnRyaWVzX1tpbmRleCArIDFdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IHRoaXMuZW50cmllc18ubGVuZ3RoO1xuICAgICAgICB0aGlzLmVudHJpZXNfW2luZGV4XSA9IGtleTtcbiAgICAgICAgdGhpcy5lbnRyaWVzX1tpbmRleCArIDFdID0gdmFsdWU7XG4gICAgICAgIGlmIChvYmplY3RNb2RlKSB7XG4gICAgICAgICAgdmFyIGhhc2hPYmplY3QgPSBnZXRPd25IYXNoT2JqZWN0KGtleSk7XG4gICAgICAgICAgdmFyIGhhc2ggPSBoYXNoT2JqZWN0Lmhhc2g7XG4gICAgICAgICAgdGhpcy5vYmplY3RJbmRleF9baGFzaF0gPSBpbmRleDtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpbmdNb2RlKSB7XG4gICAgICAgICAgdGhpcy5zdHJpbmdJbmRleF9ba2V5XSA9IGluZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJpbWl0aXZlSW5kZXhfW2tleV0gPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGxvb2t1cEluZGV4KHRoaXMsIGtleSkgIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgb2JqZWN0TW9kZSA9IGlzT2JqZWN0KGtleSk7XG4gICAgICB2YXIgc3RyaW5nTW9kZSA9IHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnO1xuICAgICAgdmFyIGluZGV4O1xuICAgICAgdmFyIGhhc2g7XG4gICAgICBpZiAob2JqZWN0TW9kZSkge1xuICAgICAgICB2YXIgaGFzaE9iamVjdCA9IGdldE93bkhhc2hPYmplY3Qoa2V5KTtcbiAgICAgICAgaWYgKGhhc2hPYmplY3QpIHtcbiAgICAgICAgICBpbmRleCA9IHRoaXMub2JqZWN0SW5kZXhfW2hhc2ggPSBoYXNoT2JqZWN0Lmhhc2hdO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLm9iamVjdEluZGV4X1toYXNoXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdHJpbmdNb2RlKSB7XG4gICAgICAgIGluZGV4ID0gdGhpcy5zdHJpbmdJbmRleF9ba2V5XTtcbiAgICAgICAgZGVsZXRlIHRoaXMuc3RyaW5nSW5kZXhfW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IHRoaXMucHJpbWl0aXZlSW5kZXhfW2tleV07XG4gICAgICAgIGRlbGV0ZSB0aGlzLnByaW1pdGl2ZUluZGV4X1trZXldO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5lbnRyaWVzX1tpbmRleF0gPSBkZWxldGVkU2VudGluZWw7XG4gICAgICAgIHRoaXMuZW50cmllc19baW5kZXggKyAxXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kZWxldGVkQ291bnRfKys7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICBpbml0TWFwKHRoaXMpO1xuICAgIH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2tGbikge1xuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG4gICAgICBmb3IgKHZhciBpID0gMCxcbiAgICAgICAgICBsZW4gPSB0aGlzLmVudHJpZXNfLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmVudHJpZXNfW2ldO1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmVudHJpZXNfW2kgKyAxXTtcbiAgICAgICAgaWYgKGtleSA9PT0gZGVsZXRlZFNlbnRpbmVsKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBjYWxsYmFja0ZuLmNhbGwodGhpc0FyZywgdmFsdWUsIGtleSwgdGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbnRyaWVzOiAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uICRfXzE0KCkge1xuICAgICAgdmFyIGksXG4gICAgICAgICAgbGVuLFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIHJldHVybiAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UoZnVuY3Rpb24oJGN0eCkge1xuICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggKCRjdHguc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaSA9IDAsIGxlbiA9IHRoaXMuZW50cmllc18ubGVuZ3RoO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IChpIDwgbGVuKSA/IDggOiAtMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAga2V5ID0gdGhpcy5lbnRyaWVzX1tpXTtcbiAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmVudHJpZXNfW2kgKyAxXTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKGtleSA9PT0gZGVsZXRlZFNlbnRpbmVsKSA/IDQgOiA2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiBba2V5LCB2YWx1ZV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHgubWF5YmVUaHJvdygpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gNDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gJGN0eC5lbmQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCAkX18xNCwgdGhpcyk7XG4gICAgfSksXG4gICAga2V5czogJHRyYWNldXJSdW50aW1lLmluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbiAkX18xNSgpIHtcbiAgICAgIHZhciBpLFxuICAgICAgICAgIGxlbixcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdmFsdWU7XG4gICAgICByZXR1cm4gJHRyYWNldXJSdW50aW1lLmNyZWF0ZUdlbmVyYXRvckluc3RhbmNlKGZ1bmN0aW9uKCRjdHgpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpXG4gICAgICAgICAgc3dpdGNoICgkY3R4LnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGkgPSAwLCBsZW4gPSB0aGlzLmVudHJpZXNfLmxlbmd0aDtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoaSA8IGxlbikgPyA4IDogLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIGtleSA9IHRoaXMuZW50cmllc19baV07XG4gICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5lbnRyaWVzX1tpICsgMV07XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IChrZXkgPT09IGRlbGV0ZWRTZW50aW5lbCkgPyA0IDogNjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAyO1xuICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAkY3R4Lm1heWJlVGhyb3coKTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuICRjdHguZW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgfSwgJF9fMTUsIHRoaXMpO1xuICAgIH0pLFxuICAgIHZhbHVlczogJHRyYWNldXJSdW50aW1lLmluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbiAkX18xNigpIHtcbiAgICAgIHZhciBpLFxuICAgICAgICAgIGxlbixcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdmFsdWU7XG4gICAgICByZXR1cm4gJHRyYWNldXJSdW50aW1lLmNyZWF0ZUdlbmVyYXRvckluc3RhbmNlKGZ1bmN0aW9uKCRjdHgpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpXG4gICAgICAgICAgc3dpdGNoICgkY3R4LnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGkgPSAwLCBsZW4gPSB0aGlzLmVudHJpZXNfLmxlbmd0aDtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoaSA8IGxlbikgPyA4IDogLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIGtleSA9IHRoaXMuZW50cmllc19baV07XG4gICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5lbnRyaWVzX1tpICsgMV07XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IChrZXkgPT09IGRlbGV0ZWRTZW50aW5lbCkgPyA0IDogNjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAyO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHgubWF5YmVUaHJvdygpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gNDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gJGN0eC5lbmQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCAkX18xNiwgdGhpcyk7XG4gICAgfSlcbiAgfSwge30pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFwLnByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBNYXAucHJvdG90eXBlLmVudHJpZXNcbiAgfSk7XG4gIHJldHVybiB7Z2V0IE1hcCgpIHtcbiAgICAgIHJldHVybiBNYXA7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL051bWJlclwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9OdW1iZXJcIjtcbiAgdmFyICRfXzE3ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIpLFxuICAgICAgaXNOdW1iZXIgPSAkX18xNy5pc051bWJlcixcbiAgICAgIHRvSW50ZWdlciA9ICRfXzE3LnRvSW50ZWdlcjtcbiAgdmFyICRhYnMgPSBNYXRoLmFicztcbiAgdmFyICRpc0Zpbml0ZSA9IGlzRmluaXRlO1xuICB2YXIgJGlzTmFOID0gaXNOYU47XG4gIHZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIE1JTl9TQUZFX0lOVEVHRVIgPSAtTWF0aC5wb3coMiwgNTMpICsgMTtcbiAgdmFyIEVQU0lMT04gPSBNYXRoLnBvdygyLCAtNTIpO1xuICBmdW5jdGlvbiBOdW1iZXJJc0Zpbml0ZShudW1iZXIpIHtcbiAgICByZXR1cm4gaXNOdW1iZXIobnVtYmVyKSAmJiAkaXNGaW5pdGUobnVtYmVyKTtcbiAgfVxuICA7XG4gIGZ1bmN0aW9uIGlzSW50ZWdlcihudW1iZXIpIHtcbiAgICByZXR1cm4gTnVtYmVySXNGaW5pdGUobnVtYmVyKSAmJiB0b0ludGVnZXIobnVtYmVyKSA9PT0gbnVtYmVyO1xuICB9XG4gIGZ1bmN0aW9uIE51bWJlcklzTmFOKG51bWJlcikge1xuICAgIHJldHVybiBpc051bWJlcihudW1iZXIpICYmICRpc05hTihudW1iZXIpO1xuICB9XG4gIDtcbiAgZnVuY3Rpb24gaXNTYWZlSW50ZWdlcihudW1iZXIpIHtcbiAgICBpZiAoTnVtYmVySXNGaW5pdGUobnVtYmVyKSkge1xuICAgICAgdmFyIGludGVncmFsID0gdG9JbnRlZ2VyKG51bWJlcik7XG4gICAgICBpZiAoaW50ZWdyYWwgPT09IG51bWJlcilcbiAgICAgICAgcmV0dXJuICRhYnMoaW50ZWdyYWwpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBNQVhfU0FGRV9JTlRFR0VSKCkge1xuICAgICAgcmV0dXJuIE1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfSxcbiAgICBnZXQgTUlOX1NBRkVfSU5URUdFUigpIHtcbiAgICAgIHJldHVybiBNSU5fU0FGRV9JTlRFR0VSO1xuICAgIH0sXG4gICAgZ2V0IEVQU0lMT04oKSB7XG4gICAgICByZXR1cm4gRVBTSUxPTjtcbiAgICB9LFxuICAgIGdldCBpc0Zpbml0ZSgpIHtcbiAgICAgIHJldHVybiBOdW1iZXJJc0Zpbml0ZTtcbiAgICB9LFxuICAgIGdldCBpc0ludGVnZXIoKSB7XG4gICAgICByZXR1cm4gaXNJbnRlZ2VyO1xuICAgIH0sXG4gICAgZ2V0IGlzTmFOKCkge1xuICAgICAgcmV0dXJuIE51bWJlcklzTmFOO1xuICAgIH0sXG4gICAgZ2V0IGlzU2FmZUludGVnZXIoKSB7XG4gICAgICByZXR1cm4gaXNTYWZlSW50ZWdlcjtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL09iamVjdFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9PYmplY3RcIjtcbiAgdmFyICRfXzE4ID0gJHRyYWNldXJSdW50aW1lLmFzc2VydE9iamVjdCgkdHJhY2V1clJ1bnRpbWUpLFxuICAgICAgZGVmaW5lUHJvcGVydHkgPSAkX18xOC5kZWZpbmVQcm9wZXJ0eSxcbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICRfXzE4LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgICAgIGdldE93blByb3BlcnR5TmFtZXMgPSAkX18xOC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAgICAga2V5cyA9ICRfXzE4LmtleXMsXG4gICAgICBwcml2YXRlTmFtZXMgPSAkX18xOC5wcml2YXRlTmFtZXM7XG4gIGZ1bmN0aW9uIGlzKGxlZnQsIHJpZ2h0KSB7XG4gICAgaWYgKGxlZnQgPT09IHJpZ2h0KVxuICAgICAgcmV0dXJuIGxlZnQgIT09IDAgfHwgMSAvIGxlZnQgPT09IDEgLyByaWdodDtcbiAgICByZXR1cm4gbGVmdCAhPT0gbGVmdCAmJiByaWdodCAhPT0gcmlnaHQ7XG4gIH1cbiAgZnVuY3Rpb24gYXNzaWduKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgdmFyIHByb3BzID0ga2V5cyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIHZhciBuYW1lID0gcHJvcHNbcF07XG4gICAgICAgIGlmIChwcml2YXRlTmFtZXNbbmFtZV0pXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IHNvdXJjZVtuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIHZhciBwcm9wcyA9IGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICB2YXIgcCxcbiAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgdmFyIG5hbWUgPSBwcm9wc1twXTtcbiAgICAgIGlmIChwcml2YXRlTmFtZXNbbmFtZV0pXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BzW3BdKTtcbiAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcHNbcF0sIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IGlzKCkge1xuICAgICAgcmV0dXJuIGlzO1xuICAgIH0sXG4gICAgZ2V0IGFzc2lnbigpIHtcbiAgICAgIHJldHVybiBhc3NpZ247XG4gICAgfSxcbiAgICBnZXQgbWl4aW4oKSB7XG4gICAgICByZXR1cm4gbWl4aW47XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCI7XG4gIHZhciBsZW5ndGggPSAwO1xuICBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICBxdWV1ZVtsZW5ndGhdID0gY2FsbGJhY2s7XG4gICAgcXVldWVbbGVuZ3RoICsgMV0gPSBhcmc7XG4gICAgbGVuZ3RoICs9IDI7XG4gICAgaWYgKGxlbmd0aCA9PT0gMikge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxuICB2YXIgJF9fZGVmYXVsdCA9IGFzYXA7XG4gIHZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICB2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICB2YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuICBmdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmbHVzaCwgMSk7XG4gICAgfTtcbiAgfVxuICB2YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcbiAgICAgIGNhbGxiYWNrKGFyZyk7XG4gICAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgbGVuZ3RoID0gMDtcbiAgfVxuICB2YXIgc2NoZWR1bGVGbHVzaDtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbiAgfSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gIH0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xuICB9XG4gIHJldHVybiB7Z2V0IGRlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gJF9fZGVmYXVsdDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCI7XG4gIHZhciBhc3luYyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIikuZGVmYXVsdDtcbiAgdmFyIHByb21pc2VSYXcgPSB7fTtcbiAgZnVuY3Rpb24gaXNQcm9taXNlKHgpIHtcbiAgICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5zdGF0dXNfICE9PSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gaWRSZXNvbHZlSGFuZGxlcih4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgZnVuY3Rpb24gaWRSZWplY3RIYW5kbGVyKHgpIHtcbiAgICB0aHJvdyB4O1xuICB9XG4gIGZ1bmN0aW9uIGNoYWluKHByb21pc2UpIHtcbiAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzFdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1sxXSA6IGlkUmVzb2x2ZUhhbmRsZXI7XG4gICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzJdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1syXSA6IGlkUmVqZWN0SGFuZGxlcjtcbiAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChwcm9taXNlLmNvbnN0cnVjdG9yKTtcbiAgICBzd2l0Y2ggKHByb21pc2Uuc3RhdHVzXykge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHRocm93IFR5cGVFcnJvcjtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcHJvbWlzZS5vblJlc29sdmVfLnB1c2gob25SZXNvbHZlLCBkZWZlcnJlZCk7XG4gICAgICAgIHByb21pc2Uub25SZWplY3RfLnB1c2gob25SZWplY3QsIGRlZmVycmVkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICsxOlxuICAgICAgICBwcm9taXNlRW5xdWV1ZShwcm9taXNlLnZhbHVlXywgW29uUmVzb2x2ZSwgZGVmZXJyZWRdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIC0xOlxuICAgICAgICBwcm9taXNlRW5xdWV1ZShwcm9taXNlLnZhbHVlXywgW29uUmVqZWN0LCBkZWZlcnJlZF0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVmZXJyZWQoQykge1xuICAgIGlmICh0aGlzID09PSAkUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBwcm9taXNlSW5pdChuZXcgJFByb21pc2UocHJvbWlzZVJhdykpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogcHJvbWlzZSxcbiAgICAgICAgcmVzb2x2ZTogKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICBwcm9taXNlUmVzb2x2ZShwcm9taXNlLCB4KTtcbiAgICAgICAgfSksXG4gICAgICAgIHJlamVjdDogKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICBwcm9taXNlUmVqZWN0KHByb21pc2UsIHIpO1xuICAgICAgICB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0LnByb21pc2UgPSBuZXcgQygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgcmVzdWx0LnJlamVjdCA9IHJlamVjdDtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VTZXQocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSwgb25SZXNvbHZlLCBvblJlamVjdCkge1xuICAgIHByb21pc2Uuc3RhdHVzXyA9IHN0YXR1cztcbiAgICBwcm9taXNlLnZhbHVlXyA9IHZhbHVlO1xuICAgIHByb21pc2Uub25SZXNvbHZlXyA9IG9uUmVzb2x2ZTtcbiAgICBwcm9taXNlLm9uUmVqZWN0XyA9IG9uUmVqZWN0O1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VJbml0KHByb21pc2UpIHtcbiAgICByZXR1cm4gcHJvbWlzZVNldChwcm9taXNlLCAwLCB1bmRlZmluZWQsIFtdLCBbXSk7XG4gIH1cbiAgdmFyIFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgaWYgKHJlc29sdmVyID09PSBwcm9taXNlUmF3KVxuICAgICAgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIHZhciBwcm9taXNlID0gcHJvbWlzZUluaXQodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc29sdmVyKChmdW5jdGlvbih4KSB7XG4gICAgICAgIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpO1xuICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgIHByb21pc2VSZWplY3QocHJvbWlzZSwgcik7XG4gICAgICB9KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcHJvbWlzZVJlamVjdChwcm9taXNlLCBlKTtcbiAgICB9XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFByb21pc2UsIHtcbiAgICBjYXRjaDogZnVuY3Rpb24ob25SZWplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdCk7XG4gICAgfSxcbiAgICB0aGVuOiBmdW5jdGlvbihvblJlc29sdmUsIG9uUmVqZWN0KSB7XG4gICAgICBpZiAodHlwZW9mIG9uUmVzb2x2ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgb25SZXNvbHZlID0gaWRSZXNvbHZlSGFuZGxlcjtcbiAgICAgIGlmICh0eXBlb2Ygb25SZWplY3QgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIG9uUmVqZWN0ID0gaWRSZWplY3RIYW5kbGVyO1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIHJldHVybiBjaGFpbih0aGlzLCBmdW5jdGlvbih4KSB7XG4gICAgICAgIHggPSBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KTtcbiAgICAgICAgcmV0dXJuIHggPT09IHRoYXQgPyBvblJlamVjdChuZXcgVHlwZUVycm9yKSA6IGlzUHJvbWlzZSh4KSA/IHgudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KSA6IG9uUmVzb2x2ZSh4KTtcbiAgICAgIH0sIG9uUmVqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICByZXNvbHZlOiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAodGhpcyA9PT0gJFByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VTZXQobmV3ICRQcm9taXNlKHByb21pc2VSYXcpLCArMSwgeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVzb2x2ZSh4KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZWplY3Q6IGZ1bmN0aW9uKHIpIHtcbiAgICAgIGlmICh0aGlzID09PSAkUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVNldChuZXcgJFByb21pc2UocHJvbWlzZVJhdyksIC0xLCByKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KHIpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYXN0OiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIHRoaXMpXG4gICAgICAgIHJldHVybiB4O1xuICAgICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICAgIGNoYWluKHgsIHJlc3VsdC5yZXNvbHZlLCByZXN1bHQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9taXNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZSh4KTtcbiAgICB9LFxuICAgIGFsbDogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHZhciByZXNvbHV0aW9ucyA9IFtdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGNvdW50ID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSh2YWx1ZXNbaV0pLnRoZW4oZnVuY3Rpb24oaSwgeCkge1xuICAgICAgICAgICAgICByZXNvbHV0aW9uc1tpXSA9IHg7XG4gICAgICAgICAgICAgIGlmICgtLWNvdW50ID09PSAwKVxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgICAgICAgfS5iaW5kKHVuZGVmaW5lZCwgaSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcbiAgICByYWNlOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLnJlc29sdmUodmFsdWVzW2ldKS50aGVuKChmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHgpO1xuICAgICAgICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH0pO1xuICB2YXIgJFByb21pc2UgPSBQcm9taXNlO1xuICB2YXIgJFByb21pc2VSZWplY3QgPSAkUHJvbWlzZS5yZWplY3Q7XG4gIGZ1bmN0aW9uIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCArMSwgeCwgcHJvbWlzZS5vblJlc29sdmVfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVqZWN0KHByb21pc2UsIHIpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAtMSwgciwgcHJvbWlzZS5vblJlamVjdF8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VEb25lKHByb21pc2UsIHN0YXR1cywgdmFsdWUsIHJlYWN0aW9ucykge1xuICAgIGlmIChwcm9taXNlLnN0YXR1c18gIT09IDApXG4gICAgICByZXR1cm47XG4gICAgcHJvbWlzZUVucXVldWUodmFsdWUsIHJlYWN0aW9ucyk7XG4gICAgcHJvbWlzZVNldChwcm9taXNlLCBzdGF0dXMsIHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlRW5xdWV1ZSh2YWx1ZSwgdGFza3MpIHtcbiAgICBhc3luYygoZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIHByb21pc2VIYW5kbGUodmFsdWUsIHRhc2tzW2ldLCB0YXNrc1tpICsgMV0pO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlSGFuZGxlKHZhbHVlLCBoYW5kbGVyLCBkZWZlcnJlZCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7XG4gICAgICBpZiAocmVzdWx0ID09PSBkZWZlcnJlZC5wcm9taXNlKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgZWxzZSBpZiAoaXNQcm9taXNlKHJlc3VsdCkpXG4gICAgICAgIGNoYWluKHJlc3VsdCwgZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICB9XG4gIHZhciB0aGVuYWJsZVN5bWJvbCA9ICdAQHRoZW5hYmxlJztcbiAgZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuICAgIHJldHVybiB4ICYmICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbicpO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpIHtcbiAgICBpZiAoIWlzUHJvbWlzZSh4KSAmJiBpc09iamVjdCh4KSkge1xuICAgICAgdmFyIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuID0geC50aGVuO1xuICAgICAgfSBjYXRjaCAocikge1xuICAgICAgICB2YXIgcHJvbWlzZSA9ICRQcm9taXNlUmVqZWN0LmNhbGwoY29uc3RydWN0b3IsIHIpO1xuICAgICAgICB4W3RoZW5hYmxlU3ltYm9sXSA9IHByb21pc2U7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBwID0geFt0aGVuYWJsZVN5bWJvbF07XG4gICAgICAgIGlmIChwKSB7XG4gICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQoY29uc3RydWN0b3IpO1xuICAgICAgICAgIHhbdGhlbmFibGVTeW1ib2xdID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhlbi5jYWxsKHgsIGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgICAgfSBjYXRjaCAocikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geDtcbiAgfVxuICByZXR1cm4ge2dldCBQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2U7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1NldFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TZXRcIjtcbiAgdmFyIGlzT2JqZWN0ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIpLmlzT2JqZWN0O1xuICB2YXIgTWFwID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL01hcFwiKS5NYXA7XG4gIHZhciBnZXRPd25IYXNoT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLmdldE93bkhhc2hPYmplY3Q7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICBmdW5jdGlvbiBpbml0U2V0KHNldCkge1xuICAgIHNldC5tYXBfID0gbmV3IE1hcCgpO1xuICB9XG4gIHZhciBTZXQgPSBmdW5jdGlvbiBTZXQoKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gYXJndW1lbnRzWzBdO1xuICAgIGlmICghaXNPYmplY3QodGhpcykpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSB0eXBlJyk7XG4gICAgaWYgKCRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdtYXBfJykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NldCBjYW4gbm90IGJlIHJlZW50cmFudGx5IGluaXRpYWxpc2VkJyk7XG4gICAgfVxuICAgIGluaXRTZXQodGhpcyk7XG4gICAgaWYgKGl0ZXJhYmxlICE9PSBudWxsICYmIGl0ZXJhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAodmFyICRfXzI1ID0gaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpLFxuICAgICAgICAgICRfXzI2OyAhKCRfXzI2ID0gJF9fMjUubmV4dCgpKS5kb25lOyApIHtcbiAgICAgICAgdmFyIGl0ZW0gPSAkX18yNi52YWx1ZTtcbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuYWRkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShTZXQsIHtcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcF8uc2l6ZTtcbiAgICB9LFxuICAgIGhhczogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBfLmhhcyhrZXkpO1xuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcF8uc2V0KGtleSwga2V5KTtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBfLmRlbGV0ZShrZXkpO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwXy5jbGVhcigpO1xuICAgIH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2tGbikge1xuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG4gICAgICB2YXIgJF9fMjMgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMubWFwXy5mb3JFYWNoKChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGNhbGxiYWNrRm4uY2FsbCh0aGlzQXJnLCBrZXksIGtleSwgJF9fMjMpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgdmFsdWVzOiAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uICRfXzI3KCkge1xuICAgICAgdmFyICRfXzI4LFxuICAgICAgICAgICRfXzI5O1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAkX18yOCA9IHRoaXMubWFwXy5rZXlzKClbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICAgICAgICAkY3R4LnNlbnQgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICRjdHguYWN0aW9uID0gJ25leHQnO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgJF9fMjkgPSAkX18yOFskY3R4LmFjdGlvbl0oJGN0eC5zZW50SWdub3JlVGhyb3cpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gOTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoJF9fMjkuZG9uZSkgPyAzIDogMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICRjdHguc2VudCA9ICRfXzI5LnZhbHVlO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIHJldHVybiAkX18yOS52YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiAkY3R4LmVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgIH0sICRfXzI3LCB0aGlzKTtcbiAgICB9KSxcbiAgICBlbnRyaWVzOiAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uICRfXzMwKCkge1xuICAgICAgdmFyICRfXzMxLFxuICAgICAgICAgICRfXzMyO1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAkX18zMSA9IHRoaXMubWFwXy5lbnRyaWVzKClbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICAgICAgICAkY3R4LnNlbnQgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICRjdHguYWN0aW9uID0gJ25leHQnO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgJF9fMzIgPSAkX18zMVskY3R4LmFjdGlvbl0oJGN0eC5zZW50SWdub3JlVGhyb3cpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gOTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoJF9fMzIuZG9uZSkgPyAzIDogMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICRjdHguc2VudCA9ICRfXzMyLnZhbHVlO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIHJldHVybiAkX18zMi52YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiAkY3R4LmVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgIH0sICRfXzMwLCB0aGlzKTtcbiAgICB9KVxuICB9LCB7fSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXQucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IFNldC5wcm90b3R5cGUudmFsdWVzXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2V0LnByb3RvdHlwZSwgJ2tleXMnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBTZXQucHJvdG90eXBlLnZhbHVlc1xuICB9KTtcbiAgcmV0dXJuIHtnZXQgU2V0KCkge1xuICAgICAgcmV0dXJuIFNldDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nSXRlcmF0b3JcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzM1O1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdJdGVyYXRvclwiO1xuICB2YXIgJF9fMzMgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiksXG4gICAgICBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCA9ICRfXzMzLmNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0LFxuICAgICAgaXNPYmplY3QgPSAkX18zMy5pc09iamVjdDtcbiAgdmFyICRfXzM2ID0gJHRyYWNldXJSdW50aW1lLmFzc2VydE9iamVjdCgkdHJhY2V1clJ1bnRpbWUpLFxuICAgICAgaGFzT3duUHJvcGVydHkgPSAkX18zNi5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgIHRvUHJvcGVydHkgPSAkX18zNi50b1Byb3BlcnR5O1xuICB2YXIgaXRlcmF0ZWRTdHJpbmcgPSBTeW1ib2woJ2l0ZXJhdGVkU3RyaW5nJyk7XG4gIHZhciBzdHJpbmdJdGVyYXRvck5leHRJbmRleCA9IFN5bWJvbCgnc3RyaW5nSXRlcmF0b3JOZXh0SW5kZXgnKTtcbiAgdmFyIFN0cmluZ0l0ZXJhdG9yID0gZnVuY3Rpb24gU3RyaW5nSXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoU3RyaW5nSXRlcmF0b3IsICgkX18zNSA9IHt9LCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fMzUsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG8gPSB0aGlzO1xuICAgICAgaWYgKCFpc09iamVjdChvKSB8fCAhaGFzT3duUHJvcGVydHkobywgaXRlcmF0ZWRTdHJpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgbXVzdCBiZSBhIFN0cmluZ0l0ZXJhdG9yIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgdmFyIHMgPSBvW3RvUHJvcGVydHkoaXRlcmF0ZWRTdHJpbmcpXTtcbiAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICB2YXIgcG9zaXRpb24gPSBvW3RvUHJvcGVydHkoc3RyaW5nSXRlcmF0b3JOZXh0SW5kZXgpXTtcbiAgICAgIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgICAgIGlmIChwb3NpdGlvbiA+PSBsZW4pIHtcbiAgICAgICAgb1t0b1Byb3BlcnR5KGl0ZXJhdGVkU3RyaW5nKV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgdmFyIGZpcnN0ID0gcy5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcbiAgICAgIHZhciByZXN1bHRTdHJpbmc7XG4gICAgICBpZiAoZmlyc3QgPCAweEQ4MDAgfHwgZmlyc3QgPiAweERCRkYgfHwgcG9zaXRpb24gKyAxID09PSBsZW4pIHtcbiAgICAgICAgcmVzdWx0U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShmaXJzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc2Vjb25kID0gcy5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XG4gICAgICAgIGlmIChzZWNvbmQgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGKSB7XG4gICAgICAgICAgcmVzdWx0U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShmaXJzdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShmaXJzdCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKHNlY29uZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9bdG9Qcm9wZXJ0eShzdHJpbmdJdGVyYXRvck5leHRJbmRleCldID0gcG9zaXRpb24gKyByZXN1bHRTdHJpbmcubGVuZ3RoO1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHJlc3VsdFN0cmluZywgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX18zNSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgJF9fMzUpLCB7fSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0l0ZXJhdG9yKHN0cmluZykge1xuICAgIHZhciBzID0gU3RyaW5nKHN0cmluZyk7XG4gICAgdmFyIGl0ZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShTdHJpbmdJdGVyYXRvci5wcm90b3R5cGUpO1xuICAgIGl0ZXJhdG9yW3RvUHJvcGVydHkoaXRlcmF0ZWRTdHJpbmcpXSA9IHM7XG4gICAgaXRlcmF0b3JbdG9Qcm9wZXJ0eShzdHJpbmdJdGVyYXRvck5leHRJbmRleCldID0gMDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgcmV0dXJuIHtnZXQgY3JlYXRlU3RyaW5nSXRlcmF0b3IoKSB7XG4gICAgICByZXR1cm4gY3JlYXRlU3RyaW5nSXRlcmF0b3I7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIjtcbiAgdmFyIGNyZWF0ZVN0cmluZ0l0ZXJhdG9yID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ0l0ZXJhdG9yXCIpLmNyZWF0ZVN0cmluZ0l0ZXJhdG9yO1xuICB2YXIgJHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyICRpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuICB2YXIgJGxhc3RJbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zID0gc3RyaW5nTGVuZ3RoO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICAgICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHZhciBzdGFydCA9IGVuZCAtIHNlYXJjaExlbmd0aDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGFzdEluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgc3RhcnQpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGNvbnRhaW5zKHNlYXJjaCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSAhPSAtMTtcbiAgfVxuICBmdW5jdGlvbiByZXBlYXQoY291bnQpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgbiA9IGNvdW50ID8gTnVtYmVyKGNvdW50KSA6IDA7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICBuID0gMDtcbiAgICB9XG4gICAgaWYgKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgcmVzdWx0ICs9IHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3NpdGlvbikge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzaXplID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgZmlyc3QgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCk7XG4gICAgdmFyIHNlY29uZDtcbiAgICBpZiAoZmlyc3QgPj0gMHhEODAwICYmIGZpcnN0IDw9IDB4REJGRiAmJiBzaXplID4gaW5kZXggKyAxKSB7XG4gICAgICBzZWNvbmQgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgaWYgKHNlY29uZCA+PSAweERDMDAgJiYgc2Vjb25kIDw9IDB4REZGRikge1xuICAgICAgICByZXR1cm4gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG4gIGZ1bmN0aW9uIHJhdyhjYWxsc2l0ZSkge1xuICAgIHZhciByYXcgPSBjYWxsc2l0ZS5yYXc7XG4gICAgdmFyIGxlbiA9IHJhdy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKGxlbiA9PT0gMClcbiAgICAgIHJldHVybiAnJztcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgcyArPSByYXdbaV07XG4gICAgICBpZiAoaSArIDEgPT09IGxlbilcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICBzICs9IGFyZ3VtZW50c1srK2ldO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xuICAgIHZhciBjb2RlVW5pdHMgPSBbXTtcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIHZhciBoaWdoU3Vycm9nYXRlO1xuICAgIHZhciBsb3dTdXJyb2dhdGU7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICBpZiAoIWlzRmluaXRlKGNvZGVQb2ludCkgfHwgY29kZVBvaW50IDwgMCB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRiB8fCBmbG9vcihjb2RlUG9pbnQpICE9IGNvZGVQb2ludCkge1xuICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQ6ICcgKyBjb2RlUG9pbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xuICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG4gICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG4gIH1cbiAgZnVuY3Rpb24gc3RyaW5nUHJvdG90eXBlSXRlcmF0b3IoKSB7XG4gICAgdmFyIG8gPSAkdHJhY2V1clJ1bnRpbWUuY2hlY2tPYmplY3RDb2VyY2libGUodGhpcyk7XG4gICAgdmFyIHMgPSBTdHJpbmcobyk7XG4gICAgcmV0dXJuIGNyZWF0ZVN0cmluZ0l0ZXJhdG9yKHMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHN0YXJ0c1dpdGgoKSB7XG4gICAgICByZXR1cm4gc3RhcnRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBlbmRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBlbmRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBjb250YWlucygpIHtcbiAgICAgIHJldHVybiBjb250YWlucztcbiAgICB9LFxuICAgIGdldCByZXBlYXQoKSB7XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH0sXG4gICAgZ2V0IGNvZGVQb2ludEF0KCkge1xuICAgICAgcmV0dXJuIGNvZGVQb2ludEF0O1xuICAgIH0sXG4gICAgZ2V0IHJhdygpIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfSxcbiAgICBnZXQgZnJvbUNvZGVQb2ludCgpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50O1xuICAgIH0sXG4gICAgZ2V0IHN0cmluZ1Byb3RvdHlwZUl0ZXJhdG9yKCkge1xuICAgICAgcmV0dXJuIHN0cmluZ1Byb3RvdHlwZUl0ZXJhdG9yO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiO1xuICB2YXIgTWFwID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL01hcFwiKS5NYXA7XG4gIHZhciBTZXQgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU2V0XCIpLlNldDtcbiAgdmFyIFByb21pc2UgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiKS5Qcm9taXNlO1xuICB2YXIgJF9fNDEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIpLFxuICAgICAgY29kZVBvaW50QXQgPSAkX180MS5jb2RlUG9pbnRBdCxcbiAgICAgIGNvbnRhaW5zID0gJF9fNDEuY29udGFpbnMsXG4gICAgICBlbmRzV2l0aCA9ICRfXzQxLmVuZHNXaXRoLFxuICAgICAgZnJvbUNvZGVQb2ludCA9ICRfXzQxLmZyb21Db2RlUG9pbnQsXG4gICAgICByZXBlYXQgPSAkX180MS5yZXBlYXQsXG4gICAgICByYXcgPSAkX180MS5yYXcsXG4gICAgICBzdGFydHNXaXRoID0gJF9fNDEuc3RhcnRzV2l0aCxcbiAgICAgIHN0cmluZ1Byb3RvdHlwZUl0ZXJhdG9yID0gJF9fNDEuc3RyaW5nUHJvdG90eXBlSXRlcmF0b3I7XG4gIHZhciAkX180MiA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheVwiKSxcbiAgICAgIGZpbGwgPSAkX180Mi5maWxsLFxuICAgICAgZmluZCA9ICRfXzQyLmZpbmQsXG4gICAgICBmaW5kSW5kZXggPSAkX180Mi5maW5kSW5kZXgsXG4gICAgICBmcm9tID0gJF9fNDIuZnJvbTtcbiAgdmFyICRfXzQzID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiksXG4gICAgICBlbnRyaWVzID0gJF9fNDMuZW50cmllcyxcbiAgICAgIGtleXMgPSAkX180My5rZXlzLFxuICAgICAgdmFsdWVzID0gJF9fNDMudmFsdWVzO1xuICB2YXIgJF9fNDQgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvT2JqZWN0XCIpLFxuICAgICAgYXNzaWduID0gJF9fNDQuYXNzaWduLFxuICAgICAgaXMgPSAkX180NC5pcyxcbiAgICAgIG1peGluID0gJF9fNDQubWl4aW47XG4gIHZhciAkX180NSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjU1L3NyYy9ydW50aW1lL3BvbHlmaWxscy9OdW1iZXJcIiksXG4gICAgICBNQVhfU0FGRV9JTlRFR0VSID0gJF9fNDUuTUFYX1NBRkVfSU5URUdFUixcbiAgICAgIE1JTl9TQUZFX0lOVEVHRVIgPSAkX180NS5NSU5fU0FGRV9JTlRFR0VSLFxuICAgICAgRVBTSUxPTiA9ICRfXzQ1LkVQU0lMT04sXG4gICAgICBpc0Zpbml0ZSA9ICRfXzQ1LmlzRmluaXRlLFxuICAgICAgaXNJbnRlZ2VyID0gJF9fNDUuaXNJbnRlZ2VyLFxuICAgICAgaXNOYU4gPSAkX180NS5pc05hTixcbiAgICAgIGlzU2FmZUludGVnZXIgPSAkX180NS5pc1NhZmVJbnRlZ2VyO1xuICB2YXIgZ2V0UHJvdG90eXBlT2YgPSAkdHJhY2V1clJ1bnRpbWUuYXNzZXJ0T2JqZWN0KE9iamVjdCkuZ2V0UHJvdG90eXBlT2Y7XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lKG9iamVjdCwgbmFtZSwgZGVzY3IpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIG1heWJlRGVmaW5lKG9iamVjdCwgbmFtZSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lQ29uc3Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIG1heWJlRGVmaW5lKG9iamVjdCwgbmFtZSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBZGRGdW5jdGlvbnMob2JqZWN0LCBmdW5jdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBmdW5jdGlvbnNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBmdW5jdGlvbnNbaSArIDFdO1xuICAgICAgbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkQ29uc3RzKG9iamVjdCwgY29uc3RzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25zdHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gY29uc3RzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gY29uc3RzW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lQ29uc3Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkSXRlcmF0b3Iob2JqZWN0LCBmdW5jLCBTeW1ib2wpIHtcbiAgICBpZiAoIVN5bWJvbCB8fCAhU3ltYm9sLml0ZXJhdG9yIHx8IG9iamVjdFtTeW1ib2wuaXRlcmF0b3JdKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChvYmplY3RbJ0BAaXRlcmF0b3InXSlcbiAgICAgIGZ1bmMgPSBvYmplY3RbJ0BAaXRlcmF0b3InXTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICAgIHZhbHVlOiBmdW5jLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpIHtcbiAgICBpZiAoIWdsb2JhbC5Qcm9taXNlKVxuICAgICAgZ2xvYmFsLlByb21pc2UgPSBQcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsQ29sbGVjdGlvbnMoZ2xvYmFsLCBTeW1ib2wpIHtcbiAgICBpZiAoIWdsb2JhbC5NYXApXG4gICAgICBnbG9iYWwuTWFwID0gTWFwO1xuICAgIHZhciBtYXBQcm90b3R5cGUgPSBnbG9iYWwuTWFwLnByb3RvdHlwZTtcbiAgICBpZiAobWFwUHJvdG90eXBlLmVudHJpZXMpIHtcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IobWFwUHJvdG90eXBlLCBtYXBQcm90b3R5cGUuZW50cmllcywgU3ltYm9sKTtcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IoZ2V0UHJvdG90eXBlT2YobmV3IGdsb2JhbC5NYXAoKS5lbnRyaWVzKCkpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LCBTeW1ib2wpO1xuICAgIH1cbiAgICBpZiAoIWdsb2JhbC5TZXQpXG4gICAgICBnbG9iYWwuU2V0ID0gU2V0O1xuICAgIHZhciBzZXRQcm90b3R5cGUgPSBnbG9iYWwuU2V0LnByb3RvdHlwZTtcbiAgICBpZiAoc2V0UHJvdG90eXBlLnZhbHVlcykge1xuICAgICAgbWF5YmVBZGRJdGVyYXRvcihzZXRQcm90b3R5cGUsIHNldFByb3RvdHlwZS52YWx1ZXMsIFN5bWJvbCk7XG4gICAgICBtYXliZUFkZEl0ZXJhdG9yKGdldFByb3RvdHlwZU9mKG5ldyBnbG9iYWwuU2V0KCkudmFsdWVzKCkpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LCBTeW1ib2wpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN0cmluZyhTdHJpbmcpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcucHJvdG90eXBlLCBbJ2NvZGVQb2ludEF0JywgY29kZVBvaW50QXQsICdjb250YWlucycsIGNvbnRhaW5zLCAnZW5kc1dpdGgnLCBlbmRzV2l0aCwgJ3N0YXJ0c1dpdGgnLCBzdGFydHNXaXRoLCAncmVwZWF0JywgcmVwZWF0XSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLCBbJ2Zyb21Db2RlUG9pbnQnLCBmcm9tQ29kZVBvaW50LCAncmF3JywgcmF3XSk7XG4gICAgbWF5YmVBZGRJdGVyYXRvcihTdHJpbmcucHJvdG90eXBlLCBzdHJpbmdQcm90b3R5cGVJdGVyYXRvciwgU3ltYm9sKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbEFycmF5KEFycmF5LCBTeW1ib2wpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheS5wcm90b3R5cGUsIFsnZW50cmllcycsIGVudHJpZXMsICdrZXlzJywga2V5cywgJ3ZhbHVlcycsIHZhbHVlcywgJ2ZpbGwnLCBmaWxsLCAnZmluZCcsIGZpbmQsICdmaW5kSW5kZXgnLCBmaW5kSW5kZXhdKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheSwgWydmcm9tJywgZnJvbV0pO1xuICAgIG1heWJlQWRkSXRlcmF0b3IoQXJyYXkucHJvdG90eXBlLCB2YWx1ZXMsIFN5bWJvbCk7XG4gICAgbWF5YmVBZGRJdGVyYXRvcihnZXRQcm90b3R5cGVPZihbXS52YWx1ZXMoKSksIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgU3ltYm9sKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE9iamVjdChPYmplY3QpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhPYmplY3QsIFsnYXNzaWduJywgYXNzaWduLCAnaXMnLCBpcywgJ21peGluJywgbWl4aW5dKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE51bWJlcihOdW1iZXIpIHtcbiAgICBtYXliZUFkZENvbnN0cyhOdW1iZXIsIFsnTUFYX1NBRkVfSU5URUdFUicsIE1BWF9TQUZFX0lOVEVHRVIsICdNSU5fU0FGRV9JTlRFR0VSJywgTUlOX1NBRkVfSU5URUdFUiwgJ0VQU0lMT04nLCBFUFNJTE9OXSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoTnVtYmVyLCBbJ2lzRmluaXRlJywgaXNGaW5pdGUsICdpc0ludGVnZXInLCBpc0ludGVnZXIsICdpc05hTicsIGlzTmFOLCAnaXNTYWZlSW50ZWdlcicsIGlzU2FmZUludGVnZXJdKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbChnbG9iYWwpIHtcbiAgICBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbENvbGxlY3Rpb25zKGdsb2JhbCwgZ2xvYmFsLlN5bWJvbCk7XG4gICAgcG9seWZpbGxTdHJpbmcoZ2xvYmFsLlN0cmluZyk7XG4gICAgcG9seWZpbGxBcnJheShnbG9iYWwuQXJyYXksIGdsb2JhbC5TeW1ib2wpO1xuICAgIHBvbHlmaWxsT2JqZWN0KGdsb2JhbC5PYmplY3QpO1xuICAgIHBvbHlmaWxsTnVtYmVyKGdsb2JhbC5OdW1iZXIpO1xuICB9XG4gIHBvbHlmaWxsKHRoaXMpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICAgIHBvbHlmaWxsKGdsb2JhbCk7XG4gIH07XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIjtcbiAgU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNTUvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiKTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC41NS9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiArICcnKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIl19
