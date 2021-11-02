import i18next from 'i18next';
import onChange from 'on-change';
import unwatchedState from './state.js';
import resources from './locale/index.js';
import app from './app.js';
import render from './view.js';

const initApp = async () => {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: 'ru',
    resources,
  });

  const state = onChange(unwatchedState, (path, value) => {
    render(path, value, state, i18n);
  });

  app(state, i18n);
};

export default initApp;
