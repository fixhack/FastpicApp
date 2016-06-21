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
.controller('LoginCtrl', function($scope, $state, $rootScope, UserService, $cargaPropiedades, $localStorage, $ionicPopup, $ionicHistory, $ionicPlatform) {

	
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
		$state.go('principal');
    }
	$scope.submit = function() {
		var formData = {
            username: $scope.data.username,
            password: $scope.data.password
        };

        UserService.signin(formData, successAuth, function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!'
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

.controller('BarcodesCtrl', function($scope, $filter, $rootScope, $http, UserService, $cargaPropiedades, $cordovaBarcodeScanner, $ionicPopup, $state, $ionicHistory, $ionicPlatform, $cordovaCamera ,$timeout, $ionicTabsDelegate) 
{
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
	
	$scope.slider = function() {
		//console.log($scope.server);	
		$state.go('slider');
	}
	$scope.back = function() {
		//console.log($scope.server);	
		$state.go('principal');
	}
	
	$scope.ScanBarcode = function() {
		
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
				//$scope.find(barcodeData.text);
				$scope.searchBarcode(barcodeData.text);
	      }, function(error) {
	        alert("Scanning failed: " + error);
	      });
		}
	
	$scope.columnNum = 3;
	
	$scope.loadCodes = function() {
		$cargaPropiedades.getServer().success(function(response) {
			$rootScope.server = response.server;
			$http.get($rootScope.server + '/fastpic/barcode/getAllCodes').then(function(response) {
				$scope.barcodes = response.data.Barcode;
				if ($scope.currentBarcode !== undefined) {
					$scope.selectCode($scope.currentBarcode.barcode);
				}
			});
		})
	}
	
	$scope.selectCode = function(codigo) {
		//console.log($ionicTabsDelegate);
		$state.go('barcodesImgs');
        $http.get($rootScope.server + '/fastpic/barcode/getByCode/' + codigo).then(function(response) {
        	$scope.currentBarcode = response.data.Barcode[0];
        });
	}	
	
	$scope.searchBarcode = function() {
		$('#lista-codigos').empty();
		for (i=0; i < $scope.barcodes.length; i++) {
			if( $scope.barcodes[i].barcode.toUpperCase().indexOf($scope.searchCode.toUpperCase()) > -1 ) {	
				$('#panel-info').addClass('hidden');
			    $('#lista-codigos').append("<button type='button' class='list-group-item' id-value='" + $scope.barcodes[i].barcode + "' id='button" + $scope.barcodes[i].barcode + "'>" + $scope.barcodes[i].barcode + "</button>");
			}
			
			if($scope.searchCode.toUpperCase().length == 0) {
				$('#panel-info').addClass('hidden');
			}
			
		}
		$('.list-group-item').on('click', function () {
					$('.list-group-item').each(function (index) {
						var cl = $(this).attr('class');
						if (cl.search("active") != -1) {
							$(this).attr('class', 'list-group-item')
						}
					})
					$(this).button('toggle');
					showDataScreen($(this).text());
				});
		
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
						//$scope.find(barcodeData.text);
						$scope.saveCode(barcodeData.text);
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
    
    $scope.saveImg = function() {
    	var options = {
	      quality: 50,
	      destinationType: Camera.DestinationType.DATA_URL,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      allowEdit: false,
	      encodingType: Camera.EncodingType.JPEG,
	      targetWidth: 100,
	      targetHeight: 100,
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: true,
		  correctOrientation:true
	    };

	    $cordovaCamera.getPicture(options).then(function(imgData) {
	    	console.log("break1");
	    	var imageString = "data:image/jpeg;base64," + imgData;
	      $scope.currentBarcode.images.push({ imageData: imageString, imageOrder: 3 });
	      console.log("break2");
        	console.log($scope.currentBarcode);
        	$http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode)
        	.then(function(result) {
        		$scope.selectCode($scope.currentBarcode.barcode);
        		console.log("break3");
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
    
    $scope.delImg = function() {
    	var imagenes = $('div.panel-primary.imagen-clickable .imageId');
    	for (i = 0; i < imagenes.length; i++) {
    		for (e = 0; e < $scope.currentBarcode.images.length; e++) {
    			var currentBarcodeCode = $scope.currentBarcode.images[e].imageId;
    			var code = parseInt(imagenes[i].value);
    			if (currentBarcodeCode == code) {
    				$scope.currentBarcode.images.splice(e,1);
    			}
    		}
    	}
    	console.log($scope.currentBarcode);
    	$http.post($rootScope.server + '/fastpic/barcode/update', $scope.currentBarcode)
    	.then(function(result) {
    		$scope.selectCode($scope.currentBarcode.barcode);
    	});
    }
    
    $('#dwn-img').on('click', function () {
        var imagenes = $('div.panel-primary.imagen-clickable img');
        for (i = 0; i < imagenes.length; i++) {
        	var url = imagenes[i].src.replace(/^data:image\/[^;]/, 'data:application/octet-stream,name=filename.jpg');
        	window.open(url);
        }
    });

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
});
