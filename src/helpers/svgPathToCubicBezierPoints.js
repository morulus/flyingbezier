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