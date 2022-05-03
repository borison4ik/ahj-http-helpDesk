import Field from './field';

export default class Popup {
  constructor(options) {
    this.options = options;
    this.type = this.options?.type || 'text';
    this.text = this.options?.text || 'Empty Popup';
    this.title = this.options?.title || 'Modal Popup';
    this.formNames = this.options?.names || ['name', 'description'];
  }

  render() {
    this.popupWrapper = document.createElement('div');
    this.popupWrapper.classList.add('popup__wrapper');

    this.popup = document.createElement('div');
    this.popup.className = 'popup';

    this.popupTitle = document.createElement('h2');
    this.popupTitle.className = 'popup__title';
    this.popupTitle.textContent = this.title;

    this.popupBody = document.createElement('div');
    this.popupBody.className = 'popup__body';

    if (this.type === 'text') {
      this.textElement = document.createElement('p');
      this.textElement.textContent = this.text;
      this.popupBody.appendChild(this.textElement);
    } else if (this.type === 'form' || this.type === 'edit') {
      this.popupForm = document.createElement('form');
      this.popupForm.className = 'popup__form';

      this.formNames.forEach((fieldName) => {
        const field = new Field({
          name: fieldName,
          text: fieldName,
          value: this.options[fieldName],
        });
        this.popupForm.appendChild(field.render());
      });
      this.popupBody.appendChild(this.popupForm);
    }

    this.popup.appendChild(this.popupTitle);
    this.popup.appendChild(this.popupBody);

    this.popupControls = document.createElement('div');
    this.popupControls.className = 'popup__controls';

    this.popupCancelBtn = document.createElement('button');
    this.popupCancelBtn.className = 'popup__cancel btn';
    this.popupCancelBtn.textContent = 'Cancel';
    this.popupCancelBtn.addEventListener(
      'click',
      this.onClickCancel.bind(this)
    );

    this.popupOkBtn = document.createElement('button');
    this.popupOkBtn.className = 'popup__apply btn';
    this.popupOkBtn.textContent = 'Ok';
    this.popupOkBtn.addEventListener('click', this.onClickOk.bind(this));

    this.popupControls.appendChild(this.popupCancelBtn);
    this.popupControls.appendChild(this.popupOkBtn);

    this.popup.appendChild(this.popupControls);
    this.popupWrapper.appendChild(this.popup);

    document.body.appendChild(this.popupWrapper);
    setTimeout(() => {
      document.querySelector('.popup__wrapper').classList.add('shown');
    });
  }

  onClickCancel(evt) {
    console.log('Cancel');
    document.querySelector('.popup__wrapper').classList.remove('shown');
    setTimeout(() => {
      document.body.removeChild(this.popupWrapper);
    }, 300);
  }

  onClickOk(evt) {
    console.log(this.popupForm);
    const formData = new FormData(this.popupForm);

    switch (this.type) {
      case 'text':
        document.dispatchEvent(new CustomEvent('OK'));
        break;
      case 'form':
        document.dispatchEvent(
          new CustomEvent('CREATE__TICKET', { detail: { formData } })
        );
        this.onClickCancel();
        break;
      case 'edit':
        document.dispatchEvent(
          new CustomEvent('APPLY_EDIT__TICKET', {
            detail: { formData, id: this.options?.id },
          })
        );
        this.onClickCancel();
        break;
      default:
        document.dispatchEvent(new CustomEvent('OK'));
        break;
    }
  }
}
