angular.module('cardapioClientApp.config', ['restangular'])

.config(['$mdThemingProvider', function ($mdThemingProvider) {

    $mdThemingProvider.definePalette('black', {
        '50'  : '333333',
        '100' : '333333',
        '200' : '333333',
        '300' : '333333',
        '400' : '333333',
        '500' : '222222',
        '600' : '111111',
        '700' : '333333',
        '800' : '333333',
        '900' : '333333',
        'A100': '333333',
        'A200': '333333',
        'A400': '333333',
        'A700': '000000',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
        'contrastLightColors': undefined
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('black');

}])

.config(function($mdIconProvider) {
    $mdIconProvider
      .icon('google',   'assets/images/google.svg', 32)
      .icon('facebook', 'assets/images/facebook.svg', 32)
      .icon('twitter',  'assets/images/twitter.svg', 32);
  })

.config(function(RestangularProvider) {

    RestangularProvider.setRestangularFields({
        id : "_id.$oid",
    });

    RestangularProvider.setDefaultHeaders({'Accept': 'application/hal+json', 'Content-Type': 'application/json', 'No-Auth-Challenge': 'true'});

});
