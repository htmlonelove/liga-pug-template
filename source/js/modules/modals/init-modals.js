import {setupModal} from './modal';

// настраиваем модалки тут, все колбеки импортим, а не создаем из этого модуля простыню
const initModal = (modalId, modal, btn) => {
  switch (modalId) {
    case 'example':
      setupModal(modal, false, btn, false, true, true);
      break;
    default:
      setupModal(modal, false, btn, false, false, false);
      break;
  }
};

// аргументы setupModal(modal, closeCallback, modalBtns, openCallback, noPrevDefault, preventScrollLock)
// возможна инициализация только с первыми аргументом,
// если вам нужно открывать модалку в другом месте под какими-нибудь условиями
const initModals = () => {
  const modals = document.querySelectorAll('.modal:not(.is-initialized)');
  const modalBtns = document.querySelectorAll('[data-modal]');

  // фикс для редких случаев, когда модалка появляется при загрузке страницы
  if (modals.length) {
    modals.forEach((el) => {
      setTimeout(() => {
        el.classList.remove('modal--preload');
        el.classList.add('is-initialized');
      }, 100);
    });
  }

  if (modalBtns.length) {
    modalBtns.forEach((btn) => {
      const modalId = btn.dataset.modal;
      const modal = document.querySelector(`.modal--${modalId}`);
      if (modal) {
        initModal(modalId, modal, btn);
      }
    });
  }
};

window.initModals = initModals;

export {initModals};
