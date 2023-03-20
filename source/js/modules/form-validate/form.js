import {Validator} from './validator';
import {callbacks} from './callback';
import {initPhoneInput} from './init-phone-input';

export class Form {
  constructor() {
    this._validator = new Validator();
    this._initPhoneInput = initPhoneInput;
    this._callbacks = callbacks;
    this._validState = false;
  }

  _resetSelect(select) {
    const nativeSelect = select.querySelector('select');
    const activeIndex = nativeSelect.options.selectedIndex;
    const selectedOption = nativeSelect.options[activeIndex];
    const buttonText = select.querySelector('.custom-select__text');
    const selectItems = select.querySelectorAll('.custom-select__item');
    buttonText.textContent = selectedOption.textContent;
    selectItems.forEach((item, index) => {
      if (index === activeIndex - 1) {
        item.setAttribute('aria-selected', 'true');
        return;
      }
      item.setAttribute('aria-selected', 'false');
    });
    if (!nativeSelect.value) {
      select.classList.remove('not-empty');
      select.classList.remove('is-valid');
    }
  }

  _resetSelects(form) {
    const selects = form.querySelectorAll('[data-select]');
    selects.forEach((select) => {
      this._resetSelect(select);
    });
  }

  reset(form) {
    this._validator._reset();
    const parent = form.closest('[data-form-validate]');
    form.reset();
    form.querySelectorAll('.is-invalid').forEach((item) => item.classList.remove('is-invalid'));
    form.querySelectorAll('.is-valid').forEach((item) => item.classList.remove('is-valid'));
    form.querySelectorAll('.input-message').forEach((item) => item.remove());
    parent.querySelectorAll('.input-message').forEach((item) => item.remove());
    setTimeout(() => {
      this._resetSelects(form);
    });
  }

  initPhoneInput(parent) {
    this._initPhoneInput(parent);
  }

  validateForm(event) {
    return this._validator.validateForm(event);
  }

  validateFormElement(item) {
    return this._validator.validateFormElement(item);
  }

  createStates(item) {
    return this._validator._createStates(item);
  }

  _onFormSubmit(event, callback = null) {
    this._validState = this.validateForm(event);
    if (this._validState && callback) {
      this._callbacks[callback].successCallback(event);
      if (this._callbacks[callback].reset) {
        setTimeout(() => {
          this.reset(event.target);
        }, this._callbacks[callback].resetTimeout ? this._callbacks[callback].resetTimeout : 500);
      }
      return;
    }
    if (!this._validState && callback) {
      this._callbacks[callback].errorCallback(event);
      return;
    }
  }

  _onFormInput(item) {
    this.validateFormElement(item);
    this.createStates(item);
  }

  _initValidate(parent) {
    const form = parent.querySelector('form');
    if (!form) {
      return;
    }

    const phoneParents = form.querySelectorAll('[data-validate-type="phone"]');
    phoneParents.forEach((item) => this._initPhoneInput(item));

    const callback = parent.dataset.callback;
    form.noValidate = true;

    form.addEventListener('submit', (event) => {
      this._onFormSubmit(event, callback);
    });

    form.addEventListener('input', (event) => {
      this._onFormInput(event.target);
    });

    form.addEventListener('reset', (event) => {
      this.reset(event.target);
    });
  }

  init() {
    this._validateParent = document.querySelectorAll('[data-form-validate]');
    if (!this._validateParent.length) {
      return;
    }
    this._validateParent.forEach((parent) => this._initValidate(parent));
  }
}
