export class Accordions {
  constructor() {
    this._windowWidth = window.innerWidth;
    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
    this._setDynamicPosition = this._setDynamicPosition.bind(this);
    this._removeDynamicPosition = this._removeDynamicPosition.bind(this);
    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._activeElement = null;
    this._isDesktop = window.innerWidth >= 1024;
    this._clickedElement = null;
    this._init();
  }

  _init() {
    this.fullUpdate();
    document.addEventListener('click', this._documentClickHandler);
    window.addEventListener('resize', this._windowResizeHandler);
    document.addEventListener('keydown', this._handleKeyDown);
    this.updateDynamicListeners();
  }

  _setDynamicPosition(event) {
    if (!this._isDesktop) {
      return;
    }

    const element = event.currentTarget;
    const content = element.querySelector('[data-accordion="content"]');
    if (!content) {
      return;
    }

    // Сброс предыдущих стилей
    content.style.left = '';
    content.style.right = '';
    content.style.width = '';

    // Получаем размеры и позиции
    const elementRect = element.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Проверяем, выходит ли контент за правый край экрана
    if (contentRect.right > viewportWidth) {
      content.style.left = `-${contentRect.right - viewportWidth + 20}px`; // 20px отступ справа
    }

    // Проверяем, выходит ли контент за левый край экрана
    if (contentRect.left < 0) {
      content.style.left = `-${contentRect.left}px`;
    }

    // Проверяем, если контент слишком широкий
    if (contentRect.width > viewportWidth) {
      content.style.width = `${viewportWidth - 40}px`; // 20px отступ слева и справа
      content.style.left = `-${elementRect.left}px`;
    }
  }

  _removeDynamicPosition(event) {
    if (!this._isDesktop) {
      return;
    }

    const element = event.currentTarget;
    const content = element.querySelector('[data-accordion="content"]');
    if (content) {
      content.style.left = '';
      content.style.right = '';
      content.style.width = '';
    }
  }

  _handleMouseEnter(event) {
    if (!this._isDesktop || this._clickedElement) {
      return;
    }
    const element = event.currentTarget;
    if (this._activeElement && this._activeElement !== element) {
      this.closeAccordion(this._activeElement);
    }
    this.openAccordion(element);
  }

  _handleMouseLeave(event) {
    if (!this._isDesktop || this._clickedElement) {
      return;
    }
    const element = event.currentTarget;
    const relatedTarget = event.relatedTarget;
    if (!element.contains(relatedTarget)) {
      this.closeAccordion(element);
    }
  }

  _handleClickOutside(event) {
    if (this._clickedElement && !this._clickedElement.contains(event.target)) {
      this.closeAccordion(this._clickedElement);
      this._clickedElement = null;
    }
  }

  _documentClickHandler(evt) {
    const target = evt.target;
    if (!target.closest('[data-accordion="button"]')) {
      this._handleClickOutside(evt);
      return;
    }

    evt.preventDefault();
    const parent = target.closest('[data-accordion="parent"]');

    if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
      return;
    }

    const element = target.closest('[data-accordion="element"]');
    if (element.classList.contains('is-active')) {
      this.closeAccordion(element);
      this._clickedElement = null;
    } else {
      if (this._clickedElement) {
        this.closeAccordion(this._clickedElement);
      }
      this.openAccordionImmediate(element);
      this._clickedElement = element;

      if (this._isDesktop) {
        this._setDynamicPosition({ currentTarget: element });
      }
    }
  }

  _handleKeyDown(event) {
    const target = event.target;
    const accordionElement = target.closest('[data-accordion="element"]');

    if (event.key === 'Escape' && this._clickedElement) {
      this.closeAccordion(this._clickedElement);
      this._clickedElement = null;
    } else if (event.key === 'Enter' && accordionElement) {
      event.preventDefault();
      if (accordionElement.classList.contains('is-active')) {
        this.closeAccordion(accordionElement);
      } else {
        this.openAccordion(accordionElement);
        const firstListItem = accordionElement.querySelector('[data-accordion="content"] a, [data-accordion="content"] button');
        if (firstListItem) {
          firstListItem.focus();
        }
      }
    } else if (event.key === 'Tab') {
      if (accordionElement && accordionElement.classList.contains('is-active')) {
        const content = accordionElement.querySelector('[data-accordion="content"]');
        const focusableElements = content.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          accordionElement.querySelector('[data-accordion="button"]').focus();
        }
      }
    }
  }

  _setFocusableElements(element) {
    const content = element.querySelector('[data-accordion="content"]');
    const focusableElements = content.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach((el) => el.setAttribute('tabindex', '0'));
  }

  _windowResizeHandler() {
    if (this._windowWidth === window.innerWidth) {
      return;
    }

    this._windowWidth = window.innerWidth;
    const wasDesktop = this._isDesktop;
    this._isDesktop = window.innerWidth >= 1024;

    this.updateAccordionsHeight();
    this.updateDynamicListeners();

    if (this._isDesktop) {
      document.querySelectorAll('[data-accordion="element"].is-active').forEach((element) => {
        this._setDynamicPosition({ currentTarget: element });
      });
    } else if (wasDesktop) {
      document.querySelectorAll('[data-accordion="element"]').forEach((element) => {
        const content = element.querySelector('[data-accordion="content"]');
        if (content) {
          content.style.left = '';
          content.style.right = '';
          content.style.width = '';
        }
      });
    }
  }

  closeAllAccordion(parent) {
    const elements = parent.querySelectorAll('[data-accordion="element"]');
    elements.forEach((element) => {
      const currentParent = element.closest('[data-accordion="parent"]');
      if (currentParent === parent) {
        this.closeAccordion(element);
      }
    });
  }

  updateAccordionsHeight(element = null) {
    if (element) {
      const content = element.querySelector('[data-accordion="content"]');
      content.style.transition = 'none';
      content.style.maxHeight = `${content.scrollHeight}px`;
      setTimeout(() => {
        content.style.transition = null;
      });
      return;
    }

    const closeElements = document.querySelectorAll('[data-accordion="element"]:not(.is-active)');

    closeElements.forEach((closeElement) => {
      const parent = closeElement.closest('[data-accordion="parent"]');
      const content = closeElement.querySelector('[data-accordion="content"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        content.style.maxHeight = '100%';
        return;
      }
      content.style.maxHeight = null;
    });

    const openElements = document.querySelectorAll('[data-accordion="element"].is-active');
    openElements.forEach((openElement) => {
      const content = openElement.querySelector('[data-accordion="content"]');
      const parent = openElement.closest('[data-accordion="parent"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        content.style.maxHeight = '100%';
        return;
      }
      content.style.transition = 'none';
      content.style.maxHeight = `${content.scrollHeight}px`;
      setTimeout(() => {
        content.style.transition = null;
      });

      this._setDynamicPosition({ currentTarget: openElement });
    });
  }

  fullUpdate(parent = null, transition = false) {
    let openElements;
    if (parent) {
      openElements = parent.querySelectorAll('[data-accordion="element"].is-active');
    } else {
      openElements = document.querySelectorAll('[data-accordion="element"].is-active');
    }
    openElements.forEach((openElement) => {
      const innerParent = openElement.querySelector('[data-accordion="parent"]');
      if (innerParent) {
        return;
      }
      this.openAccordion(openElement, transition);
    });

    this.updateAccordionsHeight();

    openElements.forEach((openElement) => {
      this._setDynamicPosition({ currentTarget: openElement });
    });
  }

  openAccordionImmediate(element) {
    const contentElement = element.querySelector('[data-accordion="content"]');
    element.classList.add('is-active');
    contentElement.style.display = 'block';
    contentElement.style.maxHeight = 'none';
    contentElement.style.opacity = '1';
    contentElement.style.overflow = 'visible';

    if (this._isDesktop) {
      this._setDynamicPosition({ currentTarget: element });
    }

    requestAnimationFrame(() => {
      this.finalizeAccordionOpen(element);
    });
  }

  finalizeAccordionOpen(element) {
    const contentElement = element.querySelector('[data-accordion="content"]');
    const viewportHeight = window.innerHeight;
    const contentRect = contentElement.getBoundingClientRect();
    const bottomSpace = viewportHeight - contentRect.bottom;

    if (bottomSpace < 20) {
      const maxHeight = viewportHeight - contentRect.top - 20;
      contentElement.style.maxHeight = `${maxHeight}px`;
      contentElement.style.overflowY = 'auto';
    }

    if (this._isDesktop) {
      this._setDynamicPosition({ currentTarget: element });
    }
  }

  openAccordion(element, transition = true) {
    if (this._isDesktop) {
      const otherElements = document.querySelectorAll('[data-accordion="element"].is-active');
      otherElements.forEach((otherElement) => {
        if (otherElement !== element) {
          this.closeAccordion(otherElement);
        }
      });
    }

    const parentElement = element.closest('[data-accordion="parent"]');
    const contentElement = element.querySelector('[data-accordion="content"]');

    if (parentElement.hasAttribute('data-single')) {
      this.closeAllAccordion(parentElement);
    }

    this.openAccordionImmediate(element);
    this._setFocusableElements(element);

    if (!transition) {
      contentElement.style.transition = 'none';
      requestAnimationFrame(() => {
        contentElement.style.transition = null;
      });
    }

    if (parentElement.closest('[data-accordion="element"]')) {
      this.openAccordion(parentElement.closest('[data-accordion="element"]'), transition);
    }
  }

  closeAccordion(element, transition = true) {
    const contentElement = element.querySelector('[data-accordion="content"]');
    if (!contentElement) {
      return;
    }
    element.classList.remove('is-active');

    const currentHeight = contentElement.scrollHeight;
    contentElement.style.maxHeight = `${currentHeight}px`;
    contentElement.style.overflowY = 'hidden';

    requestAnimationFrame(() => {
      contentElement.style.maxHeight = '0';

      if (!transition) {
        contentElement.style.transition = 'none';
        setTimeout(() => {
          contentElement.style.transition = null;
        });
      }

      contentElement.addEventListener('transitionend', () => {
        this._removeDynamicPosition({ currentTarget: element });
        contentElement.style.display = ''; // Reset display style
      }, { once: true });
    });
  }

  updateDynamicListeners() {
    const accordionElements = document.querySelectorAll('[data-accordion="element"]');
    accordionElements.forEach((element) => {
      element.removeEventListener('mouseenter', this._handleMouseEnter);
      element.removeEventListener('mouseleave', this._handleMouseLeave);
      element.removeEventListener('mouseenter', this._setDynamicPosition);
      element.removeEventListener('mouseleave', this._removeDynamicPosition);

      if (this._isDesktop) {
        element.addEventListener('mouseenter', this._handleMouseEnter);
        element.addEventListener('mouseleave', this._handleMouseLeave);
        element.addEventListener('mouseenter', this._setDynamicPosition);
        element.addEventListener('mouseleave', this._removeDynamicPosition);
      }
    });
  }
}
