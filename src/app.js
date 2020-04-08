const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // retorna todos os repositorios da aplicação
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {

  // receber as informações do corpo da requisição body
  const { title, url, techs } = request.body

  // criar o objeto repository
  const repository = {
    title,
    url,
    techs,
    likes: 0,
  }

  // anexar o repositório criado a Array repositories
  repositories.push(repository)

  //retorne um json com repositorio criado
  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  
  // fazer um update
  // pegar a id na requisição dos parametros
  const { id } = request.params

  // pegar o titulo e a url do corpo
  const { title, url } = request.body

  // selecionar o repositorio
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  //não permitir fazer update em um repositorio que nao existe
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }
  // fazer as alterações
  // criar um novo repositorio com os novos dados
  const repository = {
    title,
    url,
  }
  // salvar
  repositories[repositoryIndex] = repository
    // retorno

  response.status(200).json(repository)


  
});

app.delete("/repositories/:id", (req, res) => {

  //Pegar o id
  const { id } = req.params
  
  // Filtrar pelo id
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  // verifica se repositoryindex não esta vazio status(400) erro
  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'repository not found.'})
  }

  // excluir projeto
  repositories.splice(repositoryIndex, 1)

  // retorno status-204: retorna vaziu, porem OK.
  return res.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  // pegar o id do route params
  const { id } = request.params

  // encontrar o repositorio para add like
  const repository = repositories.find(repository => repository.id === id)

  // verifica se o repositorio existe
  if (!repository) {
    return response.status(400).send()
  }
  // add like
  repository.likes ++;

  //retorno
  return response.json(repository)
});

module.exports = app;