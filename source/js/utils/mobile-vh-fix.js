import {iosChecker} from './ios-checker';

const mobileVhFix = () => {
  const isMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIE = !!window.MSInputMethodContext && !!document.documentMode;

  if (!isIE && (isMobile || iosChecker())) {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
  }
};

export {mobileVhFix};
