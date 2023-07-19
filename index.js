require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('dev'))

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
    console.log(JSON.stringify(res.body)),
  ].join(' ')
})

const Person = require('./models/person')
// const password = process.argv[2]

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
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  console.log(date.getDate)
  const phonebookInfoCounter = persons.reduce((acc, currPerson) => {
    if (currPerson) {
      acc += 1
    }
    return acc
  }, 0)
  response.send(`<div>Phonebook has info for ${phonebookInfoCounter} people
  <p>${date.toString()}</p></div>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))

  // const id = Number(request.params.id);
  // const person = persons.find((p) => p.id === id);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log(result)
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// const generatedId = () => {
//   // const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
//   const newId = persons.length > 0 ? Math.floor(Math.random() * 100) : 0
//   // return maxId + 1;
//   return newId
// }

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // const person = {
  //   name: body.name,
  //   number: body.number,
  // };

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (body.name === undefined) {
  //   return response.status(400).json({
  //     error: 'name missing',
  //   });
  // }
  if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log(person)

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(400).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// const PORT = process.env.PORT || 3004;
const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
