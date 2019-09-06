Dataset Multitool
=================

A tool to make it easier to work with and process tabular data files.
Interpret, convert and reformat CSV datasets and various text formats.
For example you can take a dataset and:

* Convert it to different comma/semi-column or tab separated format
* Update columns values between US, European and ISO date formats
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

Data definition
---------------
The input and output datadefinition are lists of column names, followed by the datatype of each column.
There are three suppored datatypes.

	varchar    : any text value
	numeric    : any numeric value 123 or -12,3 or 1.234 etc.
	datetime   : any datetime value 12/31/2018 or 31-12-2018 12:34 etc.

Each datatype is followed by parentheses, containing additional format information.
The datatype varchar has the maximum width in parentheses.
Numeric datatype format is either just te maximum width, or the width and how many decimals places.

Datetime datatypes

must be followed by the date-mask in parentheses.
Use any dateformat using dd=day, mm=month, yyyy=year, hh=hours, nn=minutes, ss=seconds, fff=milliseconds.
Allowed datetime separators are - \ / . : and space.
Use single letter d, m, h to indicate non-fixed positions so without leading zeroes.
Valid datetime format examples: dd-mm-yyyy hh:nn:ss.fff , yyyy-mm-dd hh:nn , d-m-yyyy h:nn:ss etc.

DataExamples

	varchar(7)                 : text value max. 7 characters, example AB12345
	varchar(30)                : text value max. 30 characters
	numeric(3)                 : numeric value with max. 3 digits, example 123 or 999
	numeric(8)                 : numeric value with max. 8 digits, example 12467235
	numeric(6,3)               : numeric value max. width 6 characters, and 3 decimal places, example 12.345
	numeric(7,2)               : numeric values, example 1234.56 or -678.90 or 9999.99
	datetime(d-m-yyyy)         : datetime values 31-1-2018 or 5-12-2018 etc.
	datetime(mm/dd/yyyy)       : datetime values 01/31/2018 or 12/05/2018 etc.
	datetime(dd-mm-yyyy hh:nn) : datetime values 31-01-2018 12:34 or 05-12-2018 23:59 etc.
	datetime(yyyymmdd)         : datetime values 20181231 or 20180131 etc.

Known bugs
----------
* Automatically detecting date formats is sometimes incorrect
* There is no output log for any data errors

History
-------
04-jul-2019 - first release v1.0  

questions, comments, new songs: Bas de Reuver - bdr1976@gmail.com


BdR©2019 Free to use - send questions or comments here