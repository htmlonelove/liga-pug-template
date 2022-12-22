const BASE_COUNTRY_CODE = '+7';
const BASE_MATRIX = ' (___) ___ __ __';
const phoneLength = BASE_COUNTRY_CODE.length + BASE_MATRIX.length;

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
    if (!parent.hasAttribute('data-required')) {
      parent.classList.remove('is-valid');
      parent.classList.remove('is-invalid');
      const parentMessage = parent.querySelector('.input-message');
      if (parentMessage) {
        parentMessage.remove();
      }
    }
    parent.classList.remove('not-empty');
    target.removeEventListener('input', onInputPhoneInput);
    target.removeEventListener('blur', onBlurPhoneInput);
  }
};

export const initPhoneInput = (parent) => {
  const input = parent.querySelector('input');
  parent.dataset.phoneLength = phoneLength;
  input.addEventListener('focus', onFocusPhoneInput);
};
