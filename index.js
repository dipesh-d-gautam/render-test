const express = require("express")
const app = express()

const cors = require("cors")
app.use(cors())

const morgan = require("morgan")
app.use(express.json())
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

const generateId = () => {
  const maxId = persons.length
    ? Math.max(...persons.map((person) => person.id))
    : 0
  const newId = maxId + 1
  return newId
}

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/api/info", (req, res) => {
  const numOfPeople = persons.length
  res.send(`<p>Phonebook has info for ${numOfPeople} people</p>${new Date()}`)
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const index = persons.findIndex((person) => person.id === id)
  if (index !== -1) {
    persons.splice(index, 1)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    })
  }
  const nameAlreadyExists = persons.find((person) => {
    return person.name.toLowerCase() === body.name.toLowerCase()
  })
  if (nameAlreadyExists) {
    return res.status(400).json({
      error: "name must be unique",
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  const updatedPersons = persons.concat(person)
  res.json(updatedPersons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
