import scrollLock from './../../vendor/scroll-lock';
import {FocusLock} from './../../vendor/focus-lock';

export class Burger {
  constructor() {
    this._header = document.querySelector('[data-header]');
    this._burger = document.querySelector('[data-burger]');
    this._scrollLock = scrollLock;
    this._focusLock = new FocusLock();
    this._isMenuOpen = false;
    this._isFirstClick = true;

    this._onBurgerClick = this._onBurgerClick.bind(this);
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  init() {
    if (!this._burger) {
      return;
    }

    this._burger.addEventListener('click', this._onBurgerClick);
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  _openMenu() {
    this._isMenuOpen = true;
    this._header.classList.add('is-open');
    this._scrollLock.disablePageScroll();
    document.addEventListener('keydown', this._onDocumentKeydown);
    document.addEventListener('click', this._onDocumentClick);
    this._focusLock.lock('[data-header]');
    if (window.ls) {
      window.ls.stop();
    }
  }

  _closeMenu() {
    this._isMenuOpen = false;
    this._header.classList.remove('is-open');
    this._scrollLock.enablePageScroll();
    this._focusLock.unlock('[data-header]');
    document.removeEventListener('keydown', this._onDocumentKeydown);
    document.removeEventListener('click', this._onDocumentClick);
    if (window.ls) {
      window.ls.start();
    }
  }

  _onBurgerClick() {
    if (this._isFirstClick) {
      this._header.classList.remove('is-open');
      this._isFirstClick = false;
      return;
    }

    if (this._isMenuOpen) {
      this._closeMenu();
    } else {
      this._openMenu();
    }
  }

  _onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      this._closeMenu();
    }
  }

  _onDocumentClick(evt) {
    if (evt.target.hasAttribute('data-close-menu')) {
      this._closeMenu();
    }
  }

  _onResize() {
    if (window.innerWidth <= 1023) {
      this._header.classList.add('is-open');
      this._isFirstClick = true;
    } else {
      this._header.classList.remove('is-open');
      this._isFirstClick = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const burger = new Burger();
  burger.init();
});
