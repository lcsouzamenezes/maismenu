angular.module('cardapioApp.controller', ['angular.viacep'])

.controller('IndexController', function($scope, $state, $stateParams, $q, userService, geolocation, viaCep, CLIENTS) {

    console.log('controller: Cardapio Controller');

    var distance = 6;

    $scope.addclient = CLIENTS.one();

    //$scope.addclient.localization = {};

    $scope.register = {
        form : true
    };


    $scope.saveClient = function() {

        $scope.register = {
            sending  : true,
            form     : false,
            complete : false
        };

        userService.registerClient($scope.addclient)
        .then(function(res) {

            $scope.register = {
                sending  : false,
                form     : false,
                complete : true
            };

            clientReset();

        },
        function(err) {

            $scope.register = {
                sending  : false,
                complete : true,
                form     : false,
                message  : err
            };

        });

    };

    function clientReset() {
        $scope.addclient = "";
        $scope.addclient = CLIENTS.one();
    }

    $scope.getCEP = function(cep){

        if(cep && cep.length == 8) {

            viaCep.get(cep).then(function(res){

                $scope.cep = res;

                $scope.addclient.end      = $scope.cep.logradouro;
                $scope.addclient.end2     = $scope.cep.complemento;
                $scope.addclient.district = $scope.cep.bairro;
                $scope.addclient.city     = $scope.cep.localidade;
                $scope.addclient.state    = $scope.cep.uf;

                // bairro: "Embaré"
                // cep: "11025-031"
                // complemento: "de 403/404 a 535/536"
                // gia: "6336"
                // ibge: "3548500"
                // localidade: "Santos"
                // logradouro: "Rua Liberdade"
                // uf: "SP"

                //getLatLong(cep);

            });
        }
    };


    function getLatLong(local) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: local}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                $scope.addclient.localization.lat = results[0].geometry.location.lat();
                $scope.addclient.localization.lng = results[0].geometry.location.lng();

                console.log($scope.addclient.localization.lat);

            } else {
                console.log('Request failed.');
                return "Request failed.";
            }
        });
    }

    function toRad(value) {
        var RADIANT_CONSTANT = 0.0174532925199433;
        return (value * RADIANT_CONSTANT);
    }

    function calculateDistance(starting, ending) {
        var KM_RATIO = 6371;
        try {
            var dLat = toRad(ending.lat - starting.lat);
            var dLon = toRad(ending.lng - starting.lng);
            var lat1Rad = toRad(starting.lat);
            var lat2Rad = toRad(ending.lat);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = KM_RATIO * c;
            return d.toFixed(2);
        } catch(e) {
            return -1;
        }
    }

    $scope.getDistance = function(){

        $scope.loading = true;

        geolocation.getLocation().then(function(data){

            $scope.coordsAtual = {
                lat: data.coords.latitude,
                lng: data.coords.longitude
            };

            CLIENTS.getList().then(function(clients){

                $scope.clientsDistance = [];

                angular.forEach(clients, function(client) {
                    client.distance = calculateDistance($scope.coordsAtual, client.localization);

                    if(client.distance < distance && client.client != 'admin' && client.logo) {

                        $scope.clientsDistance.push(client);
                    }

                });

                $scope.loading = false;

            });

        });

    };

})

.controller('ClientsController', function($scope, CLIENTS, API) {

    $scope.API = API;

    CLIENTS.getList()

    .then(function(clients){
        // console.log(clients);
        $scope.clients = clients;
    });

})

.directive('setClassWhenAtTop', function ($window) {
    var $win = angular.element($window);

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass  = attrs.setClassWhenAtTop,
                offsetTop = element.prop('offsetTop');

            $win.on('scroll', function (e) {
                if ($window.pageYOffset >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
})

.filter('uploadDir', function(API) {
	return function(url) {
		if(url) return API.upload + url;
	};
});
