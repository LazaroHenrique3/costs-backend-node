const Project = require('../models/Project')

const getAll = async (req, res) => {
    try {
        const projects = await Project.find({})
        .populate('category', 'name')

        return res.status(200).json(projects)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const [project] = await Project.find({_id: id})
        .populate('category', 'name')

        return res.status(200).json(project)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const existsProjectByName = async (name, id = "") => {
    try {
        let projects = null;

        //Em caso de alteração devo levar em consideração o id, para ele não comparar com ele memso
        if (id === "") {
            //Significa que é o cadastro do projeto
            projects = await Project.findOne({ name })
        } else {
            projects = await Project.findOne({ name, _id: { $ne: id } });
        }

        return (projects) ? true : false
    } catch (error) {
        console.error(error)
    }
}

const existsThisCategoryInProject = async (idProject) => {
    try {
        const project = await  Project.find({category: idProject})

        return (project.length === 0) ? false : true
    } catch (error) {
        console.error(error)
    }
}

const create = async (req, res) => {
   try {
        const { name, budget, category, cost, services } = req.body

        const newCategory = await Project.create({ name, budget, category, cost, services })
        return res.status(201).json(newCategory)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, budget, category, cost, services } = req.body
        
        await Project.updateOne({ _id: id }, { name, budget, category, cost, services })

        const [updatedProject] = await Project.find({_id: id})
        .populate('category', 'name')

        return res.status(200).json(updatedProject)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        await Project.deleteOne({_id: id})
        return res.status(200).json({msg: "successfully deleted"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}


module.exports = {
    getAll,
    getProjectById,
    existsProjectByName,
    existsThisCategoryInProject,
    create,
    update,
    destroy
}