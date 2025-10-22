import csv

with open('matches.csv', 'r', encoding='utf-8') as fin, \
     open('converted_matches.csv', 'w', encoding='utf-8', newline='') as fout:
    reader = csv.reader(fin, delimiter=';')
    writer = csv.writer(fout, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    for row in reader:
        writer.writerow(row)
