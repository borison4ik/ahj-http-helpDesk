import Ticket from './components/ticket';
import Popup from './components/popup';

import API from './API';

window.onload = async () => {
  const server = new API();
  const ticketsList = document.querySelector('.tickets__list');
  const addTicketBtn = document.getElementById('add__ticket');
  const popupEl = document.getElementById('popup');

  let response;

  try {
    response = await server.getAll();
    render(response);
  } catch (err) {
    console.log(err.message);
  }

  listeners();

  function render(res) {
    if (res.status !== 'success') {
      return;
    }

    ticketsList.innerHTML = '';

    res.data.forEach((item) => {
      const ticket = new Ticket(item);
      ticketsList.appendChild(ticket.render());
    });
  }

  async function checkTicket(evt) {
    const { id, status } = evt.detail;
    const ticket = await server.changeTicket({ id, status });
  }

  async function getTicketFull(evt) {
    const { id } = evt.detail;
    const res = await server.getTicketFull(id);
    if (res.status === 'success') {
      const { description } = res.data;
      const ticketEl = document.querySelector(`[data-id="${id}"]`);
      const descriptionEl = ticketEl.querySelector('.description');
      descriptionEl.textContent = description;
      ticketEl.classList.add('open');
    }
  }

  async function createTicket(evt) {
    console.log('create new ticket', evt.detail.formData);
    const { formData } = evt.detail;
    const tiket = {};
    formData.forEach((value, key) => {
      tiket[key] = value;
    });
    console.log(tiket);

    try {
      const newTicket = await server.addTicket(tiket);
      ticketsList.appendChild(new Ticket(newTicket.data).render());
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteTicket(evt) {
    const { id } = evt.detail;

    try {
      const res = await server.deleteTicket(id);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function editTicket(evt) {
    const { id, name } = evt.detail;
    const res = await server.getTicketFull(id);
    const { description } = await res.data;
    console.log('description', description);
    const popup = new Popup({ type: 'edit', name, description, id });
    popup.render();
  }

  async function applyEditTicket(evt) {
    console.log(evt.detail);
    const { formData, id } = evt.detail;

    const tiket = {};
    formData.forEach((value, key) => {
      tiket[key] = value;
    });

    const editedTicket = await server.changeTicket({ ...tiket, id });
    response = await server.getAll();
    render(response);
  }

  function addNewTicket() {
    const popup = new Popup({ type: 'form' });
    popup.render();
  }

  function listeners() {
    addTicketBtn.addEventListener('click', addNewTicket);
    document.addEventListener('CHECK__TICKET', checkTicket);
    document.addEventListener('GET_FULL_TICKET', getTicketFull);
    document.addEventListener('CREATE__TICKET', createTicket);
    document.addEventListener('DELETE__TICKET', deleteTicket);
    document.addEventListener('EDIT__TICKET', editTicket);
    document.addEventListener('APPLY_EDIT__TICKET', applyEditTicket);
  }
};
