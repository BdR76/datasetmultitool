// ---------------------------------------------------------------------------
// -- Scriptname   : Dataset Multitool                                      --
// -- Author       : Bas de Reuver                                          --
// -- Date         : 04-jul-2019                                            --
// -- Description  : Various utilities & tools to work with CSV datasets    --
// ---------------------------------------------------------------------------
// TODO:
// -detect month/day order in date fields
// -support quoted strings + escape literal quotes
// -display row/field errors in output log

var SMART_DETECT_LINES = 1000;

var DDinput;
var DDoutput;

// current year and century, example year=2018 then year=18, century=20
var datenow = new Date();
var CURRENT_YEAR_TWODIGIT = parseInt(datenow.getFullYear().toString().substr(-2));
var CURRENT_CENT_TWODIGIT = parseInt(datenow.getFullYear().toString().substr(0, 2));

function doExample(idx) {

	switch(idx) {
		case 1:
			// input
			data1 = "OrderID\tOrderDate\tArtNo\tAmount\tPrice\tPartName\tBrandName\n40361\t07/03/2019\t4006633374668\t2\t59.95\tBrake Pads Ceramic\tATE\n40361\t07/03/2019\t4006633146647\t2\t42.95\tBrake discs Powerdisc\tATE\n40361\t07/03/2019\t4016987119501\t1\t69.75\tBattery VW IV 12V 60Ah\tVarta\n40362\t07/05/2019\t4082300264630\t4\t4.99\tBattery terminal\tHELLA\n40362\t07/05/2019\t4026736081348\t1\t39.95\tOvervoltage Protector\tHERTH+BUSS ELPARTS\n40363\t07/08/2019\t4013872786831\t1\t230.00\tClutch kit 3000 990\tSACHS\n40363\t07/08/2019\t4006633294256\t1\t42.95\tClutch cable 1m\tATE\n40364\t07/10/2019\t0191215072422\t1\t3,299.00\tEngine block Honda B-series\tDART\n40365\t07/11/2019\t4010858791506\t1\t86.95\tTiming belt set\tCONTINENTAL\n40365\t07/11/2019\t4029416288686\t10\t8.99\tOil filter 105mm/66mm\tHERTH+BUSS JAKOPARTS\n";
			dd1 = "[OrderID] numeric(8)\n[OrderDate] datetime(mm/dd/yyyy)\n[ArtNo] varchar(15)\n[Amount] numeric(3)\n[Price] numeric(8,2)\n[PartName] varchar(30)\n[BrandName] varchar(30)\n";
			frm1 = "tsv";
			head = true;
			decin = ".";

			// output
			dd2 = "[OrderID] numeric(8)\n[OrderDate] datetime(dd-mm-yyyy)\n[Amount] numeric(3)\n[Price] numeric(8,2)\n[ArtNo] varchar(15)\n[BrandName] varchar(30)\n[PartName] varchar(30)\n";
			frm2 = "tsv";
			break;
		case 2:
			// input
			data1 = "Code;PatientNaam;MedicatieCode;MedicatieNaam;Dosis;DossisEenheid;StartDatum;StopDatum\n1001;Anna;A10BG03;ACTOS TABLET 30MG;30,0;mg;25-11-2014;\n1002;Bernard;C10AA01;ZOCOR TABLET 20MG;20,0;mg;16-10-2016;15-12-2016\n1003;Corry;V03AE01;RESONIUM A POEDER 5G;5,0;g;27-8-2014;\n1004;Dirk;C10AA01;ZOCOR TABLET 40MG;40,0;mg;17-1-2015;\n1005;Eduard;A07DA05;ARESTAL TABLET 1MG;1,0;mg;28-12-2014;\n1006;Fred;C03DA04;INSPRA TABLET 25MG;25,0;mg;3-3-2015;\n1007;Gerard;C03DA04;INSPRA TABLET 50MG;1,0;mg;31-3-2015;1-5-2015\n1008;Hendrik;N02BA15;ASCAL TABLET  1G;1,0;g;6-11-2014;\n1009;Izaak;C08CA01;NORVASC TABLET  5MG;5,0;mg;2-7-2014;30-8-2014\n1010;Johan;C09AA04;COVERSYL TABLET 4MG;4,0;mg;18-11-2015;\n";
			dd1 = "[Code] numeric(4)\n[PatientNaam] varchar(25)\n[MedicatieCode] varchar(8)\n[MedicatieNaam] varchar(25)\n[Dosis] numeric(6,1)\n[DossisEenheid] varchar(5)\n[StartDatum] datetime(d-m-yyyy)\n[StopDatum] datetime(d-m-yyyy)\n";
			frm1 = "ssv";
			head = true;
			decin = ",";

			// output
			dd2 = "[Code] numeric(4)\n[PatientNaam] varchar(25)\n[MedicatieCode] varchar(8)\n[MedicatieNaam] varchar(25)\n[Dosis] numeric(6,2)\n[DossisEenheid] varchar(5)\n[StartDatum] datetime(yyyy-mm-dd)\n[StopDatum] datetime(yyyy-mm-dd)\n";
			frm2 = "tsv";
			break;
		case 3:
			// input
			data1 = "20181116123459P0738493Tj.             Hekking                  Gedoogstraat            00012 1403ETJuinen                  M19410810E\n20181116123459P1374409H.P.  van der   Vaart                    Dorpsplein              00001A1234ABTer Weksel              M19390517E\n20181116123459P1927221L.              Sanders                  Goedeplein              00125 5121XEMeerdijk                M19610502V\n20181116123459P2073561J.              Harmsen                  Slechtestraat           00030C5121XEMeerdijk                V19750219V\n20181116123459P2196399H.              Stubbe                   Korteknallersweg        00066A4373BBBiggeveen               M19600520V\n20181116123459P2275037F.J.  van       Fleppensteyn             Korteknallersweg        00066B4373BBBiggeveen               M19600520V\n20181116123459P2614864J.              Flodder                  Zonnedael               00073 6132APAmstelhaeghe            M19541202V\n20181116123459P3080913K.              Flodder                  Zonnedael               00073 6132APAmstelhaeghe            V19630609V\n20181116123459P3518964D.F.            Duck                     Kwakstraat              00013 9684VEDuckstad                M19340609V\n20181116123459P4156817G.              Geluk                    Guusweg                 00777 9684ENGansdorp                M19480707V\n";
			dd1 = "[MUTDAT] datetime(yyyymmddhhnnss)\n[ENTITEIT] varchar(1)\n[PRSPMONUM] varchar(7)\n[PRSGESVLT] varchar(6)\n[PRSGESVVG] varchar(10)\n[PRSGESNAM] varchar(25)\n[PRSSTTNAM] varchar(24)\n[PRSHUINUM] numeric(5)\n[PRSHUILET] varchar(1)\n[PRSPKDNUM] varchar(6)\n[PRSWPLNAM] varchar(24)\n[PRSGESAND] varchar(1)\n[PRSGEBDAT] datetime(yyyymmdd)\n[PRSANDNAM] varchar(1)\n";
			frm1 = "fix";
			head = false;
			decin = ".";

			// output
			dd2 = "[MUTDAT] datetime(dd-mm-yyyy hh:nn:ss)\n[ENTITEIT] varchar(1)\n[PRSPMONUM] varchar(7)\n[PRSGESVLT] varchar(6)\n[PRSGESVVG] varchar(10)\n[PRSGESNAM] varchar(25)\n[PRSSTTNAM] varchar(24)\n[PRSHUINUM] numeric(5)\n[PRSHUILET] varchar(1)\n[PRSPKDNUM] varchar(6)\n[PRSWPLNAM] varchar(24)\n[PRSGESAND] varchar(1)\n[PRSGEBDAT] datetime(dd-mm-yyyy)\n[PRSANDNAM] varchar(1)\n";
			frm2 = "tsv";
		break;
	}

	// input
	document.getElementById("inputFormat").value = frm1;
	document.getElementById("checkHeaderInput").checked = head;
	document.getElementById("textInput").value = data1;
	document.getElementById("datadefInput").value = dd1
	document.getElementById("inputDecimal").value = decin;

	// output
	document.getElementById("outputFormat").value = frm2;
	document.getElementById("checkHeaderOutput").checked = true;
	document.getElementById("textOutput").value = "";
	document.getElementById("datadefOutput").value = dd2;
}

function GetDatestringPosition(datemask)
{
	// determine if datemask is all fixed positions or separated values
	var tmp = datemask.toLowerCase().split(/-| |:|\/|\\|\./); // split on ["-", " ", ":", "/", "\", "."]

	var fixed = true;
	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i] == "d") fixed = false;
		if (tmp[i] == "m") fixed = false;
		if (tmp[i] == "h") fixed = false;
	};

	// initialise result
	var res = [-1, -1, -1, -1, -1, -1, -1, 0, 4, datemask]; // [7]=not-fixed positions, [8]=year length, [9]=datemask

	if (fixed) {
		// flag as "fixed positions"
		res[7] = 0;

		// find string positions in mask
		res[0] = datemask.indexOf("yyyy"); // year, either yyyy or yy
		if (res[0] == -1) res[0] = datemask.indexOf("yy");
		res[1] = datemask.indexOf("mm"); // month
		res[2] = datemask.indexOf("dd"); // day

		res[3] = datemask.indexOf("hh"); // hours
		res[4] = datemask.indexOf("nn"); // minutes
		res[5] = datemask.indexOf("ss"); // seconds
		res[6] = datemask.indexOf("fff");// milliseconds

		res[8] = (datemask.indexOf("yyyy") < 0 ? 2 : 4);
	} else {
		// flag as "separated"
		res[7] = 1;

		// find index of each value
		for (var i = 0; i < tmp.length; i++) {
			if (tmp[i].indexOf("y") >= 0) {
				res[0] = i; // year
				res[8] = tmp[i].length;
			};
			if (tmp[i].indexOf("m") >= 0) res[1] = i; // month
			if (tmp[i].indexOf("d") >= 0) res[2] = i; // day

			if (tmp[i].indexOf("h") >= 0) res[3] = i; // hours
			if (tmp[i].indexOf("n") >= 0) res[4] = i; // minutes
			if (tmp[i].indexOf("s") >= 0) res[5] = i; // seconds
			if (tmp[i].indexOf("f") >= 0) res[6] = i; // milliseconds
		};
	};

	return res;
}

function checkValidDateTime(year, month, day, hour, min, sec, msec)
{
	// invalid if any value is not-a-number
	if (	isNaN(year)
		|| isNaN(month)
		|| isNaN(day)
		|| isNaN(hour)
		|| isNaN(min)
		|| isNaN(sec)
		|| isNaN(msec)
	) {
		return false;
	};

	// month has 31 days
	var max = 31;

	// except for april, june, september, november
	if ([4,6,9,11].indexOf(month) >= 0) max = 30;

	// february has 28 days
	if (month == 2) {
		// except 29 days when leap year
		max = (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ? 29 : 28);
	};
	
	// invalid if any values are out of bounds
	return !(	(day < 1)
			|| (day > max)
			|| (month < 1)
			|| (month > 12)
			|| (year < 1900)	// arbitrary year limits
			|| (year > 2100)
			|| (hour < 0)
			|| (hour > 23)
			|| (min < 0)
			|| (min > 59)
			|| (sec < 0)
			|| (sec > 59)
			|| (msec < 0)
			|| (msec > 999)
			);
}

function ConvertDateFormat(input, arypos, maskout)
{
	// exception, empty values are allowed
	if ((!input) || input.trim() == "") {
		return ["", true];
	};
	// initialise result
	var res = maskout;

	// initialise
	var year  = 1900;
	var month = 1;
	var day   = 1;

	var hour  = 0;
	var min   = 0;
	var sec   = 0;
	var msec  = 0;

	var yearlen = arypos[8];

	// fixed date format, values in string are always on exact same position
	if (arypos[7] == 0) {
		// arypos contains string-start-position for each value
		if (arypos[0] >= 0) year  = input.substring(arypos[0], arypos[0]+yearlen);
		if (arypos[1] >= 0) month = input.substring(arypos[1], arypos[1]+2);
		if (arypos[2] >= 0) day   = input.substring(arypos[2], arypos[2]+2);

		if (arypos[3] >= 0) hour  = input.substring(arypos[3], arypos[3]+2);
		if (arypos[4] >= 0) min   = input.substring(arypos[4], arypos[4]+2);
		if (arypos[5] >= 0) sec   = input.substring(arypos[5], arypos[5]+2);
		if (arypos[6] >= 0) msec  = input.substring(arypos[6], arypos[6]+3);
	} else {
	// not fixed date format, value position in string can vary, example "31-1-2020 12:00" or "1-1-2020 0:00" etc.
		var tmp = input.split(/-| |:|\/|\\|\./); // split on ["-", " ", ":", "/", "\", "."]

		// arypos contains index for each value
		if (arypos[0] >= 0 && arypos[0] < tmp.length) year  = tmp[arypos[0]];
		if (arypos[1] >= 0 && arypos[1] < tmp.length) month = tmp[arypos[1]];
		if (arypos[2] >= 0 && arypos[2] < tmp.length) day   = tmp[arypos[2]];

		if (arypos[3] >= 0 && arypos[3] < tmp.length) hour  = tmp[arypos[3]];
		if (arypos[4] >= 0 && arypos[4] < tmp.length) min   = tmp[arypos[4]];
		if (arypos[5] >= 0 && arypos[5] < tmp.length) sec   = tmp[arypos[5]];
		if (arypos[6] >= 0 && arypos[6] < tmp.length) msec  = tmp[arypos[6]];
	};

	// exception for 2-digit year format
	if (yearlen == 2) {
		var cent = CURRENT_CENT_TWODIGIT;
		if (parseInt(year) > CURRENT_YEAR_TWODIGIT) {
			cent = cent - 1;
		};
		year = "" + cent + year;
	};

	// check if it is a valid date..
	// the JavaScript Date constructor is garbage at detecting invalid dates, see:
	// https://stackoverflow.com/questions/58660171/detecting-invalid-date-values-when-constructing-a-new-date-from-integers-in-java
	//var dt = new Date(`${year}-${month}-${day} ${hour}:${min}:${sec}.${msec}`);
	//valid = (dt instanceof Date && !isNaN(dt));
	
	// ..so instead use a custom function
	valid = checkValidDateTime(year, month, day, hour, min, sec, msec);

	// construct new date string, in case of invalid date it can be garbage-in garbage-out
	// but that is better than "null" or "" in output dataset
	// date
	res = res.replace("yyyy", year);
	res = res.replace(  "yy", year.toString().substr(-2));
	res = res.replace(  "mm", ("00" + month).slice(-2));
	res = res.replace(   "m", month);
	res = res.replace(  "dd", ("00" + day).slice(-2));
	res = res.replace(   "d", day);

	// time
	res = res.replace( "hh", ("00" + hour).slice(-2));
	res = res.replace(  "h", hour);
	res = res.replace( "nn", ("00" + min).slice(-2));
	res = res.replace(  "n", min);
	res = res.replace( "ss", ("00" + sec).slice(-2));
	res = res.replace(  "s", sec);
	res = res.replace("fff", ("000" + msec).slice(-3));

	// return new string and IsValidDate
	return [res, valid];
}

function WriteToLog(str)
{
	// write to error logging
	document.getElementById("textLog").value += (str + "\n");
}

function ClearLog()
{
	// write to error logging
	document.getElementById("textLog").value = "";
}

function DoGenerate()
{
	// use these regular expressions
	RefreshLists();
	RefreshDataDefinition();
	GenerateRandomData();
	OutputRandomData();
}

function StringPad(s, p)
{
	// left pad
	var left = (p < 0);
	if (p < 0) p = p * -1;

	// pad space left or right
	if (left) {
		while(s.length < p) s = " " + s;
	} else {
		while(s.length < p) s = s + " ";
	};

	// if too long then truncate
	if (s.length > p) s = (left ? s.substring(s.length-p, s.length) : s.substring(0, p));

	return s;
}

function detectDataTypes()
{
	// clear logging
	ClearLog();
	
	// determine metadata based on input textdata
	var lines = document.getElementById("textInput").value.split("\n");
	var arycol = [];

	DDinput = [];

	// header line contains column names
	var header = document.getElementById("checkHeaderInput").checked;

	// limit number of lines to examine (for performence)
	//var max = (lines.length > SMART_DETECT_LINES ? SMART_DETECT_LINES : lines.length);
	var max = lines.length;

	// count separator characters
	var tabcount = 0;
	var comcount = 0;
	var semcount = 0;

	for (var i = 0; i < max; i++) {
		// get next line
		var line = lines[i].trim();
		// ignore empty lines
		if (line != "") {
			// count occuranse of tab characters
			for( var count = -1, index = -2; index != -1; count++, index = line.indexOf("\t", index + 1) );
			tabcount = tabcount + count;
			// count occuranse of comma characters
			for( var count = -1, index = -2; index != -1; count++, index = line.indexOf(",", index + 1) );
			comcount = comcount + count;
			// count occuranse of semi-colon characters
			for( var count = -1, index = -2; index != -1; count++, index = line.indexOf(";", index + 1) );
			semcount = semcount + count;
		};
	};

	// which format
	var sep = "";
	var frm = "fix";
	if ( (tabcount > 0) && (tabcount > comcount) && (tabcount > semcount) ) { sep = "\t"; frm = "tsv"; };
	if ( (comcount > 0) && (comcount > tabcount) && (comcount > semcount) ) { sep = ","; frm = "csv"; };
	if ( (semcount > 0) && (semcount > tabcount) && (semcount > comcount) ) { sep = ";"; frm = "ssv"; };

	document.getElementById("inputFormat").value = frm;

	if (frm == "fix") {
		// fixed length
		var fixcol = []; // all character in line
		var num = 0; // 1=num, 0=char
		var spaces = 0;
		var newcol = 0;
		var inQuotes = false;

		for (var i = 0; i < max; i++) {
			// get next line
			var line = lines[i].trim();
			// ignore empty lines
			if (line != "") {
				for (var c = 0; c < line.length; c++) {
					// line may vary in length
					if (!fixcol[c]) fixcol[c] = 0;
					newcol = 0;

					// examine single characers
					var ch = line[c];


                    // string value in quotes, treat as one continuous value, i.e. do not check content for column breaks
                    if (ch == '"') {
						// spaces followed by a new quoted string, probably a new column
						if ( (!inQuotes) && (spaces > 1) ) newcol = 1;
						spaces = 0; // reset
						// toggle quoted string
						inQuotes = !inQuotes;
					}

                    // string value in quotes, treat as one continuous value, i.e. do not check content for column breaks
					if (!inQuotes) {
						// count space characters
						if (ch == " ") {
							// a space after a numeric value
							if (num == 1)
							{
								num = -1; // reset text/numeric indicator because probably a new column
								spaces++; // count single space as "big space" i.e. 2 spaces or more
							}
							spaces = spaces + 1;
						} else {
							// more than 2 spaces could indicate new column
							if (spaces > 1)  newcol = 1;
							spaces = 0; // reset

							// switch between alpha and numeric characters could indicate new column
							var isdigit = ("0123456789".indexOf(ch));
							// ignore characters that can be both numeric or alpha values example "A.B." or "Smith-Johnson"
							var ignore = (",.-+:/\\".indexOf(ch));
							if (ignore < 0) {
								if (isdigit < 0) {
									if (num == 1) newcol = 1;
									num = 0;
								} else {
									if (num == 0) newcol = 1;
									num = 1;
								};
							};
						};
					};

					// detected a new column
					fixcol[c] = fixcol[c] + newcol;
				};
			};
		};

		// convert to columns
		var idx = 0;
		var start = 0;
		var i = 0;
		while (i < fixcol.length) {
			// find column end
			start = i;
			var stop = -1;
			while ( (stop == -1) && (i < fixcol.length) ) {
				i = i + 1;
				if (fixcol[i] > 1) {
					stop = i - 1;
				};
			};
			// exception when last column length is 1 character
			if (stop == -1) stop = fixcol.length-1;

			// add column
			arycol[idx] = [];

			arycol[idx][0] = ("Col" + (idx+1));      // name
			arycol[idx][1] = "varchar";          // datatype
			arycol[idx][2] = (stop - start + 1); // length
			arycol[idx][3] = 0;                  // decimals
			idx = idx + 1;
		};

	} else {

		for (var i = 0; i < max; i++) {
			// get next line
			var line = lines[i].trim();
			// ignore empty lines
			if (line != "") {
				var cols = line.split(sep);

				for (var c = 0; c < cols.length; c++) {

					// column properties
					if (c > arycol.length-1) {
						// initialise
						arycol[c] = [];

						arycol[c][0] = (header ? cols[c] : "Col" + (c+1)); // name
						arycol[c][1] = "numeric";  // datatype
						arycol[c][2] = 0;     // length
						arycol[c][3] = 0;     // decimals
					};

					// update length
					if ( (i > 0) || (header == false) ) {
						// get value and length
						// note: sometimes empty values still contain just spaces or tabs
						var val = cols[c].trim();
						var maxlen = val.length;

						// ignore empty values
						if (maxlen > 0) {
							// test if numeric, allow comma for decimal
							var test = val.replace(".", "").replace(",", "");
							var num = (!isNaN(parseFloat(test)) && isFinite(test));
							var dat = "";

							// check if date
							// TODO: improve date detection, only checks on year now)
							if ( (maxlen >= 8) && (maxlen <= 10) ) {
								// check for year, 4 characters on the left or on the right
								var yl = val.substring(0, 4);
								var yr = val.substring(val.length-4, val.length);

								// check for year
								yl = (!isNaN(parseFloat(yl)) && isFinite(yl) ? parseFloat(yl) : 0);
								yr = (!isNaN(parseFloat(yr)) && isFinite(yr) ? parseFloat(yr) : 0);

								// remove all digits should leave just two separators
								// example "31-12-2019" -> "--"
								var datsep = val.replace(/[0-9]/g, "");

								// check for year on left side
								if ( (yl > 1900) && (yl < 2100) ) {
									// left 4 characters could be year, check separator
									if (datsep == "") {
										if (val.length == 8) dat = "yyyymmdd";
									} else {
										if ( (datsep.length == 2) && (datsep[0] == datsep[1]) ) {
											datsep = datsep.substring(0, 1);
											dat = 'yyyy'+datsep+'m'+datsep+'d'
										};
									};
								};

								// check for year on right side
								if ( (yr > 1900) && (yr < 2100) ) {
									// right 4 characters could be year, check separator
									if (datsep == "") {
										if (val.length == 8) dat = "ddmmyyyy";
									} else {
										if ( (datsep.length == 2) && (datsep[0] == datsep[1]) ) {
											datsep = datsep.substring(0, 1);
											dat = (datsep == "/" ? 'm/d/yyyy' : 'd'+datsep+'m'+datsep+'yyyy'); // exception for US date format
										};
									};
								};
							};
							if (dat != "") {
								// numeric values starting with "0" treat as varchar
								arycol[c][1] = "datetime";
								arycol[c][3] = dat;
							} else if (num) {
								// numeric values starting with "0" and not a decimal value, treat as varchar
								// for example patient code "0123456" or site code "001"
								if (maxlen > 1) {
									if ( (val.substring(0, 1) == "0") && (val.indexOf(".") == -1) && (val.indexOf(",") == -1) ) {
										arycol[c][1] = "varchar";
									};
								};
							} else {
								arycol[c][1] = "varchar"
								// if up to this line numeric values, "convert" width of numeric+decimals to just varchar length
								if ( (arycol[c][1] == "numeric")  && (arycol[c][3] > 0) ) {
									arycol[c][2] = arycol[c][2] + arycol[c][3] + 1;
									arycol[c][3] = 0;
								};
							};
							if (arycol[c][1] == "numeric") {
								// For numeric values with decimals; keep max length of both before and after decimal.
								// So max width for left side[2] and max length of right side[3]) = decimal digits.
								// If the same column contains values like "123.4" and "1.234",
								// then max string length is 5 characters,
								// however the datatype should be 7 characters with 3 decimals = numeric(7,3)
								var com = val.lastIndexOf(",");
								var pnt = val.lastIndexOf(".");
								var dec = ( pnt > com ? pnt : com);
								if (dec > 0) {
									dec = val.length - dec - 1;
									if (dec > arycol[c][3]) {
										// Keep track of max length of decimal digits
										arycol[c][3] = dec;
									};
									// Keep track of max length of numeric part (left of decimal separator)
									maxlen = maxlen - dec - 1;
									// set input decimal selection
									document.getElementById("inputDecimal").value = (pnt > com ? "." : ",");
								};
							};
							// keep max length
							if (maxlen > arycol[c][2]) {
								arycol[c][2] = maxlen;
							};
						};
					};
				};
			};
		};

		// numeric with decimals: [2] is max length before decimal, [3] is max length after decimal.
		// Change [2] so it's total length including decimals and [3] is just decimals
		for (var c = 0; c < arycol.length; c++) {
			if ( (arycol[c][1] == "numeric") && (arycol[c][3] > 0) ) {
				arycol[c][2] = arycol[c][2] + arycol[c][3] + 1; // +1 for decimal character
			};
		};
	};

	// Data definitions input and output, display in textboxes on the right
	var strin = "";
	var strout = "";
	for (var c = 0; c < arycol.length; c++) {
		// column properties
		strin = strin + "[" +
				arycol[c][0] + "] " + // name
				arycol[c][1] + "("; // datatype

		strout = strout + "[" +
				arycol[c][0] + "] " + // name
				arycol[c][1] + "("; // datatype

		strin  = strin  + (arycol[c][1] == "datetime" ? arycol[c][3] : arycol[c][2]); // length or datemask
		strout = strout + (arycol[c][1] == "datetime" ? "yyyy-mm-dd" : arycol[c][2]); // force output datemask

		if ( (arycol[c][1] == "numeric") && (arycol[c][3] != 0) ) {
			strin  = strin  + "," + arycol[c][3]; // decimals
			strout = strout + "," + arycol[c][3]; // decimals
		};
		strin = strin + ")\n";
		strout = strout + ")\n";
	};

	// output
	document.getElementById("datadefInput").value = strin;
	document.getElementById("datadefOutput").value = strout;
	
	// write to logging
	var msg = "";
	if (frm == "tsv") msg = "tab-separated";
	if (frm == "csv") msg = "comma-separated";
	if (frm == "ssv") msg = "semicolon-separated";
	if (frm == "fix") msg = "fixed-width";
	msg = "Detected " + msg + " data with " + arycol.length + " columns.";
	WriteToLog(msg);
	WriteToLog("Ready.");
}

function addLineNumber()
{
	if (confirm('Add line number column to input data?')) {
		// get input lines and separator
		var lines = document.getElementById("textInput").value.split("\n");
		var formatin = document.getElementById("inputFormat").value;
		var sepin = (formatin == "tsv" ? "\t" : (formatin == "csv" ? "," : (formatin == "ssv" ? ";" : ",")));

		// check if column names in header
		var headIn = document.getElementById("checkHeaderInput").checked;
		var off = (headIn ? 0 : 1);

		var strout = "";
		// get input lines and separator
		for (var i = 0; i < lines.length; i++) {
			// get next line
			var line = lines[i];
			if ( (line.trim() != "") || (i != lines.length-1) ) {
				switch (formatin) {
					case "tsv":
					case "csv":
					case "ssv":
						// header columns
						if (headIn && (i == 0) ) {
							strout = strout + "LineNumber" + sepin + line;
						} else {
							strout = strout + (i+off) + sepin + line;
						};

						break;
					case "fix":
						strout = strout + StringPad(""+(i+off), 8) + line;
						break;
				};
				strout = strout + "\n"
			};
		};
		// new output
		document.getElementById("textInput").value = strout;
		// adjust datadefinition
		var ddin = document.getElementById("datadefInput").value;
		document.getElementById("datadefInput").value = "[LineNumber] numeric(8)\n" + ddin;
		var ddout = document.getElementById("datadefOutput").value;
		document.getElementById("datadefOutput").value = "[LineNumber] numeric(8)\n" + ddout;
	};
}

function doSchemaIni()
{
	var str = "";
	var dateformat = "";
	var decimalplace = -1;
	var namequote = false;
	
	// determine global format and settings
	for (var i = 0; i < DDinput.length; i++) {
		var nam = DDinput[i][0];
		var typ = DDinput[i][1];
		var wid = DDinput[i][2];
		var msk = DDinput[i][3];
		
		// if any name contains spaces, put all column names in quotes
		namequote = (namequote || nam.indexOf(" ") > 0);

		// date format
		if ((typ == "datetime") && (dateformat == "") ) {
			dateformat = msk[9];
		};

		// decimal places
		if (typ == "numeric") {
			// keep maximum decimals
			if (decimalplace < msk) {
				decimalplace = msk;
			};
		};
	};

	// filename
	str += "[" + document.getElementById("txtTableName").value + "]\n";

	// delimiter
	var formatin = document.getElementById("inputFormat").value;
	if (formatin == "tsv") str += "Format=TabDelimited\n";
	if (formatin == "ssv") str += "Format=Delimited(;)\n";
	if (formatin == "csv") str += "Format=CSVDelimited\n";
	if (formatin == "fix") str += "Format=FixedLength\n";

	// header
	if (document.getElementById("checkHeaderInput").checked) {
		str += "ColNameHeader=True\n";
	}

	// dateformat, optional
	if (dateformat != "") {
		str += "DateTimeFormat=" + dateformat + "\n";
	}

	// decimal, optional
	if (decimalplace > 0) {
		str += "NumberDigits=" + decimalplace + "\n";
		str += "DecimalSymbol=" + document.getElementById("inputDecimal").value + "\n";
	}
	
	// output all columns
	for (var i = 0; i < DDinput.length; i++) {
		var nam = DDinput[i][0];
		var typ = DDinput[i][1];
		var wid = DDinput[i][2];
		var msk = DDinput[i][3];
		var com = "";

		// if any name contains spaces, put all column names in quotes
		if (namequote) {
			nam = '"' + nam + '"';
		};
		
		// schema can only have one dateformat, change any other datetimes to Text with comment
		if ((typ == "datetime") && (msk[9] != dateformat) ) {
			com = " ; DateTimeFormat=" + msk[9];
			typ = "varchar";
			wid = msk.length;
		};
		
		// schema.ini data types
		if (typ == "varchar") typ = "Text";
		if (typ == "numeric") typ = (msk > 0 ? "Float" : "Integer");
		if (typ == "datetime") typ = "DateTime";

		// format column line
		str += "Col" + (i+1) + "=" + nam + " " + typ + " Width " + wid + com + "\n";
	};

	document.getElementById("textOutput").value = str;
}

function getTableNameSQL()
{
	var ret = document.getElementById("txtTableName").value;

	if (ret.trim() == "") ret = "TableName";

	if (ret.indexOf(" ") > 0) ret = '[' + ret + ']';

	return ret;
}

function getCreateTableSQL()
{
	var ret = "";
	var brackets = false;
	
	// determine global format and settings
	for (var i = 0; i < DDoutput.length; i++) {
		var nam = DDoutput[i][0];
		var typ = DDoutput[i][1];
		var wid = DDoutput[i][2];
		var msk = DDoutput[i][3];
		
		// if any name contains spaces, put all column names in quotes
		brackets = (brackets || nam.indexOf(" ") > 0);
	};

	// tablename
	ret += "CREATE TABLE " + getTableNameSQL() + " (\n";

	// create all columns
	for (var i = 0; i < DDoutput.length; i++) {
		var nam = DDoutput[i][0];
		var typ = DDoutput[i][1];
		var wid = DDoutput[i][2];
		var msk = DDoutput[i][3];
		var fld = "";

		// if any name contains spaces, put all column names in brackets
		if (brackets) {
			nam = '[' + nam + ']';
		};
		
		// SQL data types
		if (typ == "numeric") {
			if (msk == 0) {
				typ = (wid > 2 ? "Integer" : "TinyInt");
				wid = "";
			} else {
				wid = wid + "," + msk;
			};
		};

		// datetime or just date
		if (typ == "datetime") {

			if (msk[9].indexOf("hh") < 0) typ = "date";
			wid = "";

			// SQL script output, force ISO datetime formats
			var dtiso = "";
			if (msk[9].indexOf("yyyy") >= 0) dtiso = "yyyy-mm-dd ";
			if (msk[9].indexOf("h")    >= 0) dtiso += "hh:nn";
			if (msk[9].indexOf("s")    >= 0) dtiso += ":ss";
			if (msk[9].indexOf("f")    >= 0) dtiso += ".fff";
			DDoutput[i][3][9] = dtiso.trim();
		};

		// width is optional, depends on data type
		if (wid != "") wid = "(" + wid + ")";

		// format column line
		ret += "\t" + nam + " " + typ + wid + ",\n";
	};

	// remove last comma and return
	ret = ret.slice(0, -2);
	ret += "\n)\n";

	return ret;
}

function interpretDataDefinition(str)
{
	var ret = [];

	// regex pattern for meta data example "[COLNAME] numeric(10)" -> 0=COLNAME, 1=numeric, 2=10
	var patMeta = /\[(.*?)\]\s.*(numeric|varchar|datetime)\((.*?)\)/;
	var idx = 0;
	var lines = str.replace(/\t/g, " ").split("\n");

	for (var i = 0; i < lines.length; i++) {
		// get next line
		var line = lines[i].trim();

		// ignore empty lines
		if (line != "") {
			// check for data definition pattern
			var res = patMeta.exec(line);
			if (res == null) {
				throw "Error in input data definition line (" + line + ")";
			} else {
				ret[idx] = [];
				// column properties
				ret[idx][0] = res[1]; // name

				var dd = res[2].toLowerCase(); // datatype
				var ln = res[3].toLowerCase(); // length
				var dc = 0;

				// split for example "(3,1)" in ln=3, dc=1
				var pos = ln.indexOf(",");
				if (pos > 0) {
					dc = ln.substring(pos + 1);
					ln = ln.substring(0, pos);
				};

				if (dd == "datetime") {
					// length is length of mask, example "dd-mm-yyyy"
					dc = GetDatestringPosition(ln);
					ln = ln.length;

					// exception for separated (not-fixed length), extra length due to character "d-m-yyyy" (len=6) may be value "31-12-2018" (len=8)
					if (dc[7] == 1) {
						if (dc[1] >= 0) ln++; // allow extra character for month
						if (dc[2] >= 0) ln++; // allow extra character for day
						if (dc[3] >= 0) ln++; // allow extra character for hour
					};
				} else {
					ln = parseInt(ln);
					dc = parseInt(dc);
				};

				// store values
				ret[idx][1] = dd;
				ret[idx][2] = ln; // length
				ret[idx][3] = dc; // decimals or datetime-mask

				idx = idx + 1;
			};
		};
	};

	// return dd array
	return ret;
}

function RefreshDataDefinition()
{
	// input
	var ddin = document.getElementById("datadefInput").value;
	DDinput = interpretDataDefinition(ddin);

	// output
	var ddout = document.getElementById("datadefOutput").value;
	DDoutput = interpretDataDefinition(ddout);

	// check if column order differs
	for (var o = 0; o < DDoutput.length; o++) {
		// -1 as default
		DDoutput[o][4] = -1;
		var str = DDoutput[o][0].toLowerCase();
		// match name and save index
		for (var i = 0; i < DDinput.length; i++) {
			if (str == DDinput[i][0].toLowerCase()) {
				DDoutput[o][4] = i;
				break;
			};
		};
	};
}

function doConvert()
{
	// clear logging
	ClearLog();
	var linecount = 0;
	var errcount = 0;
	
	// refresh columns metadata
	RefreshDataDefinition();

	// input parameters
	var formatin = document.getElementById("inputFormat").value;
	var sepin = (formatin == "tsv" ? "\t" : (formatin == "csv" ? "," : (formatin == "ssv" ? ";" : ",")));
	var headIn = document.getElementById("checkHeaderInput").checked;

	// ouput parameters
	var formatout = document.getElementById("outputFormat").value;
	var sepout = (formatout == "tsv" ? "\t" : (formatout == "ssv" ? ";" : ","));
	var headOut = document.getElementById("checkHeaderOutput").checked;
	var decin = document.getElementById("inputDecimal").value;
	var thosep = (decin == "." ? "," : ".");
	var trimout = document.getElementById("checkTrimOutput").checked;
	var maxrows = parseInt(document.getElementById("intMaxRows").value);
	//if (maxrows <= 0) maxrows = 999999999;
	if (maxrows <= 0) maxrows = Number.MAX_SAFE_INTEGER;

	// force dot as decimal separator
	var decout = document.getElementById("outputDecimal").value;
	var sqlTable = document.getElementById("txtTableName").value;
	sqlTable = getTableNameSQL();

	// prepare input and output
	var lines = document.getElementById("textInput").value.split("\n");
	// remove empty lines at the end
	while ( (lines[lines.length-1].trim().length == 0) && (lines.length > 0) ) { lines.pop(); };

	var strout = "";

	// header out
	var idx1 = 0;
	if (headOut && (["tsv", "csv", "ssv", "fix"].indexOf(formatout) >= 0)) {
		for (var i = 0; i < DDoutput.length; i++) {
			switch (formatout) {
				case "tsv":
				case "csv":
				case "ssv":
					strout = strout + DDoutput[i][0] + sepout;
					break;
				case "fix":
					idx2 = DDoutput[i][2];
					strout = strout + StringPad(DDoutput[i][0], idx2);
					break;
			};
		};
		strout = strout + "\n";
	};

	// SQL statements
	if ((formatout == "sqlins") || (formatout == "sqlsub")) {
		// create table statement first
		strout = getCreateTableSQL();
		// for sqlins, remove last '\n'
		if (formatout == "sqlins") strout = strout.slice(0, -1);
		// SQL statements always require dot for numeric values, not comma
		decout = ".";
	};

	// exception for schema.ini
	if (formatout == "schema") {
		doSchemaIni();
		return;
	}

	// input header line contains column names, then skip first line
	var first = (headIn ? 1 : 0);

	// process input data lines
	for (var i = first; i < lines.length; i++) {
		// get next line
		var line = lines[i];
		// ignore empty lines
		if (line.trim() != "") {
			linecount++;
			// ---- interpret input values ----
			var incols = [];
			// ---- convert values ----
			// output column order can be different
			var cols = [];
			var errline = "";

			switch (formatin) {
				case "tsv":
				case "csv":
				case "ssv":
					incols = line.split(sepin);
					// too many or too few columns
					if (DDinput.length != incols.length) {
						errline = errline + "too " + (DDinput.length > incols.length ? "few" : "many") + " columns, ";
					};
					break;
				case "fix":
					var idx1 = 0;
					var idx2 = 0;
					for (var c = 0; c < DDinput.length; c++) {
						idx2 = idx1 + DDinput[c][2];
						var val = line.substring(idx1, idx2).trim(); // fixed length columns, so always trim to remove extra spaces
						incols[c] = val;
						idx1 = idx2;
					};
					// too many or too few characters
					if (line.length != idx1) {
						errline = errline + "too " + (idx1 > line.length ? "few" : "many") + " characters, ";
					};
					break;
			};

			for (var c = 0; c < DDoutput.length; c++) {
				// default empty
				cols[c] = "";
				var idx = DDoutput[c][4];
				// from input columns
				if ( (idx != -1) && (incols[idx]) ) {
					// get value from input columns
					var val = incols[idx];
					cols[c] = val;
					// check width too long
					if (val.length > DDinput[idx][2]) {
						errline = errline + "value too long \"" + val + "\", ";
					};
					// get datatype
					var t = DDinput[idx][1];
					// re-format datetime values
					if (t == "datetime") {
						var dt = ConvertDateFormat(val, DDinput[idx][3], DDoutput[c][3][9]);
						cols[c] = dt[0];
						if (dt[1] == false) {
							errline = errline + "invalid date " + val + ", ";
						};
					};
					// checks for numeric values
					if (t == "numeric") {
						// not a valid numeric value
						if (isNaN(val.replace(thosep, "").replace(decin, "."))) {
							errline = errline + "invalid numeric " + val + ", ";
						} else if ((val.indexOf(thosep) > val.indexOf(decin))) {
							// incorrect decimal separator
							errline = errline + "incorrect decimal character " + val + ", ";
						} else {
							// check for too many decimals
							var p = val.trim().lastIndexOf(decin);
							if (p >= 0) {
								p = val.trim().length - p - 1; // -1 for the decimal character
								if (p > DDinput[idx][3]) {
									errline = errline + "too many decimals " + cols[c] + ", ";
								};
							};
						}
						// force decimal separator
						if (decout != "") {
							// force decimal separator
							cols[c] = val.replace(thosep, "").replace(decin, decout);
						};
					};

					// optionally trim all values
					if (trimout) {
						cols[c] = cols[c].trim();
					};
				};
			};

			// logging for any data error on this line of input
			if (errline != "") {
				// remove last comma and space
				errline = errline.slice(0, -2);
				WriteToLog("** Error on line " + (i+1) + ": " + errline);
				errcount++;
			};

			// ---- format output values ----
			switch (formatout) {
				case "tsv":
				case "csv":
				case "ssv":
					// output columns
					for (var c = 0; c < cols.length; c++) {
						// add separator, except not at the end of the line
						strout = strout + cols[c] + (c < cols.length-1 ? sepout : "");
					};
					// add line feed
					strout = strout + "\n";
					break;
				case "fix":
					// output columns
					for (var c = 0; c < cols.length; c++) {
						var pad = (c < DDoutput.length ? DDoutput[c][2] : 10);
						// right align for numeric columns
						var datatype = (c < DDoutput.length ? DDoutput[c][1] : "varchar");
						if (datatype == "numeric") pad = pad * -1;
						var val = StringPad(cols[c], pad);
						strout = strout + val;
					};
					strout = strout + "\n";
					break;
				case "sqlins":

					// each 500 rows
					var sqlnew = ((i-first) % maxrows == 0);

					// template for sub-select statement
					if (sqlnew) {
						// display which rows in comment
						var row2 = (i + maxrows - first > lines.length - first ? lines.length - first : i + maxrows - first);
						// add insert part
						strout += "\ngo\n";
						strout += "-- -------------------------------------\n";
						strout += "-- insert records " + (i-first+1) + " - " + row2 + "\n";
						strout += "-- -------------------------------------\n";
						strout += "insert into " + sqlTable + "(\n";
						for (var c = 0; c < cols.length; c++) {
							// column names
							var colname = DDoutput[c][0];
							strout = strout + "\t[" + colname + "],\n";
						};
						// remove last comma
						strout = strout.slice(0, -2) + ") values\n(";
					} else {
						// add comma after each row
						strout = strout + ",\n(";
					};

					// get values for data insert
					for (var c = 0; c < cols.length; c++) {
						var val = cols[c]
						if (val == "") {
							val = "NULL";
						} else {
							var datatype = (c < DDoutput.length ? DDoutput[c][1] : "varchar");
							if ( (datatype == "varchar") || (datatype == "datetime") ) {
								val = val.replace("'", "''");
								val = "'" + val + "'";
							};
						};
						strout = strout + val + ", ";
					};
					// remove last comma and close
					strout = strout.slice(0, -2) + ")";
					break;
				case "sqlsub":
				
					// each 500 rows
					var sqlnew = ((i-first) % maxrows == 0);

					// template for sub-select statement
					if (sqlnew) {
						// display which rows in comment
						var row2 = (i + maxrows - first > lines.length - first ? lines.length - first : i + maxrows - first);
						// add insert part
						strout += "go\n";
						strout += "-- -------------------------------------\n";
						strout += "-- insert records " + (i-first+1) + " - " + row2 + "\n";
						strout += "-- -------------------------------------\n";
						strout += "insert into " + sqlTable + "(\n";
						for (var c = 0; c < cols.length; c++) {
							// column names
							var colname = DDoutput[c][0];
							strout = strout + "\t[" + colname + "],\n";
						};
						// remove last comma
						strout = strout.slice(0, -2) + "\n)\n";
					};
	
					// template for sub-select statement
					var sqlsub = (sqlnew ? "select " : "union select ");

					// get values for data insert
					var values = "";
					for (var c = 0; c < cols.length; c++) {
						var val = cols[c]
						if (val == "") {
							val = "NULL";
						} else {
							var datatype = DDoutput[c][1];
							if ( (datatype == "varchar") || (datatype == "datetime") ) {
								val = val.replace("'", "''");
								val = "'" + val + "'";
							};
						};
						// first row
						if (sqlnew) {
							var colname = DDoutput[c][0];
							val = val + " as [" + colname + "]";
						};
						values = values + val + ", ";
					};
					// remove last comma
					values = values.slice(0, -2);
					// build actual data insert statements
					strout = strout + sqlsub + values + "\n";
					break;
			};
		};
	};

	// output
	document.getElementById("textOutput").value = strout;
	
	// write to logging
	var msg = "";
	msg = "Converted " + linecount + " data lines, " + (errcount > 0 ? "detected " + errcount + " lines with errors." : "no errors detected.");

	WriteToLog(msg);
	WriteToLog("Ready.");
};
