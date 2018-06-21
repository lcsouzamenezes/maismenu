angular.module('cardapioAdminApp.services', ['restangular'])

.factory('ApiRestangular', function(Restangular, API) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(API.api);
    });
})

.factory('CLIENTS',function(ApiRestangular){
    return ApiRestangular.service('clients');
})

.factory('PRODUCTS_USER',function(ApiRestangular){
    return ApiRestangular.service('products/user');
})

.factory('PRODUCTS',function(ApiRestangular){
    return ApiRestangular.service('products');
})


// .factory('PRODUCT_ID',function(ApiRestangular){
//     return ApiRestangular.service('products/id');
// })

.factory('USERS',function(ApiRestangular){
    return ApiRestangular.service('users');
})

.factory('SIDEBAR', function() {

    var sections = [
        {
            "title" : "Dashboard",
            "type"  : "link",
            "state" : "admin.dashboard",
            "icon"  : "dashboard"
        },
        {
            "title": "Produtos",
            "type": "heading"
        },
        {
            "title" : "Produtos",
            "type"  : "toggle",
            "icon"  : "store",
            "pages" : [
                {
                    "title" : "Todos os Produtos",
                    "type"  : "link",
                    "state" : "admin.products"
                },
                {
                    "title" : "Adicionar Novo Produto",
                    "state" : "admin.addProduct",
                    "type"  : "link"
                },
                {
                    "title" : "Categorias de Produtos",
                    "state" : "admin.catsProduct",
                    "type"  : "link"
                }
            ]
        },
        {
            "title": "Marketing",
            "type": "heading"
        },
        {
            "title" : "Banners Promocionais",
            "type"  : "toggle",
            "icon"  : "slideshow",
            "pages" : [
                {
                    "title" : "Todos os Banners",
                    "type"  : "link",
                    "state" : "admin.banners"
                },
                {
                    "title" : "Adicionar Novo Banner",
                    "state" : "admin.addBanner",
                    "type"  : "link"
                }
            ]
        },            {
            "title": "Configurações",
            "type": "heading"
        },
        {
            "title" : "Informações",
            "type"  : "link",
            "state" : "admin.config",
            "icon"  : "settings"
        },
        {
            "title" : "Imagens",
            "type"  : "link",
            "state" : "admin.media",
            "icon"  : "image"
        }
    ];

    var self;

    return self = {
        sections: sections,

        selectSection: function(sectionmenu) {
            self.openedSection = sectionmenu;
        },
        toggleSelectSection: function(sectionmenu) {
            self.openedSection = (self.openedSection === sectionmenu ? null : sectionmenu);
        },
        isSectionSelected: function(sectionmenu) {
            return self.openedSection === sectionmenu;
        },
        selectPage: function(sectionmenu, page) {
            self.currentSection = sectionmenu;
            self.currentPage = page;
        },
        isPageSelected: function(page) {
            return self.currentPage === page;
        }
    };
})


.factory('toast', function toast($mdToast) {
    var service = {
        message: '',
        msgToast: msgToast
    };
    return service;
    function msgToast(msg) {
        this.message = msg;
        $mdToast.show(
            $mdToast.simple({position: 'top right'})
            .content(msg)
            .hideDelay(6000)
        );
    }
})

// lodash
.factory('_', function ($window) {
    return $window._;
})

// Slugify
.factory('slugify', function() {
    var self = this;
    self.generate = function(slug){
        var makeString = function(object) {
            if (object === null) {
                return '';
            }
            return '' + object;
        };

        var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșšŝťțŭùúüűûñÿýçżźž',
        to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssttuuuuuunyyczzz',
        regex = new RegExp('[' + from + ']', 'g');

        slug = makeString(slug).toString().toLowerCase().replace(regex, function (c){
            var index = from.indexOf(c);
            return to.charAt(index) || '-';
        }).replace(/[^\w\-\s]+/g, '').trim().replace(/\s+/g, '-').replace(/\-\-+/g, '-');
        return slug;
    };
    return self;
});