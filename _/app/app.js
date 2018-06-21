angular.module('cardapioApp', [
    'ui.router',
    'constants',
    'duScroll',
    'ngMessages',
    'cardapioApp.config',
    'cardapioApp.controller',
    'cardapioApp.services'
])

//Routes
.config(function($stateProvider, $locationProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

    $stateProvider

    .state('index',{
        url           : '/',
        templateUrl   : '_/partials/home.html',
        controller    : 'IndexController',
        data          : {
            pageTitle : 'cardápio App'
        }
    })

    .state('clients',{
        url           : '/clients',
        templateUrl   : '_/partials/clients.html',
        controller    : 'ClientsController',
        data          : {
            pageTitle : 'cardápio App'
        }
    });


    //$locationProvider.html5Mode(true).hashPrefix('!');


    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode({
        enabled     : true,
        requireBase : false
    });

})

.run(function($rootScope, $state, $stateParams) {

    $rootScope.$state       = $state;
    $rootScope.$stateParams = $stateParams;



    $rootScope.$on('$stateChangeSuccess', function(event, next, current){

        event.preventDefault();

        // verify if is admin or frontend
        // if($state.includes('admin') || $state.is('login')) $rootScope.cardapioIf.admin = true;
        // else if ($state.is('index')) $rootScope.cardapioIf.website = true;
        // else $rootScope.cardapioIf.frontend = true;

    });


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        // var shouldLogin = !$window.sessionStorage.token && !AuthenticationService.isLogged;
        //
        // $rootScope.Authenticated = shouldLogin;
        //
        // var isLogin = toState.name === 'login';
        // if(isLogin){
        //    return;
        // }
        //
        // if(shouldLogin) {
        //     $location.url('/login');
        //     return;
        // }

    });

});
