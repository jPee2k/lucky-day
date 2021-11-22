const getRemoteData = async (state) => {
  const url = new URL('https://hexlet-allorigins.herokuapp.com/get');
  url.searchParams.append('url', state.url);

  try {
    const response = await fetch(url.toString());
    if (response.ok) {
      state.processState = 'success';
      const data = await response.json();
      return data.contents;
    }
  } catch (err) {
    state.processState = 'error';
    state.errors.push(err.message);
  }

  return null;
};

export default getRemoteData;
