import json
import csv
import os

# files = ['Table_{}.csv'.format(i) for i in xrange(1,13)]
# files = ['Table_1.csv']
# print files
# indices = [5] + [i for i in xrange(8,245)]

# for FILE_IN in files:
# 	with open(FILE_IN, 'r') as csvfile:
# 		to_dump = {}

# 		for _ in xrange(16):
# 			csvfile.readline()
		
# 		headers = csvfile.readline().strip().split(',')
# 		print headers

# 		lines = csvfile.read().strip().split('\n')
# 		for line in lines:
# 			values = line.strip().split(',')
# 			destination_region = values[1].strip()
# 			d_values = {headers[i]: values[i].strip().replace(' ','') for i in indices}
# 			to_dump[destination_region] = d_values

# 	FILE_OUT = '{}.json'.format(os.path.basename(FILE_IN)[:-4])
	
# 	with open(FILE_OUT, 'w') as outfile:
# 		outfile.write(json.dumps(to_dump))

# for testing purpose, just read 1 file
files = ['Table_1test.csv']

for FILE_IN in files:
	to_dump = {}
	with open(FILE_IN, 'rb') as csvfile:
		spamreader = csv.DictReader(csvfile)
		for row in spamreader :
			to_dump[row['Major area, region, country or area of destination']] = row
				 			
	FILE_OUT = '{}.json'.format(os.path.basename(FILE_IN)[:-4])	
	with open(FILE_OUT, 'w') as outfile:
		outfile.write(json.dumps(to_dump))

