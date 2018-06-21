angular.module('cardapioApp.config', ['restangular'])

.config(function(RestangularProvider) {

    RestangularProvider.setRestangularFields({
        id : "_id.$oid",
    });

    RestangularProvider.setDefaultHeaders({'Accept': 'application/hal+json', 'Content-Type': 'application/json', 'No-Auth-Challenge': 'true'});

});
