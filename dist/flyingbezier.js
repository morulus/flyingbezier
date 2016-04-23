/*!
 * Copyright 2016-present, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com>
 * Follow: github.com/morulus
 * All rights reserved.
 * 
 * This source code is licensed under the MIT-style license
 * 
 * Copyright (c) 2016 Vladimir Kalmykov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * ==
 * 
 * Copyright (c) 2016 Владимир Калмыков
 * 
 * Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»), безвозмездно использовать Программное Обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного Обеспечения, а также лицам, которым предоставляется данное Программное Обеспечение, при соблюдении следующих условий:
 * 
 * Указанное выше уведомление об авторском праве и данные условия должны быть включены во все копии или значимые части данного Программного Обеспечения.
 * 
 * ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ ГАРАНТИИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ, НО НЕ ОГРАНИЧИВАЯСЬ ИМИ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ТРЕБОВАНИЯМ, В ТОМ ЧИСЛЕ, ПРИ ДЕЙСТВИИ КОНТРАКТА, ДЕЛИКТЕ ИЛИ ИНОЙ СИТУАЦИИ, ВОЗНИКШИМ ИЗ-ЗА ИСПОЛЬЗОВАНИЯ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫХ ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
 * 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["flyingbezier"] = factory();
	else
		root["flyingbezier"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2016-present, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com>
	 * Follow: github.com/morulus
	 * All rights reserved.
	 *
	 * This source code is licensed under the MIT-style license
	 */

	var bezieraxe = __webpack_require__(1);
	var svgPathToCubicBezierPoints = __webpack_require__(2);
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	var tm = { 
		trinatur : function(num) {
			return num;
		},
		angle : function(angle) {
			if (angle<0) angle = 360-angle;
			if (angle>360) angle -= 360;
			return angle;
		},
		de_ra : function(de) {
			var pi = Math.PI;
			var de_ra = (de*(pi/180));
			return de_ra;
		},
		ra_de : function(radian) {
			var y = (radian * 180) / Math.PI;
			while (y>360) y=y-360;
			return y;
		},
		sin : function(ra) {
			if ( (ra == 0) || (ra == 180) || (ra == 360) ) return 0;
			else return Math.sin(this.de_ra(ra));
		},
		cos : function(ra) {
			if ( (ra == 270) || (ra == 90) ) return 0;
			else return Math.cos(this.de_ra(ra));
		},
		delta2sc: function(a, b, $C) {
			
			var c = Math.sqrt(
				Math.pow(a,2) + Math.pow(b, 2) - (2 * a * b * this.cos($C))
			);
			
			var $A = this.ra_de(Math.acos((b*b + c*c - a*a)/(2*b*c)));
			
			var $B = 180-$A-$C;
			
			var result = {
				a: a,
				b: b,
				c: c,
				'$A': $A,
				'$B': $B,
				'$C': $C
			};
			
			return result;
		},
		delta2c1s: function(a, $C, $A) {
			var $B = 180-($C+$A);
			var c = a * (this.sin($C) / this.sin($A));
			var b = a * (this.sin($B) / this.sin($A));
			return {
				a: a,
				b: b,
				c: c,
				'$A': $A,
				'$B': $B,
				'$C': $C
			};
		},
		rotation : function(l, a, back)
		{
			W = l * this.cos(a);
			if (back!=true) {
				if (W<0) return 0;
			};
			return W;
		},
		disrotation : function(a,ac) {
			dis = ac * this.sin(a);
			return dis;
		},
		not0 : function(num) {
			if (num<1) {
			   num = 1;
			};
			return num;
		}, 
		nature : function(num) {
			if (num<0) num = 0;
			return Math.abs(num);
		},
		distX: function(radius, radian) {
			return this.disrotation(radian, radius);
		},
		distY: function(radius, radian) {
			return radius*this.sin(90 - radian);
		},
		/* calc 3D perspective */
		perspective: function(focusd, matrixw, distantion) {
			
			var hangle = this.delta2sc(matrixw/2, focusd, 90)['$B'];
			
			var areaw = this.delta2c1s(distantion, hangle, (90-hangle)).c;
			
			return areaw;
		}
	};
		
	var boxsize = [500,180];
	var frames = 300;
	var i = 0;
	var progress = 0;
	var stack = 0;
	var getangles = function(a,b) {
		var c = Math.sqrt(Math.pow(a,2) + Math.pow(b, 2) - (2 * a * b * tm.cos(90)));
		var $A = tm.ra_de(Math.acos((b*b + c*c - a*a)/(2*b*c)));
		var $B = 180-(90+$A);
		return [$A,$B];
	};
	/*
	Расчет местоположения точки в пространстве по кривой Безье в прогрессе t
	*/
	var getbezierxy = function(t, P0x,P0y,P1x,P1y,P2x,P2y,P3x,P3y) {
		return [
			(Math.pow((1 - t), 3) * P0x) + 
						(3 * Math.pow((1 - t), 2) * t * P1x) + 
						(3* (1 - t) * Math.pow(t, 2) * P2x) + 
						(Math.pow(t, 3) * P3x),
			(Math.pow((1 - t), 3) * P0y) + 
						(3 * Math.pow((1 - t), 2) * t * P1y) + 
						(3* (1 - t) * Math.pow(t, 2) * P2y) + 
						(Math.pow(t, 3) * P3y)
		];
	};
	/*
	Расчет направления движения между двумя координатами
	*/
	var getangledirection = function(x0,x,y0,y) {
		var angle=0;
		if (y0===y) {
			if (x>x0) angle = 0;
			else if (x<x0) angle = 180;
			else if (x===x0) angle = 0;
		} else if (x0===x) {
			if (y>y0) angle = 90;
			else if (y0>y) angle = -90;
			else angle = 0;
		}
		else {
			
			if (y0>y && x>x0) {
				a = x - x0;
				b = y - y0;
				angle = getangles(a,b)[1];
				
			} else if (x>x0 && y>y0) {
				a = y - y0;
				b = x - x0;
				angle = getangles(a,b)[0];

			} else if (x0>x && y>y0) {
				a = x - x0;
				b = y - y0;
				angle = 90+getangles(a,b)[0];
				
			} else if (y0>y && x0>x) {
				a = x - x0;
				b = y - y0;
				angle = 180-getangles(a,b)[1];
			};
		}
		return angle;
	}

	module.exports = {
	    getangles: getangles,
	    getbezierxy: getbezierxy,
	    getangledirection: getangledirection,
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function svgPathToCubicBezierPoints(path, percentRequired) {
		var path=path.replace(/([\n])/g, ' ').replace(/[\t]+/g, ''),si=0,cubic=[],
		task=0,
		M_EREG = /M[\s\d\.\-\,]+[^\sSCLM]+/i,
		c_EREG = /c[\s\d\.]+,[\d\.]+\-[\d\.]+,[\d\.]+[^\sSCLM]+/i,
		s_EREG = /s[\s\d\.\-\,][^\sSCLM]+/i,
		Parts = [],p=null,shift=0,cubic=[],vals,tonullx=0,tonully=0,i=0,locksblocks=[],addsx=0,addsy=0,
		minx=9999999,miny=9999999,maxx=0,maxy=0;

		// Search for M
		p=null,shift=0;
		do {
			p = M_EREG.exec(path.substr(shift));
			if (p!==null) { Parts[shift+p.index] = p[0]; Parts[shift+p.index].index+=shift; shift += p.index+p[0].length;  }
		} while(p!==null);
		// Search for c
		p=null,shift=0;
		do {
			p = c_EREG.exec(path.substr(shift));
			if (p!==null) { Parts[shift+p.index] = p[0]; Parts[shift+p.index].index+=shift; shift += p.index+p[0].length; }
		} while(p!==null);
		// Search for s
		p=null,shift=0;
		do {
			p = s_EREG.exec(path.substr(shift));
			if (p!==null) { Parts[shift+p.index] 
				= p[0]; 
				Parts[shift+p.index].index+=shift; 
				shift += p.index+p[0].length; }
			
		} while(p!==null);

		for (i in Parts) {
			if (Parts.hasOwnProperty(i)) {
				locksblocks.push([parseInt(i), parseInt(i)+Parts[i].length]);
			}
		}

		var ground=0;
		for (i=0;i<locksblocks.length;i++) {
			if (ground<locksblocks[i][0]) Parts[ground] = path.substring(ground, locksblocks[i][0]);
			ground = locksblocks[i][1];
		}
		if (ground!=locksblocks.length) {
			Parts[ground] = path.substr(ground);
		}

		var assessx = function(x) {
			if (x>maxx) maxx = x;
			if (x<minx) minx = x;
			cubic.push(x);
		};
		var assessy = function(y) {
			if (y>maxy) maxy = y;
			if (y<miny) miny = y;
			cubic.push(y);
		};
		// Make chronology
		for (var i in Parts) {
			if (Parts.hasOwnProperty(i)) {
				switch(Parts[i].charAt(0).toLowerCase()) {
					case 'm':
						vals = Parts[i].substr(1).split(',');
						tonullx = parseFloat(vals[0]);
						tonully = parseFloat(vals[1]);

						assessx(parseFloat(vals[0]));
						assessy(parseFloat(vals[1]));

					break;
					case 'c':
						vals = Parts[i].substr(1).replace(/([\-, ]+)/g, '|$1').replace(/[,]+/g,'').replace(/^(\|{1})/,'').split('|');
						if (Parts[i].charAt(0)==='C') {
							// Absolute value
							addsx=0;addsy=0;
						} else {
							// Relative
							addsx=tonullx;addsy=tonully;
						}	
						
						assessx(parseFloat(vals[0])+addsx);
						assessy(parseFloat(vals[1])+addsy);

						assessx(parseFloat(vals[2])+addsx);
						assessy(parseFloat(vals[3])+addsy);

						assessx(parseFloat(vals[4])+addsx);
						assessy(parseFloat(vals[5])+addsy);

						tonullx=cubic[cubic.length-2];
						tonully=cubic[cubic.length-1];
						
					break;
					case 's':
						vals = Parts[i].substr(1).replace(/([\-, ]+)/g, '|$1').replace(/[,]+/g,'').replace(/^(\|{1})/,'').split('|');
						
						if (Parts[i].charAt(0)==='S') {
							// Absolute value
							addsx=0;addsy=0;
						} else {
							// Relative
							addsx=tonullx;addsy=tonully;
						}		
						/* Первая контрольная точка - это отражение последней контрольной точки в предыдущем звене */
						var prevx = cubic[cubic.length-4];
						var prevy = cubic[cubic.length-3];

						var prevpointx = cubic[cubic.length-2];
						var prevpointy = cubic[cubic.length-1];

						assessx(prevpointx);
						assessy(prevpointy);



						/* Вычисляем отражение */
						var reflectx = (prevpointx-prevx)+prevpointx;
						var reflecty = (prevpointy-prevy)+prevpointy;

						assessx(reflectx);
						assessy(reflecty);


						assessx(parseFloat(vals[0])+addsx);
						assessy(parseFloat(vals[1])+addsy);

						assessx(parseFloat(vals[2])+addsx);
						assessy(parseFloat(vals[3])+addsy);

						tonullx=cubic[cubic.length-2];
						tonully=cubic[cubic.length-1];
					break;
					case ',':
						/* Резкое завершение пути */
						vals = Parts[i].substr(1).split(',');
						assessx(parseFloat(vals[0])+tonullx);
						assessy(parseFloat(vals[1])+tonully);
					break;
					case '-':
					case ' ':
					default:
						/* Конечная точка s пути */
						vals = Parts[i].substr(1).split(',');
						if (vals.length<2) continue;

						assessx((parseFloat(vals[0])*(Parts[i].charAt(0)==='-'?-1:1))+tonullx);
						assessy(parseFloat(vals[1])+tonully);
					break;
				}
			}
		}

		/* Преобразуем в проценты */
		if (percentRequired) {
			var percentcubic = [],
			xy = 0,
			xlim=maxx-minx,ylim=maxy-miny;
			for (i=0;i<cubic.length;i++) {
				percentcubic.push( (cubic[i]/(xy===0?xlim:ylim)*100)+'%') ;
				xy=xy===0?1:0;
			};
			return percentcubic;
		} else {
			return cubic;
		}
	}

/***/ }
/******/ ])
});
;