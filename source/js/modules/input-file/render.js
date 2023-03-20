export const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const renderElement = (container, component, place = 'beforeend') => {
  switch (place) {
    case 'beforebegin':
      container.before(component);
      break;
    case 'afterbegin':
      container.prepend(component);
      break;
    case 'beforeend':
      container.append(component);
      break;
    case 'afterend':
      container.after(component);
      break;
  }
};
