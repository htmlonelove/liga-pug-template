import './locomotive-scroll';
import {Burger} from './burger';
import {StickyHeader} from './sticky-header';
import {initLocomotiveScroll} from './init-locomotive-scroll';

window.addEventListener('DOMContentLoaded', () => {
  initLocomotiveScroll();

  window.addEventListener('load', () => {
    const burger = new Burger();
    burger.init();
    const stickyHeader = new StickyHeader();
    stickyHeader.init();
  });
});
