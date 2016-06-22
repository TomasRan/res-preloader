/*
 *	@author:		tomasran
 *	@description:	preload js,css,images
 *	@createDate:	2016-06-16 20:49
 *	@example:
 *		var resPreloader = require('res-preloader');
 *
 *		resPreloader({
 *			retryInterval: 1000,
 *			retryLimit: 3,
 *			resources: [],
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

	var preload = function(type, data, callback) {
		var target = '';

		if (type === 'img') {
			target = new Image();	
			target.src = data.src;
		} else if (type === 'js') {
			target = document.create('script');
			target.src = data.src;
			target.type = 'type/javascript';
		} else if (type === 'css') {
			target = document.create('link');
			target.href = data.src;
			target.type = 'type/css';
			target.rel = 'stylesheet';
		}

		target.onload = function() {
			delete target;
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
					console.log('load error: ', data.src);
					console.log('retry times: ', data.retryLimit);
					preload(type, data, callback);	
				}, data.retryInterval);
			}
		};
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

		for (var i = 0; i < opts.resources.length; i++) {
			var type = getFileType(opts.resources[i]);

			if (!type) {
				opts.callback({
					'index': i,
					'url': opts.resources[i]
				}, 'invalid url');	
			} else {
				preload(type, {
					'index': i,
					'src': opts.resources[i],
					'retryInterval': opts.retryInterval,
					'retryLimit': opts.retryLimit	
				}, function(data, e) {
					opts.callback(data, e);	
				});
			}
		}
	};

	return resPreloader;
}));
