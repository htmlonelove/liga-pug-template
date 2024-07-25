import Swiper from 'swiper';
import { Navigation, A11y, Keyboard } from 'swiper/modules';

export function initPromoSlider() {
  let promoSlider;
  const breakpoint = 767;

  const enableSwiper = () => {
    promoSlider = new Swiper('.promo__slider', {
      modules: [Navigation, A11y, Keyboard],
      direction: 'horizontal',
      navigation: {
        nextEl: '.promo__button-next',
        prevEl: '.promo__button-prev',
      },


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
          slidesPerView: 1,
          spaceBetween: 12,
          centeredSlides: true,
          loop: true,
        },
      },


      allowTouchMove: window.innerWidth <= breakpoint,
      on: {
        slideChange() {
          const activeIndex = this.activeIndex;
          const tabControls = document.querySelectorAll('[data-tabs="control"]');
          tabControls.forEach((control, index) => {
            if (index === activeIndex) {
              control.classList.add('is-active');
            } else {
              control.classList.remove('is-active');
            }
          });
        },
      },
    });
  };

  const disableSwiper = () => {
    if (promoSlider && promoSlider.destroy) {
      promoSlider.destroy(true, true);
      promoSlider = null;
    }
  };

  const handleResize = () => {
    if (window.innerWidth <= breakpoint) {
      if (!promoSlider) {
        enableSwiper();
      }
    } else {
      disableSwiper();
    }
  };

  handleResize();

  window.addEventListener('resize', handleResize);

  return {
    destroy: () => {
      disableSwiper();
      window.removeEventListener('resize', handleResize);
    },
  };
}
