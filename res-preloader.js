/*
 *	@author:		tomasran
 *	@description:	preload js,css,html,images
 *	@createDate:	2016-06-16 20:49
 *	@example:
 *		var resPreloader = require('res-preloader');
 *
 *		resPreloader({
 *			retryInterval: 1000,
 *			retryTime: 3,
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
	} else if (typeof module !== 'undefined' && module.exports) {
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
				if (typeof dist[prop] === undefined) {
					dist[prop] = src[prop];
				}
			}
		}

		return dist;
	};

	var iePreload = function(data, callback) {
		var img = new Image();

		(function(img, data, cb) {
			var self = this;

			img.onload = function() {
				img.src = '';
				cb({
					index: data.index,
					url: data.src	
				}, null);	
			};

			img.onerror = function(e) {
				if (data.retryLimit < 1) {
					var ec = e || window.event;

					callback({
						index: data.index,
						url: data.src	
					}, ec);
				} else {
					data.retryLimit--;
					setTimeout(function() {
						self.arguments.callee;	
					}, data.retryInterval);
				}
			};
		})(img, data, callback);

		img.src = data.src;
	};

	var otherPreload = function(data, callback) {
		var obj = document.createElement('object');

		(function(o, d, cb) {
			o.onload = function() {
				o.data = '';
				document.body.removeChild(o);
				cb({
					index: d.index,
					url: d.src 
				}, null);
			}

			o.onerror = function(e) {
				if (d.retryLimit < 1) {
					var ec = e || window.event;

					document.body.removeChild(o);
					cb({
						index: d.index,
						url: d.src 
					}, ec);
				} else {
					d.retryLimit--;
					setTimeout(function() {
						self.arguments.callee;	
					}, d.retryInterval);
				}
			}
		
		})(obj, data, callback);

		obj.width = 0;
		obj.height = 0;
		obj.data = data.src; 
		document.body.appendChild(obj);
	};

	var resPreloader = function(options) {
		var opts = extend({
			'resources': [],
			'callback': function() {},
			'retryInterval': 0,
			'retryLimit': 0
		}, options);

		var preloadHandler = /*@cc_on!@*/0 ? iePreload : otherPreload;

		for (var i = 0; i < opts.resources.length; i++) {
			preloadHandler({
				'index': i,
				'src': opts.resources[i],
				'retryInterval': opts.retryInterval,
				'retryLimit': opts.retryLimit	
			}, function(data, e) {
				opts.callback(data, e);	
			});
		}
	};

	return resPreloader;
}));
