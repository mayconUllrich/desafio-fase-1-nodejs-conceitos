const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getIndex( request, response, next){

  const repositoryIndex = repositories.findIndex(
    repository => repository.id ===  request.params.id)

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'repository not found.'})
  } else {
    response.locals.index = repositoryIndex
    response.locals.id = request.params.id
    return next()
  }
}

app.use('/repositories/:id', getIndex)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body
  
  const id = uuid()

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  }
  
  repositories.push(repository)
  
  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  
  const { title, url, techs } = request.body

  const repository = {
    id: response.locals.id,
    title,
    url,
    techs,
    likes: repositories[response.locals.index].likes,
  }
  repositories[response.locals.index] = repository

  return response.json(repository)

});

app.delete("/repositories/:id", (require, response) => {
  repositories.splice(response.locals.index, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  
  repositories[response.locals.index].likes ++
  return response.json(repositories[response.locals.index])
    
});
  
module.exports = app;