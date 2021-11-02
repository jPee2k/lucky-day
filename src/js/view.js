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

const disable = (buttons) => {
  buttons.forEach((button) => {
    button.setAttribute('disabled', 'true');
  });
};

const enable = (buttons) => {
  buttons.forEach((button) => {
    button.removeAttribute('disabled');
  });
};

const rotateRouletteTo = (rotateTime, rotateOnDegrees) => {
  const list = document.querySelector('.main__list');
  const angleToCenter = 15;
  const finallyAngle = rotateOnDegrees - angleToCenter;
  list.style.transform = `rotate(${finallyAngle}deg)`;
  list.style.transition = `transform ${rotateTime}ms linear`;
};

const renderProcess = (processState, state) => {
  // const list = document.querySelector('.page .main__list');
  const buttons = document.querySelectorAll('.main__nav .button');

  switch (processState) {
    case 'sending':
      disable(buttons);
      break;
    case 'error':
      enable(buttons);
      break;
    case 'success':
      enable(buttons);
      break;
    default:
      throw new Error(`wrong process state: ${processState}`);
  }
};

const render = (path, value, state, i18n) => {
  switch (path) {
    case 'processState':
      renderProcess(value, state);
      break;
    case 'userData.horoscope':
      // TODO append text
      // document.querySelector('body')
      //   .textContent = value;
      break;
    case 'errors':
      // TODO network error handler
      console.error(value);
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

export const renderStatuses = (state) => {
  const statusElements = [...document.querySelectorAll('.main__list .main__button > span')];
  statusElements.forEach((el) => {
    const index = statusElements.indexOf(el);
    el.textContent = state.roulette.statuses?.[index];
  });
};

export default render;
