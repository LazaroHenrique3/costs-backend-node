//Validados de informações
const yup = require('yup');

//Controller de categoria
const categoryController = require('../controllers/categoryController')
//Controller de project
const projectController = require('../controllers/projectController')

const categorySchema = yup.object().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).required(),
});

const validateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req
      
        //Validando a estrututura da requisição
        await categorySchema.validate(body)

        //validando duplicação
        //Se for em update eu preciso enviar o id junto
        let existsCategory = null
        if(id === undefined){
            existsCategory = await categoryController.existsCategoryByName(body.name)
        } else {
            existsCategory = await categoryController.existsCategoryByName(body.name, id)
        }

        if(existsCategory){
            return res.status(409).json({msg: 'Category already exists!'})
        }

        return next()
    } catch (error) {
        return res.status(400).json({ msg: error.errors });
    }
}

const validateCategoryDelete = async (req, res, next) => {
    try {
        const { id } = req.params;

        //Verificando se existe Projetos que estão relacionados com essa categoria, se sim não posso excluir
        const existsCategoryInProjects = await projectController.existsThisCategoryInProject(id)

        if(existsCategoryInProjects){
            return res.status(409).json({msg: 'Category in use!'})
        }

        return next()
    } catch (error) {
        return res.status(500).json({msg: 'Internal error'});
    }
}


module.exports = {
    validateCategory,
    validateCategoryDelete
}