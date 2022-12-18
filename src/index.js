import { Notify } from 'notiflix';
import { PicturesAPI } from './picturesAPI';
import { LoadMoreBtn } from './loadMoreBtn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imageContainer: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.search-button'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onFormSubmit);

const pictureAPI = new PicturesAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);
const simpleLightBox = new SimpleLightbox('.gallery a');

async function onFormSubmit(e) {
  e.preventDefault();

  pictureAPI.query = e.currentTarget.elements.searchQuery.value.trim();
  if (pictureAPI.query === '') {
    Notify.warning('Enter something');
    return;
  }

  pictureAPI.resetPage();

  try {
    const { hits, totalHits } = await pictureAPI.fetchAPI();

    if (totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again'
      );
      refs.imageContainer.innerHTML = '';
      loadMoreBtn.hide();
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.imageContainer.innerHTML = '';
    renderPictures(hits);

    simpleLightBox.refresh();
    loadMoreBtn.show();
  } catch (error) {
    Notify.failure('Something is wrong');
  }
}

function renderPictures(hits) {
  const images = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
<a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
                <div class="info">
                <p class="info-item">
                  <b>Likes: </b>${likes}
                </p>
                <p class="info-item">
                  <b>Views: </b>${views}
                </p>
                <p class="info-item">
                  <b>Comments: </b>${comments}
                </p>
                <p class="info-item">
                  <b>Downloads: </b>${downloads}
                </p>
              </div>
      </div>
      `;
      }
    )
    .join('');

  refs.imageContainer.insertAdjacentHTML('beforeend', images);
}

async function onLoadMoreBtn() {
  loadMoreBtn.loading();
  try {
    const { hits } = await pictureAPI.fetchAPI();
    renderPictures(hits);
    simpleLightBox.refresh();
    loadMoreBtn.endLoading();

    if (hits.length < 40) {
      loadMoreBtn.hide();
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    Notify.failure('Something is wrong');
  }
}
