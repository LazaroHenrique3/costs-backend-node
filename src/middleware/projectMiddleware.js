//Validados de informações
const yup = require('yup');

//Controller de project
const projectController = require('../controllers/projectController')
//Controller de category
const categoryController = require('../controllers/categoryController')

const projectSchema = yup.object().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).required(),
    budget: yup.number().positive().required(),
    category: yup.string().required(),
    cost: yup.number().required(),
    services: yup.array().of(
        yup.object().shape({
            name: yup.string().notRequired(),
            cost: yup.number().notRequired(),
            description: yup.string().notRequired()
        })
    ).notRequired()
});

const projectSchemaUpdate = yup.object().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).required(),
    budget: yup.number().positive().required(),
    category: yup.string().required(),
    cost: yup.number().required(),
    services: yup.array().of(
        yup.object().shape({
            name: yup.string().required(),
            cost: yup.number().required(),
            description: yup.string().required()
        })
    ).test('unique-names', 'Service names must be unique', (services) => {
        //Validndo para não repetir os names dentro dos services
        const names = services.map(service => service.name);
        const uniqueNames = new Set(names);
        return names.length === uniqueNames.size;
    }).test('budget', 'The total cost of the project cannot be greater than the budget', function() {
        //Validando se a regra de orçamento de fato está sendo respeitada
        const totalCost = this.parent.services.reduce((total, service) => total + service.cost, 0);
        return totalCost <= this.parent.budget;
    }).notRequired()
});

const validateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req

        //Validando a estrututura da requisição
        if (body.services.length === 0) {
            //Sendo assim os services podem ser notRequired
            await projectSchema.validate(body)
        } else {
            //caso contrario eu preciso validar eles
            await projectSchemaUpdate.validate(body)
        }

        //validando duplicação
        //Se for em update eu preciso enviar o id junto
        let existsProject = null
        if (id === undefined) {
            existsProject = await projectController.existsProjectByName(body.name)
        } else {
            existsProject = await projectController.existsProjectByName(body.name, id)
        }

        if (existsProject) {
            return res.status(409).json({ msg: 'Project already exists!' })
        }

        //Verificando se a category passada é valida
        const existsCategory = await categoryController.existsCategoryById(body.category)
        if (!existsCategory) {
            return res.status(404).json({ msg: 'Category not exists!' })
        }

        return next()
    } catch (error) {
        return res.status(400).json({ msg: error.errors });
    }
}

module.exports = {
    validateProject
}

