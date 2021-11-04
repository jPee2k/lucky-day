// TODO fix fetch (on vercel)
const getRemoteData = async (state) => {
  // const proxy = 'https://thingproxy.freeboard.io';
  // const url = new URL(`/fetch/${state.url}`, proxy);

  try {
    const response = await fetch(state.url);
    if (response.ok) {
      state.processState = 'success';
      return await response.text();
    }
  } catch (err) {
    state.processState = 'error';
    state.errors.push(err.message);
  }

  return null;
};

export default getRemoteData;
