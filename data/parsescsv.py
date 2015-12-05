import json
import csv
import os

files = ['Table_{}.csv'.format(i) for i in xrange(1,13)]

for FILE_IN in files:
	to_dump = {}
	with open(FILE_IN, 'rb') as csvfile:
		spamreader = csv.DictReader(csvfile)
		for row in spamreader :
			to_dump[row['Major area, region, country or area of destination']] = row
				 			
	FILE_OUT = '{}.json'.format(os.path.basename(FILE_IN)[:-4])	
	with open(FILE_OUT, 'w') as outfile:
		outfile.write(json.dumps(to_dump))




