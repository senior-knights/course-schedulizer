mp <- readr::read_csv('meeting-patterns.csv', col_types = 'icc')
jsonlite::write_json(mp, path = 'meeting-patterns.json')

