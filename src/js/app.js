import * as yup from 'yup';
import _ from 'lodash';
import unwatchedState from './state.js';
import getRemoteData from './ajax.js';
import { isStorageAvailable, saveData, hasData } from './storage.js';
import { swapPage, renderStatuses } from './view.js';
import runRouletteApp from './roulette.js';

const getZodiacByBirthday = (day, month) => {
  const birthDate = new Date(`${month}.${day}`);
  const data = unwatchedState.zodiacsList.find((zodiac) => {
    const dateFrom = new Date(zodiac.dateFrom);
    const dateTo = new Date(zodiac.dateTo);
    return dateFrom <= birthDate && dateTo >= birthDate;
  });
  return data.name;
};

const userFormHandler = (state, i18n, evt) => {
  evt.preventDefault();
  const formData = new FormData(evt.target);
  const fields = Object.fromEntries(formData.entries());
  const tomorrow = new Date(Date.now() + (24 * 60 * 60 * 1000));
  fields.birthday = fields.birthday || tomorrow;

  const schema = yup.object().shape({
    name: yup.string().trim()
      .min(2, i18n.t('userData.validation.name.min'))
      .max(254, i18n.t('userData.validation.name.max'))
      .matches(/^([a-zA-Z]+)$|^([а-яА-Я]+)$/, i18n.t('userData.validation.name.symbols'))
      .required(i18n.t('userData.validation.required')),
    birthday: yup.date()
      .min(new Date('01-01-1900'), i18n.t('userData.validation.date.min'))
      .max(new Date(), i18n.t('userData.validation.date.max'))
      .required(i18n.t('userData.validation.required')),
  });

  schema.validate(fields, { abortEarly: false })
    .then((data) => {
      state.userData = { ...data };
      state.userData.zodiacSign = getZodiacByBirthday(
        data.birthday.getDate(),
        data.birthday.getMonth() + 1,
      );
      if (data.remember && isStorageAvailable()) {
        saveData(state.userData);
      }
      swapPage('main');
    })
    .catch((err) => {
      state.validationErrors = _.keyBy(err.inner, 'path');
    });
};

const rouletteHandler = async (state, evt) => {
  evt.preventDefault();

  runRouletteApp(state);
  state.processState = 'sending';
  const data = await getRemoteData(state);

  if (data) {
    if (data.querySelector('parsererror')) {
      state.errors.push('xml parser error');
      state.processState = 'error';
    }

    const horoscopeForToday = data.querySelector(`${state.userData.zodiacSign} today`);
    state.userData.horoscope = horoscopeForToday.textContent.trim();
    state.processState = 'success';
  }
};

const app = async (state, i18n) => {
  renderStatuses(state);

  // if (hasData()) {
  //   swapPage('main');
  // }

  /* --- user form ---*/
  const userForm = document.querySelector('.user-data__form');
  userForm.addEventListener('submit', (evt) => userFormHandler(state, i18n, evt));

  /* --- roulette ---*/
  const luckyButton = document.querySelector('#lucky');
  luckyButton.addEventListener('click', (evt) => rouletteHandler(state, evt));
};

export default app;
