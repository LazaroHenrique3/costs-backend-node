const Category = require('../models/Category')

const getAll = async (req, res) => {
    try {
        const categories = await Category.find({})

        return res.status(200).json(categories)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const existsCategoryByName = async (name, id = "") => {
    try {
        let category = null;

        //Em caso de alteração devo levar em consideração o id, para ele não comparar com ele memso
        if (id === "") {
            //Significa que é o cadastro da categoria
            category = await Category.findOne({ name })
        } else {
            category = await Category.findOne({ name, _id: { $ne: id } });
        }

        return (category) ? true : false
    } catch (error) {
        console.error(error)
    }
}

const existsCategoryById = async (id) => {
    try {
        let category = await Category.findOne({ _id: id });

        return (category) ? true : false
    } catch (error) {
        console.error(error)
    }
}

const create = async (req, res) => {
    try {
        const { name } = req.body

        const newCategory = await Category.create({ name })
        return res.status(201).json(newCategory)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body

        await Category.updateOne({ _id: id }, {name})

        const [updatedCategory] = await Category.find({_id: id})

        return res.status(200).json(updatedCategory)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        await Category.deleteOne({_id: id})
        return res.status(200).json({msg: "successfully deleted"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    getAll,
    existsCategoryByName,
    existsCategoryById,
    create,
    update,
    destroy
}