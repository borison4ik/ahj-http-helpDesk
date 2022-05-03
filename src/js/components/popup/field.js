export default class Field {
  constructor(options) {
    this.inputType = options?.inputType || 'text';
    if (!options?.name) {
      throw new Error('Field must have name');
    }
    this.name = options?.name;
    this.text = options?.text || 'empty';
    this._value = options?.value || '';
  }

  render() {
    this.popupFormFiled = document.createElement('div');
    this.popupFormFiled.className = 'popup__form_filed';
    this.input = document.createElement('input');
    this.input.type = this.inputType;
    this.input.id = `form__${this.name}`;
    this.input.name = this.name;
    this.input.value = this.value;
    this.validate();
    this.input.addEventListener('input', this.onInputHandler.bind(this));
    this.label = document.createElement('label');
    this.label.for = this.input.id;
    this.label.textContent = this.text;

    this.popupFormFiled.appendChild(this.input);
    this.popupFormFiled.appendChild(this.label);

    return this.popupFormFiled;
  }

  get value() {
    return this._value;
  }

  onInputHandler() {
    this._value = this.input.value;
    this.validate();
  }

  validate() {
    if (this.value !== '') {
      this.input.classList.add('filed');
    } else {
      this.input.classList.remove('filed');
    }
  }
}
