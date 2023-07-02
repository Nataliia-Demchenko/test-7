
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getData } from './api';

const refs = {
  search: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  target: document.querySelector('.js-guard'),
};

let query = '';
let currentPage = 1;
const perPage = 40;

refs.loadMoreBtn.classList.add('is-hidden');

// Magnification of images when clicked
let lightbox = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
});

// Endless scrolling down
const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);
function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      lightbox.refresh();
      showPhotos(query, currentPage);
    }
  });
}
// Performing image search and playback by subject
refs.search.addEventListener('submit', onSearchButton);

function onSearchButton(event) {
  event.preventDefault();
  currentPage = 1;

  observer.unobserve(refs.target);

  const searchValue = event.currentTarget.elements.searchQuery.value.trim();

  if (!searchValue) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (searchValue === query) {
    return;
  }
  refs.galleryEl.innerHTML = '';
  query = searchValue;
  lightbox.refresh();
  showPhotos(query, currentPage);

  return query;
}
// Sending a request and rendering the gallery
async function showPhotos(query, currentPage = 1) {
  const { hits, totalHits } = await getData(query, currentPage);
  const totalPages = Math.ceil(totalHits / perPage);

  refs.galleryEl.insertAdjacentHTML('beforeend', createMarkupCards({ hits }));

  if (currentPage === totalPages) {
    observer.unobserve(refs.target);

    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    observer.observe(refs.target);
  }

	// Checking whether the response from the server is not empty
	  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  lightbox.refresh();
}

// Creating Image Group markup
function createMarkupCards({ hits }) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                <b>Likes</b>
                ${likes}
                </p>
                <p class="info-item">
                <b>Views</b>
                ${views}
                </p>
                <p class="info-item">
                <b>Comments</b>
                ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>
                ${downloads}
                </p>
            </div>
            </div>`
    )
    .join('');
}