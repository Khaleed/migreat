from __future__ import division
import pandas as pd
import numpy as np

file_name = 'OriginAndDestination_2013T110/1990.csv'
dest = 'United States of America'

with open(file_name, 'r') as f:
	# read csv
	data = pd.read_csv(f)

row = data.loc[data['Destination'] == dest]

origins = data.loc[data['Country code'] < 900]

countries = origins['Destination']

# list comprehension
vals = [(i, row[i].values[0]) for i in countries]

# filter
filtered_vals = filter(lambda x: not np.isnan(x[1]), vals)

# get the iso codes for origins 


