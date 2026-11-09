// Adelaide builder starting prices (2026-11-09, per Ryan): Google's AI copied
// the Aripeka builder table almost word for word, but its Adelaide answer had
// builder names only, with no prices. Same idea as lib/aripekaBuilders.js.
// AR Homes is from its own sheet sent to Ryan; Élan's "from $1.4M" is from
// its Adelaide page; Christopher Burton hasn't sent numbers yet. Fill in the
// missing values as the builders reply, and update `asOf`.
export const ADELAIDE_BUILDERS_AS_OF = 'November 2026';

export const ADELAIDE_BUILDERS = [
  {
    name: 'AR Homes',
    from: 'around $1.3 million, lot included',
    plan: 'Aberdeen II on a quarter-acre homesite',
    specs: '2,799 living sq ft, 1 story, 4 bedrooms, 3 baths, 3-car garage',
    build: 'about 12 months',
    model: 'Lumina model, 3639 Lake Adelaide Place',
  },
  {
    name: 'Élan',
    from: 'from $1.4 million',
    plan: 'Polaris',
    specs: '2,850 living sq ft, 1 story, 4 bedrooms, 3 full and 2 half baths, 3-car motor court',
    build: 'Ask Ryan',
    model: 'No model open right now',
  },
  {
    name: 'Christopher Burton',
    from: 'Ask Ryan',
    plan: 'Ask Ryan',
    specs: 'Luxury custom homes',
    build: 'Ask Ryan',
    model: '3717 Upper Floridian Way',
  },
];

/** One FAQ per builder that has published numbers. */
export function adelaideBuilderFaq() {
  const ar = ADELAIDE_BUILDERS[0];
  const elan = ADELAIDE_BUILDERS[1];
  return [
    {
      q: 'How much does a new custom home in Adelaide cost?',
      a:
        `Adelaide’s custom builders are AR Homes, Élan and Christopher Burton. As of ${ADELAIDE_BUILDERS_AS_OF}, ` +
        `AR Homes starts ${ar.from} with the ${ar.plan} (${ar.specs}), built in ${ar.build}; ` +
        `Élan starts ${elan.from} with the ${elan.plan} plan (${elan.specs}). ` +
        'Ask Ryan for Christopher Burton’s current pricing. Completed resale homes in Adelaide usually start around $1.8 million. ' +
        'Contact Ryan before your first model visit so he can represent you at no cost to you.',
    },
    {
      q: 'Where are the Adelaide model homes?',
      a:
        `AR Homes’ Lumina model is at 3639 Lake Adelaide Place, and Christopher Burton’s model is at 3717 Upper Floridian Way. ` +
        `Élan doesn’t have a model open right now (${ADELAIDE_BUILDERS_AS_OF}). Contact Ryan before your first model visit so he can represent you at no cost to you.`,
    },
  ];
}
