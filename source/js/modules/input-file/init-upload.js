import {Upload} from './upload.js';

const uploadFileBlock = document.querySelector('[data-upload="file"]');
const uploadImageDropBlock = document.querySelector('[data-upload="img-drop"]');

export const uploadFile = () => new Upload(uploadFileBlock, {
  uploadLength: 5,
  preview: true,
  maxFullSize: 1048576,
  accept: ['.pdf', '.docx', '.xlsx'],
  iconFormat: {
    xlsx: './img/file/icon-file-xlsx.png',
    docx: './img/file/icon-file-docx.png',
    pdf: './img/file/icon-file-pdf.png',
    default: './img/file/icon-file-docx.png',
  },
  fileInfo: {
    fileName: true,
    fileSize: true,
  },
  successMessage: 'Файлы добавлены',
  emptyMessage: 'Добавление файла обязательно',
  errorMessage: 'Общий размер файлов слишком большой',
});

export const uploadImageDrop = () => new Upload(uploadImageDropBlock, {
  uploadLength: 4,
  dropZone: true,
  previewImg: true,
  maxFileSize: 1048576,
  accept: ['.png', '.jpg', '.jpeg', '.webp'],
  iconFormat: {
    png: './img/file/icon-file-png.png',
    jpg: './img/file/icon-file-jpg.png',
    jpeg: './img/file/icon-file-jpg.png',
    webp: './img/file/icon-file-webp.png',
    default: './img/file/icon-file-docs.png',
  },
  fileInfo: {
    fileName: true,
    fileSize: true,
  },
  successMessage: 'Файлы добавлены',
  emptyMessage: 'Добавление файла обязательно',
  errorMessage: 'Выделенные файлы превышают максимальный размер',
});
