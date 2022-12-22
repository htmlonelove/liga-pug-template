import {getLimitationsRegEx, getMatrixLimitationsRegEx, getMailRegEx} from './regular-expression';
import {matrixReplace} from './matrix';
import {Message} from './render-message';

export class Validator {
  constructor() {
    this._getLimitationsRegEx = getLimitationsRegEx;
    this._getMatrixLimitationsRegEx = getMatrixLimitationsRegEx;
    this._getMailRegEx = getMailRegEx;
    this._matrixReplace = matrixReplace;
    this._message = new Message();
  }

  _renderMessage(trigger, parent, input) {
    if (!parent.hasAttribute('data-required') && !input.value) {
      return;
    }
    if (!trigger) {
      parent.classList.add('is-invalid');
      if (parent.hasAttribute('data-message-base') && !input.value) {
        this._message.renderMessage(parent, parent.dataset.messageBase, 'invalid');
      } else if (parent.hasAttribute('data-message-extra') && input.value) {
        this._message.renderMessage(parent, parent.dataset.messageExtra, 'invalid');
      } else if (!parent.hasAttribute('data-message-extra') && parent.hasAttribute('data-message-base') && input.value) {
        this._message.renderMessage(parent, parent.dataset.messageBase, 'invalid');
      } else {
        this._message.removeMessage(parent);
      }
    } else {
      if (parent.hasAttribute('data-message-success')) {
        this._message.renderMessage(parent, parent.dataset.messageSuccess, 'valid');
      } else {
        this._message.removeMessage(parent);
      }
    }
  }

  _setItemValidState(parent, input) {
    if (!parent.hasAttribute('data-required') && !input.value) {
      return;
    }
    parent.classList.add('is-valid');
    parent.classList.remove('is-invalid');
    input.setAttribute('aria-invalid', 'false');
    this._message.removeMessage(parent);
  }

  _setItemInvalidState(parent, input) {
    if (!parent.hasAttribute('data-required') && !input.value) {
      return;
    }
    parent.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
  }

  _simpleLimitation(item, limitation) {
    item.value = item.value.replace(this._getLimitationsRegEx(limitation), '');
  }

  _matrixLimitation(item, matrix, limitation) {
    this._matrixReplace(item, matrix, limitation);
  }

  _validateTextInput(parent, input) {
    let flag = true;
    if (input.value.length >= (+input.getAttribute('minlength') || 2)) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      flag = false;
    }
    return flag;
  }

  _validateMatrixInput(parent, input) {
    let flag = true;
    if (input.value.length === input.closest('[data-matrix]').dataset.matrix.length) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      flag = false;
    }
    return flag;
  }

  _validateEmailInput(parent, input) {
    let flag = true;
    if (new RegExp(this._getMailRegEx(), '').test(input.value)) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      flag = false;
    }
    return flag;
  }

  _validatePhoneInput(parent, input) {
    let flag = true;
    if (input.value.length >= +parent.dataset.phoneLength) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      flag = false;
    }
    return flag;
  }

  _validateCheckbox(parent, input) {
    let flag = true;
    if (input.checked) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      flag = false;
    }
    return flag;
  }

  _findSelectedOption(options) {
    let flag = false;
    options.forEach((option) => {
      if (option.value && option.selected) {
        flag = true;
      }
    });
    return flag;
  }

  _validateSelect(parent, input) {
    const options = input.querySelectorAll('option');
    const customSelectText = parent.querySelector('.custom-select__text');
    input.setAttribute('aria-invalid', 'false');
    let flag = true;
    if (this._findSelectedOption(options)) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      parent.classList.remove('not-empty');
      customSelectText.innerHTML = '';
      flag = false;
    }
    return flag;
  }

  _returnCheckedElements(inputs) {
    let flag = false;
    inputs.forEach((input) => {
      if (input.checked) {
        flag = true;
      }
    });
    return flag;
  }

  _removeGroupAria(inputs) {
    inputs.forEach((input) => {
      if (!input.checked) {
        input.removeAttribute('aria-required');
        input.removeAttribute('aria-invalid');
      } else {
        input.setAttribute('aria-required', true);
        input.setAttribute('aria-invalid', false);
      }
    });
  }

  _setGroupAria(inputs) {
    inputs.forEach((input) => {
      input.setAttribute('aria-required', true);
      input.setAttribute('aria-invalid', true);
    });
  }

  _validateToggleGroup(parent) {
    const formElements = parent.querySelectorAll('input');
    let flag = true;
    if (this._returnCheckedElements(formElements)) {
      this._removeGroupAria(formElements);
      parent.classList.remove('is-invalid');
      parent.classList.add('is-valid');
      this._message.removeMessage(parent);
    } else {
      this._setGroupAria(formElements);
      parent.classList.remove('is-valid');
      flag = false;
    }
    return flag;
  }

  _customExample(parent, input) {
    let flag = true;
    if (!input.value.length) {
      parent.dataset.messageBase = 'Поле обязательно к заполнению';
      this._setItemInvalidState(parent, input);
      flag = false;
    } else if (input.value.length < input.minLength) {
      parent.dataset.messageBase = `Осталось ввести ещё ${input.minLength - input.value.length} символов`;
      this._setItemInvalidState(parent, input);
      flag = false;
    } else if (input.value.length > input.minLength) {
      parent.dataset.messageBase = `Вы ввели ${input.value.length - input.minLength} лишних символов`;
      this._setItemInvalidState(parent, input);
      flag = false;
    } else {
      parent.dataset.messageSuccess = 'Поле заполнено корректно';
      this._setItemValidState(parent, input);
      flag = true;
    }
    return flag;
  }

  _validateFile(parent, input) {
    let flag = true;
    const sizeTest = parent.dataset.maxSize && input.files[0] ? input.files[0].size < +parent.dataset.maxSize : true;
    if (input.value && sizeTest) {
      this._setItemValidState(parent, input);
    } else {
      this._setItemInvalidState(parent, input);
      flag = false;
    }
    return flag;
  }

  _validateInput(type, parent, input) {
    switch (type) {
      case 'text':
        return this._validateTextInput(parent, input);
      case 'matrix':
        return this._validateMatrixInput(parent, input);
      case 'email':
        return this._validateEmailInput(parent, input);
      case 'phone':
        return this._validatePhoneInput(parent, input);
      case 'checkbox':
        return this._validateCheckbox(parent, input);
      case 'select':
        return this._validateSelect(parent, input);
      case 'toggle-group':
        return this._validateToggleGroup(parent, input);
      case 'file':
        return this._validateFile(parent, input);
      case 'custom-example':
        return this._customExample(parent, input);
      default:
        return false;
    }
  }

  validateFormElement(formElement, fullValidate = false) {
    const parent = formElement.closest('[data-validate-type]');
    if (!parent) {
      return;
    }

    if (!parent.hasAttribute('data-required')) {
      const removeElement = parent.querySelector('input') || parent.querySelector('select') || parent.querySelector('textarea');

      if (!removeElement.value) {
        parent.classList.remove('is-valid');
        parent.classList.remove('is-invalid');
      }
    }

    const onInputValidate = parent.hasAttribute('data-on-input-validate');

    if (parent.hasAttribute('data-limitation')) {
      this._simpleLimitation(formElement, parent.dataset.limitation);
    }

    if (parent.dataset.validateType === 'matrix') {
      this._matrixLimitation(formElement, parent.dataset.matrix, this._getMatrixLimitationsRegEx(parent.dataset.matrixLimitation));
    }

    const isValid = this._validateInput(parent.dataset.validateType, parent, formElement);

    if (onInputValidate || fullValidate) {
      this._renderMessage(isValid, parent, formElement);
    }
  }

  _fullValidate(items) {
    let result = true;
    items.forEach((item) => {
      const formElement = item.querySelector('input') || item.querySelector('select') || item.querySelector('textarea');
      this.validateFormElement(formElement, true);
      if (item.classList.contains('is-invalid')) {
        result = false;
      }
    });
    return result;
  }

  validateForm(form) {
    const validateItems = form.querySelectorAll('[data-validate-type]');
    const result = this._fullValidate(validateItems);
    return result;
  }
}
