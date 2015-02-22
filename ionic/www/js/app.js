// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'restangular', 'starter.controllers', 'starter.services', 'starter.io', 'starter.platform', 'starter.config'])

.run(function($ionicPlatform, Platform, $rootScope, $ionicPopup, $state, Session, Errors) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.getDeviceUrl = Platform.getDeviceUrl;
  });

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.name !== 'sign-in' && !Session.isSignedIn()) {
      // Don't do the thing we were going to do
      event.preventDefault();

      return $state.go('sign-in'); // Go back to the login when reloading
    };
  });

  $rootScope.errorHandler = function(err) {
    $rootScope.state.loading = false;

    if (err instanceof Errors.InvalidApiKeyError) {
      Session.clearApiKey();
      return location.reload();
    }

    return $ionicPopup.alert({
      title: err.type || err.status || 'API Error',
      template: err.data || err.message
    });
  };

  $rootScope.state = {};
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider, RestangularProvider, Config) {

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|cdvfile|filesystem):|data:image\//);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('sign-in', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.documents', {
      url: '/documents',
      views: {
        'tab-documents': {
          templateUrl: 'templates/tab-documents.html',
          controller: 'DocumentsCtrl'
        }
      }
    })
    .state('tab.document-detail', {
      url: '/document/:documentId',
      views: {
        'tab-documents': {
          templateUrl: 'templates/document-detail.html',
          controller: 'DocumentDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');

  RestangularProvider.setBaseUrl(Config.SERVER_BASE_URL);

  // Records have Id field (capital I)
  RestangularProvider.setRestangularFields({
    id: 'Id'
  });

  // Remove request body for DELETE
  RestangularProvider.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
      return null;
    }
    return elem;
  });

});

var isCordova = typeof cordova !== 'undefined';

if (isCordova) {
  document.addEventListener('deviceready', bootstrapIonic, false);
} else {
  window.addEventListener('load', bootstrapIonic);
}

function bootstrapIonic() {
  var body = window.document.body;

  templateLoader('templates/body.html', function(bodyHtml) {
    body.innerHTML += bodyHtml;
    body.setAttribute('animation', 'slide-left-right-ios7');
    angular.bootstrap(body, ['starter']);
  });

  function templateLoader(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        return cb(xhr.responseText);
      }
    };
    return xhr.send();
  };
}
