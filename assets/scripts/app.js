let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
// header
let header = $(".c-header");
let headerNavList = $(".c-header__navList");
let scrollTop = $(".c-scrollTop");
let showNavSub1 = $("#show-navSub1");
let showNavSub2 = $("#show-navSub2");
let goBack = $("#goBack");

// slider
let slider = $(".p-slider__wrapper");
let sliderControl = $$(".p-slider__controlItem");
let postNews = $(".p-slider__postInfoWrap");
let postNewsItems = $$(".p-slider__postInfoWrap > a");
let nextPost = $("#nextPost");
let prevPost = $("#prevPost");
let currentSlide = 1;
let currentPost = 0;

// reality intro
let realityList = $(".p-reality__list");
let btnLeft = $(".p-reality__btnLeft");
let btnRight = $(".p-reality__btnRight");
let currentIndex = 0;

// end varibales
// header
window.onscroll = function () {
  handleScrollTopHeader();
};

function handleScrollTopHeader() {
  let scrollTopHeader =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
  if (scrollTopHeader > 50) {
    header.classList.add("is-active");
  } else {
    header.classList.remove("is-active");
  }

  if (scrollTopHeader > window.innerHeight - 80) {
    scrollTop.classList.add("is-active");
  } else {
    scrollTop.classList.remove("is-active");
  }
}

goBack.onclick = function () {
  headerNavList.classList.remove("is-navSub1", "is-navSub2");
};

showNavSub1.onclick = function () {
  headerNavList.classList.add("is-navSub1");
};

showNavSub2.onclick = function () {
  headerNavList.classList.add("is-navSub2");
};

// slider
let clearSlider = function () {
  for (let i = 0; i < sliderControl.length; i++) {
    slider.classList.remove(`p-slider__visual${i + 1}`);
  }
};

let clearPostSlider = function () {
  for (let i = 0; i < postNewsItems.length; i++) {
    postNews.classList.remove(`is-next${i}`);
  }
};

let clearSliderControl = function () {
  for (let i = 0; i < sliderControl.length; i++) {
    sliderControl[i].classList.remove("is-active");
  }
};

for (let i = 0; i < sliderControl.length; i++) {
  sliderControl[i].onclick = function () {
    clearSlider();
    clearSliderControl();
    slider.classList.add(`p-slider__visual${i + 1}`);
    sliderControl[i].classList.add("is-active");
  };
}

let renderSlider = function () {
  clearSlider();
  clearSliderControl();
  slider.classList.add(`p-slider__visual${currentSlide}`);
  sliderControl[currentSlide - 1].classList.add("is-active");
};

let nextSlider = function () {
  currentSlide = currentSlide >= sliderControl.length ? 1 : currentSlide + 1;
  renderSlider();
};

let nextPostNews = function () {
  clearPostSlider();
  currentPost = currentPost >= postNewsItems.length ? 1 : currentPost + 1;
  postNews.classList.add(`is-next${currentPost}`);
};

let prevPostNews = function () {
  clearPostSlider();
  currentPost = currentPost <= 0 ? postNewsItems.length - 1 : currentPost - 1;
  postNews.classList.add(`is-next${currentPost}`);
};

slider.classList.add("p-slider__visual1");
prevPost.onclick = prevPostNews;
nextPost.onclick = nextPostNews;

// reality intro
let realityListItems = $$(".p-reality__list > li");
let clearRealityListItems = function () {
  for (let i = 0; i < realityListItems.length; i++) {
    realityList.classList.remove(`is-next${i}`);
  }
};

let prevRealityItem = function () {
  clearRealityListItems();
  currentIndex =
    currentIndex <= 0 ? realityListItems.length - 1 : currentIndex - 1;
  realityList.classList.add(`is-next${currentIndex}`);
};

let nextRealityItem = function () {
  clearRealityListItems();
  currentIndex =
    currentIndex >= realityListItems.length - 1 ? 0 : currentIndex + 1;
  realityList.classList.add(`is-next${currentIndex}`);
};

btnLeft.onclick = prevRealityItem;
btnRight.onclick = nextRealityItem;

let autoSlide = setInterval(() => {
  nextSlider();
  nextPostNews();
  nextRealityItem();
}, 5000);
