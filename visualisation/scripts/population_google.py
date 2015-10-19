import codecs
import json

output = []
input_directory = './data/'
output_directory = '../public/app/data/'

min_population = 80000

with codecs.open('{}population909500.json'.format(input_directory), 'r', 'utf-8') as fp:
	data = json.load(fp)
	series = data[2]
	year = int(series[0])
	values = series[1]
	size = len(values) / 3
	for i in range(0, size, 3):
		output.append({
			'year': year,
			'latitude': values[i],
			'longitude': values[i + 1],
			'population': values[i + 2]
		})

with codecs.open('{}population_google.json'.format(output_directory), 'w', 'utf-8') as fp:
	json.dump(output, fp, sort_keys=True, indent=4, separators=(',', ': '))