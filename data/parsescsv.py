import xlrd
import json

# Example data extracted from: http://esa.un.org/unmigration/TIMSO2013/data/subsheets/UN_MigrantStockByOriginAndDestination_2013T10.xls
 
# Open the workbook
wb = xlrd.open_workbook('UN_MigrantStockByOriginAndDestination_2013T10.xls')

# Create migrate data structure
migrate = []

# Select sheets that we want: 1, 4, 7, 10 index and include appropiate year
valid_sheets = [{'id': 1, 'year': 1990}, {'id': 4, 'year': 2000}, {'id': 7, 'year': 2010}, {'id': 10, 'year': 2013}] 

# Loop over the sheets
for current_sheet in valid_sheets:
    # Get the current sheet
    sh = wb.sheet_by_index(current_sheet['id'])

    # Init countries list
    countries = []
    second_column = sh.col_values(1)
    starting_row = 15
    starting_column = 9
    iso_column = sh.col_values(3)
    for colnum in range(starting_column, sh.ncols):
        # Create an aux dict to store the relation between the current country and the others
        country_name = sh.col_values(colnum)[starting_row]
        aux_dic = {'name': country_name, 'destinationList' : []}
   
        for rownum in range(starting_row, sh.nrows - 1):
	    # Store every country destination in the current dict
	    	val = sh.col_values(colnum)[rownum]
	        if second_column[rownum] == "United States of America":
                    aux_dic['destinationList'] \
                    .append({'countryDest': second_column[rownum], 'number': int(val) if val else ''})
    		if second_column[rownum] == country_name:
    			aux_dic['iso'] = int(iso_column[rownum])
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
    "countries_relation": [
      {
        "iso": 4,
        "name": "Afghanistan",
        "destinationList": [
          {
            "countryDest": "United States of America",
            "number": 32735
          }
        ]
      },
      {
        "iso": 8,
        "name": "Albania",
        "destinationList": [
          {
            "countryDest": "United States of America",
            "number": 6476
          }
        ]
      }
"""




