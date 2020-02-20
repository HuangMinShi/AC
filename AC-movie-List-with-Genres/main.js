(function () {
  // ============================== declare variables ==============================
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const showGenreList = document.querySelector('#show-genre-list')
  const datapanel = document.querySelector('#data-panel')
  const pagination = document.querySelector('#pagination')
  const ITEM_PER_PAGE = 8
  let paginationData = []
  const genreList = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }


  // ============================== function ==============================

  // show list of movie genres
  function getGenreList(list) {
    let genresContent = ''
    for (let key in list) {
      genresContent += `
        <a class="nav-link" data-toggle="pill" href="javascript:;" data-genres="${list[key]}">${list[key]}</a>
        `
    }
    showGenreList.innerHTML = genresContent
    showGenreList.firstElementChild.classList.toggle('active')
  }

  // display movies
  function displayMovieList(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
      <div class="col-sm-3">
        <div class="card mb-2">
          <img src="${POSTER_URL}${item.image}" class="card-img-top" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <div id="show-movie-genres">
              ${showMovieGenres(item)}
            </div>
          </div>
        </div>
      </div>
    `
    })
    datapanel.innerHTML = htmlContent
  }

  // show genres of each movie
  function showMovieGenres(movie) {
    const movieGenres = movie.genres
    let htmlContent = ''
    for (let i = 0; i < movieGenres.length; i++) {
      let genreKey = movieGenres[i]
      htmlContent += `
        <a href="#" class="badge badge-secondary" data-genres="${genreList[genreKey]}">${genreList[genreKey]}</a>
      `
    }
    return htmlContent
  }

  // show movies of each movie genre
  function showMoviesOfgenre(genre) {
    let results = []
    results = data.filter(item => {
      return item.genres.some(item => {
        return genreList[item.toString()] === genre
      })
    })
    getTotalPages(results)
    getPageData(1, results)
  }

  // Pagination
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayMovieList(pageData)
  }

  function showToggle(genre) {
    showGenreList.querySelector('.active').classList.toggle('active')
    showGenreList.querySelector(`a[data-genres="${genre}"]`).classList.toggle('active')
  }


  // ============================== execute ==============================
  // consume an API 
  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results)
      getGenreList(genreList)
      showMoviesOfgenre(showGenreList.firstElementChild.dataset.genres)
    })
    .catch(err => {
      console.log(err)
    })

  // add events
  showGenreList.addEventListener('click', event => {
    showMoviesOfgenre(event.target.dataset.genres)
  })

  datapanel.addEventListener('click', event => {
    if (event.target.classList.contains('badge')) {
      showMoviesOfgenre(event.target.dataset.genres)
      showToggle(event.target.dataset.genres)
    }
  })

  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

})()