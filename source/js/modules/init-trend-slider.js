import Swiper from 'swiper';
import {Grid, Navigation, A11y, Keyboard} from 'swiper/modules';

export function initTrendSlider() {
  const trendSlider = new Swiper('.trend__slider', {
    modules: [Grid, Navigation, A11y, Keyboard],
    direction: 'horizontal',

    navigation: {
      nextEl: '.trend__button-next',
      prevEl: '.trend__button-prev',
    },

    grabCursor: true,
    speed: 500,
    observer: true,
    observeParents: true,
    watchOverflow: true,
    loop: true,

    a11y: {
      enabled: true,
      prevSlideMessage: 'Предыдущий слайд',
      nextSlideMessage: 'Следующий слайд',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },

    breakpoints: {
      // when window width is >= 320px
      320: {
        autoHeight: true,
        slidesPerView: 1.19,
        spaceBetween: 20,
        centeredSlides: true,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 'auto',
        spaceBetween: 20,
      },
      // when window width is >= 1020px
      1020: {
        loop: false,
        spaceBetween: 20,
        simulateTouch: false,
        slidesPerView: 3,
        grid: {
          fill: 'row',
          rows: 2,
          rowGap: 47,
        },
      },
    },

    on: {
      init() {
        this.slides[0].classList.add('trend__slide-active');
        addSlideClickListeners(this.el);
        addSlideFocusListeners(this.el);
      },
      slideChange() {
        this.slides.forEach((slide) => {
          slide.classList.remove('trend__slide-active');
        });
        const activeSlide = this.slides[this.activeIndex];
        if (activeSlide) {
          activeSlide.classList.add('trend__slide-active');
        }
      },
    },
  });

  return trendSlider;
}

function addSlideClickListeners(sliderElement) {
  sliderElement.addEventListener('click', function (e) {
    const slideTarget = e.target.closest('.slide-trend');
    if (slideTarget) {
      const href = slideTarget.dataset.href;
      if (href) {
        window.location.href = href;
      }
    }
  });

  sliderElement.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const slideTarget = e.target.closest('.slide-trend');
      if (slideTarget) {
        const href = slideTarget.dataset.href;
        if (href) {
          window.location.href = href;
        }
      }
    }
  });
}

function addSlideFocusListeners(sliderElement) {
  const slides = sliderElement.querySelectorAll('.slide-trend');

  slides.forEach((slide) => {
    slide.addEventListener('focus', () => {
      slide.classList.add('is-focused');
    });

    slide.addEventListener('blur', () => {
      slide.classList.remove('is-focused');
    });
  });
}
