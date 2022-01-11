import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetch from './api/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  fetch(refs.inputRef.value).then(data => {
    if (data.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length >= 2 && data.length <= 10) {
      renderSeveralCountriesMarkup(data);
    } else if (data.length === 1) {
      renderOneCountryMarkup(data[0]);
    }
  });
}

function renderSeveralCountriesMarkup(data) {
  const markup = data
    .map(({ flags, name }) => `<li><img src="${flags.svg}"/> ${name.official}</li>`)
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderOneCountryMarkup({ flags, name, capital, population, languages }) {
  refs.countryList.innerHTML = `<li><img src="${flags.svg}"/> ${name.official}</li>`;
  refs.countryInfo.innerHTML = `
    <ul>
        <li><strong>Capital:</strong> ${capital}</li>
        <li><strong>Population:</strong> ${population}</li>
        <li><strong>Languages:</strong> ${Object.values(languages).join(', ')}</li>
    </ul>`;
}
