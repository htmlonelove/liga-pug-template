export function applySlideOpacity() {
  const slides = document.querySelectorAll('.slide-trend');

  slides.forEach((slide) => {
    const items = slide.querySelectorAll('.slide-trend__text > ul');

    items.forEach((item, index) => {
      const opacity = 1 - (index * 0.2);
      item.style.opacity = opacity;
      item.style.transition = 'opacity 0.3s ease';
    });
  });
}
