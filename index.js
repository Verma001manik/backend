const express  = require('express');
const app = express();
const cors =  require('cors');

const morgan = require('morgan');
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get("/", (request,response)=>{
    response.send("<h1>hey</h1>");
})
app.get("/api/persons", (request,response)=>{
    response.json(persons);
})
app.get("/api/persons/:id", (request,response)=>{
    let id = Number(request.params.id);
    let person = persons.find(person=> person.id == id)
    if(person){
        response.json(person);
        
    }
    else{
        response.status(404).end();
    }
})
    app.get("/info", (request, response) => {
        let length = persons.length;
        let currentDate = new Date();
        console.log(length);
        response.send(`<p>Number of phone numbers are ${length}. Request received at ${currentDate}.</p>`);
      });

    app.delete("/api/persons/:id", (request,response)=>{
        let id = request.params.id;
        let persons = persons.filter(person=> person.id!==id);
        response.status(204).end();
    })
    const generateId = ()=>{
        const maxId = persons.length> 0
          ? Math.max(...persons.map(p => p.id))
          : 0
        return maxId + 1 ;
    }
    app.post("/api/persons", (request, response) => {
      let body = request.body;
      let name = body.name;
      let number = body.number;
    
      if (!name || !number) {
        return response.status(400).json({
          error: "name or number is missing"
        });
      } else if (persons.find(person => person.name === name)) {
        return response.status(400).json({
          error: "name is already present"
        });
      }
    
      const person = {
        name: name,
        number: number,
        id: generateId()
      };
    
      persons = persons.concat(person);
      response.json(person);
    });
    
      
    const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }
    
    app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})