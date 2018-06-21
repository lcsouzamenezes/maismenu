angular.module('cardapioAdminApp.auth', [])

.controller('LoginController', function($rootScope, $scope, $stateParams, $http, $location, $window, AuthenticationService, toast, userService, base64) {


    $scope.login = function() {

        if($stateParams.client !== $scope.user.client && $scope.user.client != 'admin'){
            toast.msgToast('Cliente ID inválido. Tente novamente.');
            return;
        }

        //Request
        userService.loginClient($scope.user)

        //Response Handler
        .then(function(res) {
            AuthenticationService.isLogged = true;
            $location.url($stateParams.client+ '/dashboard');
            toast.msgToast(res.client+ ', seja bem-vindo novamente.');

        },
        function(err) {
            AuthenticationService.isLogged = false;
            toast.msgToast(err);
        });

    };

    $scope.gotoCardapio = function(){
        $window.location.href = '/client/#!/' +$stateParams.client+ '/index';
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

        registerClient : function(client) {

            var deferred = $q.defer();

            $http.post(API.url+ '/auth/register', client)

            .success(function(res) {
                deferred.resolve(res);
            })
            .error(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        loginClient : function(user) {

            var deferred = $q.defer();
            
            console.log(API.url);

            $http.post(API.url+ '/auth/login', user)
            .success(function(user) {
                base64.saveJwtToSessionStorage(user.token);
                var profile = base64.getJwtProfile();
                deferred.resolve(profile);
            })

            .error(function(res) {
                base64.deleteJwtFromSessionStorage();
                deferred.reject(res);
            });

            return deferred.promise;
        },

        logoutClient : function() {
            var deferred = $q.defer();
            $http.post(API.url+ '/auth/logout')
            .success(function(data, status) {
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

    if(!$window.sessionStorage.token) {
        var auth = {
            isLogged: false
        };
    }
    if($window.sessionStorage.token) {
        var auth = {
            isLogged: true
        };
    }

    $rootScope.auth = auth;
    return auth;
})

.factory('authInterceptor', function ($rootScope, $q, $window, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        response: function (response) {
            if (response.status === 401) {
                alert('Not Logged On');
            }
            return response || $q.when(response);
        }
    };
})

.factory('base64', function ($window, $q) {
    return {
        encode: function (input) {
            var output = "";
            return output;
        },

        //Decodes JWT
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

        //Get user from JWT
        getJwtProfile: function () {
            var deferred = $q.defer();
            if($window.sessionStorage.token) {
                var encodedProfile = $window.sessionStorage.token.split('.')[1];
                var decodedProfile = JSON.parse( this.decode(encodedProfile) );
                deferred.resolve(decodedProfile);
            }
            else {
                deferred.reject("OOPS No JWT Token exists in sessionStorage!!! ");
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
