// v 0.0.1

const testInstruments = () => {
  // создание панели
  const panel = document.createElement('div');
  panel.classList = 'ts-panel';

  // кнопка для переполнения
  const more = document.createElement('button');
  more.type = 'button';
  more.textContent = 'проверить переполнение';
  more.classList = 'ts-btn ts-btn--more';
  panel.appendChild(more);

  // кнопка для включения свободного редактирования контента
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.textContent = 'включить редактирование';
  edit.classList = 'ts-btn ts-btn--edit';
  panel.appendChild(edit);

  // кнопка для удаления картинок
  const image = document.createElement('button');
  image.type = 'button';
  image.textContent = 'проверить картинки';
  image.classList = 'ts-btn ts-btn--image';
  panel.appendChild(image);

  // кнопка для обводки элементов
  const outline = document.createElement('button');
  outline.type = 'button';
  outline.textContent = 'обвести элементы';
  outline.classList = 'ts-btn ts-btn--outline';
  panel.appendChild(outline);

  // кнопка для скрытия панели
  const hide = document.createElement('button');
  hide.type = 'button';
  hide.textContent = 'скрыть';
  hide.classList = 'ts-btn ts-btn--hide';
  panel.appendChild(hide);

  // кнопка для ссылок
  const href = document.createElement('button');
  href.type = 'button';
  href.textContent = 'ссылки и кнопки';
  href.classList = 'ts-btn ts-btn--href';
  panel.appendChild(href);

  // консоль
  const con = document.createElement('div');
  con.classList = 'ts-console';
  panel.appendChild(con);

  // вставка панели в страницу
  const body = document.body;
  body.appendChild(panel);

  // переполнение контентом
  more.onclick = () => {
    let allNodes = document.body.querySelectorAll('*');
    allNodes = [...allNodes];
    allNodes = allNodes.filter(textNodes);
    allNodes = allNodes.filter(textNodesWithString);

    if (allNodes.length !== 0) {
      allNodes.forEach((node) => {
        if (
          !node.classList.contains('ts-panel') && 
          !node.classList.contains('ts-btn')
        ) {
          node.textContent = node.textContent + " " + node.textContent;
        }
      });
    }

    if (more.dataset.count) {
      more.textContent = "проверить переполнение(" + ++more.dataset.count + ")";
    } else {
      more.dataset.count = 1;
      more.textContent = "проверить переполнение(1)";
    }
  }

  // функция для фильтрации по типам нод. Убираем те, где текста быть не может.
  function textNodes(node) {
    return node.nodeName !== 'SCRIPT' && node.nodeName !== 'svg' && node.nodeName !== 'defs' && node.nodeName !== 'rect' && node.nodeName !== 'pattern' && node.nodeName !== 'use' && node.nodeName !== 'symbol' && node.nodeName !== 'path' && node.nodeName !== 'circle' && node.nodeName !== 'IMG' && node.nodeName !== 'image' && node.nodeName !== 'video' && node.nodeName !== 'IFRAME' && node.nodeName !== 'PICTURE' && node.nodeName !== 'SOURCE';
  }

  // функция фильтрация по строке. Если в ноде нет тескта, либо много переносов, значит это родительская нода
  function textNodesWithString(node) {
    return node.textContent !== '' && (node.textContent.match(/\n/g)||[]).length == 0;
  }

  // свободное редактирование
  edit.onclick = () => {
    const body = document.body;

    if (body.isContentEditable) {
      body.contentEditable = 'false';
      edit.textContent = 'включить редактирование';
    } else {
      body.contentEditable = 'true';
      edit.textContent = 'выключить редактирование';
    }
  }

  // анализ картинок
  image.onclick = () => {
    const images = document.querySelectorAll('img');
    if (images.length !== 0) {
      let pictureCount = 0;
      let mediaCount = 0;
      let webpCount = 0;
      let retinaCount = 0;
      let imagesCount = 0;

      images.forEach((image) => {
        imagesCount++;
        const parent = image.parentNode;
        if (parent.nodeName == "PICTURE") {
          pictureCount++;

          let children = [...parent.childNodes].filter(onlySource);

          // проверяем детей на кадрирование. 
          children.forEach((child) => {
            if (child.media !== '') {
              mediaCount++;
            }
            return;
          });

          // проверяем детей на webp. 
          children.forEach((child) => {
            if (child.type == 'image/webp') {
              webpCount++;
            }
            return;
          });

          // проверяем детей на ретину. 
          children.forEach((child) => {
            if (child.srcset !== '') {
              retinaCount++;
            }
            return;
          });

          // проверяем детей на ретину. 
          children.forEach((child) => {
            child.remove();
          });

          image.src = "";
          image.srcset = "";
        } else {
          if (image.srcset !== '') {
            retinaCount++;
          }

          image.src = "";
          image.srcset = "";
        }

      });

      con.textContent = con.textContent + "Количество картинок: " + imagesCount + "\r\n";
      con.textContent = con.textContent + "Количество picture: " + pictureCount + "\r\n";
      con.textContent = con.textContent + "Встречается кадрирование: " + mediaCount + "\r\n";
      con.textContent = con.textContent + "Количество webp: " + webpCount + "\r\n";
      con.textContent = con.textContent + "Количество ретинизации: " + retinaCount + "\r\n";
    }
  }

  // функция фильтрация нодам, оставляет только source
  function onlySource(node) {
    return node.nodeName == 'SOURCE';
  }

  // обводка элементов
  outline.onclick = () => {
    let allNodes = document.body.querySelectorAll('*');
    allNodes = [...allNodes];

    if (allNodes.length !== 0) {
      allNodes.forEach((node) => {
        if (
          !node.classList.contains('ts-panel') && 
          !node.classList.contains('ts-btn') &&
          !node.classList.contains('ts-console')
        ) {
          node.style.outline = '1px solid rgba(231, 46, 139, 1)'; 
        }
      });
    }
  }

  // скрытие и открытие панели
  const panelBoard = document.querySelector('.ts-panel');

  hide.onclick = () => {
    if (panelBoard) {
      panelBoard.classList.add('ts-panel--close');
    }   
  }

  panelBoard.onclick = (event) => {
    if (panelBoard.classList.contains('ts-panel--close') && event.target == panelBoard) {
      panelBoard.classList.remove('ts-panel--close');
    }
  }

  // аналитика по ссылкам
  href.onclick = () => {
    const a = document.querySelectorAll('a');
    const b = document.querySelectorAll('button');

    let hrefCount = 0;
    let hrefEmptyCount = 0;
    let btnCount = 0;
    let btnTypeCount = 0;

    a.forEach((item) => {
      hrefCount++;
      if (item.textContent == '') {
        hrefEmptyCount++;
      }
    });

    b.forEach((item) => {
      if (!item.classList.contains('ts-btn')) {
        btnCount++;
        console.log(item.innerText);
        if (item.innerText == '') {
          con.textContent = con.textContent + "Контент кнопки: пустая." + item.classList + "\r\n";
        } else {
          con.textContent = con.textContent + "Контент кнопки: " + item.innerText + "\r\n";
        }
        
        if (!item.type) {
          btnTypeCount++;
        }
      }
    });

    con.textContent = con.textContent + "Количество ссылок " + hrefCount + "\r\n";
    con.textContent = con.textContent + "Количество пустых ссылок " + hrefEmptyCount + "\r\n";
    con.textContent = con.textContent + "Количество кнопок " + btnCount + "\r\n";
    con.textContent = con.textContent + "Количество кнопок без типа  " + btnTypeCount + "\r\n";

  }

};

export {testInstruments};
