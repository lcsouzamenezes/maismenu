angular.module('cardapioAdminApp.auth', [])

.controller('LoginController', function($rootScope, $scope, $stateParams, $http, $location, $window, AuthenticationService, toast, userService) {


	$scope.login = function() {

		if($rootScope.currentUser !== $scope.user.user && $scope.user.user != 'admin'){
			toast.msgToast('Cliente ID inválido. Tente novamente.');
			return;
		}

		//Request
		userService.loginClient($scope.user)

		//Response Handler
		.then(function(res) {
			AuthenticationService.isLogged = true;
			$location.url($scope.user.user+ '/dashboard');
			toast.msgToast($scope.user.user+ ', seja bem-vindo novamente.');
		},
		function(err) {
			AuthenticationService.isLogged = false;
			toast.msgToast(err.message);
		});

	};

	$scope.gotoCardapio = function(){
		$window.location.href = '/client/#!/' +$rootScope.currentUser+ '/index';
	};

})

.controller('ResetPassController', function($scope, $stateParams, $location, toast, userService){

	$scope.resetPass = function() {
		userService.resetPass({client: $stateParams.client, email: $scope.user.email})
		.then(function(res){
			toast.msgToast('Sua senha foi resetada e enviada para o seu E-mail');
			$location.url($stateParams.client+ '/login');
		})
		.catch(function(err){
			toast.msgToast(err);
		});
	};

})

.controller('LogoutController', function($rootScope, $scope, $http, $window, $location, AuthenticationService, $log, toast, userService) {

	//Request
	userService.logoutClient()

	//Response Handler
	.then(function(profile) {
		AuthenticationService.isLogged = false;
		toast.msgToast('Volte sempre ;)');
		$location.url($rootScope.client.client+ '/login');
	},
	function(error) {
		AuthenticationService.isLogged = false;
		toast.msgToast('Ocorreu algum erro ao fazer logout.');
	});

})

.controller('ProfileController', function($rootScope, $scope, $stateParams, toast, userService) {

	console.log('controller: Profile Controller');


	$scope.changePass = function(client) {

		userService.changePass(client)

		.then(function(res) {
			toast.msgToast(res);
		},
		function(err) {
			toast.msgToast(err);
		});
	};

})


.service('userService', function($http, $q, $rootScope, $window, $log, toast, base64, USERS, API) {

	return {

		getToken : function() {
			return $window.sessionStorage.token;
		},

		compareUser : function(user) {

			var getJwtProfile = base64.getJwtProfile();
			var profileJwt = getJwtProfile.$$state.value.user;

			return profileJwt;

		},

		loginClient : function(user) {

			var deferred = $q.defer();

			$http.post(API.api+ '/login', user)

			.then(function(user) {

				if(user.data.error) {
					base64.deleteJwtFromSessionStorage();
					deferred.reject(user.data);

				} else {
					base64.saveJwtToSessionStorage(user.data.token);
					var profile = base64.getJwtProfile();
					deferred.resolve(profile);
				}

			});

			return deferred.promise;

		},

		logoutClient : function() {

			var deferred = $q.defer();

			$http.post(API.url+ '/auth/logout')

			.then(function(data, status) {
				base64.deleteJwtFromSessionStorage();
				deferred.resolve("Success with logout" + data);
			})
			.error(function(res) {
				deferred.reject(res.data);
			});

			return deferred.promise;
		},

		changePass : function(client) {

			var deferred = $q.defer();

			$http.post(API.url+ '/auth/changepass', client)

			.success(function(res) {
				deferred.resolve(res);
			})

			.error(function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		},

		resetPass : function(client) {
			var deferred = $q.defer();

			$http.post(API.url+ '/auth/resetpass', client)

			.success(function(data, status) {
				deferred.resolve();
			})

			.error(function(reason, status) {
				deferred.reject(reason);
			});

			return deferred.promise;
		}

	};

})

.factory('AuthenticationService', function($rootScope, $window) {

	var auth;

	if(!$window.sessionStorage.token) {
		auth = {
			isLogged: false
		};
	}
	if($window.sessionStorage.token) {
		auth = {
			isLogged: true
		};
	}

	$rootScope.auth = auth;
	return auth;
})

.factory('AuthInterceptor', function ($location, userService, $q) {

	return {

		request: function(config) {
			config.headers = config.headers || {};

			if (userService.getToken()) {
				config.headers.Authorization = 'Bearer ' + userService.getToken();
			}

			return config;
		},

		responseError: function(response) {
			if (response.status === 401 || response.status === 403) {
				$location.path('/login');
			}

			return $q.reject(response);
		}
	};
})






.factory('base64', function ($window, $q) {

	return {

		encode: function (input) {
			var output = "";
			return output;
		},

		// Decodes JWT
		decode: function (encodedJWT) {
			var output = encodedJWT.replace('-', '+').replace('_', '/');
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
		},

		// Get user from JWT
		getJwtProfile: function () {
			var deferred = $q.defer();
			if($window.sessionStorage.token) {
				var encodedProfile = $window.sessionStorage.token.split('.')[1];
				var decodedProfile = JSON.parse( this.decode(encodedProfile) );
				deferred.resolve(decodedProfile);
			}
			else {
				deferred.reject('No JWT Token exists in sessionStorage.');
			}
			return deferred.promise;
		},

		deleteJwtFromSessionStorage : function() {
			delete $window.sessionStorage.token;
		},

		saveJwtToSessionStorage : function(token) {
			$window.sessionStorage.token = token;
		}
	};
});
