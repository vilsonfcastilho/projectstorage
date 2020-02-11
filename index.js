const express = require ('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
})

const checkProjectExists = (req, res, next) => {
  if(!req.body.name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  return next();
}

const checkProjectInArray = (req, res, next) => {
  const project = projects[req.params.index];
  if(!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  req.project = project;

  return next();
}

// List all Projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Find a Project
server.get('/projects/:index', checkProjectInArray, (req, res) => {
  return res.json(req.project);
});

// Create Project
server.post('/projects', checkProjectExists, (req, res) => {
  const { name } = req.body;

  projects.push(name);

  return res.json(projects);
});

// Edit Project
server.put('/projects/:index', checkProjectExists, checkProjectInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  projects[index] = name;

  return res.json(projects);
});

// Delete Project
server.delete('/projects/:index', (req, res) => {
  const { index } = req.params;

  projects.splice(index, 1);

  return res.json(projects);
});

server.listen(3000);