Dataset Multitool
=================

Try it here: [Dataset Multitool](http://members.home.nl/bas.de.reuver/files/datasetmultitool.html)

A tool to make it easier to work with and process tabular data files.
Interpret, convert and reformat CSV datasets and various text formats.
For example you can take a dataset and:

* Convert it to different comma/semi-colon or tab separated format
* Update date values to US, European and ISO date formats
* Replace decimal points or comma's in numeric values
* Remove thousand separators from number values
* Rearrange the column order
* Convert all data to SQL insert statements

How to use it
-------------

1. Paste your dataset in the green input textbox
2. Press "Smart examine" to automatically detect format (or enter it manually)
3. Adjust output columns and formats
4. Select output format and press CONVERT button
5. Copy&paste dataset from blue output textbox into new file or spreadsheet

Options
-------
**Input format**  
Tab separated, comma separated, semi-colon separated or fixed width.

**Column names in first row**   
First row contains column names, unselect this option when data starts at the first row.

**Decimal separator**   
Adjust decimal point or comma when converting numeric values.
Select option (unchanged) to copy numeric values as-is.
Select point as decimal separator for input will remove any thousand separator commas.
And vice versa, if comma is decimal separator then any points thousand separators
will be removed for numeric values.

Data definition
---------------
The input and output datadefinition are lists of column names, followed by the datatype of each column.
Each datatype is followed by parentheses, containing additional format information.
Suppored datatypes are

	varchar    : any text or string value
	numeric    : any numeric value 123 or -12,3 or 1.234 etc.
	datetime   : any datetime value 12/31/2018 or 31-12-2018 12:34 etc.

**varchar**   
Datatype varchar has the maximum width in parentheses.

**numeric**   
Numeric datatype format is either just te maximum width, or the width and how many decimals places.

**datetime**   
Datetime datatypes must be followed by the date-mask in parentheses.
Use any dateformat using dd=day, mm=month, yyyy=year, hh=hours, nn=minutes, ss=seconds, fff=milliseconds.
Allowed datetime separators are - \ / . : and space.
Use single letter d, m, h to indicate non-fixed positions so without leading zeroes.
Valid datetime format examples: dd-mm-yyyy hh:nn:ss.fff , yyyy-mm-dd hh:nn , d-m-yyyy h:nn:ss etc.

DataExamples

	varchar(7)                 : text value max. 7 characters, example AB12345
	varchar(30)                : text value max. 30 characters
	numeric(3)                 : numeric value with max. 3 digits, example 123 or 999
	numeric(8)                 : numeric value with max. 8 digits, example 12467235
	numeric(6,3)               : numeric value max. width 6 characters, and 3 decimal places, example 12,345
	numeric(7,2)               : numeric values, example 1234,56 or -678,90 or 9999,99
	datetime(d-m-yyyy)         : datetime values 31-1-2018 or 5-12-2018 etc.
	datetime(mm/dd/yyyy)       : datetime values 01/31/2018 or 12/05/2018 etc.
	datetime(dd-mm-yyyy hh:nn) : datetime values 31-01-2018 12:34 or 05-12-2018 23:59 etc.
	datetime(yyyymmdd)         : datetime values 20181231 or 20180131 etc.

Known bugs
----------
Although fully functional, this tool is in prototype phase.
It is missing some conveniences like open-file and save-file dialogs.
Working with large dataset (>10000 records) is quite slow.

Known bugs and missing features:

* When automatically detecting date formats, the date and month order is sometimes incorrect
* Quoted string values are not supported
* There is no output log for any data errors

History
-------
04-jul-2019 - first release v1.0  

BdR©2019 Free to use - send questions or comments: Bas de Reuver - bdr1976@gmail.com
