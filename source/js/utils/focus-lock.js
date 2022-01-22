const SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])'
];

export class FocusLock {
  constructor() {
    this._lockedSelector = null;
    this._focusableElements = null;
    this._endElement = null;
    this._selectors = SELECTORS;

    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
  }

  _documentKeydownHandler(evt) {
    const activeElement = document.activeElement;
    if (evt.key === 'Tab') {
      if (!this._focusableElements.length) {
        evt.preventDefault();
        activeElement.blur();
        return;
      }
      if (this._focusableElements.length === 1) {
        evt.preventDefault();
        this._focusableElements[0].focus();
        return;
      }
      if (this._focusableElements.length > 1 && !activeElement.closest(this._lockedSelector)) {
        evt.preventDefault();
        this._focusableElements[0].focus();
        return;
      }
    }
    if (evt.key === 'Tab' && !evt.shiftKey && activeElement === this._focusableElements[this._focusableElements.length - 1]) {
      evt.preventDefault();
      this._focusableElements[0].focus();
    }
    if (evt.key === 'Tab' && evt.shiftKey && activeElement === this._focusableElements[0]) {
      evt.preventDefault();
      this._focusableElements[this._focusableElements.length - 1].focus();
    }
  }

  lock(lockedSelector, startFocus = true) {
    this.unlock();
    this._lockedSelector = lockedSelector;
    const lockedElement = document.querySelector(this._lockedSelector);
    if (!lockedElement) {
      return;
    }
    this._focusableElements = lockedElement.querySelectorAll(this._selectors);
    this._endElement = document.activeElement;
    const startElement = lockedElement.querySelector('[data-focus]') || this._focusableElements[0];
    if (this._endElement) {
      this._endElement.blur();
    }
    if (startElement && startFocus) {
      startElement.focus();
    }
    document.addEventListener('keydown', this._documentKeydownHandler);
  }

  unlock(returnFocus = true) {
    if (this._endElement && returnFocus) {
      this._endElement.focus();
    }
    this._lockedSelector = null;
    this._focusableElements = null;
    this._endElement = null;
    document.removeEventListener('keydown', this._documentKeydownHandler);
  }
}

window.focusLock = new FocusLock();
