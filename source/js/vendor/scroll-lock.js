(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    exports['scrollLock'] = factory();
  } else {
    root['scrollLock'] = factory();
  }
})(this, function () {
  return /** ****/ (function (modules) { // webpackBootstrap
    /** ****/ 	// The module cache
    /** ****/ 	let installedModules = {};
    /** ****/
    /** ****/ 	// The require function
    /** ****/ 	function __webpack_require__(moduleId) {
      /** ****/
      /** ****/ 		// Check if module is in cache
      /** ****/ 		if (installedModules[moduleId]) {
        /** ****/ 			return installedModules[moduleId].exports;
        /** ****/ 		}
      /** ****/ 		// Create a new module (and put it into the cache)
      /** ****/ 		let module = installedModules[moduleId] = {
        /** ****/ 			i: moduleId,
        /** ****/ 			l: false,
        /** ****/ 			exports: {},
        /** ****/};
      /** ****/
      /** ****/ 		// Execute the module function
      /** ****/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /** ****/
      /** ****/ 		// Flag the module as loaded
      /** ****/ 		module.l = true;
      /** ****/
      /** ****/ 		// Return the exports of the module
      /** ****/ 		return module.exports;
      /** ****/ 	}
    /** ****/
    /** ****/
    /** ****/ 	// expose the modules object (__webpack_modules__)
    /** ****/ 	__webpack_require__.m = modules;
    /** ****/
    /** ****/ 	// expose the module cache
    /** ****/ 	__webpack_require__.c = installedModules;
    /** ****/
    /** ****/ 	// define getter function for harmony exports
    /** ****/ 	__webpack_require__.d = function (exports, name, getter) {
      /** ****/ 		if (!__webpack_require__.o(exports, name)) {
        /** ****/ 			Object.defineProperty(exports, name, {enumerable: true, get: getter});
        /** ****/ 		}
      /** ****/ 	};
    /** ****/
    /** ****/ 	// define __esModule on exports
    /** ****/ 	__webpack_require__.r = function (exports) {
      /** ****/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** ****/ 			Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'});
        /** ****/ 		}
      /** ****/ 		Object.defineProperty(exports, '__esModule', {value: true});
      /** ****/ 	};
    /** ****/
    /** ****/ 	// create a fake namespace object
    /** ****/ 	// mode & 1: value is a module id, require it
    /** ****/ 	// mode & 2: merge all properties of value into the ns
    /** ****/ 	// mode & 4: return value when already ns object
    /** ****/ 	// mode & 8|1: behave like require
    /** ****/ 	__webpack_require__.t = function (value, mode) {
      /** ****/ 		if (mode & 1) {
        value = __webpack_require__(value);
      }
      /** ****/ 		if (mode & 8) {
        return value;
      }
      /** ****/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) {
        return value;
      }
      /** ****/ 		let ns = Object.create(null);
      /** ****/ 		__webpack_require__.r(ns);
      /** ****/ 		Object.defineProperty(ns, 'default', {enumerable: true, value});
      /** ****/ 		if (mode & 2 && typeof value !== 'string') {
        for (let key in value) {
          __webpack_require__.d(ns, key, function (key) {
            return value[key];
          }.bind(null, key));
        }
      }
      /** ****/ 		return ns;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// getDefaultExport function for compatibility with non-harmony modules
    /** ****/ 	__webpack_require__.n = function (module) {
      /** ****/ 		let getter = module && module.__esModule ?
      /** ****/ 			function getDefault() {
          return module['default'];
        } :
      /** ****/ 			function getModuleExports() {
          return module;
        };
      /** ****/ 		__webpack_require__.d(getter, 'a', getter);
      /** ****/ 		return getter;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// Object.prototype.hasOwnProperty.call
    /** ****/ 	__webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /** ****/
    /** ****/ 	// __webpack_public_path__
    /** ****/ 	__webpack_require__.p = '';
    /** ****/
    /** ****/
    /** ****/ 	// Load entry module and return exports
    /** ****/ 	return __webpack_require__(__webpack_require__.s = 0);
    /** ****/ })
  /** **********************************************************************/
  /** ****/ ([
    /* 0 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {

      'use strict';
      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./src/tools.js
      let argumentAsArray = function argumentAsArray(argument) {
        return Array.isArray(argument) ? argument : [argument];
      };
      let isElement = function isElement(target) {
        return target instanceof Node;
      };
      let isElementList = function isElementList(nodeList) {
        return nodeList instanceof NodeList;
      };
      let eachNode = function eachNode(nodeList, callback) {
        if (nodeList && callback) {
          nodeList = isElementList(nodeList) ? nodeList : [nodeList];

          for (let i = 0; i < nodeList.length; i++) {
            if (callback(nodeList[i], i, nodeList.length) === true) {
              break;
            }
          }
        }
      };
      let throwError = function throwError(message) {
        return console.error('[scroll-lock] '.concat(message));
      };
      let arrayAsSelector = function arrayAsSelector(array) {
        if (Array.isArray(array)) {
          let selector = array.join(', ');
          return selector;
        }
      };
      let nodeListAsArray = function nodeListAsArray(nodeList) {
        let nodes = [];
        eachNode(nodeList, function (node) {
          return nodes.push(node);
        });
        return nodes;
      };
      let findParentBySelector = function findParentBySelector($el, selector) {
        let self = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        let $root = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document;

        if (self && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1) {
          return $el;
        }

        while (($el = $el.parentElement) && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) === -1) {

        }

        return $el;
      };
      let elementHasSelector = function elementHasSelector($el, selector) {
        let $root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
        let has = nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1;
        return has;
      };
      let elementHasOverflowHidden = function elementHasOverflowHidden($el) {
        if ($el) {
          let computedStyle = getComputedStyle($el);
          let overflowIsHidden = computedStyle.overflow === 'hidden';
          return overflowIsHidden;
        }
      };
      let elementScrollTopOnStart = function elementScrollTopOnStart($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }

          let scrollTop = $el.scrollTop;
          return scrollTop <= 0;
        }
      };
      let elementScrollTopOnEnd = function elementScrollTopOnEnd($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }

          let scrollTop = $el.scrollTop;
          let scrollHeight = $el.scrollHeight;
          let scrollTopWithHeight = scrollTop + $el.offsetHeight;
          return scrollTopWithHeight >= scrollHeight;
        }
      };
      let elementScrollLeftOnStart = function elementScrollLeftOnStart($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }

          let scrollLeft = $el.scrollLeft;
          return scrollLeft <= 0;
        }
      };
      let elementScrollLeftOnEnd = function elementScrollLeftOnEnd($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }

          let scrollLeft = $el.scrollLeft;
          let scrollWidth = $el.scrollWidth;
          let scrollLeftWithWidth = scrollLeft + $el.offsetWidth;
          return scrollLeftWithWidth >= scrollWidth;
        }
      };
      let elementIsScrollableField = function elementIsScrollableField($el) {
        let selector = 'textarea, [contenteditable="true"]';
        return elementHasSelector($el, selector);
      };
      let elementIsInputRange = function elementIsInputRange($el) {
        let selector = 'input[type="range"]';
        return elementHasSelector($el, selector);
      };
      // CONCATENATED MODULE: ./src/scroll-lock.js
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'disablePageScroll', function () {
        return disablePageScroll;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'enablePageScroll', function () {
        return enablePageScroll;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'getScrollState', function () {
        return getScrollState;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'clearQueueScrollLocks', function () {
        return clearQueueScrollLocks;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'getTargetScrollBarWidth', function () {
        return scroll_lock_getTargetScrollBarWidth;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'getCurrentTargetScrollBarWidth', function () {
        return scroll_lock_getCurrentTargetScrollBarWidth;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'getPageScrollBarWidth', function () {
        return getPageScrollBarWidth;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'getCurrentPageScrollBarWidth', function () {
        return getCurrentPageScrollBarWidth;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'addScrollableTarget', function () {
        return scroll_lock_addScrollableTarget;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'removeScrollableTarget', function () {
        return scroll_lock_removeScrollableTarget;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'addScrollableSelector', function () {
        return scroll_lock_addScrollableSelector;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'removeScrollableSelector', function () {
        return scroll_lock_removeScrollableSelector;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'addLockableTarget', function () {
        return scroll_lock_addLockableTarget;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'addLockableSelector', function () {
        return scroll_lock_addLockableSelector;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'setFillGapMethod', function () {
        return scroll_lock_setFillGapMethod;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'addFillGapTarget', function () {
        return scroll_lock_addFillGapTarget;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'removeFillGapTarget', function () {
        return scroll_lock_removeFillGapTarget;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'addFillGapSelector', function () {
        return scroll_lock_addFillGapSelector;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'removeFillGapSelector', function () {
        return scroll_lock_removeFillGapSelector;
      });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'refillGaps', function () {
        return refillGaps;
      });
      function _objectSpread(target) {
        for (let i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {}; let ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          } ownKeys.forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } return target;
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
        } else {
          obj[key] = value;
        } return obj;
      }


      let FILL_GAP_AVAILABLE_METHODS = ['padding', 'margin', 'width', 'max-width', 'none'];
      let TOUCH_DIRECTION_DETECT_OFFSET = 3;
      let state = {
        scroll: true,
        queue: 0,
        scrollableSelectors: ['[data-scroll-lock-scrollable]'],
        lockableSelectors: ['body', '[data-scroll-lock-lockable]'],
        fillGapSelectors: ['body', '[data-scroll-lock-fill-gap]', '[data-scroll-lock-lockable]'],
        fillGapMethod: FILL_GAP_AVAILABLE_METHODS[0],
        //
        startTouchY: 0,
        startTouchX: 0,
      };
      var disablePageScroll = function disablePageScroll(target) {
        if (state.queue <= 0) {
          state.scroll = false;
          scroll_lock_hideLockableOverflow();
          fillGaps();
        }

        scroll_lock_addScrollableTarget(target);
        state.queue++;
      };
      var enablePageScroll = function enablePageScroll(target) {
        state.queue > 0 && state.queue--;

        if (state.queue <= 0) {
          state.scroll = true;
          scroll_lock_showLockableOverflow();
          unfillGaps();
        }

        scroll_lock_removeScrollableTarget(target);
      };
      var getScrollState = function getScrollState() {
        return state.scroll;
      };
      var clearQueueScrollLocks = function clearQueueScrollLocks() {
        state.queue = 0;
      };
      var scroll_lock_getTargetScrollBarWidth = function getTargetScrollBarWidth($target) {
        let onlyExists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (isElement($target)) {
          let currentOverflowYProperty = $target.style.overflowY;

          if (onlyExists) {
            if (!getScrollState()) {
              $target.style.overflowY = $target.getAttribute('data-scroll-lock-saved-overflow-y-property');
            }
          } else {
            $target.style.overflowY = 'scroll';
          }

          let width = scroll_lock_getCurrentTargetScrollBarWidth($target);
          $target.style.overflowY = currentOverflowYProperty;
          return width;
        } else {
          return 0;
        }
      };
      var scroll_lock_getCurrentTargetScrollBarWidth = function getCurrentTargetScrollBarWidth($target) {
        if (isElement($target)) {
          if ($target === document.body) {
            let documentWidth = document.documentElement.clientWidth;
            let windowWidth = window.innerWidth;
            let currentWidth = windowWidth - documentWidth;
            return currentWidth;
          } else {
            let borderLeftWidthCurrentProperty = $target.style.borderLeftWidth;
            let borderRightWidthCurrentProperty = $target.style.borderRightWidth;
            $target.style.borderLeftWidth = '0px';
            $target.style.borderRightWidth = '0px';

            let _currentWidth = $target.offsetWidth - $target.clientWidth;

            $target.style.borderLeftWidth = borderLeftWidthCurrentProperty;
            $target.style.borderRightWidth = borderRightWidthCurrentProperty;
            return _currentWidth;
          }
        } else {
          return 0;
        }
      };
      var getPageScrollBarWidth = function getPageScrollBarWidth() {
        let onlyExists = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return scroll_lock_getTargetScrollBarWidth(document.body, onlyExists);
      };
      var getCurrentPageScrollBarWidth = function getCurrentPageScrollBarWidth() {
        return scroll_lock_getCurrentTargetScrollBarWidth(document.body);
      };
      var scroll_lock_addScrollableTarget = function addScrollableTarget(target) {
        if (target) {
          let targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.setAttribute('data-scroll-lock-scrollable', '');
              } else {
                throwError('"'.concat($target, '" is not a Element.'));
              }
            });
          });
        }
      };
      var scroll_lock_removeScrollableTarget = function removeScrollableTarget(target) {
        if (target) {
          let targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.removeAttribute('data-scroll-lock-scrollable');
              } else {
                throwError('"'.concat($target, '" is not a Element.'));
              }
            });
          });
        }
      };
      var scroll_lock_addScrollableSelector = function addScrollableSelector(selector) {
        if (selector) {
          let selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.scrollableSelectors.push(selector);
          });
        }
      };
      var scroll_lock_removeScrollableSelector = function removeScrollableSelector(selector) {
        if (selector) {
          let selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.scrollableSelectors = state.scrollableSelectors.filter(function (sSelector) {
              return sSelector !== selector;
            });
          });
        }
      };
      var scroll_lock_addLockableTarget = function addLockableTarget(target) {
        if (target) {
          let targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.setAttribute('data-scroll-lock-lockable', '');
              } else {
                throwError('"'.concat($target, '" is not a Element.'));
              }
            });
          });

          if (!getScrollState()) {
            scroll_lock_hideLockableOverflow();
          }
        }
      };
      var scroll_lock_addLockableSelector = function addLockableSelector(selector) {
        if (selector) {
          let selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.lockableSelectors.push(selector);
          });

          if (!getScrollState()) {
            scroll_lock_hideLockableOverflow();
          }

          scroll_lock_addFillGapSelector(selector);
        }
      };
      var scroll_lock_setFillGapMethod = function setFillGapMethod(method) {
        if (method) {
          if (FILL_GAP_AVAILABLE_METHODS.indexOf(method) !== -1) {
            state.fillGapMethod = method;
            refillGaps();
          } else {
            let methods = FILL_GAP_AVAILABLE_METHODS.join(', ');
            throwError('"'.concat(method, '" method is not available!\nAvailable fill gap methods: ').concat(methods, '.'));
          }
        }
      };
      var scroll_lock_addFillGapTarget = function addFillGapTarget(target) {
        if (target) {
          let targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.setAttribute('data-scroll-lock-fill-gap', '');

                if (!state.scroll) {
                  scroll_lock_fillGapTarget($target);
                }
              } else {
                throwError('"'.concat($target, '" is not a Element.'));
              }
            });
          });
        }
      };
      var scroll_lock_removeFillGapTarget = function removeFillGapTarget(target) {
        if (target) {
          let targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.removeAttribute('data-scroll-lock-fill-gap');

                if (!state.scroll) {
                  scroll_lock_unfillGapTarget($target);
                }
              } else {
                throwError('"'.concat($target, '" is not a Element.'));
              }
            });
          });
        }
      };
      var scroll_lock_addFillGapSelector = function addFillGapSelector(selector) {
        if (selector) {
          let selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            if (state.fillGapSelectors.indexOf(selector) === -1) {
              state.fillGapSelectors.push(selector);

              if (!state.scroll) {
                scroll_lock_fillGapSelector(selector);
              }
            }
          });
        }
      };
      var scroll_lock_removeFillGapSelector = function removeFillGapSelector(selector) {
        if (selector) {
          let selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.fillGapSelectors = state.fillGapSelectors.filter(function (fSelector) {
              return fSelector !== selector;
            });

            if (!state.scroll) {
              scroll_lock_unfillGapSelector(selector);
            }
          });
        }
      };
      var refillGaps = function refillGaps() {
        if (!state.scroll) {
          fillGaps();
        }
      };

      var scroll_lock_hideLockableOverflow = function hideLockableOverflow() {
        let selector = arrayAsSelector(state.lockableSelectors);
        scroll_lock_hideLockableOverflowSelector(selector);
      };

      var scroll_lock_showLockableOverflow = function showLockableOverflow() {
        let selector = arrayAsSelector(state.lockableSelectors);
        scroll_lock_showLockableOverflowSelector(selector);
      };

      var scroll_lock_hideLockableOverflowSelector = function hideLockableOverflowSelector(selector) {
        let $targets = document.querySelectorAll(selector);
        eachNode($targets, function ($target) {
          scroll_lock_hideLockableOverflowTarget($target);
        });
      };

      var scroll_lock_showLockableOverflowSelector = function showLockableOverflowSelector(selector) {
        let $targets = document.querySelectorAll(selector);
        eachNode($targets, function ($target) {
          scroll_lock_showLockableOverflowTarget($target);
        });
      };

      var scroll_lock_hideLockableOverflowTarget = function hideLockableOverflowTarget($target) {
        if (isElement($target) && $target.getAttribute('data-scroll-lock-locked') !== 'true') {
          let computedStyle = window.getComputedStyle($target);
          $target.setAttribute('data-scroll-lock-saved-overflow-y-property', computedStyle.overflowY);
          $target.setAttribute('data-scroll-lock-saved-inline-overflow-property', $target.style.overflow);
          $target.setAttribute('data-scroll-lock-saved-inline-overflow-y-property', $target.style.overflowY);
          $target.style.overflow = 'hidden';
          $target.setAttribute('data-scroll-lock-locked', 'true');
        }
      };

      var scroll_lock_showLockableOverflowTarget = function showLockableOverflowTarget($target) {
        if (isElement($target) && $target.getAttribute('data-scroll-lock-locked') === 'true') {
          $target.style.overflow = $target.getAttribute('data-scroll-lock-saved-inline-overflow-property');
          $target.style.overflowY = $target.getAttribute('data-scroll-lock-saved-inline-overflow-y-property');
          $target.removeAttribute('data-scroll-lock-saved-overflow-property');
          $target.removeAttribute('data-scroll-lock-saved-inline-overflow-property');
          $target.removeAttribute('data-scroll-lock-saved-inline-overflow-y-property');
          $target.removeAttribute('data-scroll-lock-locked');
        }
      };

      var fillGaps = function fillGaps() {
        state.fillGapSelectors.map(function (selector) {
          scroll_lock_fillGapSelector(selector);
        });
      };

      var unfillGaps = function unfillGaps() {
        state.fillGapSelectors.map(function (selector) {
          scroll_lock_unfillGapSelector(selector);
        });
      };

      var scroll_lock_fillGapSelector = function fillGapSelector(selector) {
        let $targets = document.querySelectorAll(selector);
        let isLockable = state.lockableSelectors.indexOf(selector) !== -1;
        eachNode($targets, function ($target) {
          scroll_lock_fillGapTarget($target, isLockable);
        });
      };

      var scroll_lock_fillGapTarget = function fillGapTarget($target) {
        let isLockable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (isElement($target)) {
          let scrollBarWidth;

          if ($target.getAttribute('data-scroll-lock-lockable') === '' || isLockable) {
            scrollBarWidth = scroll_lock_getTargetScrollBarWidth($target, true);
          } else {
            let $lockableParent = findParentBySelector($target, arrayAsSelector(state.lockableSelectors));
            scrollBarWidth = scroll_lock_getTargetScrollBarWidth($lockableParent, true);
          }

          if ($target.getAttribute('data-scroll-lock-filled-gap') === 'true') {
            scroll_lock_unfillGapTarget($target);
          }

          let computedStyle = window.getComputedStyle($target);
          $target.setAttribute('data-scroll-lock-filled-gap', 'true');
          $target.setAttribute('data-scroll-lock-current-fill-gap-method', state.fillGapMethod);

          if (state.fillGapMethod === 'margin') {
            let currentMargin = parseFloat(computedStyle.marginRight);
            $target.style.marginRight = ''.concat(currentMargin + scrollBarWidth, 'px');
          } else if (state.fillGapMethod === 'width') {
            $target.style.width = 'calc(100% - '.concat(scrollBarWidth, 'px)');
          } else if (state.fillGapMethod === 'max-width') {
            $target.style.maxWidth = 'calc(100% - '.concat(scrollBarWidth, 'px)');
          } else if (state.fillGapMethod === 'padding') {
            let currentPadding = parseFloat(computedStyle.paddingRight);
            $target.style.paddingRight = ''.concat(currentPadding + scrollBarWidth, 'px');
          }
        }
      };

      var scroll_lock_unfillGapSelector = function unfillGapSelector(selector) {
        let $targets = document.querySelectorAll(selector);
        eachNode($targets, function ($target) {
          scroll_lock_unfillGapTarget($target);
        });
      };

      var scroll_lock_unfillGapTarget = function unfillGapTarget($target) {
        if (isElement($target)) {
          if ($target.getAttribute('data-scroll-lock-filled-gap') === 'true') {
            let currentFillGapMethod = $target.getAttribute('data-scroll-lock-current-fill-gap-method');
            $target.removeAttribute('data-scroll-lock-filled-gap');
            $target.removeAttribute('data-scroll-lock-current-fill-gap-method');

            if (currentFillGapMethod === 'margin') {
              $target.style.marginRight = '';
            } else if (currentFillGapMethod === 'width') {
              $target.style.width = '';
            } else if (currentFillGapMethod === 'max-width') {
              $target.style.maxWidth = '';
            } else if (currentFillGapMethod === 'padding') {
              $target.style.paddingRight = '';
            }
          }
        }
      };

      let onResize = function onResize(e) {
        refillGaps();
      };

      let onTouchStart = function onTouchStart(e) {
        if (!state.scroll) {
          state.startTouchY = e.touches[0].clientY;
          state.startTouchX = e.touches[0].clientX;
        }
      };

      let scroll_lock_onTouchMove = function onTouchMove(e) {
        if (!state.scroll) {
          let startTouchY = state.startTouchY;
          let startTouchX = state.startTouchX;
          let currentClientY = e.touches[0].clientY;
          let currentClientX = e.touches[0].clientX;

          if (e.touches.length < 2) {
            let selector = arrayAsSelector(state.scrollableSelectors);
            let direction = {
              up: startTouchY < currentClientY,
              down: startTouchY > currentClientY,
              left: startTouchX < currentClientX,
              right: startTouchX > currentClientX,
            };
            let directionWithOffset = {
              up: startTouchY + TOUCH_DIRECTION_DETECT_OFFSET < currentClientY,
              down: startTouchY - TOUCH_DIRECTION_DETECT_OFFSET > currentClientY,
              left: startTouchX + TOUCH_DIRECTION_DETECT_OFFSET < currentClientX,
              right: startTouchX - TOUCH_DIRECTION_DETECT_OFFSET > currentClientX,
            };

            let handle = function handle($el) {
              let skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              if ($el) {
                let parentScrollableEl = findParentBySelector($el, selector, false);

                if (elementIsInputRange($el)) {
                  return false;
                }

                if (skip || elementIsScrollableField($el) && findParentBySelector($el, selector) || elementHasSelector($el, selector)) {
                  let prevent = false;

                  if (elementScrollLeftOnStart($el) && elementScrollLeftOnEnd($el)) {
                    if (direction.up && elementScrollTopOnStart($el) || direction.down && elementScrollTopOnEnd($el)) {
                      prevent = true;
                    }
                  } else if (elementScrollTopOnStart($el) && elementScrollTopOnEnd($el)) {
                    if (direction.left && elementScrollLeftOnStart($el) || direction.right && elementScrollLeftOnEnd($el)) {
                      prevent = true;
                    }
                  } else if (directionWithOffset.up && elementScrollTopOnStart($el) || directionWithOffset.down && elementScrollTopOnEnd($el) || directionWithOffset.left && elementScrollLeftOnStart($el) || directionWithOffset.right && elementScrollLeftOnEnd($el)) {
                    prevent = true;
                  }

                  if (prevent) {
                    if (parentScrollableEl) {
                      handle(parentScrollableEl, true);
                    } else {
                      if (e.cancelable) {
                        e.preventDefault();
                      }
                    }
                  }
                } else {
                  handle(parentScrollableEl);
                }
              } else {
                if (e.cancelable) {
                  e.preventDefault();
                }
              }
            };

            handle(e.target);
          }
        }
      };

      let onTouchEnd = function onTouchEnd(e) {
        if (!state.scroll) {
          state.startTouchY = 0;
          state.startTouchX = 0;
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', onResize);
      }

      if (typeof document !== 'undefined') {
        document.addEventListener('touchstart', onTouchStart);
        document.addEventListener('touchmove', scroll_lock_onTouchMove, {
          passive: false,
        });
        document.addEventListener('touchend', onTouchEnd);
      }

      let deprecatedMethods = {
        hide: function hide(target) {
          throwError('"hide" is deprecated! Use "disablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#disablepagescrollscrollabletarget');
          disablePageScroll(target);
        },
        show: function show(target) {
          throwError('"show" is deprecated! Use "enablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#enablepagescrollscrollabletarget');
          enablePageScroll(target);
        },
        toggle: function toggle(target) {
          throwError('"toggle" is deprecated! Do not use it.');

          if (getScrollState()) {
            disablePageScroll();
          } else {
            enablePageScroll(target);
          }
        },
        getState: function getState() {
          throwError('"getState" is deprecated! Use "getScrollState" instead. \n https://github.com/FL3NKEY/scroll-lock#getscrollstate');
          return getScrollState();
        },
        getWidth: function getWidth() {
          throwError('"getWidth" is deprecated! Use "getPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getpagescrollbarwidth');
          return getPageScrollBarWidth();
        },
        getCurrentWidth: function getCurrentWidth() {
          throwError('"getCurrentWidth" is deprecated! Use "getCurrentPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getcurrentpagescrollbarwidth');
          return getCurrentPageScrollBarWidth();
        },
        setScrollableTargets: function setScrollableTargets(target) {
          throwError('"setScrollableTargets" is deprecated! Use "addScrollableTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addscrollabletargetscrollabletarget');
          scroll_lock_addScrollableTarget(target);
        },
        setFillGapSelectors: function setFillGapSelectors(selector) {
          throwError('"setFillGapSelectors" is deprecated! Use "addFillGapSelector" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgapselectorfillgapselector');
          scroll_lock_addFillGapSelector(selector);
        },
        setFillGapTargets: function setFillGapTargets(target) {
          throwError('"setFillGapTargets" is deprecated! Use "addFillGapTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgaptargetfillgaptarget');
          scroll_lock_addFillGapTarget(target);
        },
        clearQueue: function clearQueue() {
          throwError('"clearQueue" is deprecated! Use "clearQueueScrollLocks" instead. \n https://github.com/FL3NKEY/scroll-lock#clearqueuescrolllocks');
          clearQueueScrollLocks();
        },
      };

      let scrollLock = _objectSpread({
        disablePageScroll,
        enablePageScroll,
        getScrollState,
        clearQueueScrollLocks,
        getTargetScrollBarWidth: scroll_lock_getTargetScrollBarWidth,
        getCurrentTargetScrollBarWidth: scroll_lock_getCurrentTargetScrollBarWidth,
        getPageScrollBarWidth,
        getCurrentPageScrollBarWidth,
        addScrollableSelector: scroll_lock_addScrollableSelector,
        removeScrollableSelector: scroll_lock_removeScrollableSelector,
        addScrollableTarget: scroll_lock_addScrollableTarget,
        removeScrollableTarget: scroll_lock_removeScrollableTarget,
        addLockableSelector: scroll_lock_addLockableSelector,
        addLockableTarget: scroll_lock_addLockableTarget,
        addFillGapSelector: scroll_lock_addFillGapSelector,
        removeFillGapSelector: scroll_lock_removeFillGapSelector,
        addFillGapTarget: scroll_lock_addFillGapTarget,
        removeFillGapTarget: scroll_lock_removeFillGapTarget,
        setFillGapMethod: scroll_lock_setFillGapMethod,
        refillGaps,
        _state: state,
      }, deprecatedMethods);

      /* harmony default export */ let scroll_lock = __webpack_exports__['default'] = (scrollLock);

      /***/ })
    /** ****/ ])['default'];
});
