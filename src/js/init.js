import i18next from 'i18next';
import onChange from 'on-change';
import unwatchedState from './state.js';
import resources from './locale/index.js';
import app from './app.js';

const initApp = async () => {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: 'ru',
    resources,
  });

  const state = onChange(unwatchedState, (path, value) => {
    // TODO render
  });

  app(state, i18n);
};

export default initApp;
