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
		define(function() {
			return factory();
		});
	} else if (typeof module != undefined && module.exports) {
		module.exports = factory();
	} else {
		global.resPreloader = factory();
	}
})(window || {}, function() {
	var extend = function(src, dist) {
		if (typeof dist !== 'object') {
			return src;	
		}

		for (var prop in src) {
			if (src.hasOwnProperty(prop)) {
				if (dist[prop] && typeof dist[prop] === typeof src[prop]) {

				} else {
					dist[prop] = src[prop];
				}
			}
		}

		return dist;
	};

	var resPreloader = function(options) {
		var opts = extend({
			'resources': [],
			'callback': function() {}
		}, options);

		var isIE = /*@cc_on!@*/0;

		if (isIE) {
			for (var i = 0; i < opts.resources.length; i++) {
				(function(index) {
					var img = new Image();

					img.onload = function() {
						img.src = '';
						options.callback({
							index: index,
							url: opts.resources[index] 
						}, null);
					}

					img.onerror = function(e) {
						var ec = e || window.event;

						options.callback({
							index: index,
							url: opts.resources[index] 
						}, e);	
					}

					img.src = opts.resources[i];
				})(i);
			}
		} else {
			for (var i = 0; i < opts.resources.length; i++)	{
				(function(index) {
					var obj = document.createElement('object');

					obj.onload = function() {
						obj.data = '';
						document.body.removeChild(obj);
						options.callback({
							index: index,
							url: opts.resources[index]
						}, null);
					}

					obj.onerror = function(e) {
						var ec = e || window.event;

						document.body.removeChild(obj);
						options.callback({
							index: index,
							url: opts.resources[index]
						}, e);
					}

					obj.data = opts.resources[i];
				})(i);
			}
		}
	};

	return resPreloader;
}));
