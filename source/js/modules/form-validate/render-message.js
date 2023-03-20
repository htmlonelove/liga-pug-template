export class Message {
  constructor() {
    this._baseErrorText = 'Это поле является обязательным';
  }

  _messageTemplate(message, state) {
    const cssClass = state === 'valid' ? 'is-valid' : 'is-invalid';
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
