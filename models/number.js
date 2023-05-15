const { response } = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const url = process.env.MONGODB_URL;
console.log("connection to : ", url);
mongoose.connect(url)
  .then(result=>{
    console.log("connected to mongodb");

  })
  .catch((error)=>{
    console.log("error connecting to mongodb ", error.message);


  })
  const phoneSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 4,
      required: true,
    },
    number: String,
})
phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model("Person",phoneSchema);