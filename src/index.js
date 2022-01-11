import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  container: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(event => {
    const valueOfInput = event.target.value.trim();

    if (valueOfInput === '') {
      refs.list.innerHTML = '';
      refs.container.innerHTML = '';
      return;
    }

    fetchCountries(valueOfInput)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info('Too many matches found. Please enter a more specific name.');
          return;
        } else if (countries.length >= 2 && countries.length <= 10) {
          refs.container.innerHTML = '';
          renderFewCountryList(countries);
          return;
        } else {
          refs.list.innerHTML = '';
          renderOneCountryList(countries);
        }
      })
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  }, DEBOUNCE_DELAY),
);

function renderFewCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list__item list">
          <img class='country-list__img' src="${country.flags.svg}" alt="flag of Country" width="30px">
          <p>${country.name.common}</p>
        </li>`;
    })
    .join('');
  refs.list.innerHTML = markup;
}

function renderOneCountryList(countries) {
  const markup = countries
    .map(country => {
      const countryValues = Object.values(country);
      const languagesValues = Object.values(countryValues[3]);

      return `
          <div class="country-list__container">
          <img src="${country.flags.svg}" alt="flag of Country" width="30px">
          <p>${country.name.official}</p>
          </div>
          <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${languagesValues}</p>
        </li>`;
    })
    .join('');
  refs.container.innerHTML = markup;
}