const DATASETS = {
  homicide: {
    group:        'violence',
    label:        'Homicide Rate',
    unit:         'per 100,000 people',
    colorScheme:  d3.interpolateReds,
    barClass:     'violence',
    dotColor:     '#c0392b',
    valueKey:     'hrate',
    file:         'homicide_all'
  },
  refugees: {
    group:        'violence',
    label:        'Refugee Population',
    unit:         'people (asylum)',
    colorScheme:  d3.interpolatePurples,
    barClass:     'refugees',
    dotColor:     '#8e44ad',
    valueKey:     'refugees',
    file:         'refugee'
  },
  conflict: {
    group:        'violence',
    label:        'Conflict Deaths',
    unit:         'deaths',
    colorScheme:  d3.interpolateOranges,
    barClass:     'conflict',
    dotColor:     '#d35400',
    valueKey:     'deaths',
    file:         'deaths'
  },
  electricity: {
    group:        'resources',
    label:        'Electricity Access',
    unit:         '% of population',
    colorScheme:  d3.interpolateBlues,
    barClass:     'resources',
    dotColor:     '#2980b9',
    valueKey:     'share',
    file:         'electric'
  },
  water: {
    group:        'resources',
    label:        'Safe Water Access',
    unit:         '% using safe water',
    colorScheme:  d3.interpolateGreens,
    barClass:     'water',
    dotColor:     '#16a085',
    valueKey:     'water',
    file:         'water'
  }
};