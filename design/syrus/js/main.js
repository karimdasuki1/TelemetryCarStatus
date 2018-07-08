// append side-by-side jCal with 4 day selection to jCalTarget element
$('#jCalTarget').jCal({
	day:			new Date(),
	days:			4,
	showMonths:		2,
	monthSelect:	true,
	callback:		function (day, days) {
			console.log('selected ' + days + ' days starting ' + day);
		}
    
	});
