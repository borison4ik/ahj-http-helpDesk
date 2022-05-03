export default class Ticket {
  constructor(data) {
    this.id = data?.id;
    this.created = data?.created;
    this.name = data?.name;
    this.description = data?.description;
    this.status = data?.status;
  }

  render() {
    this.li = document.createElement('li');
    this.li.className = 'ticket__item';
    this.li.dataset.id = this.id;

    this.label = document.createElement('label');
    this.label.className = 'ticket__done';
    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.checked = this.status === 'true';
    this.input.addEventListener('change', this.onChackboxHandler.bind(this));
    this.span = document.createElement('span');
    this.span.className = 'done__icon';
    this.label.appendChild(this.input);
    this.label.appendChild(this.span);

    this.ticketText = document.createElement('div');
    this.ticketText.className = 'ticket__text';
    this.textEl = document.createElement('p');
    this.textEl.className = 'text';
    this.textEl.textContent = this.name;
    this.descriptionEl = document.createElement('p');
    this.descriptionEl.className = 'description';
    this.descriptionEl.textContent = this.description;
    this.ticketText.appendChild(this.textEl);
    this.ticketText.appendChild(this.descriptionEl);
    this.ticketText.addEventListener(
      'click',
      this.onTaskClickHandler.bind(this)
    );

    this.ticketDate = document.createElement('div');
    this.ticketDate.className = 'ticket__date';
    this.ticketDate.textContent = this.formatDate(this.created);

    this.buttonEdit = document.createElement('button');
    this.buttonEdit.className = 'ticket__edit control';
    this.buttonEdit.type = 'button';
    this.buttonEdit.innerHTML = '<span class="hide">edit</span>';
    this.buttonEdit.addEventListener('click', this.onClickEdit.bind(this));

    this.buttonDelete = document.createElement('button');
    this.buttonDelete.className = 'ticket__delete control';
    this.buttonDelete.type = 'button';
    this.buttonDelete.innerHTML = '<span class="hide">delete</span>';
    this.buttonDelete.addEventListener('click', this.onClickDelete.bind(this));

    this.li.appendChild(this.label);
    this.li.appendChild(this.ticketText);
    this.li.appendChild(this.ticketDate);
    this.li.appendChild(this.buttonEdit);
    this.li.appendChild(this.buttonDelete);

    return this.li;
  }

  onChackboxHandler(evt) {
    this.status = evt.currentTarget.checked ? 'true' : 'false';
    document.dispatchEvent(
      new CustomEvent('CHECK__TICKET', {
        detail: { id: this.id, status: this.status },
      })
    );
  }

  onTaskClickHandler(evt) {
    document.dispatchEvent(
      new CustomEvent('GET_FULL_TICKET', { detail: { id: this.id } })
    );
  }

  onClickEdit(evt) {
    console.log('this.description', this.description);
    document.dispatchEvent(
      new CustomEvent('EDIT__TICKET', {
        detail: { id: this.id, name: this.name },
      })
    );
  }

  onClickDelete(evt) {
    this.li.remove();
    document.dispatchEvent(
      new CustomEvent('DELETE__TICKET', { detail: { id: this.id } })
    );
  }

  formatDate(timecode) {
    const date = new Date(timecode);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
    const year = String(date.getFullYear()).slice(-2);
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const formated = `${day}.${month}.${year} ${h}:${m}`;

    return formated;
  }
}
