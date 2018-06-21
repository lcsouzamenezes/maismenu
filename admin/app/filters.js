angular.module('cardapioAdminApp.filters', [])

.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
			return '-';
		}
		if (typeof precision === 'undefined') {
			precision = 1;
		}
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
		number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	};
})

.filter('nospace', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/ /g, '');
	};
})

//replace uppercase to regular case
.filter('humanizeDoc', function () {
	return function (doc) {
		if (!doc) return;
		if (doc.type === 'directive') {
			return doc.name.replace(/([A-Z])/g, function ($1) {
				return '-' + $1.toLowerCase();
			});
		}

		return doc.label || doc.name;
	};
})

//pages situation
.filter('situation', function(){
	return function(sit) {
		if(sit == 1) return 'Publicado';
		else if(sit == 2) return 'Rascunho';
		else if(sit == 3) return 'Lixeira';
	};
})

.filter('widgetrows', function(){
	return function(rows) {
		if(rows == 2) return 50;
		else if(rows == 4) return 25;
	};
})

.filter('uploadDir', function(API) {
	return function(url) {
		if(url) return API.upload + url;
	};
});
