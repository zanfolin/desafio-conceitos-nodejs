const express = require("express");
const cors = require("cors");

// const toArray = require("./utils/toArray")

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, res, next) {
   const {method, url, ip } = req;

   const logLabel = `[${method.toUpperCase()}] ${url}`
   console.count('️\n#️⃣ ')
   console.log(`🖥 ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`)
   console.log(`📃 ${logLabel}`)
   console.time(`⏱`)
   next();
   console.timeEnd(`⏱`)

};

function validateId(req, res, next) {
  const {id} = req.params;

  if (!isUuid(id)) {
     return res.status(400).json({error:'Invalid project ID.'});
  };
  
  return next();
};

app.use(logRequests);
app.use('/repositories/:id', validateId);


app.get("/repositories", (req, res) => {
  return res.json(repositories);

});

app.post("/repositories", (req, res) => {
  const {title, url, techs } = req.body;

  const repository = { 
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0 
  };
  repositories.push(repository);
  
  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({error:`Repository with id ${id} not found.`});
  };

  const {
    title= repositories[repoIndex].title, 
    url=repositories[repoIndex].url, 
    techs,
  } = req.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes : repositories[repoIndex].likes
  };

  repositories[repoIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0 ) {
    return res.status(400).json({error:`Repository with id ${id} not found.`})
  }

  repositories.splice(repoIndex, 1);
  
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;
  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repoIndex < 0) {
    return res.status(400).json({error:`Repositorie with id ${id} not found.`})
  }

  repositories[repoIndex].likes++;
  
  return res.json({likes: repositories[repoIndex].likes});
});

module.exports = app;
