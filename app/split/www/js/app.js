angular.module('split', ['ionic', 'split.controllers'])

  .run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

      document.addEventListener("pause", function() {
        $rootScope.socket.emit('logout', {username: $rootScope.username});
      }, false);

    });
  })

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl'
      })

      // Each tab has its own nav history stack:
      .state('tab.login', {
        url: '/login',
        views: {
          'tab-login': {
            templateUrl: 'templates/tab-login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('tab.findfriends', {
        url: '/findfriends',
        views: {
          'tab-find-friends': {
            templateUrl: 'templates/tab-find-friends.html',
            controller: 'FindFriendsCtrl'
          }
        }
      })
      .state('tab.scanreceipt', {
        url: '/scanreceipt',
        views: {
          'tab-scan-receipt': {
            templateUrl: 'templates/tab-scan-receipt.html',
            controller: 'ScanReceiptCtrl'
          }
        }
      })
      .state('tab.pay', {
        url: '/pay',
        views: {
          'tab-pay': {
            templateUrl: 'templates/tab-pay.html',
            controller: 'PayCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/login');

  });