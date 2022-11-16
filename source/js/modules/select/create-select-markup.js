const createNativeOptionsMarkup = (items, activeIndex) => {
  return items.map((el, index) => {
    if (activeIndex.length) {
      const currentIndex = activeIndex.find((item) => item === index);
      if (currentIndex === index) {
        return `<option ${el.value ? `value=${el.value}` : ''} selected>${el.text ? `${el.text}` : ''}</option>`;
      } else {
        return `<option ${el.value ? `value=${el.value}` : ''}>${el.text ? `${el.text}` : ''}</option>`;
      }
    } else {
      return `<option ${el.value ? `value=${el.value}` : ''}>${el.text ? `${el.text}` : ''}</option>`;
    }
  }).join('\n');
};

export const createNativeSelectMarkup = ({id, items, multiple, name, required, activeIndex = []}) => {
  return `<select ${id ? `id='${id}'` : ''} ${name ? `name='${name}'` : ''} ${multiple ? 'multiple' : ''} ${
    required ? 'required' : ''
  } tabindex="-1" aria-hidden="true">
            <option value=""></option>
            ${createNativeOptionsMarkup(items, activeIndex)}
          </select>`;
};
