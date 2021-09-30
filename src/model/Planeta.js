const mongoose = require('mongoose')

const PlanetaSchema = mongoose.Schema({
    nome: {type: String},
    raioKM: {type: Number},
    numSatelites: {type: Number},
    distanceSolUA: {type: Number},
    tipo: {type: String, enum:['rochoso', 'gasoso',]}
},{timestamps:true})

module.exports = mongoose.model('planetas', PlanetaSchema)