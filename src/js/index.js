
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import { createMarkup } from './markup';
import { fetchImages } from './api';

let page = 1;
let query = '';
let totalHits;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnSubmit: document.querySelector('.submit'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handlerSubmit);
refs.btnLoadMore.addEventListener('click', handlerClickMore);

refs.btnLoadMore.hidden = true;

async function handlerClickMore() {
  page += 1;
  const data = await fetchImages(query, page);
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
  modal.refresh();
  checkLoadMore();
  scroll();
}

async function handlerSubmit(evt) {
  evt.preventDefault();
  query = evt.currentTarget.searchQuery.value;
  refs.gallery.innerHTML = '';
  page = 1;
  refs.btnLoadMore.hidden = true;
  try {
    const data = await fetchImages(query, page);
    totalHits = data.data.totalHits;
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
    modal.refresh();
  } catch (error) {
    console.log(error);
    Notiflix.Report.failure(
      'Oops!',
      'Something went wrong! Try reloading the page!',
      'Ok'
    );
  } finally {
    if (!totalHits) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      refs.btnLoadMore.hidden = false;
    }
  }
  checkLoadMore();
}

function checkLoadMore() {
  if (totalHits / 40 < page && totalHits) {
    refs.btnLoadMore.hidden = true;
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

const modal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  navText: ['◀', '▶'],
  closeText: '✖',
});

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Markup

function createMarkup(arr) {
    return arr
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
          return `<div class="photo-card">
          <a class="photo-link" href="${largeImageURL}">
          <div class="thumb">
          <img class="photo-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b><span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b><span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b><span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b><span>${downloads}</span>
          </p>
        </div>
        </a>
      </div>`;
        }
      )
      .join('');
  }
  
//   export { createMarkup };