const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// HELPERS
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

// MIDDLEWARES
function verifyIfCPFExists(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({error: "No customer with that CPF"})
  }

  request.customer = customer;

  return next();
}

// GET ROUTES
app.get('/statement', verifyIfCPFExists, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.get('/statement/date', verifyIfCPFExists, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) => statement.createdAt.toDateString() === new Date(dateFormat).toDateString())

  return response.json(statement);
});

app.get('/account', verifyIfCPFExists, (request, response) => {
  const { customer } = request;

  return response.json(customer);
});

app.get('/balance', verifyIfCPFExists, (request, response) => {
  const { customer } = request;

  const balance = getBalance(customer.statement);

  return response.json({balance});
});

// POST ROUTES
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const customerExists = customers.some((customer) => customer.cpf === cpf);

  if (customerExists) {
    return response.status(400).json({error: "Customer Already exists!"});
  }

  const id = uuidv4();

  customers.push({
    cpf, 
    name, 
    id, 
    statement: [],
  });

  return response.status(201).send();
});

app.post('/deposit', verifyIfCPFExists, (request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    createdAt: new Date(),
    type: 'credit',
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
})

app.post('/withdraw', verifyIfCPFExists, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({error: "Insufficient funds!"});
  }

  const statementOperation = {
    amount,
    createdAt: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
})

// PUT ROUTES
app.put('/account', verifyIfCPFExists, (request, response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;
  
  return response.status(201).send();
})

// DELETE ROUTES
app.delete('/account', verifyIfCPFExists, (request, response) => {
  const { customer } = request;

  customers.splice(customer, 1)
  
  return response.status(204);
})

app.listen(3333, () => {
  console.log('🚀 SERVER STARTED AT PORT 3333 🚀')
});