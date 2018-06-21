angular.module('cardapioApp.services', [])

.factory('ApiRestangular', function(Restangular, API) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(API.api);
    });
})

.factory('CLIENTS', function(ApiRestangular){
    return ApiRestangular.service('clients');
})

.factory('CLIENT', function(ApiRestangular){
    return ApiRestangular.service('clients/user');
})

.service('userService', function($http, $q, $rootScope, $window, $log, CLIENTS, CLIENT, API) {

    return {

        registerClient : function(client) {

            var deferred = $q.defer();

            var adduser = {
                cep         : client.cep,
                end         : client.end,
                end2        : client.end2,
                district    : client.district,
                city        : client.city,
                state       : client.state,
                user        : client.client,
                email       : client.email,
                title       : 'Mais Menu de ' +client.client
            };

            CLIENTS.post(adduser)

            .then(function(res) {

                console.log('Usuário registrado com sucesso.');
                deferred.resolve(res);

            }, function(err) {

                console.log('Error: falha ao registrar usuário.');
                console.log(err);
                deferred.reject(err);

            });

            return deferred.promise;
        },

        checkClient : function (client) {
            return CLIENT.one(client).get()
            .then(function(res) {
                if(res) { return false; }
                else { return true; }
            });
        }
    };

})

.constant(
    'geolocation_msgs', {
        'errors.location.unsupportedBrowser'  : 'Browser does not support location services',
        'errors.location.permissionDenied'    : 'You have rejected access to your location',
        'errors.location.positionUnavailable' : 'Unable to determine your location',
        'errors.location.timeout'             : 'Service timeout has been reached'
    }
)

.factory('geolocation', ['$q', '$rootScope', '$window', 'geolocation_msgs', function ($q, $rootScope, $window, geolocation_msgs) {
    return {
        getLocation: function (opts) {
            var deferred = $q.defer();
            if ($window.navigator && $window.navigator.geolocation) {
                $window.navigator.geolocation.getCurrentPosition(function(position){
                    $rootScope.$apply(function(){
                        deferred.resolve(position);
                    });
                }, function(error) {
                    switch (error.code) {
                        case 1:
                        $rootScope.$broadcast('error',geolocation_msgs['errors.location.permissionDenied']);
                        $rootScope.$apply(function() {
                            deferred.reject(geolocation_msgs['errors.location.permissionDenied']);
                        });
                        break;
                        case 2:
                        $rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                        $rootScope.$apply(function() {
                            deferred.reject(geolocation_msgs['errors.location.positionUnavailable']);
                        });
                        break;
                        case 3:
                        $rootScope.$broadcast('error',geolocation_msgs['errors.location.timeout']);
                        $rootScope.$apply(function() {
                            deferred.reject(geolocation_msgs['errors.location.timeout']);
                        });
                        break;
                    }
                }, opts);
            }
            else {
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.unsupportedBrowser']);
                $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);});
            }
            return deferred.promise;
        }
    };
}])

.directive('userUnique', ['$q', 'userService', function($q, userService) {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.unique = function(modelValue, viewValue) {
                var deferred = $q.defer(),
                currentValue = modelValue || viewValue,
                key = currentValue;

                if (key) {
                    userService.checkClient(key, currentValue)
                    .then(function(unique) {
                        if (unique) {
                            deferred.resolve(); //It's unique
                        }
                        else {
                            deferred.reject(); //Add unique to $errors
                        }
                    });
                    return deferred.promise;
                }
                else {
                    return $q.when(true);
                }
            };
        }
    };

}]);
