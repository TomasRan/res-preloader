/*
 *	@author:		tomasran
 *	@description:	preload js,css,html,images
 *	@createDate:	2016-06-16 20:49
 *	@example:
 *		var resPreloader = require('res-preloader');
 *
 *		resPreloader({
 *			resArr: [],
 *			callback: function() {},
 *		});
 */

((function(global, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], function() {
			return factory();
		});
	} else if (typeof module !== undefined && module.exports) {
		module.exports = factory();
	} else {
		global.resPreloader = factory();
	}
})(window || {}, function() {
	var extend = function(src, dist) {
	};

	var resPreloader = function(options) {
		var opts = extend({
			'resArr': [],
			'callback': function() {}
		}, options);
	};


	return resPreloader;
}));
