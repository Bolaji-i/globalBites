/**
 * Cuisines offered on the recipe form and the recipe list filter.
 *
 * The English name is what a recipe stores. Its translation lives in the
 * `cuisines` messages under the camelCased name ("Latin American" →
 * `latinAmerican`), so adding a cuisine here means adding that key to every
 * file in `messages/`.
 */
export const CUISINE_GROUPS = {
  // Broad traditions, for dishes that belong to a region more than one country
  regional: [
    'African', 'West African', 'East African', 'North African',
    'Asian', 'Southeast Asian', 'Caribbean', 'European', 'Eastern European',
    'Latin American', 'Mediterranean', 'Middle Eastern', 'Nordic', 'Oceanian',
  ],
  national: [
    'American', 'Argentinian', 'Australian', 'Brazilian', 'British', 'Cameroonian',
    'Chinese', 'Colombian', 'Cuban', 'Egyptian', 'Ethiopian', 'Filipino',
    'French', 'German', 'Ghanaian', 'Greek', 'Indian', 'Indonesian',
    'Italian', 'Jamaican', 'Japanese', 'Kenyan', 'Korean', 'Lebanese',
    'Malaysian', 'Mexican', 'Moroccan', 'Nigerian', 'Pakistani', 'Persian',
    'Peruvian', 'Polish', 'Portuguese', 'Russian', 'Senegalese', 'South African',
    'Spanish', 'Thai', 'Turkish', 'Vietnamese',
  ],
  other: ['Fusion'],
} as const;

export type CuisineGroup = keyof typeof CUISINE_GROUPS;

export const ALL_CUISINES: string[] = Object.values(CUISINE_GROUPS).flat();
