import {createElement, renderElement} from './render';
import {createPreviewContainerMarkup} from './create-preview-container-markup';
import {createMessageMarkup} from './create-message-markup';
import {createPreviewMarkup} from './create-preview-markup';

export class Upload {
  constructor(uploadBlock, options = {}) {
    this._uploadBlock = uploadBlock;
    if (!this._uploadBlock) {
      return;
    }
    this._options = options;
    this._formParent = this._uploadBlock.closest('form');
    this._maxFileSize = this._options.maxFileSize ? this._options.maxFileSize : false;
    this._maxFullSize = this._options.maxFullSize ? this._options.maxFullSize : false;
    this._dropZone = this._options.dropZone ? this._options.dropZone : false;
    this._renderPreview = this._options.preview ? this._options.preview : false;
    this._uploadLength = this._options.uploadLength ? this._options.uploadLength : 1;
    this._accept = this._options.accept ? this._options.accept : false;
    this._emptyMessage = this._options.emptyMessage ? this._options.emptyMessage : false;
    this._errorMessage = this._options.errorMessage ? this._options.errorMessage : false;
    this._successMessage = this._options.successMessage ? this._options.successMessage : false;
    this._input = this._uploadBlock.querySelector('input');
    this._dropZoneBlock = this._dropZone ? this._uploadBlock.querySelector('[data-drop-zone]') : false;
    this._previewBlock = null;
    this._files = [];
    this._message = null;

    this._onDropZoneBlockDragover = this._onDropZoneBlockDragover.bind(this);
    this._onDropZoneBlockDragenter = this._onDropZoneBlockDragenter.bind(this);
    this._onDropZoneBlockDragleave = this._onDropZoneBlockDragleave.bind(this);
    this._onDropZoneBlockDrop = this._onDropZoneBlockDrop.bind(this);
    this._onDropZoneBlockClick = this._onDropZoneBlockClick.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
    this._onPreviewBlockClick = this._onPreviewBlockClick.bind(this);
    this._onFormParentReset = this._onFormParentReset.bind(this);
    this._onFormParentSubmit = this._onFormParentSubmit.bind(this);
    this._init();
  }

  _overwriteFileList() {
    const dataTransfer = new DataTransfer();
    this._files.forEach((file) => dataTransfer.items.add(file));
    this._input.files = dataTransfer.files;
  }

  _changeDropZoneBlock() {
    if (this._files.length) {
      this._dropZoneBlock.classList.add('not-empty');
      return;
    }
    this._dropZoneBlock.classList.remove('not-empty');
  }

  _checkAccept(file) {
    let flag = false;
    this._accept.forEach((item) => {
      if (file.name.endsWith(item)) {
        flag = true;
      }
    });
    return flag;
  }

  _renderMessage(message) {
    if (this._message) {
      this._message.remove();
    }
    this._message = createElement(createMessageMarkup(message));
    renderElement(this._uploadBlock, this._message);
  }

  _renderFiles() {
    let error = false;
    if (this._accept) {
      this._files = this._files.filter((file) => this._checkAccept(file));
    }

    this._overwriteFileList();

    error = this._maxFullSize ? this._checkFullSize(this._files) > this._maxFullSize : false;

    if (this._previewBlock) {
      this._previewBlock.innerHTML = '';
    }

    if (this._dropZoneBlock) {
      this._changeDropZoneBlock();
    }

    this._files.forEach((file) => {
      const fileSizeError = this._maxFileSize ? file.size > this._maxFileSize : false;
      if (fileSizeError) {
        error = true;
      }
      const reader = new FileReader();
      if (this._previewBlock) {
        reader.addEventListener('load', (readerEvent) => {
          renderElement(this._previewBlock, createElement(createPreviewMarkup(file, readerEvent, this._options, fileSizeError)));
        });
      }
      reader.readAsDataURL(file);
    });

    if (error) {
      this._uploadBlock.classList.add('is-invalid');
      if (this._errorMessage) {
        this._renderMessage(this._errorMessage);
      }
    } else {
      this._uploadBlock.classList.remove('is-invalid');
      if (this._message) {
        this._message.remove();
        this._message = null;
      }
    }
  }

  _checkFullSize(array) {
    let fullSize = 0;
    array.forEach((item) => {
      fullSize += item.size;
    });
    return fullSize;
  }

  reset() {
    this._uploadBlock.classList.remove('is-invalid');
    this._uploadBlock.classList.remove('is-valid');
    if (this._dropZoneBlock) {
      this._dropZoneBlock.classList.remove('not-empty');
    }
    this._uploadBlock.querySelectorAll('.is-invalid').forEach((item) => item.classList.remove('is-invalid'));
    this._uploadBlock.querySelectorAll('.is-valid').forEach((item) => item.classList.remove('is-valid'));
    this._files = [];
    if (this._previewBlock) {
      this._previewBlock.innerHTML = '';
    }

    if (this._message) {
      this._message.remove();
      this._message = null;
    }
  }

  _onFormParentReset() {
    this.reset();
  }

  _onFormParentSubmit() {
    if (!this._files.length && this._emptyMessage) {
      this._renderMessage(this._emptyMessage);
    }
  }

  _onPreviewBlockClick(event) {
    if (!event.target.dataset.fileName) {
      return;
    }

    const name = event.target.dataset.fileName;
    this._files = this._files.filter((file) => file.name !== name);
    this._overwriteFileList();
    this._previewBlock.querySelector(`[data-file-name="${name}"]`).parentElement.remove();
    if (this._dropZoneBlock) {
      this._changeDropZoneBlock();
    }
    const fullSizeError = this._maxFullSize ? this._checkFullSize(this._files) > this._maxFullSize : false;
    if (fullSizeError) {
      this._uploadBlock.classList.add('is-invalid');
      if (this._errorMessage) {
        this._renderMessage(this._errorMessage);
      }
    } else {
      this._uploadBlock.classList.remove('is-invalid');
      if (this._message) {
        this._message.remove();
        this._message = null;
      }
    }
  }

  _onDropZoneBlockClick(event) {
    if (event.target.dataset.fileName || event.target.closest('.input-upload__preview')) {
      return;
    }
    this._input.click();
  }

  _onDropZoneBlockDragover(event) {
    event.preventDefault();
    if (this._dropZoneBlock.classList.contains('is-drag')) {
      return;
    }
    this._dropZoneBlock.classList.add('is-drag');
  }

  _onDropZoneBlockDragenter(event) {
    event.preventDefault();
    if (!this._dropZoneBlock.classList.contains('is-drag')) {
      return;
    }
    this._dropZoneBlock.classList.remove('is-drag');
  }

  _onDropZoneBlockDragleave(event) {
    event.preventDefault();
    if (!this._dropZoneBlock.classList.contains('is-drag')) {
      return;
    }
    this._dropZoneBlock.classList.remove('is-drag');
  }

  _onDropZoneBlockDrop(event) {
    event.preventDefault();
    this._dropZoneBlock.classList.remove('is-drag');
    if (!event.dataTransfer.files.length) {
      return;
    }
    this._files = [...this._files, ...event.dataTransfer.files].slice(0, this._uploadLength);
    this._renderFiles();
  }

  _onInputChange(event) {
    if (!event.target.files.length) {
      return;
    }

    this._files = [...this._files, ...event.target.files].slice(0, this._uploadLength);
    this._renderFiles();
  }

  _init() {
    this._input.addEventListener('change', this._onInputChange);

    if (this._uploadLength > 1) {
      this._input.setAttribute('multiple', '');
    }

    if (this._accept) {
      this._input.setAttribute('accept', this._accept);
    }

    if (this._dropZoneBlock) {
      this._previewBlock = createElement(createPreviewContainerMarkup(this._options));
      this._previewBlock.addEventListener('click', this._onPreviewBlockClick);
      this._dropZoneBlock.addEventListener('dragover', this._onDropZoneBlockDragover);
      this._dropZoneBlock.addEventListener('dragenter', this._onDropZoneBlockDragenter);
      this._dropZoneBlock.addEventListener('dragleave', this._onDropZoneBlockDragleave);
      this._dropZoneBlock.addEventListener('drop', this._onDropZoneBlockDrop);
      this._dropZoneBlock.addEventListener('click', this._onDropZoneBlockClick);
      renderElement(this._dropZoneBlock, this._previewBlock);
    }
    if (this._renderPreview) {
      this._previewBlock = createElement(createPreviewContainerMarkup(this._options));
      this._previewBlock.addEventListener('click', this._onPreviewBlockClick);
      renderElement(this._uploadBlock, this._previewBlock);
    }

    if (this._formParent) {
      this._formParent.addEventListener('reset', this._onFormParentReset);
      this._formParent.addEventListener('submit', this._onFormParentSubmit);
    }
  }
}
