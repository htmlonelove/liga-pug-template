import {initAccordions} from './modules/accordions/init-accordion';
import {initTrendSlider} from './modules/init-trend-slider';
import {applySlideOpacity} from './modules/apply-slider-opacity';
import {initPromoSlider} from './modules/init-promo-slider';
import {initTabs} from './modules/tabs/init-tabs';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------


  // Modules
  // ---------------------------------

  initAccordions();
  initTrendSlider();
  applySlideOpacity();
  initPromoSlider();

  // Load
  // -
  window.addEventListener('load', () => {
    initTabs();
  });

});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используейтся matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
