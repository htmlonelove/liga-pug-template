import {bytesToSize} from './helper';

export const createPreviewMarkup = (file, event, options, error) => {
  const nameArray = file.name.split('.');
  const expansion = nameArray[nameArray.length - 1];

  const hasErrorClass = error ? ' is-invalid' : '';

  return `<div class="input-upload__preview-item${hasErrorClass}">
            <button class="input-upload__preview-item-remove" type="button" data-file-name="${file.name}">&times;</button>
            ${options.previewImg ? `<img class="input-upload__preview-img" src="${event.target.result}" alt="${file.name}" />` : ''}
            ${options.iconFormat ? `<img class="input-upload__preview-icon" src="${options.iconFormat[expansion] ? options.iconFormat[expansion] : options.iconFormat.default}" alt="" />` : ''}
            ${options.fileInfo ? `<div class="input-upload__preview-file-info"" />
              ${options.fileInfo.fileName ? `<span class="input-upload__preview-file-name"" />
                ${file.name}
              </span>` : ''}
              ${options.fileInfo.fileSize ? `<span class="input-upload__preview-file-size"" />
                ${bytesToSize(file.size)}
              </span>` : ''}
            </div>` : ''}
          </div>`;
};
