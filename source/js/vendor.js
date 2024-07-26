// Swiper 8.4.7
import './vendor/swiper';

// Vendor
import './vendor/focus-visible-polyfill';
import './vendor/header/scroll-lock';
import './vendor/header/focus-lock';
import {Burger} from './vendor/header/burger';


// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('load', () => {
    const burger = new Burger();
    burger.init();
  });

});
