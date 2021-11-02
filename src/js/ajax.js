import axios from 'axios';

const getRemoteData = async (state) => {
  const url = `https://cors-anywhere.herokuapp.com/${state.url}`;
  const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });

  try {
    const response = await axios({
      method: 'get',
      url,
      headers,
    });

    if (response.statusText === 'OK') {
      const { data } = response;
      const xmlParser = new DOMParser();
      return xmlParser.parseFromString(data, 'application/xml');
    }
  } catch (err) {
    state.processState = 'error';
    state.errors.push(err.message);
  }

  return null;
};

export default getRemoteData;
