const DATASETS = {
  homicide: {
    group:        'violence',
    label:        'Homicide Rate',
    subheader: 'Annual number of deaths from homicide per 100,000 people',
    unit:         'per 100,000 people',
    colorScheme:  d3.interpolateReds,
    dotColor:     '#8B4513',
    valueKey:     'hrate',
    file:         'homicide_all'
  },
  refugees: {
    group:        'violence',
    label:        'Refugee Population',
    subheader:  'number of people fleeing their home country due to conflict or persecution (asylum seekers and refugees)',
    unit:         'people (asylum)',
    colorScheme:  d3.interpolateReds,
    dotColor:     '#8B4513',
    valueKey:     'refugees',
    file:         'refugee'
  },
  conflict: {
    group:        'violence',
    label:        'Conflict Deaths',
    subheader:  'Deaths in armed conflicts based on where they occurred',
    unit:         'deaths',
    colorScheme:  d3.interpolateReds,
    dotColor:     '#8B4513',
    valueKey:     'deaths',
    file:         'deaths'
  },
  electricity: {
    group:        'resources',
    label:        'Electricity Access',
    subheader:     'Share of the population (%) with access to electricity source at least 4 hours a day',
    unit:         '% of population',
    colorScheme:  d3.interpolatePurples,
    dotColor:     '#8B4513',
    valueKey:     'share',
    file:         'electric'
  },
  water: {
    group:        'resources',
    label:        'Safe Water Access',
    subheader:  'Share of the population (%) using safely managed drinking water sources',
    unit:         '% using safe water',
    colorScheme:  d3.interpolatePurples,
    dotColor:     '#8B4513',
    valueKey:     'water',
    file:         'water'
  }
};