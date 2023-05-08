const express = require('express')

//Middlewares
const categoriesMiddleware = require('./middleware/categoryMiddlewares')
const projectMiddleware = require('./middleware/projectMiddleware')

//Controllers
const CategoryController = require('./controllers/categoryController')
const ProjectController = require('./controllers/projectController')

const router = express.Router()

//Rotas 
router.get('/teste', (req, res) => {
    res.send('Resposta de teste');
});

//--Category
router.get('/categories', CategoryController.getAll)
router.post('/categories', categoriesMiddleware.validateCategory, CategoryController.create)
router.put('/categories/:id', categoriesMiddleware.validateCategory, CategoryController.update)
router.delete('/categories/:id', categoriesMiddleware.validateCategoryDelete, CategoryController.destroy)

//--Project
router.get('/projects', ProjectController.getAll)
router.get('/projects/:id', ProjectController.getProjectById)
router.post('/projects', projectMiddleware.validateProject, ProjectController.create)
router.put('/projects/:id', projectMiddleware.validateProject, ProjectController.update)
router.delete('/projects/:id', ProjectController.destroy)

module.exports = router