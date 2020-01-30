const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/**
 * Middleware que verifica se o projeto existe
 */
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) {
        return res.status(400).json({ error: 'Project not found' });
    }

    return next();
}

/**
 * Middleware que loga o número de requisições
 */
function logRequests(req, res, next) {

    console.count("Número de requisições");

    return next();
}

server.use(logRequests);

/**
 * Middleware que medi o tempo das requisições
 */
server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

/**
 * Lista todos os projetos
 */
server.get('/projects', (req, res) => {
    return res.json(projects);
})

/**
 * Request body: id, title
 * Adiciona um novo projeto
 */
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    projects.push({ "id": id, "title": title, "tasks": [] });

    return res.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto pelo id informado na requisição.
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id informado.
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1)

    return res.send();
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido pelo id; 
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title)

    return res.json(project);
});

server.listen(3000);