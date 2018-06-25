angular.module('cardapioClientApp.controller', [])

.controller('ClientController', function($rootScope, $scope, $stateParams, $mdSidenav, $mdBottomSheet, $mdDialog, PRODUCTS, CLIENTS, API) {

    console.log('controller: Client Controller');


    if(!$rootScope.client) {

        CLIENTS.one($stateParams.client).get()

        .then(function(res){

            $rootScope.client = res;

            // $scope.products   = $rootScope.client.products;
            // $scope.banners    = $rootScope.client.banners;
            // $scope.config     = $rootScope.client.config;

            $scope.background = {
                // "background-image": API.upload + $rootScope.client.banner
                "background-image": $rootScope.client.image
            };

        });

    } else {

        // $scope.products = $rootScope.client.products;
        // $scope.banners  = $rootScope.client.banners;
        // $scope.config   = $rootScope.client.config;

        $scope.background = {
            // "background-image": API.upload + $rootScope.client.banner
            "background-image": $rootScope.client.image
        };

    }

    PRODUCTS.one($stateParams.client).get()

    .then(function(products){
        $scope.products = products;
    });

    $scope.AprovedComments = function(comments) {
        var count = 0;
        angular.forEach(comments, function(comment){
            count += comment.status ? true : false;
        });
        return count;
    };


    $scope.toggleSidebar = function(){
        $mdSidenav('sidebar')
        .toggle();
    };


    $scope.showGridBottomSheet = function(title, image, index) {

        $mdBottomSheet.show({
            templateUrl         : 'partials/tpl/share.html',
            controller          : 'ShareController',
            clickOutsideToClose : true,
            locals              : {
                product: {
                    title : title,
                    image : image,
                    url   : 'http://maismenu.com.br/client/' +$stateParams.client+ '/product/' +index
                }
            }
        })
        .then(function(clickedItem) {

            console.log(clickedItem);

        });

    };

    $scope.addComment = function(ev, index) {

        $mdDialog.show({
            controller          : 'CommentsController',
            templateUrl         : 'partials/tpl/comments.html',
            parent              : angular.element(document.body),
            targetEvent         : ev,
            clickOutsideToClose : true,
            fullscreen          : false,
            locals              : {
                index : index,
                ev    : ev
            },
        });

    };

})

.controller('CommentsController', function($rootScope, $scope, $mdDialog, index, ev) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.addComment = function(comment){

        $scope.hide();

        var product = $rootScope.client.products[index];

        comment._created_on = new Date();
        comment.status      = false;


        if(!product.comments) product.comments = [];
        product.comments.push(comment);

        $rootScope.client.products[index] = product;

        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(false)
                .title('Avaliação Enviada')
                .textContent('Agora é só aguardar a aprovação.')
                .ariaLabel('Avaliação Enviada')
                .ok('OK')
                .targetEvent(ev)
            );
        });

    };

})

.controller('ShareController', function($scope, $mdBottomSheet, product) {

    $scope.product = product;

    $scope.providers = [
        { name: 'Google+',  icon: 'google' },
        { name: 'Facebook', icon: 'facebook' },
        { name: 'Twitter',  icon: 'twitter' },
    ];

    $scope.listItemClick = function($id) {
        var clickedItem = $scope.product;
        $mdBottomSheet.hide(clickedItem);
    };

})

.controller('ProductController', function($rootScope, $scope, $stateParams, $window, PRODUCT) {

    console.log('controller: Product Controller');


    PRODUCT.one($stateParams.product).get()
    .then(function(res) {

        console.log(res);
        $scope.product = res;

    });

    $scope.goBack = function(){
        $window.history.back();
    };

})

.controller('CategoryController', function($rootScope, $scope, $stateParams, CLIENTS) {

    console.log('controller: Category Controller');


    if(!$rootScope.client) {
        CLIENTS.getList({client: $stateParams.client})

        .then(function(res){
            $rootScope.client = res[0];

            var category = $stateParams.category;

            $scope.category = _.find($rootScope.client.categories, {slug: category});

            $scope.products = $rootScope.client.products.filter(function(item) {
                return item.categories && item.categories[category];
            });
        });

    } else {

        var category = $stateParams.category;

        $scope.category = _.find($rootScope.client.categories, {slug: category});

        $scope.products = $rootScope.client.products.filter(function(item) {
            return item.categories && item.categories[category];
        });

    }

});
