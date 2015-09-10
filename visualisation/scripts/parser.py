import codecs
import json

output = []
countries = {}
input_directory = './data/'
output_directory = '../public/app/data/'
keys = ['geonameid', 'name', 'asciiname', 'alternate_names', 'latitude', 'longitude', 'feature_class', 'feature_code',
        'country_code', 'cc2', 'admin1_code', 'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
        'dem', 'timezone', 'modification_date']

int_keys = ['latitude', 'longitude', 'population']

remove_keys = ['geonameid', 'asciiname', 'alternate_names', 'feature_class', 'feature_code', 'cc2', 'admin1_code',
              'admin2_code', 'admin3_code', 'admin4_code', 'elevation', 'dem']

with codecs.open('{}countries.json'.format(input_directory), 'r', 'utf-8') as fp:
	data = json.load(fp, 'utf-8')
	for country in data:
		countries[country['code']] = country['name']

with codecs.open('{}cities15000.txt'.format(input_directory), 'r', 'utf-8') as fp:
	for line in fp.readlines():
		words = line.split('\t')
		map = dict(zip(keys, words))
		map['city'] = map.pop('name')
		map['country'] = countries[map['country_code']]
		map['modification_date'] = map['modification_date'].replace('\n', '')
		for key in int_keys:
			map[key] = float(map[key])
		for key in remove_keys:
			del map[key]
		output.append(map)

with codecs.open('{}population.json'.format(output_directory), 'w', 'utf-8') as fp:
	json.dump(output, fp, sort_keys=True, indent=4, separators=(',', ': '))