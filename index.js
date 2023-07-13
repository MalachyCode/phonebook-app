const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());

app.use(express.static('build'));
app.use(express.json());
app.use(morgan('dev'));

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    tokens.res(req, res, 'content'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    console.log(JSON.stringify(response.body)),
  ].join(' ');
});

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
  {
    id: 5,
    name: 'Zenzy Fredrick',
    number: '39-23-6489972',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  console.log(date.getDate);
  const phonebookInfoCounter = persons.reduce((acc, currPerson) => {
    if (currPerson) {
      acc += 1;
    }
    return acc;
  }, 0);
  response.send(`<div>Phonebook has info for ${phonebookInfoCounter} people
  <p>${date.toString()}</p></div>`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generatedId = () => {
  // const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  const newId = persons.length > 0 ? Math.floor(Math.random() * 100) : 0;
  // return maxId + 1;
  return newId;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number,
  };

  persons.concat(person);

  response.json(person);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
