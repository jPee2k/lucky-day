export const swapPage = (selector) => {
  const activePage = document.querySelector('.page--active');
  const currentPage = document.querySelector(`.${selector}`);
  activePage.classList.remove('page--active');
  currentPage.classList.add('page--active');
};

const removeErrors = (element) => {
  const fields = element.querySelectorAll('.error__field');
  fields.forEach((field) => field.classList.remove('error__field'));
  const messages = element.querySelectorAll('.error__text');
  messages.forEach((message) => {
    message.textContent = '';
  });
};

const renderValidationErrors = (errors) => {
  const form = document.querySelector('.user-data__form');
  removeErrors(form);

  Object.keys(errors).forEach((key) => {
    const field = form.querySelector(`input[name="${key}"]`);
    field.classList.add('error__field');
    const message = form.querySelector(`input[name="${key}"] ~ .error__text`);
    message.textContent = errors[key].message;
  });
};

const renderText = (className, text, prefix) => {
  const wrapper = document.querySelector('.result__wrapper');
  const existElement = document.querySelector(`.${className}`);
  const element = document.createElement('p');
  element.classList.add(className);
  element.innerHTML = `${prefix}<br><span class="result__main-text">${text}</span>`;

  if (existElement) {
    wrapper.replaceChild(element, existElement);
    return;
  }
  wrapper.prepend(element);
};

const rotateRouletteTo = (rotateTime, rotateOnDegrees) => {
  const list = document.querySelector('.main__list');
  const angleToCenter = 15;
  const finallyAngle = rotateOnDegrees - angleToCenter;
  list.style.transform = `rotate(${finallyAngle}deg)`;
  list.style.transition = `transform ${rotateTime}ms linear`;
};

const render = (path, value, state, i18n) => {
  switch (path) {
    case 'userData.horoscope':
      renderText('result__horo', value, `${i18n.t('horoscope.title')}:`);
      break;
    case 'userData.currentStatus':
      renderText('result__calc', i18n.t(`statuses.${value}`), `${i18n.t('chance.title')}:`);
      break;
    case 'errors':
      renderText('result__horo', `${i18n.t('networkError.title')}`, `${i18n.t('networkError.message')}`);
      break;
    case 'validationErrors':
      renderValidationErrors(value);
      break;
    case 'roulette':
      rotateRouletteTo(value.rotateTime, value.rotateOnDegrees);
      break;
    default:
      break;
  }
};

export const renderStatuses = (state, i18n) => {
  const statusElements = [...document.querySelectorAll('.main__list .main__button > span')];
  statusElements.forEach((el) => {
    const index = statusElements.indexOf(el);
    el.textContent = i18n.t(`statuses.${state.roulette.statuses?.[index]}`);
  });
};

export default render;
