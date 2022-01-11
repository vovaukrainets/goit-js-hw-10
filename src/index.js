import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const counrtyInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(showCountry, DEBOUNCE_DELAY));

function showCountry() {
  countryList.innerHTML = '';
  counrtyInfo.innerHTML = '';
  const value = input.value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value)
    .then(response => {
      if (!response.ok) {
        throw Notify.failure('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(countries => {
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      if (countries.length === 1) {
        return countryCard(countries);
      } else {
        return countriesCard(countries);
      }
    })
    .catch(console.log);
}

function countryCard(country) {
  const { flags, name, capital, languages, population } = country[0];

  return (counrtyInfo.innerHTML = `<h1 class="country-name"><img class="img-country" src="${
    flags.svg
  }" alt="${name.common}">${name.common}</h1>
            <ul class="country-inf">
                <li class="value-heading">Capital:
                    <span class="value">${capital}</span>
                </li>
                <li class="value-heading">Population:
                    <span class="value">${population}</span>
                </li>
                <li class="value-heading">Languages:
                    <span class="value">${Object.values(languages).join(', ')}</span>
                </li>
            </ul>`);
}

function countriesCard(countries) {
  countryList.innerHTML = countries
    .map(
      ({ name, flags }) =>
        `<li class="country__list-item">
        <img class="img-countries" src="${flags.svg}" alt="${name.common}>
        <span class="country__list-name">${name.common}<span>
    </li>`,
    )
    .join('');
}
