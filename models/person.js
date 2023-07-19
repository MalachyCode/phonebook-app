require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url =
  'mongodb+srv://Malachy:Janefrances2@cluster0.u0a5qk5.mongodb.net/phonebook-app?retryWrites=true&w=majority'

console.log('connecting to', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
    console.log(result.date)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{5}/.test(v) || /\d{2}-\d{5}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    minLength: 8,
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
