// Aripeka builder starting prices (2026-11-05): Ryan met each of the four
// builders in person and got their current starting price (lot included),
// starting plan and build time. Shown on the Aripeka page and area guide
// (components/AripekaBuilderPrices.js) and in its "How much?" FAQ answer.
// Prices change: update `asOf` with each new round of numbers.
export const ARIPEKA_BUILDERS_AS_OF = 'November 2026';

export const ARIPEKA_BUILDERS = [
  {
    name: 'LifeStyle Homes',
    from: 'around $1.25 million',
    plan: 'St Thomas',
    specs: '2,433 living sq ft, 1 level, 3 bedrooms + study, 3 baths, 3-car garage',
    build: '14–16 months',
  },
  {
    name: 'CDS Builders',
    from: 'around $1.4 million',
    plan: 'Buttonwood',
    specs: '2,281 living sq ft, 3 bedrooms + office',
    build: '12–18 months',
  },
  {
    name: 'Joyal Homes',
    from: 'around $1.4 million',
    plan: 'Coronado',
    specs: '2,539 living sq ft, 4 bedrooms, 3 baths, 3-car garage',
    build: '12–15 months',
  },
  {
    name: 'Stanley Homes',
    from: 'around $1.4 million',
    plan: 'Maui 2',
    specs: '3,005 living sq ft, 4 bedrooms + study, 3 baths, 3-car garage',
    build: '12–14 months',
  },
];
