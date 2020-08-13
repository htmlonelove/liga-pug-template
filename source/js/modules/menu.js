const menu = () => {
  const menu = document.querySelector('.js-menu');

  if(!menu) return;

  const body = document.body;
  const close = document.querySelector('.js-close-menu');;
  menu.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);

  function openMenu() {
    body.classList.add('opened-menu');
  }
  function closeMenu() {
    body.classList.remove('opened-menu');
  }

  // остальной js

};


export {menu};
