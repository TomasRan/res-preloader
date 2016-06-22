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
				if (dist[prop] === undefined) {
					dist[prop] = src[prop];
				}
			}
		}

		return dist;
	};

	var preload = function(target, data, callback) {
		var self = this;

		target.onload = function() {
			target.src = '';
			callback({
				index: data.index,
				url: data.src	
			}, null);	
		};

		target.onerror = function(e) {
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
	};

	// 图片资源预加载 
	var imgPreload = function(data, callback) {
		var img = new Image();

		preload(img, data, callback);
		/*(function(img, d, cb) {
			var self = this;

			img.onload = function() {
				img.src = '';
				cb({
					index: d.index,
					url: d.src	
				}, null);	
			};

			img.onerror = function(e) {
				if (d.retryLimit < 1) {
					var ec = e || window.event;

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
			};
		})(img, data, callback);*/

		img.src = data.src;
	};

	// js资源加载
	var jsPreload = function(data, callback) {
		var js = document.create('script');

		js.src = data.src;
		css.type = 'type/javascript';
	};

	// css资源加载
	var cssPreload = function(data, callback) {
		var css = document.create('link');

		css.href = data.src;
		css.type = 'type/css';
		css.rel = 'stylesheet';
	};

	/*
	 * 使用object标签进行预加载，存在兼容性问题，且object标签不支持onerror事件属性
	 *
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
	 };*/

	var getFileType = function(url) {
		var isImg = /.(png|jpg|jpeg|gif|bmp|webp)(\?\w*)?$/i;
		var isJavascript = /.js(\?\w*)?$/i;
		var isCss = /.css(\?\w*)?$/i;

		if (isImg.test(url)) {
			return 'img';
		} else if (isJavascript.test(url)) {
			return 'js';
		} else if (isCss.test(url)) {
			return 'css';	
		}
	};

	var resPreloader = function(options) {
		var opts = extend({
			'resources': [],
			'callback': function() {},
			'retryInterval': 0,
			'retryLimit': 0
		}, options);

		var handlerMap = {
			'img': imgPreload,
			'js': jsPreload,
			'css': cssPreload
		};

		for (var i = 0; i < opts.resources.length; i++) {
			var preloadHandler = handlerMap[getFileType(opts.resources[i])];

			if (preloadHandler === undefined) {
				opts.callback({
					'index': i;
					'url': opts.resources[i]
				}, new throw Error('invalid url'));	
			}

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
