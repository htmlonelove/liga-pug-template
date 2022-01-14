// Константы и переменные

const BASE_COUNTRY_CODE = '+7';
const BASE_MATRIX = '(___) ___ __ __';
const phoneLength = BASE_COUNTRY_CODE.length + BASE_MATRIX.length;

// Ограничения ввода для обычных полей

const returnLimitationsRegEx = (dataLimitations) => {
  switch (dataLimitations) {
    case 'digit':
      return /[^\d]/g;
    case 'name':
      return /[^a-zA-Zа-яёА-ЯЁ\-\s]/g;
    case 'letters':
      return /[^a-zA-Zа-яёА-ЯЁ\s]/g;
    case 'letters-and-digit':
      return /[^a-zA-Zа-яёА-ЯЁ\s\d]/g;
    case 'cyrillic':
      return /[^а-яёА-ЯЁ\s]/g;
    case 'latin':
      return /[^a-zA-Z\s]/g;
    default:
      return false;
  }
};

const simpleLimitations = (formElement, dataLimitations) => {
  const RegEx = returnLimitationsRegEx(dataLimitations);
  if (RegEx) {
    formElement.addEventListener('input', () => {
      formElement.value = formElement.value.replace(RegEx, '');
    });
    return;
  }
  // eslint-disable-next-line no-console
  console.error(`Переданный формат ограничения: ${dataLimitations}, не поддерживается. Проверьте корректность введённых значений в соответствии со спецификацией.`);
};

// Ограничения ввода для обычных полей с матрицей

const returnMatrixLimitationsRegEx = (dataMatrixLimitations) => {
  switch (dataMatrixLimitations) {
    case 'digit':
      return /[^\d]/g;
    case 'name':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z\-]]/g;
    case 'letters':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z]/g;
    case 'letters-and-digit':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z\d]/g;
    case 'cyrillic':
      return /[^\а-яё\А-ЯЁ]/g;
    case 'latin':
      return /[^\a-z\A-Z]/g;
    default:
      return false;
  }
};

const initMatrixReplace = (target, matrix, RegEx) => {
  const def = matrix.replace(RegEx, '');
  let val = target.value.replace(RegEx, '');
  let i = 0;

  if (def.length >= val.length) {
    val = def;
  }

  target.value = matrix.replace(/./g, (a) => {
    if (/[_\^]/.test(a) && i < val.length) {
      return val.charAt(i++);
    } else if (i >= val.length) {
      return '';
    } else {
      return a;
    }
  });
};

const simpleMatrix = (formElement, dataMatrix, dataMatrixLimitations) => {
  if (dataMatrixLimitations === null) {
    // eslint-disable-next-line no-console
    console.error('При валидации по матрице обязательно указывать формат ограничений: data-matrix-limitations=""');
    return;
  }
  const RegEx = returnMatrixLimitationsRegEx(dataMatrixLimitations);
  if (RegEx) {

    formElement.addEventListener('input', () => {
      initMatrixReplace(formElement, dataMatrix, RegEx);
    });
  } else {
    // eslint-disable-next-line no-console
    console.error(`Переданный формат ограничения: ${dataMatrixLimitations}, не поддерживается. Проверьте корректность введённых значений в соответствии со спецификацией.`);
  }
};

// Маска для телефона

const onInputPhoneInput = ({target}) => {
  const matrix = `${BASE_COUNTRY_CODE}${BASE_MATRIX}`;
  const def = matrix.replace(/\D/g, '');
  let i = 0;
  let val = target.value.replace(/\D/g, '');
  if (def.length >= val.length) {
    val = def;
  }
  target.value = matrix.replace(/./g, (a) => {
    if (/[_\d]/.test(a) && i < val.length) {
      return val.charAt(i++);
    } else if (i >= val.length) {
      return '';
    } else {
      return a;
    }
  });
};

const prettifyPhoneInput = (input) => {
  if (!input.value.startsWith(BASE_COUNTRY_CODE)) {
    if (input.value.startsWith('8')) {
      input.value = input.value.replace('8', BASE_COUNTRY_CODE);
    } else {
      input.value = `${BASE_COUNTRY_CODE}${input.value}`;
    }
  }
  // onInputPhoneInput({input});
  const matrix = `${BASE_COUNTRY_CODE}${BASE_MATRIX}`;
  const def = matrix.replace(/\D/g, '');
  let i = 0;
  let val = input.value.replace(/\D/g, '');
  if (def.length >= val.length) {
    val = def;
  }

  input.value = matrix.replace(/./g, (a) => {
    if (/[_\d]/.test(a) && i < val.length) {
      return val.charAt(i++);
    } else if (i >= val.length) {
      return '';
    } else {
      return a;
    }
  });
};

const onFocusPhoneInput = ({target}) => {
  if (!target.value) {
    target.value = BASE_COUNTRY_CODE;
  }

  target.addEventListener('input', onInputPhoneInput);
  target.addEventListener('blur', onBlurPhoneInput);
  target.addEventListener('keydown', onKeydownPhoneInput);
};

const onKeydownPhoneInput = (e) => {
  if (e.target.selectionStart === 1 && e.keyCode === 8 || e.keyCode === 46) {
    e.preventDefault();
  }
  if (e.target.selectionStart <= phoneLength && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39) {
    e.target.setSelectionRange(phoneLength, phoneLength);
  }
};

const onBlurPhoneInput = ({target}) => {
  if (target.value === BASE_COUNTRY_CODE) {
    const parent = target.closest('[data-validate-type="phone"]');
    target.value = '';
    parent.classList.remove('not-empty');
    target.removeEventListener('input', onInputPhoneInput);
    target.removeEventListener('blur', onBlurPhoneInput);
  }
};

// Показ ошибок полей форм

const hideError = (el) => {
  if (el.classList.contains('toggle-group')) {
    validateToggleGroup(el);
    el.setAttribute('aria-invalid', 'true');
    el.classList.remove('is-invalid');
    el.classList.add('is-valid');
  } else {
    const parent = el.closest('[data-validate-type]');
    el.setAttribute('aria-invalid', 'false');
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
  }
};

const showError = (el) => {
  if (el.classList.contains('toggle-group')) {
    validateToggleGroup(el);
    el.setAttribute('aria-invalid', 'false');
    el.classList.add('is-invalid');
    el.classList.remove('is-valid');
  } else {
    const parent = el.closest('[data-validate-type]');
    el.setAttribute('aria-invalid', 'true');
    parent.classList.add('is-invalid');
    parent.classList.remove('is-valid');
  }
};

const showInputsError = (inputs) => {
  let flag = true;
  let result = true;
  inputs.forEach((input) => {
    const type = input.closest('[data-validate-type]').dataset.validateType;
    if (type === 'toggle-group') {
      return;
    }
    flag = validateInputs(type, input);
    if (!flag) {
      result = flag;
      showError(input);
    } else {
      hideError(input);
    }
  });
  return result;
};

const showGroupInputsError = (parents) => {
  let flag = true;
  let result = true;
  if (!parents.length) {
    return result;
  }
  parents.forEach((parent) => {
    flag = validateToggleGroup(parent);
    if (!flag) {
      result = flag;
      showError(parent);
    } else {
      hideError(parent);
    }
  });
  return result;
};

const showErrors = (inputs, parents) => {
  let result = true;
  const inputsResult = showInputsError(inputs);
  const groupResult = showGroupInputsError(parents);

  if (!inputsResult || !groupResult) {
    result = false;
  }

  return result;
};

// Валидация полей форм

const validateTextInput = (input) => {
  const parent = input.closest('[data-validate-type]');
  let flag = true;
  let minLength = +input.getAttribute('minlength');
  if (!minLength) {
    minLength = 1;
  }
  if (input.value.length >= minLength) {
    parent.classList.add('is-valid');
    parent.classList.remove('is-invalid');
    input.setAttribute('aria-invalid', 'false');
  } else {
    parent.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    flag = false;
  }
  return flag;
};

const validatePhoneInput = (input) => {
  const parent = input.closest('[data-validate-type]');
  let flag = true;
  if (input.value.length >= phoneLength) {
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
  } else {
    parent.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    flag = false;
  }
  return flag;
};

const validateEmailInput = (input) => {
  const parent = input.closest('[data-validate-type]');
  let flag = true;
  const emailString = /[a-zA-Zа-яёА-ЯЁ0-9]{1}([a-zA-Zа-яёА-ЯЁ0-9\-_\.]{1,})?@[a-zA-Zа-яёА-ЯЁ0-9\-]{1}([a-zA-Zа-яёА-ЯЁ0-9.\-]{1,})?[a-zA-Zа-яёА-ЯЁ0-9\-]{1}\.[a-zA-Zа-яёА-ЯЁ]{2,6}/;
  const regEmail = new RegExp(emailString, '');
  if (regEmail.test(input.value)) {
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
  } else {
    parent.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    flag = false;
  }
  return flag;
};

const validateMatrixInput = (input) => {
  const parent = input.closest('[data-validate-type]');
  let flag = true;
  const matrix = input.closest('[data-matrix]').dataset.matrix;
  if (input.value.length === matrix.length) {
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
  } else {
    parent.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    flag = false;
  }
  return flag;
};

const findSelectedOption = (options) => {
  let flag = false;
  options.forEach((option) => {
    if (option.value && option.selected) {
      flag = true;
    }
  });
  return flag;
};

const validateSelect = (input) => {
  const parent = input.closest('[data-validate-type]');
  const options = input.querySelectorAll('option');
  const customSelectText = parent.querySelector('.custom-select__text');
  input.setAttribute('aria-invalid', 'false');
  let flag = true;
  if (findSelectedOption(options)) {
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
  } else {
    parent.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    customSelectText.innerHTML = '';
    parent.classList.remove('not-empty');
    flag = false;
  }
  return flag;
};

const validateCheckbox = (input) => {
  const parent = input.closest('[data-validate-type]');
  let flag = true;
  if (input.checked) {
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
  } else {
    parent.classList.remove('is-valid');
    flag = false;
  }
  return flag;
};

const validateInputs = (type, input) => {
  switch (type) {
    case 'text':
      return validateTextInput(input);
    case 'phone':
      return validatePhoneInput(input);
    case 'email':
      return validateEmailInput(input);
    case 'matrix':
      return validateMatrixInput(input);
    case 'select':
      return validateSelect(input);
    case 'checkbox':
      return validateCheckbox(input);
    default:
      return false;
  }
};

const returnCheckedElements = (inputs) => {
  let flag = false;
  inputs.forEach((input) => {
    if (input.checked) {
      flag = true;
    }
  });
  return flag;
};

const removeGroupAria = (inputs) => {
  inputs.forEach((input) => {
    if (!input.checked) {
      input.removeAttribute('aria-required');
      input.removeAttribute('aria-invalid');
    } else {
      input.setAttribute('aria-required', true);
      input.setAttribute('aria-invalid', false);
    }
  });
};

const setGroupAria = (inputs) => {
  inputs.forEach((input) => {
    input.setAttribute('aria-required', true);
    input.setAttribute('aria-invalid', true);
  });
};

const validateToggleGroup = (parent) => {
  const formElements = parent.querySelectorAll('input');
  let flag = true;
  if (returnCheckedElements(formElements)) {
    removeGroupAria(formElements);
    parent.classList.remove('is-invalid');
    parent.classList.add('is-valid');
  } else {
    setGroupAria(formElements);
    parent.classList.remove('is-valid');
    flag = false;
  }
  return flag;
};

const checkInputValidity = (type, input) => {
  validateInputs(type, input);
};

// Установка всех действий в полях форм

const formElementLimitationsAction = (formValidateElement) => {
  const dataLimitations = formValidateElement.dataset.limitations ? formValidateElement.dataset.limitations : null;
  let formElement = formValidateElement.querySelector('input');
  if (!formElement) {
    formElement = formValidateElement.querySelector('textarea');
  }
  if (!formElement) {
    // eslint-disable-next-line no-console
    console.error('В валидируемом блоке отсутствует поле формы');
    return;
  }
  if (dataLimitations) {
    simpleLimitations(formElement, dataLimitations);
  }
};

const formElementMatrixAction = (formValidateElement) => {
  const dataMatrix = formValidateElement.dataset.matrix ? formValidateElement.dataset.matrix : null;
  const dataMatrixLimitations = formValidateElement.dataset.matrixLimitations ? formValidateElement.dataset.matrixLimitations : null;
  let formElement = formValidateElement.querySelector('input');
  if (!formElement) {
    formElement = formValidateElement.querySelector('textarea');
  }
  if (!formElement) {
    // eslint-disable-next-line no-console
    console.error('В валидируемом блоке отсутствует поле формы');
    return;
  }
  if (dataMatrix) {
    simpleMatrix(formElement, dataMatrix, dataMatrixLimitations);
  }
};

const formElementValidateAction = (formValidateElement) => {
  const dataValidateType = formValidateElement.dataset.validateType;
  const dataLimitations = formValidateElement.dataset.limitations ? formValidateElement.dataset.limitations : null;
  const dataMatrix = formValidateElement.dataset.matrix ? formValidateElement.dataset.matrix : null;
  const dataMatrixLimitations = formValidateElement.dataset.matrixLimitations ? formValidateElement.dataset.matrixLimitations : null;
  if (dataValidateType !== 'toggle-group') {
    let formElement = formValidateElement.querySelector('input');
    if (!formElement) {
      formElement = formValidateElement.querySelector('textarea');
    }
    if (!formElement) {
      formElement = formValidateElement.querySelector('select');
    }
    if (!formElement) {
      // eslint-disable-next-line no-console
      console.error('В валидируемом блоке отсутствует поле формы');
      return;
    }

    formElement.setAttribute('aria-required', true);
    formElement.setAttribute('aria-invalid', true);

    if (dataLimitations) {
      simpleLimitations(formElement, dataLimitations);
    }

    if (dataMatrix) {
      simpleMatrix(formElement, dataMatrix, dataMatrixLimitations);
    }

    if (dataValidateType === 'phone') {
      if (formElement.value) {
        prettifyPhoneInput(formElement);
      }
      formElement.addEventListener('focus', onFocusPhoneInput);
    }

    formElement.addEventListener('input', () => {
      checkInputValidity(dataValidateType, formElement);
    });

    checkInputValidity(dataValidateType, formElement);
  } else {
    const formElements = formValidateElement.querySelectorAll('input');
    if (formElements.length) {
      formElements.forEach((el) => {
        el.setAttribute('aria-required', true);
        el.setAttribute('aria-invalid', true);
        el.addEventListener('input', () => {
          validateToggleGroup(formValidateElement);
        });
      });
      validateToggleGroup(formValidateElement);
    } else {
      // eslint-disable-next-line no-console
      console.error('В валидируемом блоке отсутствуют поля формы');
      return;
    }
  }
};

// Обработка события submit на форме

const onFormSubmit = (e, callback) => {
  const formElements = e.target.querySelectorAll('[aria-required="true"]');
  const groupsFormElement = e.target.querySelectorAll('[data-validate-type="toggle-group"]');
  if (showErrors(formElements, groupsFormElement) && callback && callback.validationSuccessCallback) {
    callback.validationSuccessCallback(e);
  } else if (callback && callback.validationErrorCallback) {
    callback.validationErrorCallback(e);
  } else {
    e.preventDefault();
  }
};

// Очистка полей формы

const clearForm = (form) => {
  form.reset();
  const formValidateElements = form.querySelectorAll('[data-validate-type]');
  const notEmptyInputs = form.querySelectorAll('.not-empty');
  const invalidInputs = form.querySelectorAll('.is-invalid');
  notEmptyInputs.forEach((notEmptyInput) => {
    notEmptyInput.classList.remove('not-empty');
  });
  invalidInputs.forEach((invalidInput) => {
    invalidInput.classList.remove('is-invalid');
  });
  formValidateElements.forEach((formValidateElement) => {
    const dataValidateType = formValidateElement.dataset.validateType;
    if (dataValidateType !== 'toggle-group') {
      let formElement = formValidateElement.querySelector('input');
      if (!formElement) {
        formElement = formValidateElement.querySelector('textarea');
      }
      if (!formElement) {
        formElement = formValidateElement.querySelector('select');
      }
      if (!formElement) {
        // eslint-disable-next-line no-console
        console.error('В валидируемом блоке отсутствует поле формы');
        return;
      }
      formElement.value = '';
      checkInputValidity(dataValidateType, formElement);
    } else {
      validateToggleGroup(formValidateElement);
    }
  });
};

window.clearForm = clearForm;

// Класс FormsValidate

export default class FormsValidate {
  constructor(wrappers, callback = {}) {
    this.wrappers = wrappers;
    this.callback = callback;
  }

  init(formWrappers) {
    if (!formWrappers) {
      formWrappers = this.wrappers;
    }

    const typeOfNode = Object.prototype.toString.call(formWrappers);

    if (
      typeOfNode === '[object HTMLCollection]' ||
      typeOfNode === '[object NodeList]' ||
      typeOfNode === '[object Array]'
    ) {
      formWrappers.forEach((wrapper) => {
        if (wrapper.classList.contains('is-initialized')) {
          // eslint-disable-next-line no-console
          console.error('На данной форме валидация уже инициализированна');
        } else {
          this.initItem(wrapper);
        }
      });
    } else if (typeOfNode === '[object HTMLDivElement]' || typeOfNode === '[object HTMLElement]') {
      if (!formWrappers.classList.contains('is-initialized')) {
        this.initItem(formWrappers);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Переданный обьект не соответствует формату');
      return;
    }
  }

  initItem(element) {
    element.classList.add('is-initialized');
    const form = element.querySelector('form');
    const resetButtons = form.querySelectorAll('button[type="reset"], [data-reset]');
    form.noValidate = true;
    form.addEventListener('submit', (e) => {
      onFormSubmit(e, this.callback);
    });
    if (resetButtons.length) {
      resetButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          clearForm(form);
        });
      });
    }
    const formValidateElements = form.querySelectorAll('[data-validate-type]');
    const formLimitationsElements = form.querySelectorAll('[data-limitations]:not([data-validate-type])');
    const formMatrixElements = form.querySelectorAll('[data-matrix]:not([data-validate-type])');

    if (formValidateElements.length) {
      formValidateElements.forEach((el) => {
        formElementValidateAction(el);
      });
    }
    if (formLimitationsElements.length) {
      formLimitationsElements.forEach((el) => {
        formElementLimitationsAction(el);
      });
    }
    if (formMatrixElements.length) {
      formMatrixElements.forEach((el) => {
        formElementMatrixAction(el);
      });
    }
  }
}

window.FormsValidate = FormsValidate;
