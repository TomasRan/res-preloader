# res-preloader

## install

> npm install res-preloader

## usage

```
	var resPreloader = require('res-preloader');

	resPreloader({
		resources:[
			'../images/xxx.jpg',
			'../images/xxx.png',
			....
		],
		callback: function(data, e) {
			if (e) {
				...	
			} else {
				...		
			}	
		}		
	});
```
