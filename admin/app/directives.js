angular.module('cardapioAdminApp.directives', [])

.directive('menuLink', function() {
    return {
        scope: {
            sectionmenu: '='
        },
        templateUrl: 'partials/tpl/menu-link.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();

            $scope.isSelected = function() {
                return controller.isSelected($scope.sectionmenu);
            };

            $scope.focusSection = function() {
                controller.autoFocusContent = true;
            };
        }
    };
})

.directive('menuToggle', [ '$timeout', function($timeout) {
    return {
        scope: {
            sectionmenu: '='
        },
        templateUrl: 'partials/tpl/menu-toggle.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            var $ul = $element.find('ul');
            var originalHeight;

            $scope.isOpen = function() {
                return controller.isOpen($scope.sectionmenu);
            };

            $scope.toggle = function() {
                controller.toggleOpen($scope.sectionmenu);
            };

            $scope.$watch(
                function () {
                    return controller.isOpen($scope.sectionmenu);
                },
                function(open) {
                    var $ul = $element.find('ul');
                    var targetHeight = open ? getTargetHeight() : 0;
                    $timeout(function () {
                        $ul.css({ height: targetHeight + 'px' });
                    }, 0, false);

                    function getTargetHeight() {
                        var targetHeight;
                        $ul.addClass('no-transition');
                        $ul.css('height', '');
                        targetHeight = $ul.prop('clientHeight');
                        $ul.css('height', 0);
                        $ul.removeClass('no-transition');
                        return targetHeight;
                    }
                }
            );

            var parentNode = $element[0].parentNode.parentNode.parentNode;
            if(parentNode.classList.contains('parent-list-item')) {
                var heading = parentNode.querySelector('h2');
                $element[0].firstChild.setAttribute('aria-describedby', heading.id);
            }
        }
    };

}])


.directive('chooseMedia', ['$mdDialog', '$rootScope', 'FileUploader', 'API', function($mdDialog, $rootScope, FileUploader, API) {
    return {
        restrict : 'AE',
        require  : 'ngModel',
        scope    : {
            options : '=',
            model   : '=ngModel'
        },
        template :
        //'<input type="hidden" ng-model="item.image">' +
        '<div layout="row" layout-align="start center">' +
        '<md-button class="md-accent" ng-click="choose($event)">Selecione</md-button>' +
        '<md-button ng-if="model" class="md-warn" ng-click="remove()">Remover</md-button>' +
        '</div>',

        link: function(scope, $scope, element, API) {

            scope.remove = function(){
                scope.model = "";
            };

            scope.choose = function(ev){

                $mdDialog.show({
                    parent              : angular.element(document.body),
                    controller          : chooseMediaControl,
                    ariaLabel           : 'Selecionar Imagem',
                    targetEvent         : ev,
                    clickOutsideToClose : true,
                    templateUrl         : 'partials/tpl/media.html',
                })

                .then(function(imagechange) {
                    scope.model = imagechange;
                });

                function chooseMediaControl($rootScope, $scope, $mdDialog, $q, toast, API) {

                    loadMedia();

                    function loadMedia() {
                        $scope.uploaddir = API.upload;
                        $scope.media = $rootScope.client.media;
                    }

                    $scope.cancelMedia = function() {
                        $mdDialog.cancel();
                    };

                    $scope.setMedia = function(imageurl, index){
                        $scope.imagechoose   = imageurl;
                        $scope.selectedMedia = index;
                    };

                    $scope.applyMedia = function(imagechange) {
                        $mdDialog.hide(imagechange);
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

                    // CALLBACKS

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

                }
            };
        }
    };
}])

.directive('chooseFileButton', function() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function() {
                angular.element(document.querySelector('#' + attrs.chooseFileButton))[0].click();
            });
        }
    };
})

.directive('mdWidget', function($rootScope, ApiRestangular){
    return {
        restrict : 'AE',
        scope    : {
            slug        : '=',
            widgettitle: '='
        },
        templateUrl: "partials/widgets/widget-default.html",
        controller: function($scope, $attrs){
            $scope.listWidgets = function(slug, widgettitle){
                ApiRestangular.all(slug).getList({pagesize: $rootScope.config.dashboard_widgets_pagesize}).then(function(res) {
                    $scope.widget_items    = res;
                    $scope.widget_pagesize = $rootScope.config.dashboard_widgets_pagesize;
                    $scope.widget_slug     = slug;
                    $scope.widget_title    = widgettitle;
                });
            };

            $scope.listWidgets($scope.slug, $scope.widgettitle);

        }
    };
})


.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});
