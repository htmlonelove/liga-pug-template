const setLimitationError = (limitation) => {
  // eslint-disable-next-line no-console
  console.error(`Переданный формат ограничения(data-limitation="${limitation}") - не поддерживается. Проверьте корректность введённых значений.`);
};

export const getLimitationsRegEx = (limitation) => {
  switch (limitation) {
    case 'digit':
      return /[^\d]/g;
    case 'name':
      return /[^a-zA-Zа-яёА-ЯЁ\-\s]/g;
    case 'letters':
      return /[^a-zA-Zа-яёА-ЯЁ\s]/g;
    case 'letters-and-digit':
      return /[^a-zA-Zа-яёА-ЯЁ\s\d]/g;
    case 'cyrillic':
      return /[^а-яёА-ЯЁ\s]/g;
    case 'latin':
      return /[^a-zA-Z\s]/g;
    default:
      return setLimitationError(limitation);
  }
};

export const getMatrixLimitationsRegEx = (matrix) => {
  switch (matrix) {
    case 'digit':
      return /[^\d]/g;
    case 'name':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z\-]]/g;
    case 'letters':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z]/g;
    case 'letters-and-digit':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z\d]/g;
    case 'cyrillic':
      return /[^\а-яё\А-ЯЁ]/g;
    case 'latin':
      return /[^\a-z\A-Z]/g;
    default:
      return false;
  }
};

export const getMailRegEx = () => /[a-zA-Zа-яёА-ЯЁ0-9]{1}([a-zA-Zа-яёА-ЯЁ0-9\-_\.]{1,})?@[a-zA-Zа-яёА-ЯЁ0-9\-]{1}([a-zA-Zа-яёА-ЯЁ0-9.\-]{1,})?[a-zA-Zа-яёА-ЯЁ0-9\-]{1}\.[a-zA-Zа-яёА-ЯЁ]{2,6}/;
