import * as yup from 'yup';
import _ from 'lodash';
import unwatchedState from './state.js';
import getRemoteData from './ajax.js';
import {
  isStorageAvailable, saveData, hasData, saveToState, compareDate,
} from './storage.js';
import { swapPage, renderStatuses } from './view.js';

const getZodiacByBirthday = (day, month) => {
  const birthDate = new Date(`${month}.${day}`);
  const data = unwatchedState.zodiacsList.find((zodiac) => {
    const dateFrom = new Date(zodiac.dateFrom);
    const dateTo = new Date(zodiac.dateTo);
    return dateFrom <= birthDate && dateTo >= birthDate;
  });
  return data.name;
};

const parseXML = (text) => {
  const xmlParser = new DOMParser();
  return xmlParser.parseFromString(text, 'application/xml');
};

const getUserHoroscope = (zodiacSign) => {
  if (zodiacSign && hasData(['fullHoroscope'])) {
    const data = parseXML(localStorage.getItem('fullHoroscope'));

    if (!data.querySelector('parsererror')) {
      const horoscopeForToday = data.querySelector(`${zodiacSign} today`);
      return horoscopeForToday.textContent.trim();
    }
  }

  return null;
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
      state.userData = { ...state.userData, ...data };
      state.userData.zodiacSign = getZodiacByBirthday(
        data.birthday.getDate(),
        data.birthday.getMonth() + 1,
      );
      state.userData.horoscope = getUserHoroscope(state.userData.zodiacSign);
      if (data.remember && state.storageAvailability) {
        saveData(state.userData);
      }
      swapPage('main');
    })
    .catch((err) => {
      state.validationErrors = _.keyBy(err.inner, 'path');
    });
};

const calculateRotationData = (data) => {
  const {
    statuses, currentItem: fromItem, nextItem: toItem, rotateCount, oneRotateTime, rotateOnDegrees,
  } = data;

  // calculate angles
  const itemsCount = statuses.length;
  const angleByStep = 360 / itemsCount;

  // calculate steps
  const stepsBeforeStop = itemsCount * rotateCount;
  let steps;
  if (fromItem > toItem) {
    steps = itemsCount - (fromItem - toItem);
  } else {
    steps = toItem - fromItem;
  }
  const sumOfSteps = steps + stepsBeforeStop;

  // calculate time
  const rotateTimeByStep = oneRotateTime / itemsCount;
  const rotateTime = rotateTimeByStep * sumOfSteps;

  return {
    rotateOnDegrees: rotateOnDegrees - (sumOfSteps * angleByStep),
    rotateTime,
  };
};

const getNextItem = (currentItem, currentStatus) => {
  if (currentStatus) {
    return currentItem;
  }
  let nextItem;
  do {
    nextItem = _.random(1, 12);
  } while (nextItem === currentItem);
  return nextItem;
};

const rouletteHandler = (state, evt) => {
  evt.preventDefault();

  const {
    statuses, currentItem, rotateCount, oneRotateTime, rotateOnDegrees,
  } = state.roulette;

  // one day - one status
  let nextItem;
  if (compareDate() && localStorage.getItem('dailyItem')) {
    nextItem = parseInt(localStorage.getItem('dailyItem'), 10);
  } else {
    nextItem = getNextItem(currentItem, state.userData.currentStatus);
    saveData({ dailyItem: currentItem });
  }

  const rotationData = calculateRotationData({
    statuses, currentItem, nextItem, rotateCount, oneRotateTime, rotateOnDegrees,
  });
  state.roulette = { ...state.roulette, ...rotationData, currentItem: nextItem };
  state.userData.currentStatus = state.roulette.statuses[nextItem - 1];
};

const getHoroscope = async (state) => {
  state.processState = 'sending';
  const text = await getRemoteData(state);
  const data = parseXML(text);

  if (data.querySelector('parsererror') || !text) {
    state.errors.push('xml parser error');
    return null;
  }

  if (state.storageAvailability) {
    saveData({ fullHoroscope: text });
  }

  return data;
};

// TODO multi chance
const multiChanceHandler = (state, evt) => {
  const result = [];
  for (let i = 0; i <= 10000; i += 1) {
    const random = _.random(0, 4);
    if (result[random]) {
      result[random] += 1;
    } else {
      result[random] = 1;
    }
  }

  const max = Math.max(...result);
  const mark = result.indexOf(max) + 1; // result
};

const app = async (state, i18n) => {
  renderStatuses(state, i18n);

  if (isStorageAvailable()) {
    state.storageAvailability = true;
    saveData({ today: new Date().toLocaleDateString() });
  }

  const fields = ['name', 'birthday', 'zodiacSign', 'fullHoroscope'];
  if (hasData(fields)) {
    saveToState(fields, state.userData);
    swapPage('main');
  }

  if (!hasData(['fullHoroscope'] || !compareDate())) {
    await getHoroscope(state);
  }

  state.userData.horoscope = getUserHoroscope(state.userData.zodiacSign);

  /* --- user form ---*/
  const userForm = document.querySelector('.user-data__form');
  userForm.addEventListener('submit', (evt) => userFormHandler(state, i18n, evt));

  /* --- roulette ---*/
  const luckyButton = document.querySelector('#lucky');
  luckyButton.addEventListener('click', (evt) => rouletteHandler(state, evt));

  /* --- multi-chance ---*/
  const multiButton = document.querySelector('#chance');
  multiButton.addEventListener('click', (evt) => multiChanceHandler(state, evt));

  /* --- result button ---*/
  const resultButton = document.querySelector('#horoscope');
  resultButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    swapPage('result');
  });

  /* --- edit button ---*/
  const editButton = document.querySelector('#edit-data');
  editButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    swapPage('user-data');
  });

  /* --- backTo button ---*/
  const backToButton = document.querySelector('#back-to-roulette');
  backToButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    swapPage('main');
  });
};

export default app;
