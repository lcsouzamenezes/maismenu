angular.module('cardapioAdminApp.controllers', [])

.controller('DashboardController', function($scope, $state, $stateParams, API){

    console.log('controller: Dashboard Controller');

    // $scope.uploaddir = API.upload;

})

.controller('ProductsController', function($rootScope, $scope, $mdDialog, $http, toast, PRODUCTS, API){

    console.log('controller: Products Controller');


    var bookmark;

    $scope.selected = [];

    $scope.query = {
        limit     : 5,
        order     : 'title',
        page      : 1
    };


    $scope.removeProduct = function(id, index, ev){

        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Deseja remover este Produto?')
            .content('Este produto será removido permanentemente.')
            .ariaLabel('Remover Produto')
            .ok('DELETAR')
            .cancel('CANCELAR')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {

            $http.delete(API.api +'/products/'+ id)
            .then(function(res) {
                console.log(index);
                // $scope.products = res;
                $scope.products.splice(index, 1);
                toast.msgToast('Produto  ...Deletado!');
            });

        });
    },

    $scope.removeProducts = function (ev, index) {
        var items   = $scope.selected;
        var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Deseja deletar os Produtos selecionados?')
        .content('* Estes produtos serão removidos permanentemente.')
        .ariaLabel('Remover Produtos')
        .ok('DELETAR')
        .cancel('CANCELAR')
        .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {

            angular.forEach(items, function(item){

                var itemIndex = $scope.client.products.indexOf(item);
                $scope.selected = [];
                $rootScope.client.products.splice(itemIndex, 1);
                $rootScope.client.put({client: $rootScope.client.client})
                .then(function(res){
                    $rootScope.client = res;
                    toast.msgToast('Produto  ...Deletado!');
                });

            });
        });
    };

    $scope.cloneProduct = function(index) {

        $rootScope.client.products.push(angular.copy($rootScope.client.products[index]));

        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast($rootScope.client.products[index].title+ ' clonado, atualizando...');
        });

    };

    $scope.onPaginate = function() {
        $scope.selected = [];
    };

})

.controller('AddProductsController', function($rootScope, $scope, $state, toast, slugify){

    console.log('controller: Add Product Controller');


    $scope.product = {
        _created_on: new Date()
    };

    $scope.saveProduct = function(product){

        if(!$rootScope.client.products) $rootScope.client.products = [];

        $rootScope.client.products.push(product);

        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            $state.go('admin.products', {client: $rootScope.client.client});
            toast.msgToast(product.title+ ' criado!');
        });

    };

    $scope.slugIt = function(title){
        $scope.product.slug = slugify.generate(title);
    };

})

.controller('EditProductsController', function($rootScope, $scope, $state, $stateParams, $http, slugify, toast, CLIENTS, PRODUCTS, API){

    console.log('controller: Edit Product Controller');

    var id = $stateParams.id;

    console.log('product id: ' +id);


    $http.get(API.api +'/products/'+ id)
    .then(function(res) {
        console.log(res);
        $scope.product = res.data;
        $scope.product.created_on = new Date($scope.product.created_on);
    });

    $scope.saveProduct = function(product){

        console.log(product);

        //$scope.product.one($scope.product.id ).put()

        $http.put(API.api +'/products/' +$scope.product.id, product)

        .then(function(res){

            $scope.product = res;
            $scope.product.created_on = new Date($scope.product.created_on);

            toast.msgToast('Produto #' +$scope.product.id+ ' atualizado!');

        }, function(err){

            toast.msgToast('Ocorreu um erro ao atualizar o produto');

        });
    };

    $scope.update = function(msg){

        $rootScope.client.put()

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast(msg);
        });
    };

    $scope.slugIt = function(title){
        $scope.product.slug = slugify.generate(title);
    };

    $scope.commentAproved = function(index) {
        $scope.product.comments[index].status = true;
        $scope.update('Comentário aprovado.');
    };
    $scope.commentDisaproved = function(index) {
        $scope.product.comments[index].status = false;
        $scope.update('Comentário pendente.');
    };
    $scope.commentRemove = function(index) {
        $scope.product.comments.splice(index, 1);
        $scope.update('Comentário excluído.');
    };

})

.controller('ProductsCatsController', function($rootScope, $scope, $mdDialog, slugify, toast, CLIENTS){

    console.log('controller: Products Cats Controller');


    $scope.catEditing = false;

    $scope.addTax = function(cat){
        if(!$scope.catEditing) {
            if(!$rootScope.client.categories) $rootScope.client.categories = [];
            $rootScope.client.categories.push(cat);
        }
        $rootScope.client.put({client: $rootScope.client.client})
        .then(function(res){
            $scope.catEditing = false;
            $rootScope.client = res;
            cat = "";
            toast.msgToast('Categorias atualizadas!');
        });
    };

    $scope.editTax = function(index){
        $scope.catEditing = true;
        $scope.cat = $rootScope.client.categories[index];
    };

    $scope.remTax = function(ev, index){
        var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Deseja deletar a Categoria selecionada?')
        .content('* Esta categoria será removida permanentemente.')
        .ariaLabel('Remover Categoria')
        .ok('DELETAR')
        .cancel('CANCELAR')
        .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
            $rootScope.client.categories.splice(index, 1);
            $rootScope.client.put({client: $rootScope.client.client})
            .then(function(res){
                $rootScope.client = res;
                toast.msgToast('Categorias atualizadas!');
            });

        });
    };

    $scope.slugIt = function(title){
        $scope.cat.slug = slugify.generate(title);
    };

})

.controller('BannersController', function($rootScope, $scope, $state, $stateParams, $mdDialog, toast, CLIENTS){

    console.log('controller: Banners Controller');


    var bookmark;

    $scope.selected = [];

    $scope.filter = {
        options: {
            debounce: 500
        }
    };

    $scope.query = {
        limit     : 10,
        order     : 'title',
        page      : 1
    };

    $scope.removeFilter = function() {
        $scope.filter.show = false;
        $scope.query.filter = {};

        if ($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
        }
    };

    $scope.$watch('query.filter', function(newValue, oldValue) {
        if (!oldValue) {
            bookmark = $scope.query.page;
        }
        if (newValue !== oldValue) {
            $scope.query.page = 1;
        }
        if (!newValue) {
            $scope.query.page = bookmark;
        }
    });

    $scope.removeBanner = function(index, ev){
        var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Deseja deletar este Banner?')
        .content('* Este banner será removido permanentemente.')
        .ariaLabel('Remover Banner')
        .ok('DELETAR')
        .cancel('CANCELAR')
        .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
            $rootScope.client.banners.splice(index, 1);
            $rootScope.client.put({client: $rootScope.client.client})
            .then(function(res){
                $rootScope.client = res;
                toast.msgToast('Banner deletado.');
            });
        });
    },

    $scope.removeBanners = function (ev, index) {
        var items   = $scope.selected;
        var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Deseja deletar os Banners selecionados?')
        .content('* Estes banners serão removidos permanentemente.')
        .ariaLabel('Remover Banners')
        .ok('DELETAR')
        .cancel('CANCELAR')
        .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {

            angular.forEach(items, function(item){

                var itemIndex = $scope.client.banners.indexOf(item);
                $scope.selected = [];
                $rootScope.client.banners.splice(itemIndex, 1);
                $rootScope.client.put({client: $rootScope.client.client})
                .then(function(res){
                    $rootScope.client = res[0];
                    toast.msgToast('Banner deletado.');
                });

            });
        });
    };

    $scope.cloneBanner = function(index) {

        $rootScope.client.banners.push(angular.copy($rootScope.client.banners[index]));

        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast('Banner ' +$rootScope.client.banners[index].title+ ' clonado, atualizando.');
        });

    };

})

.controller('AddBannersController', function($rootScope, $scope, toast, CLIENTS){

    console.log('controller: Add Banner Controller');


    $scope.banner = {
        created: new Date()
    };

    $scope.saveBanner = function(banner){

        if(!$rootScope.client.banners) $rootScope.client.banners = [];

        $rootScope.client.banners.push(banner);

        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast('"' + banner.title+ '" banner criado.');
        });

    };

})

.controller('EditBannersController', function($rootScope, $scope, $state, $stateParams, toast, CLIENTS){

    console.log('controller: Edit Banner Controller');


    $scope.bannerIndex = $stateParams.banner;

    $scope.banner = $rootScope.client.banners[$scope.bannerIndex];
    $scope.banner.created = new Date($scope.banner.created);

    $scope.saveBanner = function(){

        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast('Banner ' +$rootScope.client.banners[$scope.bannerIndex].title+ ' atualizado.');
        });
    };

})

.controller('SettingsController', function($rootScope, $scope, $state, $timeout, $stateParams, toast, CLIENTS) {

    console.log('controller: Config Controller');


    $scope.updateConfig = function(){
        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast('Informações atualizadas!');
        });
    };

    //themes
    $scope.themelst = [
        {name: 'Padrão Dark',   value: 'def-dark'},
        {name: 'Padrão White',  value: 'def-white'},
        {name: 'Indigo Dark',   value: 'indigo-dark'},
        {name: 'Indigo White',  value: 'indigo-white'},
        {name: 'Teal Dark',     value: 'teal-dark'},
        {name: 'Teal White',    value: 'teal-white'},
    ];

})

.controller('MediaController', function($rootScope, $scope, $http, $q, toast, $mdDialog, FileUploader, API) {

    console.log('controller: MediaController');


    $scope.selectedmedia = [];
    $scope.errors = [];


    $scope.setMedia = function(item, index){
        if ($scope.selectedmedia.indexOf(item) === -1) {
            $scope.selectedmedia.push(item);
        }
        else {
            $scope.selectedmedia.splice($scope.selectedmedia.indexOf(item), 1);
        }
    };

    var uploader = $scope.uploader = new FileUploader({
        url        : API.uploader + 'uploader.php',
        autoUpload : true,
    });

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onAfterAddingFile = function(fileItem) {
        fileItem.file.name = $rootScope.client.client + "_" + fileItem.file.name;
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
        toast.msgToast(fileItem+ ' : ' +response);
    };

    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        var image = {
            filename: fileItem.file.name,
            size    : fileItem.file.size
        };
        $rootScope.client.media.push(image);
    };

    uploader.onCompleteAll = function() {
        $rootScope.client.put({client: $rootScope.client.client})

        .then(function(res){
            $rootScope.client = res;
            toast.msgToast('Arquivos de imagens atualizados com sucesso.');
        });

    };


    $scope.deleteImgs = function (ev, index) {
        var items   = $scope.selectedmedia;
        var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Deseja deletar as imagens selecionadas?')
        .content('* Estas imagens serão removidas permanentemente.')
        .ariaLabel('Remover Imagens')
        .ok('DELETAR')
        .cancel('CANCELAR')
        .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {

            angular.forEach(items, function(item){

                var itemIndex = $rootScope.client.media.indexOf(item);

                $scope.selectedmedia = [];
                $rootScope.client.media.splice(itemIndex, 1);


                var req = {
                    method : 'POST',
                    url    : API.uploader + 'delete.php',
                    data   : {
                        filename: API.upload + item.filename
                    },
                    headers: {
                        'Content-Type' : 'application/json',
                        'Access-Control-Allow-Headers' : '*',
                        'Access-Control-Allow-Origin' : '*'

                    }

                };

                $http(req)
                    .then(function(res) {
                        console.log(res);
                    }, function(err) {
                        console.log(err);
                    });

                toast.msgToast('media #' +item._id+ ', deletada.');

            });

            $rootScope.client.put({client: $rootScope.client.client})

            .then(function(res){
                $rootScope.client = res;
                toast.msgToast('Arquivos de imagens atualizados com sucesso.');

                //$http.post(API.uploader + 'delete.php', item.filename);

            });


        });
    };

})

.controller('SidebarController', function($rootScope, $scope, $state, $stateParams, $mdSidenav, $timeout, $window, toast, userService, SIDEBAR){

    console.log('controller: SidebarController');


    // SIDEBAR
    var self                 = this;
    $scope.menu              = SIDEBAR;
    $scope.openMenu          = openMenu;
    $scope.closeMenu         = closeMenu;
    $scope.isSectionSelected = isSectionSelected;
    $scope.focusMainContent  = focusMainContent;

    $rootScope.$on('$locationChangeSuccess', openPage);

    // Methods used by menuLink and menuToggle directives
    this.isOpen             = isOpen;
    this.isSelected         = isSelected;
    this.toggleOpen         = toggleOpen;
    this.autoFocusContent   = false;

    var mainContentArea = document.querySelector("[role='main']");

    function closeMenu() {
        $timeout(function() { $mdSidenav('left').close(); });
    }
    function openMenu() {
        $timeout(function() { $mdSidenav('left').open(); });
    }
    function openPage() {
        $scope.closeMenu();
        if (self.autoFocusContent) {
            focusMainContent();
            self.autoFocusContent = false;
        }
    }
    function focusMainContent($event) {
        if ($event) { $event.preventDefault(); }
        $timeout(function(){
            mainContentArea.focus();
        }, 90);
    }
    function isSelected(page) {
        return SIDEBAR.isPageSelected(page);
    }
    function isSectionSelected(sectionmenu) {
        var selected = false;
        var openedSection = SIDEBAR.openedSection;
        if(openedSection === sectionmenu){
            selected = true;
        }
        return selected;
    }
    function isOpen(sectionmenu) {
        return SIDEBAR.isSectionSelected(sectionmenu);
    }
    function toggleOpen(sectionmenu) {
        return SIDEBAR.toggleSelectSection(sectionmenu);
    }

    $scope.gotoCardapio = function(){
        // $window.location.href = '/client/#!/' +$stateParams.client+ '/index';
        $window.open('/client/#!/' +$stateParams.client+ '/index', '_blank');
        console.log($stateParams.client);
    };

});
