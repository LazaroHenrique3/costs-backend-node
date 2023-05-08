const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        budget: {
            type: Number,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        cost: {
            type: Number,
            required: true
        },
        services: [{
            id: {
                type: String,
                required: true //Inicialmente não preciso ter services cadastrados
            },
            name: {
                type: String,
                required: false //Inicialmente não preciso ter services cadastrados
            },
            cost: {
                type: Number,
                required: false //Inicialmente não preciso ter services cadastrados
            },
            description: {
                type: String,
                required: false //Inicialmente não preciso ter services cadastrados
            }
        }]
    },
    {
        timestamps: true
    }
)


const Project = mongoose.model("Project", projectSchema)

module.exports = Project