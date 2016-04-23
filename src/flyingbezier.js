/*
 * Copyright 2016-present, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com>
 * Follow: github.com/morulus
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license
 */

var bezieraxe = require('./helpers/bezieraxe.js');
var svgPathToCubicBezierPoints = require('./helpers/svgPathToCubicBezierPoints.js');
var pixelize = function(value, quantity) {
	if ("string" == typeof value) {
		if (value.substr(-1)==='%') {
			return ((quantity/100)* (value.substring(0, value.length-1)));
		} else {
			return parseInt(value.split('px').join(''));
		}
	} else {
		return value;
	}
	
	return parseInt(value);
}

/**
Performs movement along the curve
**/
function flybezier(cfg, handler) {
	var config = {
		path: false,
		areaWidth: false,
		areaHeight: false,
		duration: 5000, // ms
		calcAngle: true
	};

	for (var prop in cfg) {
		if (cfg.hasOwnProperty(prop)) {
			config[prop] = cfg[prop];
		}
	}

	var compiledPath = svgPathToCubicBezierPoints(config.path, true)

	var x0=0,y0=0,cubicbpathpx = [],xy=0,x,y,rotatemode,
	area=[
		config.areaWidth||600,
		config.areaHeight||600
	],staksCount=0,stack,t;

	// Устанавливаем опцию rotate
	
	// Конвертируем процентры в пиксели
	for (i = 0;i<compiledPath.length;i++) {
		cubicbpathpx[i] = pixelize(compiledPath[i], area[xy]);
		xy=xy===0?1:0;
	}
	staksCount=cubicbpathpx.length/8;

	var pos = 0;
	setInterval(function(progress) {
		pos+=20;
		if (pos>config.duration) pos = 0;

		var progress = pos/config.duration;
		/*
		Расчитываем какой стек из 8 точек сейчас работает
		*/

		stack = Math.floor(progress/(1/staksCount) );
		t = (progress - (stack*(1/staksCount))) / (1/staksCount) ;
		

		xy = bezieraxe.getbezierxy(t, 
			cubicbpathpx[stack*8],
			cubicbpathpx[(stack*8)+1],
			cubicbpathpx[(stack*8)+2],
			cubicbpathpx[(stack*8)+3],
			cubicbpathpx[(stack*8)+4],
			cubicbpathpx[(stack*8)+5],
			cubicbpathpx[(stack*8)+6],
			cubicbpathpx[(stack*8)+7]
		);
		x = xy[0]; y = xy[1]; 
		var a=0,b=0,summand=0,angle=0;
		
		if (!!config.calcAngle) {
			// Рассчет направления движения
			angle = bezieraxe.getangledirection(x0,x,y0,y);
		} else {
			angle = 0;
		}
		
		x0=x;y0=y;
		handler(x, y, angle);
	}, 20);
};


if ("object"===typeof window) window.flybezier = flybezier;
module.exports = flybezier;