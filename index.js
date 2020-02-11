const express = require ('express');

const server = express();

server.use(express.json());

const projects = [];

// Middleware to see if the Project exists
const checkProjectExists = (req, res, next) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

// Middleware to count the number of requests
const logRequests = (req, res, next) => {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

// List all Projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Create Project
server.post('/projects', (req, res) => {
  const { id, name } = req.body;

  const project = {
    id,
    name,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// Edit Project
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const project = projects.find(p => p.id == id);

  project.name = name;

  return res.json(project);
});

// Delete Project
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// Add new Project Task
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(name);

  return res.json(project);
});

server.listen(3000);