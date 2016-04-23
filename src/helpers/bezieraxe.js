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
