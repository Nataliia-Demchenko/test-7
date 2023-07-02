import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';

const PARAMS = new URLSearchParams({
  key: '38024449-092934a06013d99d6c76f6e40',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

async function fetchImages(q, page) {
  const resp = await axios.get(`${BASE_URL}?${PARAMS}&q="${q}"&page=${page}`);
  return resp;
}

export { fetchImages };