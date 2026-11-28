import { partnerRestaurants, demoRestaurants } from './restaurants-data.js';

const text = {
  title: ['식당 찾기', 'Find restaurants'],
  intro: ['지역과 식단을 선택하고, 식당별로 조건에 맞는 메뉴를 확인하세요.', 'Choose an area and dietary preferences, then see matching dishes at each restaurant.'],
  city: ['지역', 'Area'],
  allCities: ['전체 지역', 'All areas'],
  seongnam: ['성남', 'Seongnam'],
  seoul: ['서울', 'Seoul'],
  diet: ['식단', 'Diet'],
  allDiets: ['모든 메뉴', 'All dishes'],
  'no-pork': ['돼지고기 제외', 'No pork'],
  vegetarian: ['채식', 'Vegetarian'],
  vegan: ['비건', 'Vegan'],
  allergies: ['피할 알레르기 재료', 'Allergens to avoid'],
  milk: ['우유', 'Milk'],
  egg: ['달걀', 'Egg'],
  wheat: ['밀', 'Wheat'],
  soy: ['대두', 'Soy'],
  peanut: ['땅콩', 'Peanut'],
  nuts: ['견과류', 'Tree nuts'],
  sesame: ['참깨', 'Sesame'],
  fish: ['생선', 'Fish'],
  shellfish: ['갑각류·조개류', 'Shellfish'],
  search: ['검색', 'Search'],
  tryDemo: ['예시 데이터로 체험하기', 'Try sample data'],
  demoNotice: ['체험용 가상 식당과 메뉴입니다. 실제 방문이나 주문에 사용할 수 없습니다.', 'These are fictional restaurants and dishes for the demo.'],
  results: ['검색 결과', 'Search results'],
  emptyLive: ['이 조건에 맞는 매장 확인 메뉴가 아직 등록되지 않았습니다.', 'No restaurant-reviewed dishes have been listed for these selections yet.'],
  emptyDemo: ['예시 식당에 조건에 맞는 메뉴가 없습니다.', 'No sample dishes match these selections.'],
  back: ['← 검색 결과로', '← Back to results'],
  matching: ['조건에 맞는 메뉴', 'Matching dishes'],
  emptyMenu: ['이 식당에서 현재 조건에 맞는 메뉴가 없습니다.', 'This restaurant has no dishes listed for these selections.'],
  demo: ['가상 예시', 'Fictional example'],
  checked: ['매장 확인일', 'Restaurant review date'],
  map: ['네이버 지도에서 보기', 'Open in Naver Map'],
};

const $ = selector => document.querySelector(selector);
const allergyIds = ['milk', 'egg', 'wheat', 'soy', 'peanut', 'nuts', 'sesame', 'fish', 'shellfish'];
const sample = $('#demo');
const city = $('#city');
const diet = $('#diet');
const price = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' });
let lang = 0;
const t = key => text[key][lang];

function element(tag, value = '', className = '') {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  if (className) node.className = className;
  return node;
}

function restaurantUrl(id) {
  const params = new URLSearchParams();
  if (city.value) params.set('city', city.value);
  if (diet.value) params.set('diet', diet.value);
  if (sample.checked) params.set('demo', '1');
  if (lang) params.set('lang', 'en');
  if (id) params.set('restaurant', id);
  return params.size ? `?${params}` : './';
}

function selectValue(control, value) {
  control.value = [...control.options].some(option => option.value === value) ? value : '';
}

function loadLocation() {
  const params = new URLSearchParams(location.search);
  selectValue(city, params.get('city'));
  selectValue(diet, params.get('diet'));
  sample.checked = params.get('demo') === '1';
  lang = Number(params.get('lang') === 'en');
  localize();
  render(params.get('restaurant'));
}

function localize() {
  document.documentElement.lang = lang ? 'en' : 'ko';
  document.title = `${t('title')} | ADPAI`;
  for (const node of document.querySelectorAll('[data-text]')) node.textContent = t(node.dataset.text);
  $('#language').textContent = lang ? 'KR' : 'EN';
  $('#language').lang = lang ? 'ko' : 'en';
  $('#language').setAttribute('aria-label', lang ? 'View in Korean' : '영어로 보기');
}

function dishMatches(dish, checkedAllergies) {
  if (!sample.checked && !dish.checkedOn) return false;
  return (!diet.value || dish.diets.includes(diet.value))
    && checkedAllergies.every(id => dish.allergyChecks.includes(id));
}

function restaurantCard(record) {
  const { restaurant, dishes } = record;
  const card = element('article', '', 'card');
  const locationText = sample.checked ? `${t(restaurant.city)} · ${t('demo')}` : t(restaurant.city);
  const heading = element('h3');
  const link = element('a', restaurant.name[lang]);
  link.href = restaurantUrl(restaurant.id);
  link.addEventListener('click', event => navigateLink(event, restaurant.id, '#restaurant-title'));
  heading.append(link);
  const count = lang
    ? `${dishes.length} matching ${dishes.length === 1 ? 'dish' : 'dishes'}`
    : `조건에 맞는 메뉴 ${dishes.length}개`;
  card.append(element('p', locationText, 'muted'), heading, element('p', count, 'matched'));
  return card;
}

function dishCard(dish) {
  const card = element('article', '', 'card');
  card.append(element('h3', dish.name[lang]));
  if (Number.isFinite(dish.price)) card.append(element('p', price.format(dish.price)));
  if (dish.checkedOn) card.append(element('p', `${t('checked')} ${dish.checkedOn}`, 'muted'));
  return card;
}

function render(id) {
  const restaurants = sample.checked ? demoRestaurants : partnerRestaurants;
  const checkedAllergies = [...document.querySelectorAll('#allergies input:checked')].map(input => input.value);
  const records = restaurants.map(restaurant => ({
    restaurant,
    dishes: restaurant.dishes.filter(dish => dishMatches(dish, checkedAllergies)),
  }));
  const matches = records.filter(({ restaurant, dishes }) =>
    (!city.value || city.value === restaurant.city) && dishes.length);
  const detail = records.find(({ restaurant }) => restaurant.id === id);
  $('#demo-notice').hidden = !sample.checked;
  $('#results').hidden = Boolean(detail);
  $('#restaurant').hidden = !detail;
  if (detail) {
    const { restaurant, dishes } = detail;
    const heading = element('h1', restaurant.name[lang]);
    heading.id = 'restaurant-title';
    heading.tabIndex = -1;
    const place = sample.checked ? `${t(restaurant.city)} · ${t('demo')}` : t(restaurant.city);
    const header = $('#restaurant-heading');
    header.replaceChildren(heading, element('p', place, 'muted'));
    if (restaurant.mapUrl) {
      const map = element('a', t('map'), 'map-link');
      map.href = restaurant.mapUrl;
      header.append(map);
    }
    $('#back').href = restaurantUrl();
    $('#dishes').replaceChildren(...dishes.map(dishCard));
    $('#empty-menu').hidden = dishes.length > 0;
    return;
  }
  const count = matches.length;
  $('#count').textContent = lang ? `${count} ${count === 1 ? 'restaurant' : 'restaurants'}` : `식당 ${count}곳`;
  $('#cards').replaceChildren(...matches.map(restaurantCard));
  $('#empty').hidden = count > 0;
  $('#empty').textContent = t(sample.checked ? 'emptyDemo' : 'emptyLive');
}

function navigate(id, focus) {
  const destination = restaurantUrl(id);
  if (new URL(destination, location.href).href !== location.href) {
    history.pushState(null, '', destination);
  }
  render(id);
  if (focus) $(focus)?.focus();
}

function navigateLink(event, id, focus) {
  if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  navigate(id, focus);
}

for (const id of allergyIds) {
  const label = element('label');
  const input = element('input');
  input.type = 'checkbox';
  input.value = id;
  const name = element('span');
  name.dataset.text = id;
  label.append(input, name);
  $('#allergies').append(label);
}
$('#filters').addEventListener('submit', event => {
  event.preventDefault();
  $('.allergy-picker').open = false;
  navigate(null);
});
sample.addEventListener('change', () => navigate(null));
$('#back').addEventListener('click', event => navigateLink(event, null, '#results-title'));
$('#results-title').tabIndex = -1;
$('#language').addEventListener('click', () => {
  lang = 1 - lang;
  localize();
  navigate(new URLSearchParams(location.search).get('restaurant'));
});
window.addEventListener('popstate', loadLocation);
loadLocation();
