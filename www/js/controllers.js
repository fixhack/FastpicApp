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
.controller('PrincipalCtrl', function($scope, $localStorage, $state, UserService, $rootScope) {
	function successAuth(res) {
		if (res !== undefined) {
			$localStorage.token = res.access_token;
		}
        $state.go('login');
    }
	
	$scope.logout = function() {
		UserService.logout(successAuth);
	}
})
.controller('ConfigCtrl', function($scope, $state, $cordovaFile, $rootScope) {
	/*
	var doCustomBack= function() {
	    // do something interesting here
		//console.log($state.current.url);
		if ($state.current.url == "/login"){
			ionic.Platform.exitApp();
		}
		else{
			$state.go('login');
		}
		//	$ionicHistory.goBack();
		}; 
		
	// registerBackButtonAction() returns a function which can be used to deregister it
	var deregisterHardBack= $ionicPlatform.registerBackButtonAction(
		doCustomBack, 101
	);

	$scope.$on('$destroy', function() {
		deregisterHardBack();
	});
	*/
	$scope.data = [];
	
	$scope.data.nombreServidor = $rootScope.server;
	
	$scope.saveInfo = function() {
		//$cordovaFile.writeFile("file:///data/data/com.ionicframework.fastpicapp621531/files/", "fastpic.conf", '{"server": ' + $scope.data.nombreServidor + '}', true).then(function(a) { console.log('readAsText Success'); })
		$rootScope.server = $scope.data.nombreServidor;
		$state.go('login');
	}
	
	$scope.goBackToLogin = function() {
		$state.go('login');
	}
})
.controller('LoginCtrl', function($scope, $state, $rootScope, UserService, $cordovaFile, $cargaPropiedades, $localStorage, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading) {
	  $scope.show = function() {
		    $ionicLoading.show({
		      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		    });
		  };

		  $scope.hide = function(){
		        $ionicLoading.hide();
		  };
		  
	
	$scope.config = function() {
		$state.go('configuration');
	}
	
	$scope.data = {};
	
	var doCustomBack= function() {
	    // do something interesting here
		//$state.go('login');
		//$ionicHistory.goBack();
		ionic.Platform.exitApp();
		
		}; 
		
	// registerBackButtonAction() returns a function which can be used to deregister it
	var deregisterHardBack= $ionicPlatform.registerBackButtonAction(
		doCustomBack, 101
	);

	$scope.$on('$destroy', function() {
		deregisterHardBack();
	});
	
	function successAuth(res) {
        $localStorage.token = res.access_token;
		$state.go('principal.barcodes');
		$scope.hide($ionicLoading); 
    }
	$scope.submit = function() {
		$scope.show($ionicLoading);
		
		var formData = {
            username: $scope.data.username,
            password: $scope.data.password
        };

        UserService.signin(formData, successAuth, function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!'
            });
            $scope.hide($ionicLoading); 
        })
	};
	
	var currentPlatform = ionic.Platform.platform();
	
	$cargaPropiedades.getServer().success(function(response) {
		$rootScope.server = response.server;
	})
	
	$scope.initConfig = function() {
		console.log('Entre');
		/*
		if (ionic.Platform.platform() === 'win32') {
			$cargaPropiedades.getServer().success(function(response) {
				$rootScope.server = response.server;
			})
		}
		
		if (ionic.Platform.isAndroid()) {
			$cordovaFile.checkFile("file:///data/data/com.ionicframework.fastpicapp621531/files/", "fastpic.conf")
			.then(function(success) {
				$cordovaFile.readAsText("file:///data/data/com.ionicframework.fastpicapp621531/files/", "fastpic.conf")
				.then(function(result) {
					console.log('Encontre archivo y lo voy a leer ' + success);
	                items = JSON.parse(result);
	                console.log(items);
	                $rootScope.server = items.server;
				}, function(err) {})
			}, function(error) {
				$cordovaFile.writeFile("file:///data/data/com.ionicframework.fastpicapp621531/files/", "fastpic.conf", '{"server": "http://finanzas.seseqro.gob.mx/fastpic-service"}', true).then(function() {console.log('no lo encontre hago uno ' + error);})
			})
		}*/
	}
	
	$scope.makeWarning = function() {
		$('#avisoError').addClass('ui red message');
	};
	$rootScope.bodyClass = 'hold-transition login-page';
	
	$scope.slider = function() {
		//console.log($scope.server);	
		$state.go('slider');
	}
})
.controller('UsersCtrl', function($scope, $rootScope, UserService, $http, $cargaPropiedades, $ionicPopup, $timeout,$ionicLoading) 
{
/*
 * $cargaPropiedades.getServer().success(function(response) { $rootScope.server =
 * response.server; })
 */
	 $scope.show = function() {
		    $ionicLoading.show({
		      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		    });
		  };

		  $scope.hide = function(){
		        $ionicLoading.hide();
		  };
		
	$scope.loadUsers = function() {
		
		$cargaPropiedades.getServer().success(function(response) {
			$rootScope.server = response.server;
			$http.get($rootScope.server + '/fastpic/barcode/user/getAllUsers').then(function(response) {
				$scope.show($ionicLoading);
				$scope.users = response.data.User;
				$scope.visibleusers = response.data.User;
				if ($scope.currentUser !== undefined) {
					$scope.selectUser($scope.currentUser.username);
				}
				$scope.hide($ionicLoading);
			});
		})
		
	}
	
	$scope.selectUser = function(user) {
		// $('#enable-code').addClass('hidden');
		$('.list-group-item').each(function (index) {
            var cl = $(this).attr('class');
            if (cl.search("active") != -1) {
                $(this).attr('class', 'list-group-item')
            }
        })
		$('#button-' + user).button('toggle');
		// $('#disenableCodes').empty();
		// showDataScreen(codigo);
		showUserData(user);
	}	
	
	/*
	 * $http.get($rootScope.server +
	 * '/fastpic/barcode/user/getAllUsers').then(function(response) {
	 * $scope.users = response.data; //console.log($scope.users);
	 * //console.log(response.data.User.length);
	 * 
	 * if (response.data.User.length >= 1) { for (i = 0; i <
	 * response.data.User.length; i++) {
	 * //console.log(response.data.User[i].username);
	 * $('#lista-usuarios').append("<button type='button'
	 * class='list-group-item' id-value='" + response.data.User[i].username + "'
	 * id='button" + response.data.User[i].username + "'>" +
	 * response.data.User[i].username + "</button>"); }
	 * $('.list-group-item').on('click', function () {
	 * $('.list-group-item').each(function (index) { var cl =
	 * $(this).attr('class'); if (cl.search("active") != -1) {
	 * $(this).attr('class', 'list-group-item') } }) $(this).button('toggle'); //
	 * showDataScreen($(this).text()); }); } else {
	 *  } });
	 */
	$scope.adduser = function() {
		  $scope.data = {};

		  //var temp='<div class="list"><label class="item item-input item-stacked-label"><span class="input-label">First Name</span><input type="text" placeholder="John"></label><label class="item item-input item-stacked-label"><span class="input-label">Last Name</span><input type="text" placeholder="Suhr"></label><label class="item item-input item-stacked-label"><span class="input-label">Email</span><input type="text" placeholder="john@suhr.com"></label></div>'
		  
		  
		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: '<div class="list"><label class="item item-input item-stacked-label"><span class="input-label">Name</span><input type="text" ng-model="data.name"></label><label class="item item-input item-stacked-label"><span class="input-label">User</span><input type="text" ng-model="data.user"></label><label class="item item-input item-stacked-label"><span class="input-label">Password</span><input type="Password" ng-model="data.pass"></label></div>',
		    title: 'Add User',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel' },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.data.name ||!$scope.data.user||!$scope.data.pass) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else {
		            console.log($scope.data.name,$scope.data.user,$scope.data.pass);
		            $http.put($rootScope.server + '/fastpic/barcode/user/insert', { nombre: $scope.data.name, password: $scope.data.pass, ultimoAcceso: null, username: $scope.data.user})
		            $scope.loadUsers();
		          }
		        }
		      }
		    ]
		  });

	};

	
	
	$scope.updateUser = function() 
	{
        $('#myModalChangePassword').modal();
	};
	
	$scope.cancelChgPassword = function() {
		$('#insert-pass').val('');
		$('#myModalChangePassword').modal('hide');
	}
	
	$scope.changePassword = function(user,nombre) {
		 $scope.data = {};

		  //var temp='<div class="list"><label class="item item-input item-stacked-label"><span class="input-label">First Name</span><input type="text" placeholder="John"></label><label class="item item-input item-stacked-label"><span class="input-label">Last Name</span><input type="text" placeholder="Suhr"></label><label class="item item-input item-stacked-label"><span class="input-label">Email</span><input type="text" placeholder="john@suhr.com"></label></div>'
		  
		  
		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: '<input type="password" ng-model="data.pass">',
		    title: 'Change Password',
		    subTitle: 'Please write you new password',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel'},
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.data.pass) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else {
		            console.log($scope.data.pass,user,nombre);
		            $http.post($rootScope.server + '/fastpic/barcode/user/update', { nombre: nombre, password:$scope.data.pass , ultimoAcceso: null, username: user})
		          }
		        }
		      }
		    ]
		  });
		  
		//$http.post($rootScope.server + '/fastpic/barcode/user/update', { nombre: $scope.currentUser.nombre, password: $('#insert-pass').val(), ultimoAcceso: null, username: $scope.currentUser.username})
    	//console.log($scope.currentUser);
		//$('#insert-pass').val('');
        //$('#myModalChangePassword').modal('hide');
	}
	
	$scope.delUser = function(id) {
		console.log(id);
		$http.post($rootScope.server + '/fastpic/barcode/user/delete', { username: id })
    	.then(function(result){
    		$scope.loadUsers();
    	})
	}
	
	$scope.searchUser = function(id) {
		if (id !== undefined) {
			//console.log(id);
			//console.log($scope.users);
			$scope.visibleusers = [];
			for (i=0; i < $scope.users.length; i++) {
				if( $scope.users[i].username.indexOf(id) > -1 ) {	
					console.log($scope.users[i].username);
					$scope.visibleusers.push($scope.users[i]);
					//$('#panel-info').addClass('hidden');
				    //$('#lista-codigos').append("<button type='button' class='list-group-item' id-value='" + $scope.barcodes[i].barcode + "' id='button" + $scope.barcodes[i].barcode + "'>" + $scope.barcodes[i].barcode + "</button>");
				}
				
			}
		} else {
			console.log($scope.captureUser);
			$scope.visibleusers = [];
			for (i=0; i < $scope.users.length; i++) {
				if( $scope.users[i].username.indexOf($scope.captureUser) > -1 ) {	
					console.log($scope.users[i].username);
					$scope.visibleusers.push($scope.users[i]);
					//$('#panel-info').addClass('hidden');
				    //$('#lista-codigos').append("<button type='button' class='list-group-item' id-value='" + $scope.barcodes[i].barcode + "' id='button" + $scope.barcodes[i].barcode + "'>" + $scope.barcodes[i].barcode + "</button>");
				}
				
			}
		}
		
	}
	
	function showUserData(user) 
	{
        //$('#image-container-3').empty();
        $('#panel-info').removeClass('hidden');
        $http.post($rootScope.server + '/fastpic/barcode/user/getUserByObject/normal', { username: user }).then(function(response) {
        	$scope.currentUser = response.data.User[0];
        });
        
    }
	
	
})
.controller('BarcodesCtrl', function($scope, $filter, $rootScope, $http, UserService, $cargaPropiedades, $cordovaBarcodeScanner, $ionicPopup, $state, $ionicHistory, $ionicPlatform, $cordovaCamera ,$timeout, $ionicTabsDelegate, $ionicLoading) 
{
	 $scope.show = function() {
		    $ionicLoading.show({
		      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		    });
		  };

		  $scope.hide = function(){
		        $ionicLoading.hide();
		  };
		  
	var oldSoftBack = $rootScope.$ionicGoBack;
	
	$rootScope.$ionicGoBack = function() {
		$ionicHistory.goBack();
	};
	var doCustomBack= function() {
	    // do something interesting here
		//console.log($state.current.url);
		if ($state.current.url == "/login"){
			ionic.Platform.exitApp();
		}
		else{
			$ionicHistory.goBack(); //$state.go('login');
		}
		//	$ionicHistory.goBack();
		}; 
		
	// registerBackButtonAction() returns a function which can be used to deregister it
	var deregisterHardBack= $ionicPlatform.registerBackButtonAction(
		doCustomBack, 101
	);

	$scope.$on('$destroy', function() {
		deregisterHardBack();
	});
	
	$scope.slider = function() {
		//console.log($scope.server);	
		$state.go('slider');
	}
	$scope.back = function() {
		//console.log($scope.server);	
		$state.go('principal');
	}
		
	$scope.ScanBarcodesearch = function() {
		
	      $cordovaBarcodeScanner.scan().then(function(barcodeData) 
		  {
				var s = "Result: " + barcodeData.text + "<br/>" +
				"Format: " + barcodeData.format + "<br/>" +
				"Cancelled: " + barcodeData.cancelled;
				console.log(s);
				if (barcodeData.cancelled == true)
					{
					 var alertPopup = $ionicPopup.alert({
			                title: 'Scan failed!'
			            });
					}
				else {
					$scope.captureCode = barcodeData.text;
				}
				//$scope.find(barcodeData.text);
				$scope.searchBarcode();
	      }, function(error) {
	        alert("Scanning failed: " + error);
	      });
		}
	
	$scope.columnNum = 3;
	
	$scope.loadCodes = function() {
		$http.get($rootScope.server + '/fastpic/barcode/getAllCodes').then(function(response) {
			//$scope.show();
			$scope.barcodes = response.data.Barcode;
			$scope.visibleBarcodes = response.data.Barcode;
			if ($scope.currentBarcode !== undefined) {
				$scope.selectCode($scope.currentBarcode.barcode);
			}
		});
	}
	
	$scope.selectCode = function(codigo, openImages) {
		//console.log($ionicTabsDelegate);
		if (openImages !== undefined) {
			$state.go('barcodesImgs');
		}
		$http.get($rootScope.server + '/fastpic/barcode/getByCode/' + codigo).then(function(response) {
        	$scope.currentBarcode = response.data.Barcode[0];
        	$rootScope.currentBarcode = $scope.currentBarcode;
        });
	}	
	
	$scope.searchEntrada = function(id) {
			$scope.searchBarcode($scope.captureCode);
	}
	$scope.searchBarcode = function(id) {
		if (id !== undefined) {
			console.log(id);
			$scope.visibleBarcodes = [];
			for (i=0; i < $scope.barcodes.length; i++) {
				if( $scope.barcodes[i].barcode.indexOf(id) > -1 ) {	
					console.log($scope.barcodes[i].barcode);
					$scope.visibleBarcodes.push($scope.barcodes[i]);
					//$('#panel-info').addClass('hidden');
				    //$('#lista-codigos').append("<button type='button' class='list-group-item' id-value='" + $scope.barcodes[i].barcode + "' id='button" + $scope.barcodes[i].barcode + "'>" + $scope.barcodes[i].barcode + "</button>");
				}
				
			}
		} else {
			console.log($scope.captureCode);
			$scope.visibleBarcodes = [];
			for (i=0; i < $scope.barcodes.length; i++) {
				if( $scope.barcodes[i].barcode.indexOf($scope.captureCode) > -1 ) {	
					console.log($scope.barcodes[i].barcode);
					$scope.visibleBarcodes.push($scope.barcodes[i]);
					//$('#panel-info').addClass('hidden');
				    //$('#lista-codigos').append("<button type='button' class='list-group-item' id-value='" + $scope.barcodes[i].barcode + "' id='button" + $scope.barcodes[i].barcode + "'>" + $scope.barcodes[i].barcode + "</button>");
				}
				
			}
		}
	}
	
	// Apartado de Manipulación de Codigos
	
	$scope.addCode = function() {
		$cordovaBarcodeScanner.scan().then(function(barcodeData) 
				  {
						var s = "Result: " + barcodeData.text + "<br/>" +
						"Format: " + barcodeData.format + "<br/>" +
						"Cancelled: " + barcodeData.cancelled;
						console.log(s);
						if (barcodeData.cancelled == true)
							{
							 var alertPopup = $ionicPopup.alert({
					                title: 'Scan failed!'
					            });
							}
						else {
							$scope.saveCode(barcodeData.text);
						}
						//$scope.find(barcodeData.text);
			      }, function(error) {
			        alert("Scanning failed: " + error);
			      });
       };
        	   
	
	$scope.saveCode = function(id) {
		$http.post($rootScope.server + '/fastpic/barcode/insert', { barcode: id, images: null })
        .then(function (result) {
        	$scope.loadCodes();
        });
      //  $('#myModalAddCode').modal('hide');
      //  $('#insertCode').val('');
	}
	
	$scope.cancelAddCode = function() {
        $('#myModalAddCode').modal('hide');
        $('#insertCode').val('');
	}

    $scope.enableCode = function(codigo) {
    	$http.get($rootScope.server + '/fastpic/barcode/getByCode/' + codigo).then(function(response) {
        	$scope.currentBarcode = response.data.Barcode[0];
        	$scope.currentBarcode.status = 'D';
        	console.log($scope.currentBarcode);
        	$http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode)
        	.then(function(result) {
        		$scope.loadCodes();
        	});
        });
    }
    
    $scope.test = function() {
    	console.log($scope.currentBarcode);
    }
    
    $scope.disableCode = function(codigo) {
    	$http.get($rootScope.server + '/fastpic/barcode/getByCode/' + codigo).then(function(response) {
        	$scope.currentBarcode = response.data.Barcode[0];
        	$scope.currentBarcode.status = 'E';
	    	console.log($scope.currentBarcode);
	    	$http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode)
	    	.then(function(result) {
	    		$scope.loadCodes();
	    	});
        });
    }
    
    // Apartado de Manipulación de Imagenes
    
    $scope.addImg = function() {
    	$('#myModalLabel').empty();
    	$('#myModalBody').empty();
    	$('#myModalBody').append('<input id="MyImageOrder" type="text" /><input id="MyFileUpload" type="file" accept="image/jpeg" />');
    	$('#myModal').modal();
        $('#cancel-modal-button').on('click', function () {
        $('#myModal').modal('hide');
        });
        
    }
    
    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1280,
            targetHeight: 960,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imgData) {
        	//console.log("break1");
            $scope.imgURI = imgData;
            $scope.currentBarcode.images.push({ imageData: $scope.imgURI, imageOrder: ($scope.currentBarcode.images.length + 1)});
            //console.log("break2");
            //console.log($scope.currentBarcode);
            $http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode)
            .then(function(result) {
        		$scope.selectCode($scope.currentBarcode.barcode);
        		//console.log("break3");
        	});
	    	}, function(err) {
	    		console.log("cancelado");
	    	});
    }
    
	$scope.ChOrder = function() {
		$scope.forChange = 1;
    }
    
	$scope.CancelOrder = function() {
		$scope.forChange = 0;
    }
	
	$scope.OkOrder = function() {			
		for (i=0; i<$scope.currentBarcode.images.length; i++) {
			for(j=0; j<$scope.currentBarcode.images.length; j++) {
				if ($('.imageId')[i].value== $scope.currentBarcode.images[j].imageId) {	
					$scope.currentBarcode.images[j].imageOrder = $('.imageOrder')[i].value;
				}
			}
		}		
		console.log($scope.currentBarcode);
		$http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode);
		$scope.forChange = 0;
    }
    
    $scope.delImg = function(id) {
		for (e = 0; e < $scope.currentBarcode.images.length; e++) {
			var currentBarcodeCode = $scope.currentBarcode.images[e].imageId;
			var code = parseInt(id);
			if (currentBarcodeCode == code) {
				$scope.currentBarcode.images.splice(e,1);
			}
		}
    	console.log($scope.currentBarcode);
    	$http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode)
    	.then(function(result) {
    		$scope.selectCode($scope.currentBarcode.barcode);
    	});
    }

    function showDataScreen(id) 
	{
        $('#image-container-1').empty();
        $('#image-container-2').empty();
        $('#image-container-3').empty();
        $('#panel-info').removeClass('hidden');

        $http.get($rootScope.server + '/fastpic/barcode/getByCode/' + id).then(function(response) {
        	$scope.currentBarcode = response.data.Barcode[0];
        });
    }
	
	$scope.takePhoto=function (){
	    
	}
    
    function showDataScreen2(id) 
		{
		
        $('#data-container').empty();
        $('#panel-info').removeClass('hidden');
		$('#botones').addClass('hidden');
		$('#botones2').removeClass('hidden');
		//console.log(id);
        $http.get($rootScope.server + '/fastpic/barcode/getByCode' + '/' + id).then(function(response) {
			
        	$scope.currentBarcode = response.data.Barcode[0];
        	$scope.columns.push = [];
        	$scope.columns.push = [];
        	$scope.columns.push = [];
        	if (response.data.Barcode[0].images.length >= 1) {
                $('#data-container').append('<div id="row"><div class="col-md-4" id="image-container-1"></div><div class="col-md-4" id="image-container-2"></div><div class="col-md-4" id="image-container-3"></div></div>');
				//console.log("Aqui 2");
                for (i = 0; i < response.data.Barcode[0].images.length; i++) {
				//console.log("Aqui 3");
                    $('#image-container-' + ((i % 3) + 1)).append('<div class="panel panel-default imagen-clickable"><div class="panel-heading"><input class="imageOrder" type="text" value="' + response.data.Barcode[0].images[i].imageOrder + '"/></div><div class="panel-body"><input type="hidden" id="createdBy" value="' + response.data.Barcode[0].images[i].createdBy + '"/><input type="hidden" id="creationDate" value="' + response.data.Barcode[0].images[i].creationDate + '"/><input type="hidden" class="imageId" value="' + response.data.Barcode[0].images[i].imageId + '"/><img src="data:image/jpeg;base64,' + response.data.Barcode[0].images[i].imageData + '" class="img-thumbnail img-responsive"/></div></div>');
                }
               
            }
            else if (response.data.Barcode[0].images.length == 0) {
            	
            }
        });
    }
})
.directive('myImageContainer', function() {
	
	function link(scope, element, attrs) {
		scope.$watch('currentBarcode', function(newVal, oldVal) {
			showImageScreen(newVal, oldVal, 0);
		})
		
		scope.$watch('columnNum', function(newVal, oldVal) {
			showImageScreen(scope.currentBarcode, oldVal, 0);
		})
		
		scope.$watch('forChange', function(newVal, oldVal) {
			showImageScreen(scope.currentBarcode, oldVal, newVal);
		})
		
		function showImageScreen(newVal, oldVal, forChange) {
		
			if (forChange == 0) {
				$('#botones').removeClass('hidden');
				$('#botones2').addClass('hidden');
			}
			else if (forChange == 1) {
				$('#botones').addClass('hidden');
				$('#botones2').removeClass('hidden');
			}
				
			if (newVal !== undefined) {
				element.empty();
				if(newVal.images.length === 0) {
					element.append('<h1>This code has no images</h1>');
				}
				else {
					
					newVal.images = newVal.images.sort(function(a, b) {
						return b.imageOrder < a.imageOrder ?  1 : b.imageOrder > a.imageOrder ? -1 : 0;                   
					});
					
					var imageContainer = '<div id="row">';
					
					for (i = 0; i < attrs.columnNum; i++) {
						imageContainer = imageContainer + '<div class="col-md-' + 12 / attrs.columnNum + '" id="image-container-' + (i+1) + '">'
						
						for (e = i; e < newVal.images.length; e = e + parseInt(attrs.columnNum)) {
							if (forChange == 1) {
								imageContainer = imageContainer + '<div class="panel panel-default imagen-clickable"><div class="panel-heading"><input class="imageOrder" type="text" value="' + newVal.images[e].imageOrder + '"/></div><div class="panel-body"><input type="hidden" id="createdBy" value="' + newVal.images[e].createdBy + '"/><input type="hidden" id="creationDate" value="' + newVal.images[e].creationDate + '"/><input type="hidden" class="imageId" value="' + newVal.images[e].imageId + '"/><img src="data:image/jpeg;base64,' + newVal.images[e].imageData + '" class="img-thumbnail img-responsive"/></div></div>';
							}
							else if (forChange == 0) {
								imageContainer = imageContainer + '<div class="panel panel-default imagen-clickable"><div class="panel-heading">' + newVal.images[e].imageOrder + '</div><div class="panel-body" style="align: center;"><input type="hidden" id="createdBy" value="' + newVal.images[e].createdBy + '"/><input type="hidden" id="creationDate" value="' + newVal.images[e].creationDate + '"/><input type="hidden" class="imageId" value="' + newVal.images[e].imageId + '"/><img src="data:image/jpeg;base64,' + newVal.images[e].imageData + '" class="img-thumbnail img-responsive"/></div></div>';
							}
						}
						
						imageContainer = imageContainer + '</div>';
					}
					
					imageContainer = imageContainer + '</div>';
					
					element.append(imageContainer);
					
					if (forChange == 0) {
						$('.imagen-clickable').on('click', function () {
		                    var cl = $(this).attr('class');
		                    if (cl.search("primary") != -1) {
		                        $(this).attr('class', 'panel panel-default imagen-clickable')
		                    }
		                    else {
		                        $(this).attr('class', 'panel panel-primary imagen-clickable')
		                    }
		                });
					}
				}
			} else {
				element.empty();
				element.append('<h1>Select a code</h1>')
			}
		}
	}
	
	return {
		link: link
	}
	
})

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
})
.directive('usSpinner',   ['$http', '$rootScope', '$ionicLoading', function ($http, $rootScope, $ionicLoading){
    return {
        link: function (scope, elm, attrs)
        {
            if(attrs.$attr.usSpinnerStandalone) return;
            $rootScope.spinnerActive = false;
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (loading)
            {
                $rootScope.spinnerActive = loading;
                if(loading){
                	$ionicLoading.show({
          		      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
          		    });
                }else{
         		    $ionicLoading.hide();
                }
            });
        }
    };
}]);
