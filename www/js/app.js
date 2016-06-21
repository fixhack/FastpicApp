// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','oc.lazyLoad','ui.router', 'starter.controllers', 'starter.services', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ocLazyLoadProvider,$httpProvider,$ionicConfigProvider) {

	$ionicConfigProvider.tabs.position('bottom');
   $urlRouterProvider.when('', '/');
   
   	$ocLazyLoadProvider.config({
		debug:false,
		events:true,
	});
	
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
	  controller: 'LoginCtrl',
	  data: {
			requireAuth: false
		}
  })
  
	.state('slider', {
		templateUrl:'templates/slider.html',
		url:'/slider',
		controller: 'SliderCtrl',
		resolve: {
			loadSliderFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: 'sliderFiles',
					files:[
						'js/camera.js',
					    'js/jquery.easing.1.3.js'
					]
				})
			}
		},
		data: {
			requireAuth: false
		}
	})
    .state('principal', {
    url: '/principal',
    templateUrl: 'templates/Principal.html',
    data: {
			requireAuth: true
	}
  })

  // Each tab has its own nav history stack:

  .state('principal.barcodes', {
    url: '/barcodes',
    views: {
      'tab-barcodes': {
        templateUrl: 'templates/tab-barcodes.html',
        controller: 'BarcodesCtrl'
      }
    }
  })
  
    .state('barcodesImgs', {
    url: '/barcodesImgs',
    templateUrl: 'templates/tab-barcodesImgs.html',
        controller: 'BarcodesCtrl',
        data: {
			requireAuth: true
	}
      })
  

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  
  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
	   return {
	       'request': function (config) {
	           config.headers = config.headers || {};
	           if ($localStorage.token) {
	               config.headers.Authorization = 'Bearer ' + $localStorage.token;
	           }
	           return config;
	       },
	       'responseError': function (response) {
	           if (response.status === 401 || response.status === 403 || response.status === undefined) {
	               $location.url('/login');
	           }
	           return $q.reject(response);
	       }
	   };
	}]);

});
