import '../scss/main.scss'

// 1. 변수 선언
const moviesEl = document.querySelector('.movies')
const searchEl = document.querySelector('input')
const searchBtnEl = document.querySelector('button.search-btn')
const load_1El = document.querySelector('.loading_1')
const toTopEl = document.querySelector('#to-top');
let resEl = document.querySelector('.res')
let page = 0

// 2. 클릭 이벤트
searchBtnEl.addEventListener('click', async () => {
  page = 1
  const data = await getMovie(searchEl.value, page)
  const movies = data.Search
  const res = data.Response
  console.log(data)
  moviesEl.innerHTML = '' // 초기화 먼저
  resEl.style.display = 'none' // 초기화 먼저
  load_1El.style.display = 'block' // none시킨 로딩이미지 다시 블록으로
  load_1El.src = '/static/images/loading.gif' // 로딩이미지 띄우기
  setTimeout(function() {
    load_1El.style.display = 'none' // 로딩이미지 없애기
    response(res) 
    rederMovies(movies)
  }, 2000)
})

// 3. 영화정보 불러오기(비동기)
async function getMovie(name, page) {
  const {data} = await axios ({
    url: `https://www.omdbapi.com?apikey=7035c60c&s=${name}&page=${page}`
  })
  return data
}


function loading() {
  const loadEl = document.createElement('img')
  loadEl.src = '/static/images/logo.jpg'

}


// 4. 가져온 영화정보 화면에 출력
function rederMovies(movies) {
  movies.forEach(movie => {
    const movieEl = document.createElement('li')
    const titleEl = document.createElement('h2')
    const posterEl = document.createElement('img')
    const yearEl = document.createElement('span')
    titleEl.textContent = movie.Title
    if ('N/A' !== movie.Poster) {
      posterEl.src = movie.Poster
    } else {
      posterEl.src = '/static/images/xbox_img.png'
    }
    yearEl.textContent = movie.Year
    moviesEl.append(movieEl)
    movieEl.append(posterEl)
    movieEl.append(titleEl)
    movieEl.append(yearEl)
  })

  const io = new IntersectionObserver((entries, oi) => {
    entries.forEach(entry => {
      // 관찰 대상이 viewport 안에 들어온 경우 
      if (entry.intersectionRatio > 0) {
        const liEl = document.createElement('li')
        const load_2El = document.createElement('img')
        load_2El.className = 'loading_2'
        load_2El.src = '/static/images/loading.gif'
        moviesEl.append(liEl)
        liEl.append(load_2El)
        setTimeout(function() {
          liEl.style.display = 'none'
          moreMovies()
          oi.unobserve(entry.target)
        }, 1000)
      }  
    })
  })

  // 관찰할 대상을 선언하고, 해당 속성을 관찰시킨다.
  io.observe(moviesEl.lastChild);
}

// 5. 마지막 <li> 발견시 next page 보여주기
async function moreMovies() {
  try {
  page += 1
  const data = await getMovie(searchEl.value, page)
  const movies = data.Search
  movies.forEach(movie => {
    const movieEl = document.createElement('li')
    const titleEl = document.createElement('h2')
    const posterEl = document.createElement('img')
    const yearEl = document.createElement('span')
    titleEl.textContent = movie.Title
    if ('N/A' !== movie.Poster) {
      posterEl.src = movie.Poster
    } else {
      posterEl.src = '/static/images/xbox_img.png'
    }
    yearEl.textContent = movie.Year
    moviesEl.append(movieEl)
    movieEl.append(posterEl, titleEl, yearEl)
  })

  const io = new IntersectionObserver((entries, oi) => {
    entries.forEach(entry => {
      // 관찰 대상이 viewport 안에 들어온 경우 
      if (entry.intersectionRatio > 0) {
        const liEl = document.createElement('li')
        const load_2El = document.createElement('img')
        load_2El.src = '/static/images/loading.gif'
        load_2El.className = 'loading_2'
        moviesEl.append(liEl)
        liEl.append(load_2El)
        setTimeout(function() {
          liEl.style.display = 'none'
          moreMovies()
          oi.unobserve(entry.target)
        }, 1000)
      }
    })
  },)
  // 관찰할 대상을 선언하고, 해당 속성을 관찰시킨다.
  io.observe(moviesEl.lastChild);
  } catch (error) {
    console.error('더 이상 검색되는 영화가 없습니다.')
  }
}


// 6. 검색결과가 없을시
function response(res){
  if (res === 'False') {
    resEl.style.display = 'flex'
  }
}


// 7. 버튼 클릭 시 스크롤 위로 
toTopEl.addEventListener('click', function () {
  gsap.to(window, .7, {
    scrollTo: 0
  });
})















