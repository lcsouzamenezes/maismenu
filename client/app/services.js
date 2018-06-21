angular.module('cardapioClientApp.services', [])

.factory('ApiRestangular', function(Restangular, API) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(API.api);
    });
})

.factory('CLIENTS',function(ApiRestangular){
    return ApiRestangular.service('clients/user');
})

.factory('PRODUCTS',function(ApiRestangular){
    return ApiRestangular.service('products');
})

.factory('PRODUCT',function(ApiRestangular){
    return ApiRestangular.service('products/id');
})

.filter('uploadDir', function(API) {
    return function(url) {
        return API.upload + url;
    };
});
