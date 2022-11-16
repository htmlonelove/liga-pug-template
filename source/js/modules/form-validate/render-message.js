export class Message {
  constructor() {
    this._baseErrorText = 'Это поле является обязательным';
    this._invalidMessageClass = 'input-message--invalid';
    this._validMessageClass = 'input-message--valid';
  }

  _messageTemplate(message, state) {
    const cssClass = state === 'valid' ? 'input-message--valid' : 'input-message--invalid';
    return `<span class="input-message ${cssClass}">${message}</span>`;
  }

  removeMessage(parent) {
    const parentMessage = parent.querySelector('.input-message');
    if (parentMessage) {
      parentMessage.remove();
    }
  }

  renderMessage(parent, message, state) {
    this.removeMessage(parent);
    parent.insertAdjacentHTML('beforeend', this._messageTemplate(message, state));
  }
}
