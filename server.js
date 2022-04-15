const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const cors = require('koa-cors');

const publicPath = path.join(__dirname, '/src/public');
const app = new Koa();

app.use(cors());
app.use(
  koaBody({
    formidable: {
      uploadDir: publicPath,
      maxFileSize: 100 * 1024 * 1024,
    },
    urlencode: true,
    multipart: true,
  })
);
app.use(koaStatic(publicPath));

const DATA = {
  tickets: [
    {
      id: 1,
      name: 'Ticket',
      status: false,
      created: new Date('2012-10-3').getTime(),
    },
    {
      id: 2,
      name: 'Ticket',
      status: true,
      created: new Date('2012-10-3').getTime(),
    },
    {
      id: 3,
      name: 'Ticket',
      status: false,
      created: new Date('2012-10-3').getTime(),
    },
  ],
  descriptions: [
    {
      id: 1,
      description: '1 lorem ipsum dolor sit amet, con',
    },
    {
      id: 2,
      description: '2 lorem ipsum dolor sit amet, con',
    },
    {
      id: 3,
      description: '3 lorem ipsum dolor sit amet, con',
    },
  ],
};

function getTicketFull(id) {
  try {
    const ticket = DATA.tickets.find((t) => t.id === id);
    const { description } = DATA.descriptions.find((desc) => desc.id === id);
    return { ...ticket, description };
  } catch (err) {
    return err.message;
  }
}

function createTicket(requestBody) {
  try {
    const { name, description, status } = requestBody;
    const id = uuid();
    const created = new Date().getTime();
    DATA.tickets.push({ id, name, status, created });
    DATA.descriptions.push({ id, description });

    return true;
  } catch (err) {
    return err.message;
  }
}

app.use(async (ctx) => {
  if (ctx.method === 'GET') {
    const { method, id } = ctx.request.query;

    switch (method) {
      case 'allTickets':
        ctx.response.body = DATA.tickets;
        return;
      case 'ticketById':
        ctx.response.body = getTicketFull(id);
        return;
      default:
        ctx.response.status = 404;
        return;
    }
  } else if (ctx.method === 'POST') {
    const { method } = ctx.request.body;

    switch (method) {
      case 'createTicket':
        ctx.response.body = createTicket(ctx.request.body);
        return;
      default:
        ctx.response.status = 404;
        return;
    }
  }
});

const server = http.createServer(app.callback()).listen(7070);
