import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputCountry.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputCountry = e.target.value.trim();

  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (inputCountry === '') {
    return;
  }

  fetchCountries(inputCountry).then(country => {
    if (country.status === 404) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return;
    }

    if (country.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }

    if (country.length >= 2 && country.length <= 10) {
      renderCountryList(country);
      return;
    }

    if (country.length === 1) {
      renderCountry(country);
      return;
    }
  });
}

function renderCountry(country) {
  const markup = country
    .map(country => {
      return `<h2><img src="${country.flags.svg}" width="40"> ${country.name.official} </h2>
        <ul><li><b>Capital: </b>&nbsp;${country.capital}</li>
        <li><b>Population: </b>&nbsp;${country.population}</li>
        <li><b>Languages: </b>&nbsp;${Object.values(country.languages)}</li></ul>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}

function renderCountryList(country) {
  const markup = country
    .map(country => {
      return `<li><img src="${country.flags.svg}" width="20"> ${country.name.common}</li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}
