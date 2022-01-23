const MoveTo = (() => {
  /**
  * Defaults
  * @type {object}
  */
  const defaults = {
    tolerance: 0,
    duration: 800,
    easing: 'easeOutQuart',
    container: window,
    callback() {},
  };

  /**
  * easeOutQuart Easing Function
  * @param  {number} t - current time
  * @param  {number} b - start value
  * @param  {number} c - change in value
  * @param  {number} d - duration
  * @return {number} - calculated value
  */
  function easeOutQuart(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }

  /**
  * Merge two object
  *
  * @param  {object} obj1
  * @param  {object} obj2
  * @return {object} merged object
  */
  function mergeObject(obj1, obj2) {
    const obj3 = {};
    Object.keys(obj1).forEach((propertyName) => {
      obj3[propertyName] = obj1[propertyName];
    });

    Object.keys(obj2).forEach((propertyName) => {
      obj3[propertyName] = obj2[propertyName];
    });
    return obj3;
  }

  /**
  * Converts camel case to kebab case
  * @param  {string} val the value to be converted
  * @return {string} the converted value
  */
  function kebabCase(val) {
    return val.replace(/([A-Z])/g, function ($1) {
      return '-' + $1.toLowerCase();
    });
  }

  /**
  * Count a number of item scrolled top
  * @param  {Window|HTMLElement} container
  * @return {number}
  */
  function countScrollTop(container) {
    if (container instanceof HTMLElement) {
      return container.scrollTop;
    }
    return container.pageYOffset;
  }

  /**
  * MoveTo Constructor
  * @param {object} options Options
  * @param {object} easeFunctions Custom ease functions
  */
  // eslint-disable-next-line no-shadow
  function MoveTo(options = {}, easeFunctions = {}) {
    this.options = mergeObject(defaults, options);
    this.easeFunctions = mergeObject({easeOutQuart}, easeFunctions);
  }

  /**
  * Register a dom element as trigger
  * @param  {HTMLElement} dom Dom trigger element
  * @param  {function} callback Callback function
  * @return {function|void} unregister function
  */
  MoveTo.prototype.registerTrigger = function (dom, callback) {
    if (!dom) {
      return;
    }

    const href = dom.getAttribute('href') || dom.getAttribute('data-target');
    // The element to be scrolled
    const target = (href && href !== '#')
      ? document.getElementById(href.substring(1))
      : document.body;
    const options = mergeObject(this.options, _getOptionsFromTriggerDom(dom, this.options));

    if (typeof callback === 'function') {
      options.callback = callback;
    }

    const listener = (e) => {
      e.preventDefault();
      this.move(target, options);
    };

    dom.addEventListener('click', listener, false);

    // eslint-disable-next-line consistent-return
    return () => dom.removeEventListener('click', listener, false);
  };

  /**
  * Move
  * Scrolls to given element by using easeOutQuart function
  * @param  {HTMLElement|number} target Target element to be scrolled or target position
  * @param  {object} options Custom options
  */
  MoveTo.prototype.move = function (target, options = {}) {
    if (target !== 0 && !target) {
      return;
    }

    options = mergeObject(this.options, options);

    let distance = typeof target === 'number' ? target : target.getBoundingClientRect().top;
    const from = countScrollTop(options.container);
    let startTime = null;
    let lastYOffset;
    distance -= options.tolerance;

    // rAF loop
    /* eslint-disable-next-line */
    const loop = (currentTime) => {
      const currentYOffset = countScrollTop(this.options.container);

      if (!startTime) {
        // To starts time from 1, we subtracted 1 from current time
        // If time starts from 1 The first loop will not do anything,
        // because easing value will be zero
        startTime = currentTime - 1;
      }

      const timeElapsed = currentTime - startTime;

      if (lastYOffset) {
        if (
          (distance > 0 && lastYOffset > currentYOffset) ||
          (distance < 0 && lastYOffset < currentYOffset)
        ) {
          return options.callback(target);
        }
      }
      lastYOffset = currentYOffset;

      const val = this.easeFunctions[options.easing](timeElapsed, from, distance, options.duration);

      options.container.scroll(0, val);

      if (timeElapsed < options.duration) {
        window.requestAnimationFrame(loop);
      } else {
        options.container.scroll(0, distance + from);
        options.callback(target);
      }
    };

    window.requestAnimationFrame(loop);
  };

  /**
  * Adds custom ease function
  * @param {string}   name Ease function name
  * @param {function} fn   Ease function
  */
  MoveTo.prototype.addEaseFunction = function (name, fn) {
    this.easeFunctions[name] = fn;
  };

  /**
  * Returns options which created from trigger dom element
  * @param  {HTMLElement} dom Trigger dom element
  * @param  {object} options The instance's options
  * @return {object} The options which created from trigger dom element
  */
  function _getOptionsFromTriggerDom(dom, options) {
    const domOptions = {};

    Object.keys(options).forEach((key) => {
      const value = dom.getAttribute(`data-mt-${kebabCase(key)}`);
      if (value) {
        domOptions[key] = isNaN(value) ? value : parseInt(value, 10);
      }
    });
    return domOptions;
  }

  return MoveTo;
})();
window.MoveTo = MoveTo;

class NavigationChanger {
  constructor() {
    this._scrollDuration = 1000;
    this._currentIndex = 0;
    this._newCurrentIndex = null;
    this._blockShift = 50;
    this._linkElements = document.querySelectorAll('[data-navigation-link]');

    this._moveTo = new window.MoveTo({
      duration: this._scrollDuration,
      easing: 'easeOutQuart',
    });

    this._documentScrollHandler = this._documentScrollHandler.bind(this);
  }

  init() {
    if (!this._linkElements.length) {
      return;
    }
    this._initMoveTo();
    this._changeLinksActiveState();
    document.addEventListener('scroll', this._documentScrollHandler);
  }

  _documentScrollHandler() {
    this._changeLinksActiveState();
  }

  _changeLinksActiveState() {
    this._linkElements.forEach((link, index) => {
      const currentBlockElement = document.querySelector(`${link.getAttribute('href')}`);
      if (!currentBlockElement) {
        // eslint-disable-next-line no-console
        console.error('Блока на который ссылается ссылка не существует! Проверьте соответствие href ссылок с id блоков');
        return;
      }
      if (currentBlockElement.getBoundingClientRect().bottom > this._blockShift && currentBlockElement.getBoundingClientRect().top <= this._blockShift) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }

      if (document.body.getBoundingClientRect().bottom - window.innerHeight < this._blockShift && currentBlockElement.getBoundingClientRect().top > this._blockShift) {
        this._linkElements[index - 1].classList.remove('is-active');
        link.classList.add('is-active');
      }
    });
  }

  _removeLinkAnimation() {
    this._linkElements.forEach((link, index) => {
      if (index !== this._currentIndex && index !== this._newCurrentIndex) {
        link.classList.add('is-inactive');
      }
    });
  }

  _addLinkAnimation() {
    this._linkElements.forEach((link) => link.classList.remove('is-inactive'));
    this._currentIndex = this._newCurrentIndex;
  }

  _initMoveTo() {
    this._linkElements.forEach((link, index) => {
      link.addEventListener('click', (evt) => {
        evt.preventDefault();
        const target = document.querySelector(`${link.getAttribute('href')}`);
        if (!target) {
          // eslint-disable-next-line no-console
          console.error('Блока на который ссылается ссылка не существует! Проверьте соответствие href ссылок с id блоков');
          return;
        }
        this._newCurrentIndex = index;
        this._moveTo.move(target);
        this._removeLinkAnimation();
        setTimeout(() => {
          this._addLinkAnimation();
        }, this._scrollDuration);
      });
    });
  }
}

const navigationChanger = new NavigationChanger();

navigationChanger.init();
