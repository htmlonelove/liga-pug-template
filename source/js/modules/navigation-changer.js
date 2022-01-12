export class NavigationChanger {
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
