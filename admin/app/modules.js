angular.module('cardapioAdminApp.modules', [])

.controller('ModulesController', function($scope, $stateParams, $http, $state, $mdDialog, toast, API, ICONS, SIDEBAR, FIELDS, MODULES) {

    console.log('controller: ModulesController');

    if($stateParams.id) {
        MODULES.one($stateParams.id).get().then(function(module) {
            $scope.module = module;
        });
    }
    else $scope.module = MODULES.one();

    FIELDS.getList().then(function(fields){
        $scope.grupos = fields;
    });

    ICONS.query(function(icons){
        $scope.iconsSelect = icons;
    });


    $scope.addTaxonomy = function(tax){
        var slugtax = slug(tax);
        if(!$scope.module.taxonomy) $scope.module.taxonomy = [];
        $scope.module.taxonomy.push({title: tax, slug: slugtax});
    };

    $scope.removeTaxonomy = function(ev, index){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Deseja deletar a Taxonomy selecionada?')
            .content('* Esta taxonomy será removida permanentemente.')
            .ariaLabel('Remover Taxonomy')
            .ok('DELETAR')
            .cancel('CANCELAR')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
            $scope.module.taxonomy.splice(index, 1);
        });
    };

    $scope.toggle = function (id, taxes) {
        $scope.module.taxonomy = taxes;
        if(!$scope.item.cats) { $scope.item.cats = []; }
        var idx = $scope.item.cats.indexOf(id);
        if (idx > -1) $scope.item.cats.splice(idx, 1);
        else $scope.item.cats.push(id);
    };

    $scope.exists = function (id, taxes) {
        if(taxes) return taxes.indexOf(id) > -1;
    };


    $scope.saveModule = function(taxes){

        $http.put(API.db+ '/' +$scope.module.slug, {desc: 'Collection: '+ $scope.module.slug}).then(function(res){
            console.log('Collection: '+$scope.module.slug+ ' criada com sucesso.');
        }, function(err){
            console.log('Collection: Erro ao criar.');
            return;
        });

        var slug        = $scope.module.slug,
            module      = $scope.module.titles,
            modules     = $scope.module.titlep;

        //$scope.modules.modules = field;
        createModuleMenu(slug, module, modules);

        $scope.module.save().then(function(){
            $state.reload('admin', 'sidebar', {reload: true});
            toast.msgToast('Módulo "'+$scope.module.title+'" ...Criado!');
        });

    };

    $scope.updateModule = function(taxes){
        var slug        = $scope.module.slug,
            module      = $scope.module.titles,
            modules     = $scope.module.titlep;

        createModuleMenu(slug, module, modules);

        $scope.module.put().then(function(res){
            $state.reload('admin', 'sidebar', {reload: true});
            toast.msgToast('Módulo "'+$scope.module.title+'" ...Atualizado!');
        });
    };

    $scope.slugify = function(str){
        $scope.module.slug = slug(str);
    };

    function createModuleMenu(slug, module, modules){
        $scope.module.type = 'toggle';
        $scope.module.pages = [
            {
              "title" : "Listar todos os "+modules,
              "type"  : "link",
              "state" : "listItems({section: '"+slug+"'})"
            },
            {
              "title" : "Adicionar "+module,
              "type"  : "link",
              "state" : "newItem({section: '"+slug+"'})"
            }
        ];

        if($scope.module.taxonomy) {
            angular.forEach($scope.module.taxonomy, function(tax) {
                $scope.module.pages.push({title: tax.title, type: "link", state: "tax({tax: '"+tax.slug+"', section: '"+slug+"'})"});
            });
        }
    }

    function slug(slugitem){
        var makeString = function(object) {
            if (object === null) {
                return '';
            }
            return '' + object;
        };

        var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșšŝťțŭùúüűûñÿýçżźž',
        to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssttuuuuuunyyczzz',
        regex = new RegExp('[' + from + ']', 'g');

        slugitem = makeString(slugitem).toString().toLowerCase().replace(regex, function (c){
            var index = from.indexOf(c);
            return to.charAt(index) || '-';
        }).replace(/[^\w\-\s]+/g, '').trim().replace(/\s+/g, '-').replace(/\-\-+/g, '-');

        return slugitem;
    }

})

.controller('ModulesListController', function($scope, $http, $mdDialog, $state, toast, API, MODULES){

    console.log('controller: ModulesListController');


    var bookmark;

    $scope.selected = [];

    $scope.filter = {
        options: {
            debounce: 500
        }
    };

    $scope.query = {
        pagesize    : '10',
        sort_by     : '-_created_on',
        page        : 1,
        count       : ''
    };

    $scope.onChange = function() {
        MODULES.getList($scope.query).then(function(res){
            $scope.modulesList = res;
        });
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
            //$scope.onChange();
        }

        if (!newValue) {
            $scope.query.page = bookmark;
            //$scope.onChange();
        }

    });

    $scope.deleteModule = function(itemdel, index, ev){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Deseja deletar este Módulo?')
            .content('* Este item será removido permanentemente.')
            .ariaLabel('Remover Item')
            .ok('DELETAR')
            .cancel('CANCELAR')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {

            $http.get(API.db+ '/' +itemdel.slug).then(function(res){

                var etag = res.data._etag.$oid;

                $http.delete(API.db+ '/' +itemdel.slug, { headers: {"If-Match": etag}}).then(function(res){
                    console.log('Collection: '+itemdel.slug+ ' deletada com sucesso.');

                    itemdel.remove(null, {"If-Match": itemdel._id.$oid}).then(function(){
                        $scope.modulesList.splice(index, 1);
                        $state.reload('admin', 'sidebar', {reload: true});
                        toast.msgToast("modules #" +itemdel._id.$oid+ ' ...Deletado!');
                    });

                }, function(err){

                    console.log('Collection: Erro ao criar.');

                });
            });

        });
    },

    $scope.deleteModules = function (ev, index) {
        var items   = $scope.selected;
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Deseja deletar os Módulos selecionados?')
            .content('* Estes itens serão removidos permanentemente.')
            .ariaLabel('Remover Items')
            .ok('DELETAR')
            .cancel('CANCELAR')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {

            angular.forEach(items, function(item){

                item.remove(null, {"If-Match": item._id.$oid}).then(function(){
                    var itemIndex = $scope.items.indexOf(item);
                    $scope.selected = [];

                    $scope.items.splice(itemIndex, 1);
                    toast.msgToast($scope.section+ " #" +item._id.$oid+ ' ...Deletados!');
                });

            });
        });
    };

})

.controller('ModulesTaxController', function($scope, $mdDialog, $state, $stateParams, toast, MODULES){

    console.log('controller: ModulesTaxController');


    var tax = $stateParams.tax,
        sec = $stateParams.section;

    MODULES.getList({filter: {slug: sec}}).then(function(res){

        var taxes = res[0].taxonomy,
            taxid = res[0]._id.$oid;

        $scope.taxonomys = taxes;
        $scope.taxonomy  = _.find(taxes, {slug: tax});

        MODULES.one(taxid).get().then(function(res){
            $scope.moduletaxes = res;
        });

    });

    $scope.saveTaxes = function(){
        $scope.moduletaxes.taxonomy = $scope.taxonomys;
        $scope.moduletaxes.save().then(function(){
            toast.msgToast('Categorias atualizadas!');
        });
    };

    $scope.addTax = function(tax){
        if(!$scope.taxonomy.tax) $scope.taxonomy.tax = [];
        $scope.taxonomy.tax.push({title: tax.title, slug: tax.slug, desc: tax.desc});
    };

    $scope.remTax = function(ev, index){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Deseja deletar a Taxonomy selecionada?')
            .content('* Esta taxonomy será removida permanentemente.')
            .ariaLabel('Remover Taxonomy')
            .ok('DELETAR')
            .cancel('CANCELAR')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
            $scope.taxonomy.tax.splice(index, 1);
        });
    };

    $scope.slugify = function(slug){
        str = slug.replace("-");
        str = angular.lowercase(str);
        str = str.replace(/[^A-Z0-9]+/ig, "-");
        $scope.tax.slug = str;
    };


});
