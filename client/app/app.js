angular.module('cardapioClientApp', [
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'ngSanitize',
    'angular-flexslider',
    'constants',
    'cardapioClientApp.config',
    'cardapioClientApp.controller',
    'cardapioClientApp.services'
])

//Routes
.config(function($stateProvider, $locationProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('', '/');

    $stateProvider

    .state('client',{
        url      : '/:client',
        abstract : true,

        views: {
            'sidebar@client' : {
                templateUrl : 'partials/sidebar.html',
                cache       : false
            },
            '': {
                templateUrl : 'partials/client.html',
                controller  : 'ClientController',
                cache       : false
            },
        }
    })

    .state('client.index',{
        url           : '/index',
        templateUrl   : 'partials/home.html',
        cache         : false
    })

    .state('client.product',{
        url           : '/product/:product',
        templateUrl   : 'partials/product.html',
        controller    : 'ProductController',
        cache         : false
    })

    .state('client.category',{
        url           : '/c/:category',
        templateUrl   : 'partials/category.html',
        controller    : 'CategoryController',
        cache         : false
    });


    $locationProvider.html5Mode(true).hashPrefix('!');

    // $locationProvider.hashPrefix('!');
    // $locationProvider.html5Mode({
    //     enabled     : true,
    //     requireBase : true
    // });

})

.run(function($rootScope, $state, $stateParams, CLIENTS) {

    $rootScope.$state       = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if(!$rootScope.client) {
            CLIENTS.one(toParams.client).get()

            .then(function(res){
                $rootScope.client = res[0];
            });
        }

    });

});
