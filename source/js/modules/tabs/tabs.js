export class Tabs {
  constructor() {
    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
    this._init();
    window.addEventListener('resize', this._windowResizeHandler);
  }

  _init() {
    this._initAllTabs();
    document.addEventListener('click', this._documentClickHandler);
  }

  _resizeObserver() {
    return new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target.classList.contains('is-active')) {
          this._updateTabHeight();
        }
      }
    });
  }

  _documentClickHandler(evt) {
    const target = evt.target;
    if (!target.closest('[data-tabs="control"]')) {
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();
    const control = target.closest('[data-tabs="control"]');
    this.openTab(control);
  }

  _initAllTabs() {
    const tabs = document.querySelectorAll('[data-tabs="parent"]');
    const forLoadTabs = document.querySelectorAll('[data-tabs="element"].for-load');
    tabs.forEach((tab) => {
      this._initTab(tab);
    });
    forLoadTabs.forEach((tab) => {
      tab.classList.remove('for-load');
    });
  }

  _removeAllActiveClasses(tabControlElements, tabElements) {
    tabElements.forEach((tab) => {
      tab.classList.remove('is-active');
    });

    tabControlElements.forEach((element, index) => {
      element.classList.remove('is-active');
      element.setAttribute('data-index', index);
    });
  }

  _setTabStartState(tab, dataHeight, tabElements, tabContentElement, tabControlElements, dataDelay) {
    const activeIndex = this._returnActiveIndex(tabControlElements);
    const blockHeight = dataHeight === 'max' ? this._returnMaxHeight(tabElements) : tabElements[activeIndex].offsetHeight;
    this._removeAllActiveClasses(tabControlElements, tabElements);
    tab.classList.add('no-transition');
    tabControlElements[activeIndex].classList.add('is-active');
    tabElements[activeIndex].classList.add('is-active');
    if (dataHeight !== 'unset') {
      tabContentElement.style.height = `${blockHeight}px`;
    }
    setTimeout(() => {
      if (dataDelay) {
        tab.classList.remove('no-transition');
      }
    }, dataDelay);
  }

  _returnActiveIndex(tabControlElements) {
    let activeIndex = 0;
    let flag = true;
    tabControlElements.forEach((control, index) => {
      if (control.classList.contains('is-active') && flag) {
        activeIndex = index;
        flag = false;
      }
    });
    return activeIndex;
  }

  _returnMaxHeight(tabElements) {
    let height = [];
    tabElements.forEach((element) => {
      height.push(element.offsetHeight);
    });
    height.sort((a, b) => a - b);
    return height[height.length - 1];
  }

  _returnScopeList(nodeList, parent) {
    const array = [];
    nodeList.forEach((element) => {
      const elementParent = element.closest('[data-tabs="parent"]');
      if (elementParent === parent) {
        array.push(element);
      }
    });

    return array;
  }

  _returnScopeChild(nodeList, parent) {
    let currentChild;
    nodeList.forEach((element) => {
      const elementParent = element.closest('[data-tabs="parent"]');
      if (elementParent === parent) {
        currentChild = element;
      }
    });

    return currentChild;
  }

  _updateTabHeight() {
    const activeElements = document.querySelectorAll('[data-tabs="element"].is-active');
    activeElements.forEach((element) => {
      let transition = false;
      const parent = element.closest('[data-tabs="parent"]');
      if (parent.closest('[data-tabs="element"]')) {
        transition = true;
      }
      this._setTabElementHeight(element, transition);
    });
  }

  _setTabElementHeight(element, transition) {
    const parentElement = element.closest('[data-tabs="parent"]');
    const dataHeight = parentElement.dataset.height;
    const contentElement = this._returnScopeChild(parentElement.querySelectorAll('[data-tabs="content"]'), parentElement);
    const tabElements = this._returnScopeList(parentElement.querySelectorAll('[data-tabs="element"]'), parentElement);

    if (!transition) {
      parentElement.classList.add('no-transition');
    }

    contentElement.style.height = 'auto';

    const maxHeight = Math.max(...tabElements.map((el) => el.offsetHeight));

    if (dataHeight === 'max') {
      contentElement.style.height = `${maxHeight}px`;
    } else if (dataHeight === 'unset') {
      contentElement.style.height = 'auto';
    } else {
      const activeElement = this._returnScopeChild(parentElement.querySelectorAll('[data-tabs="element"].is-active'), parentElement);
      contentElement.style.height = `${activeElement.offsetHeight}px`;
    }

    setTimeout(() => {
      parentElement.classList.remove('no-transition');
    }, 50);

    const swiperInstance = parentElement.swiper;
    if (swiperInstance && typeof swiperInstance.update === 'function') {
      swiperInstance.update();
    }
  }

  _windowResizeHandler() {
    this._updateTabHeight();
  }

  _createDOMElement(elementType, attributes) {
    const element = document.createElement(elementType);
    for (let key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
    return element;
  }

  _toggleAndRemoveClass(element, accordion, control) {
    accordion.classList.toggle('is-active', element.classList.contains('is-active'));
    element.classList.remove('is-active');
    control.classList.remove('is-active');
  }

  _setAccordionState(parent, elements, controls) {
    if (parent.hasAttribute('data-accordion-init')) {
      return;
    }
    parent.setAttribute('data-accordion-init', '');
    elements.forEach((element, idx) => {
      const accordion = this._createDOMElement('div', {'data-tabs': 'accordion'});
      const accordionWrapper = this._createDOMElement('div', {'data-tabs': 'accordion-wrapper'});
      const accordionContent = this._createDOMElement('div', {'data-tabs': 'accordion-content'});

      accordion.append(controls[idx], accordionWrapper);
      accordionWrapper.append(accordionContent);
      accordionContent.append(element);

      parent.append(accordion);
      this._toggleAndRemoveClass(element, accordion, controls[idx]);
    });
  }

  _removeAccordionState(parent, elements, controls) {
    if (!parent.hasAttribute('data-accordion-init')) {
      return;
    }
    parent.removeAttribute('data-accordion-init');
    const controlList = this._returnScopeChild(parent.querySelectorAll('[data-tabs="controls"]'), parent);
    const content = this._returnScopeChild(parent.querySelectorAll('[data-tabs="content"]'), parent);
    const activeAccordions = this._returnScopeList(parent.querySelectorAll('[data-tabs="accordion"].is-active'), parent);
    const activeControl = activeAccordions.length ? activeAccordions[0].querySelector('[data-tabs="control"]') : controls[0];
    const activeElement = activeAccordions.length ? activeAccordions[0].querySelector('[data-tabs="element"]') : elements[0];
    elements.forEach((element, idx) => {
      const accordion = element.closest('[data-tabs="accordion"]');
      if (!accordion) {
        return;
      }
      controlList.append(controls[idx]);
      content.append(element);
      this._toggleAndRemoveClass(element, accordion, controls[idx]);
      accordion.remove();
    });

    activeControl.classList.add('is-active');
    activeElement.classList.add('is-active');
  }

  accordionBreakpointChecker(media, parent, elements, controls) {
    if (media.matches) {
      this._setAccordionState(parent, elements, controls);
    } else {
      this._removeAccordionState(parent, elements, controls);
    }
  }

  _initTab(tab) {
    const dataHeight = tab.dataset.height;
    const dataDelay = tab.dataset.delay ? tab.dataset.delay : 0;
    const tabContentElement = tab.querySelector('[data-tabs="content"]');
    const tabControlElements = this._returnScopeList(tab.querySelectorAll('[data-tabs="control"]'), tab);
    const tabElements = this._returnScopeList(tab.querySelectorAll('[data-tabs="element"]'), tab);
    const accordionMedia = tab.getAttribute('data-accordion-media') ? window.matchMedia(tab.getAttribute('data-accordion-media')) : null;
    this._setTabStartState(tab, dataHeight, tabElements, tabContentElement, tabControlElements, dataDelay);
    if (accordionMedia && !tab.accordionListener) {
      this.accordionBreakpointChecker(accordionMedia, tab, tabElements, tabControlElements);
      accordionMedia.addEventListener('change', this.accordionBreakpointChecker.bind(this, accordionMedia, tab, tabElements, tabControlElements));
      tab.accordionListener = true;
    }
    if (dataHeight !== 'unset') {
      tabElements.forEach((element) => {
        this._resizeObserver().observe(element);
      });
    }
    setTimeout(() => {
      tab.classList.remove('no-transition-global');
    });
  }

  reInit() {
    this._initAllTabs();
  }

  toggleAccordion(accordion) {
    if (accordion.classList.contains('is-active')) {
      this.closeAccordion(accordion);
    } else {
      this.openAccordion(accordion);
    }
  }

  openAccordion(accordion) {
    const parentElement = accordion.closest('[data-accordion-init]');
    const accordionWrapper = accordion.querySelector('[data-tabs="accordion-wrapper"]');
    accordionWrapper.style.maxHeight = `${accordionWrapper.offsetHeight}px`;

    if (parentElement.hasAttribute('data-single')) {
      this.closeAllAccordion(parentElement);
    }

    accordion.classList.add('is-active');
    setTimeout(() => {
      accordionWrapper.style.maxHeight = `${accordionWrapper.scrollHeight}px`;
      accordionWrapper.addEventListener('transitionend', () => {
        accordionWrapper.style.maxHeight = null;
      }, {once: true});
    }, 0);
  }

  closeAllAccordion(parent) {
    const elements = parent.querySelectorAll('[data-tabs="accordion"]');
    elements.forEach((element) => {
      const currentParent = element.closest('[data-accordion-init]');
      if (currentParent === parent && element.classList.contains('is-active')) {
        this.closeAccordion(element);
      }
    });
  }

  closeAccordion(accordion) {
    const accordionWrapper = accordion.querySelector('[data-tabs="accordion-wrapper"]');
    accordion.classList.remove('is-active');
    accordionWrapper.style.transition = 'none';
    accordionWrapper.style.maxHeight = `${accordionWrapper.scrollHeight}px`;
    setTimeout(() => {
      accordionWrapper.style.transition = null;
      accordionWrapper.style.maxHeight = '0px';
      accordionWrapper.addEventListener('transitionend', () => {
        accordionWrapper.style.maxHeight = null;
      }, {once: true});
    }, 0);
  }

  updateSwiper(index) {
    const parentElement = document.querySelector('[data-tabs="parent"]');
    const swiper = parentElement.querySelector('.swiper').swiper;
    if (swiper && window.innerWidth > 767) {
      swiper.slideTo(index);
    }
  }

  openTab(control) {
    const currentIndex = parseInt(control.dataset.index, 10);
    const parentElement = control.closest('[data-tabs="parent"]');
    const accordion = control.closest('[data-tabs="accordion"]');

    if (accordion && accordion.closest('[data-tabs="parent"]') === parentElement) {
      this.toggleAccordion(accordion);
      document.activeElement.blur();
      return;
    }

    if (control.classList.contains('is-active') || parentElement.classList.contains('no-action')) {
      return;
    }

    const dataDelay = parentElement.dataset.delay ? parentElement.dataset.delay : 0;
    const dataHeight = parentElement.dataset.height;
    const contentElement = parentElement.querySelector('[data-tabs="content"]');
    const tabElements = this._returnScopeList(parentElement.querySelectorAll('[data-tabs="element"]'), parentElement);

    const activeControl = this._returnScopeChild(parentElement.querySelectorAll('[data-tabs="control"].is-active'), parentElement);
    const activeElement = this._returnScopeChild(parentElement.querySelectorAll('[data-tabs="element"].is-active'), parentElement);
    const currentHeight = contentElement.offsetHeight;
    const newHeight = tabElements[currentIndex].offsetHeight;

    parentElement.classList.add('no-action');
    document.activeElement.blur();

    if (activeControl) {
      activeControl.classList.remove('is-active');
    }

    if (activeElement) {
      activeElement.classList.remove('is-active');
    }

    const swiper = parentElement.querySelector('.swiper').swiper;
    if (swiper && window.innerWidth > 767) {
      swiper.slideTo(parseInt(currentIndex, 10));
    }

    if (currentHeight > newHeight) {
      setTimeout(() => {
        if (dataHeight !== 'max' && dataHeight !== 'unset') {
          contentElement.style.height = newHeight + 'px';
        }
        control.classList.add('is-active');
        tabElements[currentIndex].classList.add('is-active');
        parentElement.classList.remove('no-action');
      }, dataDelay);
    } else {
      if (dataHeight !== 'max' && dataHeight !== 'unset') {
        contentElement.style.height = newHeight + 'px';
      }
      setTimeout(() => {
        control.classList.add('is-active');
        tabElements[currentIndex].classList.add('is-active');
        parentElement.classList.remove('no-action');
      }, dataDelay);
    }

    this.updateSwiper(currentIndex);

  }
}
