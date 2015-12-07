# import json
# import csv
# import os

# files = ['Table_{}.csv'.format(i) for i in xrange(1,13)]

# for FILE_IN in files:
# 	to_dump = {}
# 	with open(FILE_IN, 'rb') as csvfile:
# 		spamreader = csv.DictReader(csvfile)
# 		for row in spamreader :
# 			to_dump[row['Major area, region, country or area of destination']] = row
				 			
# 	FILE_OUT = '{}.json'.format(os.path.basename(FILE_IN)[:-4])	
# 	with open(FILE_OUT, 'w') as outfile:
# 		outfile.write(json.dumps(to_dump))

import xlrd
import json

# Example data extracted from: http://esa.un.org/unmigration/TIMSO2013/data/subsheets/UN_MigrantStockByOriginAndDestination_2013T10.xls
 
# Open the workbook
wb = xlrd.open_workbook('UN_MigrantStockByOriginAndDestination_2013T10.xls')

# Create migrate data structure
migrate = []

# Select sheets that we want: 1, 4, 7, 10 index and include appropiate year
valid_sheets = [{'id': 1, 'year': 1900}, {'id': 4, 'year': 2000}, {'id': 7, 'year': 2010}, {'id': 10, 'year': 2013}] 

# Loop over the sheets
for current_sheet in valid_sheets:
    # Get the current sheet
    sh = wb.sheet_by_index(current_sheet['id'])

    # Init countries list
    countries = []
    second_column = sh.col_values(1)
    starting_row = 15
    starting_column = 9

    for colnum in range(starting_column, sh.ncols):
        # Create an aux dict to store the relation between the current country and the others
        country_name = sh.col_values(colnum)[starting_row]
        aux_dic = {'name': country_name, 'destinationList' : []}
   
        for rownum in range(starting_row, sh.nrows - 1):
	    # Store every country destination in the current dict
            aux_dic['destinationList'].append({'countryDest': second_column[rownum], 'number': sh.col_values(colnum)[rownum]})
    
        # Append the current country to the collection
        countries.append(aux_dic)

    migrate.append({'year': current_sheet['year'], 'countries_relation': countries})

# Dump the data into a json file
with open('data.json', 'w') as outfile:
    json.dump(migrate, outfile)

"""
JSON structure created:

[
      {
	  "countries_relation": [{
		      "name": "Afghanistan",
		      "destinationList": [{
			      "countryDest": "Major area, region, country or area of destination",
			      "number": "Afghanistan"
			  }, {
			      "countryDest": "WORLD",
			      "number": 7295267.0
			  }, {
			      "countryDest": "More developed regions",
			      "number": 119772.0
			  }, {
			      "countryDest": "Sub-Saharan Africa",
			      "number": 33.0
			  }, {
			      "countryDest": "AFRICA",
			    "number": 964.0
		      {
		      ...
		      
		      "name": "Ghana",
		      "destinationList": [{
			      "countryDest": "Major area, region, country or area of destination",
			      "number": "Ghana"
			  }, {
			      "countryDest": "WORLD",
			      "number": 388872.0
			  }, {
			      "countryDest": "More developed regions",
			      "number": 130633.0
			  }, {
		      ...
		      
		      ]
	  "year": 1900
	},
	...
	{
	  "countries_relation": [{
		      "name": "Afghanistan",
		      "destinationList": [{
			      "countryDest": "Major area, region, country or area of destination",
			      "number": "Afghanistan"
		      ...
		      
		      ]
	  "year": 2000
	},
]

"""




