import codecs
import json
import random

output = []
output_directory = '../public/app/data/'

weeks = 200
tutorials = 1
groups = 100
activities = ['Case information', 'Issues and evidence', 'Goals and actions', 'Reflection']

for week in range(1, weeks + 1):
	for tutorial in range(1, tutorials + 1):
		current_week = {'week': week, 'groups': []}
		current_groups = current_week['groups']
		for group in range(1, groups + 1):
			activity = random.choice(activities)
			index = activities.index(activity)
			size = len(activities)
			progress = round(random.uniform((index + 1.0) / size, min(index + 2.0, size) / size), 2)
			complete = index == (size - 1)
			output.append({
				'week': week,
				'tutorial': tutorial,
				'group': group,
				'activity': activity,
				'progress': progress,
				'complete': complete
			})
		# output.append(current_week)

print 'length {}'.format(len(output))

with codecs.open('{}students.json'.format(output_directory), 'w', 'utf-8') as fp:
	json.dump(output, fp, indent=4, separators=(',', ': '))