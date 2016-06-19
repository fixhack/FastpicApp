angular.module('starter.services', [])

.factory("$cargaPropiedades", function($http) {
	function getServer() {
		return $http.get('config.properties');
	}
	return {
		getServer: getServer
	};
})
.factory("UserService", ['$http', '$localStorage', '$rootScope', function($http, $localStorage, $rootScope) {
	function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }
	
	function getClaimsFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }
	
	var tokenClaims = getClaimsFromToken();
	
	return {
        signup: function (data, success, error) {
            $http.post($rootScope.server + '/auth/token?', data).success(success).error(error)
        },
        signin: function (data, success, error) {
            $http({
            	method: 'POST',
            	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            	url: $rootScope.server + '/auth/token?grant_type=password&client_id=fastpic_web&client_secret=pic_webapp&username=' + data.username + '&password=' + data.password,
            	data: ''
            })
            .success(success)
            .error(error)
        },
        logout: function (success) {
            tokenClaims = {};
            delete $localStorage.token;
            success();
        },
        isLogged: function() {
        	var token = $localStorage.token;
            if (typeof token === 'undefined') {
            	return false;
            }
            else {
            	return true;
            	$http.get('config.properties').success(function(response) {
	            	$http.get(response.server + "/auth/token/validate", {
	            		data: '',
	            	})
	            	.success(function(response) {
	            		return true;
	            	})
	            	.error(function(response) {
	            		return false;
	            	})
            	})
            }
        },
        getTokenClaims: function () {
            return getClaimsFromToken();
        }
    };
}])
.factory("bodyClass", [function() {
	var bodyClassValue;
	function setBodyClass(string) {
		bodyClassValue = string;
	}
	function getBodyClass() {
		return bodyClassValue;
	}
	return {
		setBodyClass: setBodyClass,
		getBodyClass: getBodyClass
	};
}])
