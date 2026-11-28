/**
 * Add partner restaurants only with their permission. Record dishes with
 * kitchen-confirmed ingredients (including broth, sauces and toppings).
 * allergyChecks keys identify ingredients the kitchen checked for both use
 * and cross-contact. Leave any unconfirmed attribute out.
 *
 * A restaurant: { id, city, name: [ko, en], mapUrl, dishes: [...] }
 * A verified dish: { name: [ko, en], price, diets: [], allergyChecks: [],
 *                    checkedOn: 'YYYY-MM-DD' }
 */
export const partnerRestaurants = [];

export const demoRestaurants = [
  {
    id: 'sample-table', city: 'seongnam', name: ['예시 식당 A', 'Sample Restaurant A'],
    dishes: [
      { name: ['닭고기 덮밥', 'Chicken rice bowl'], price: 11000,
        diets: ['no-pork'], allergyChecks: ['milk'] },
      { name: ['두부 채소 덮밥', 'Tofu and vegetable rice bowl'], price: 10000,
        diets: ['no-pork', 'vegetarian', 'vegan'], allergyChecks: ['milk', 'egg'] },
      { name: ['돼지고기 덮밥', 'Pork rice bowl'], price: 11500,
        diets: [], allergyChecks: [] },
    ],
  },
  {
    id: 'sample-kitchen', city: 'seongnam', name: ['예시 식당 B', 'Sample Restaurant B'],
    dishes: [
      { name: ['버섯 우동', 'Mushroom udon'], price: 12000,
        diets: ['no-pork', 'vegetarian'], allergyChecks: ['milk'] },
    ],
  },
];
