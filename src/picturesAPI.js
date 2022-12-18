import axios from 'axios';

const API_KEY = '32033746-788ed9cc01d9927930ca3c628';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export class PicturesAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchAPI() {
    const options = new URLSearchParams({
      key: API_KEY,
      page: this.page,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    });
    const { data } = await axios(`?${options}`);
    this.page += 1;
    return data;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
