from __future__ import division
import pandas as pd
import numpy as np
import csv

def transform_data(in_file, out_file):

	dest = 'United States of America'

	with open(in_file, 'r') as f:
		# read csv
		data = pd.read_csv(f)

	row = data.loc[data['Destination'] == dest]

	origins = data.loc[data['Country code'] < 900]

	countries = origins['Destination']

	# list comprehension -> tupple -> countries and values
	vals = [(i, row[i].values[0]) for i in countries]

	# filter the nans
	filtered_vals = filter(lambda x: not np.isnan(x[1]), vals)

	# sort the values in descending order
	sorted_vals = sorted(filtered_vals, reverse=True, key=lambda x: x[1])

	# get the top 20
	top_20 = sorted_vals[:20]

	# go through each pair of destinationa and country code and set it
	country_to_code = { d: c for d, c in zip(data['Destination'], data['Country code'])}

	# we need the list of top 20 origins, their iso codes and values
	result = [(country_to_code[n], n, int(v)) for n, v in top_20]
	# print to csv
	with open(out_file, 'w') as f:
		# write to csv
		writer = csv.writer(f)
		writer.writerow(['iso', 'name', 'value'])
		for row in result:
			writer.writerow(row)

years = [1990, 2000, 2010, 2013]

for y in years :
	in_file = 'originAndDestination/%d.csv' % y
	out_file = 'output/us%d.csv' % y
	transform_data(in_file, out_file)
