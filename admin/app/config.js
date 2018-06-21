angular.module('cardapioAdminApp.config', ['ng-sortable', 'md.data.table', 'textAngular', 'restangular'])

.config(['$mdThemingProvider', function ($mdThemingProvider) {
    'use strict';

    $mdThemingProvider.theme('default');

}])


// Datepicker
.config(function($mdDateLocaleProvider) {

    $mdDateLocaleProvider.months      = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    $mdDateLocaleProvider.shortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    $mdDateLocaleProvider.days        = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    $mdDateLocaleProvider.shortDays   = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    // Optional.
    //$mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];
    // Example uses moment.js to parse and format dates.
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'L', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.formatDate = function(date) {
        var m = moment(date);
        return m.isValid() ? m.format('LL') : '';

    };
    // $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
    //     return myShortMonths[date.getMonth()] + ' ' + date.getFullYear();
    // };
    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar     = 'Calendário';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir Calendário';

})

.config(['RestangularProvider', function(RestangularProvider) {

    RestangularProvider.setRestangularFields({
        id : "_id.$oid",
    });

    RestangularProvider.setDefaultHeaders({'Accept': 'application/hal+json', 'Content-Type': 'application/json', 'No-Auth-Challenge': 'true'});

}])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
