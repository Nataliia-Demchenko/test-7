import axios from "axios";

const API_KEY = '38024449-092934a06013d99d6c76f6e40';
const URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
	image_type: 'photo',
	orientation: 'horizontal',
	safesearch: true,
	per_page: 40,
});

export async function getData(query, page) {
	try {
		const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${query}&${searchParams}&page=${page}`
		);
		return response.data;
	} catch (error) {
		console.log(error)
	}
}