const getRemoteData = async (state) => {
  // const proxy = 'https://thingproxy.freeboard.io';
  // const url = new URL(`/fetch/${state.url}`, proxy);
  const proxy = 'https://cors-anywhere.herokuapp.com';
  const url = `${proxy}/${state.url}`;

  try {
    const response = await fetch(url.toString());
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
