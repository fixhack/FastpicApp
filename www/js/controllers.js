angular.module('starter.controllers', ['ui.router', 'oc.lazyLoad','ngCordova'])
.controller('SliderCtrl', function($scope, $state, $rootScope, UserService, $http, $ionicHistory, $ionicPlatform, $cordovaBarcodeScanner) {
	$scope.initSlider = function() {
		$(function() {
			$scope.slider = $('#camera_wrap_4').camera({
				height: 'auto',
				loader: 'pie',
				pagination: false,
				thumbnails: false,
				hover: false,
				opacityOnGrid: false,
				imagePath: '../images/',
	            portrait: true
			});
		});
	};
	
	var oldSoftBack = $rootScope.$ionicGoBack;
	
	$rootScope.$ionicGoBack = function() {
		jQuery('#camera_wrap_4').cameraStop();
		$ionicHistory.goBack();
	};
	
	$scope.toLogin = function() {
		jQuery('#camera_wrap_4').cameraStop();
		$state.go('login');
	}
	
	var doCustomBack= function() {
    // do something interesting here
		jQuery('#camera_wrap_4').cameraStop();
		$ionicHistory.goBack();
	};
	
	$scope.ScanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) 
	  {
			var s = "Result: " + barcodeData.text + "<br/>" +
			"Format: " + barcodeData.format + "<br/>" +
			"Cancelled: " + barcodeData.cancelled;
			console.log(s);
			$scope.find(barcodeData.text);
			//$scope.searchBarcode(barcodeData.text);
      }, function(error) {
        alert("Scanning failed: " + error);
      });
	}

	// registerBackButtonAction() returns a function which can be used to deregister it
	var deregisterHardBack= $ionicPlatform.registerBackButtonAction(
		doCustomBack, 101
	);

	$scope.$on('$destroy', function() {
		deregisterHardBack();
	});
	
	//$scope.uri = 'http://finanzas.seseqro.gob.mx/wildfly/fastpic-service/fastpic/barcode/getByCode';
	
	$scope.find = function(id) {
            jQuery('#camera_wrap_4').cameraStop();
            $("#camera_wrap_4").empty();
            //var getInfo = $.getJSON($scope.uri + '/' + id).done(function (data) {
            $http.get($rootScope.server + '/fastpic/barcode/getByCode/' + id).then(function(response) {
                if (response.data.Barcode[0].images.length == 1) {
                    $('<div>', {
                        "data-src": 'data:image/jpeg;base64,' + response.data.Barcode[0].images[0].imageData
                    }).appendTo("#camera_wrap_4");

                    $('#camera_wrap_4').camera({
                        height: 'auto',
                        loader: 'pie',
                        pagination: false,
                        thumbnails: false,
                        hover: false,
                        opacityOnGrid: false,
                        imagePath: '../images/',
                        autoAdvance: false,
                        mobileAutoAdvance: false,
                        navigation: false,
                        playPause: false,
                        portrait: true
                    });
                    console.log("Solo tiene 1")
                }
                else if (response.data.Barcode[0].images.length > 1) {
                    for (i = 0; i < response.data.Barcode[0].images.length; i++) {
                        $('<div>', {
                            "data-src": 'data:image/jpeg;base64,' + response.data.Barcode[0].images[i].imageData
                        }).appendTo("#camera_wrap_4");
                    }
                    $('#camera_wrap_4').camera({
                        height: 'auto',
                        loader: 'pie',
                        pagination: false,
                        thumbnails: false,
                        hover: false,
                        opacityOnGrid: false,
                        imagePath: '../images/',
                        portrait: true
                    });
                }
            });
        }
})
.controller('LoginCtrl', function($scope, $state, $rootScope, UserService, $cargaPropiedades, $localStorage,$ionicPopup) {

	
	$scope.data = {};
	
	
	function successAuth(res) {
        $localStorage.token = res.access_token;
		$state.go('principal');
    }
	$scope.submit = function() {
		var formData = {
            username: $scope.data.username,
            password: $scope.data.password
        };

        UserService.signin(formData, successAuth, function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        })
	};
	
	
	$cargaPropiedades.getServer().success(function(response) {
		$rootScope.server = response.server;
	})
	
	$scope.makeWarning = function() {
		$('#avisoError').addClass('ui red message');
	};
	$rootScope.bodyClass = 'hold-transition login-page';
	
	$scope.slider = function() {
		//console.log($scope.server);	
		$state.go('slider');
	}
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
