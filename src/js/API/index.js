export default class API {
  constructor(options) {
    this.URL = options?.URL || 'localhost';
    this.PORT = options?.PORT || 7070;
  }

  async getAll() {
    const response = await fetch(
      `http://${this.URL}:${this.PORT}?method=allTickets`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const json = await response.json();
    return json;
  }

  async changeTicket(ticketObject) {
    const response = await fetch(`http://${this.URL}:${this.PORT}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...ticketObject, method: 'changeTicket' }),
    });
    const json = await response.json();
    return json;
  }

  async getTicketFull(id) {
    const response = await fetch(
      `http://${this.URL}:${this.PORT}?method=ticketById&id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const json = await response.json();
    return json;
  }

  async addTicket(data) {
    const response = await fetch(`http://${this.URL}:${this.PORT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, method: 'createTicket' }),
    });
    const json = await response.json();
    return json;
  }

  async deleteTicket(id) {
    const response = await fetch(`http://${this.URL}:${this.PORT}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const json = await response.json();
    return json;
  }
}
