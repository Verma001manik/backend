const express  = require('express');
const app = express();
const cors =  require('cors');
require('dotenv').config();

const Person = require('./models/number');
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger);
const morgan = require('morgan');


app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());  
app.use(express.static('build'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    return response.status(400).json({ error: error.message })  }

  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
function validatePhoneNumber(phoneNumber) {
  const pattern = /^\d{2,3}-\d{6,}$/; // regular expression pattern to match phone number format
  return pattern.test(phoneNumber);
}


// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }
app.get("/", (request,response)=>{
    response.send("<h1>fuck you nigga</h1>");
})
app.get("/api/persons", (request,response)=>{
  Person.find({}).then(result=>{
    response.json(result);
  })

    
})
app.get("/api/persons/:id", (request,response,next)=>{
    Person.findById(request.params.id).then(result=>{
      if(result){
        response.json(result)
      }else{
        response.status(404).end();
      }
    })
    .catch(error=>{
      next(error);
})
})
    app.get("/info", (request, response) => {
        // let length = persons.length;
        let currentDate = new Date();
        // console.log(length);
        response.send(`<p> Request received at ${currentDate}.</p>`);
      });

    app.delete("/api/persons/:id", (request,response,next)=>{
      Person.findByIdAndRemove(request.params.id)
        .then(result=>{
          response.status(204).end()

        })
        .catch(error=>{
          next(error);
        })
        
        ;
    })
    
    app.post("/api/persons", (request, response,next) => {
      let {name , number} = request.body;
      if(!name || !number){
        return response.status(400).json({error:'Name or phone number  missing'});

      }
      if (!validatePhoneNumber(number)) {
        return response.status(400).json({ error: 'Invalid phone number format' });
      }
      
      else{
        const person = new Person({
          name: name,
          number:number

        })
        person.save().then(savedPerson=>{
          response.json(savedPerson);
        })
        .catch(error=>{
          next(error);
        })
      

      }

    });
    
  
    app.use(unknownEndpoint)
    app.use(errorHandler)
    
    
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})