const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Planeta = require('../model/Planeta')
const validaPlaneta = [
    check("nome", "Nome do planeta é obrigatório!").not().isEmpty(),
    check("nome", "Plutão não é um planeta!").not().isIn(['Plutão']),
    check("raioKM", "Raio do planeta é obrigatório!").not().isEmpty(),
    check("raioKM", "Raio deve ser um número!").isNumeric(),
    check("numSatelites", "Número de satélites do planeta é obrigatório!").not().isEmpty(),
    check("numSatelites", "Número de satélites deve ser um número!").isNumeric(),
    check("distanceSolUA", "Distância é obrigatória!").not().isEmpty(),
    check("distanceSolUA", "Distância deve ser um número!").isNumeric(),
    check("tipo", "Informe um tipo válido!").isIn(['rochoso', 'gasoso'])
]

/*******************************
 * Listar todos os planetas
 * GET/planetas
 *******************************/
router.get('/', async(req, res) => {
    try{
        const planetas = await Planeta.find()
        res.json(planetas)
    } catch (err){
        res.status(500).send({
            errors: [{message: 'Não foi possível obter os planetas'}]
        })
    }
})

/***********************************
 * Listar um único planeta pelo ID
 * GET/planetas/id
 ***********************************/
router.get('/:id', async(req, res) => {
    try{
        const planeta = await Planeta.find({"_id" : req.params.id})
        res.json(planeta)
    } catch (err){
        res.status(400).send({
            errors: [{message: `Não foi possível obter o planeta com o id ${req.params.id}`}]
        })
    }
})

/*******************************
 * Inclui um novo planeta
 * POST/planetas
 *******************************/
router.post('/', validaPlaneta, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try{
        let planeta = new Planeta(req.body)
        await planeta.save()
        res.send(planeta)
    } catch (err){
        return res.status(400).json({
            errors: [{message: `Erro ao salvar o planeta: ${err.message}`}]
        })
    }
})

/*******************************
 * Apaga um planeta pelo id
 * DELETE/planetas/id
 *******************************/
router.delete('/:id', async(req, res) => {
    await Planeta.findByIdAndRemove(req.params.id)
    .then(planeta => {
        res.send({message: `Planeta ${planeta.nome} removido com sucesso`})
    }) .catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível excluir o planeta'}]
        })
    })
})

/**********************************
 * Altera um planeta já existente
 * DELETE/planetas/id
 **********************************/
router.put('/', validaPlaneta, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body
    await Planeta.findByIdAndUpdate(req.body._id, {$set: dados})
    .then(planeta => {
        res.send({ message: `Planeta ${planeta.nome} alterado com sucesso`})
    }) .catch(err => {
        return res.status(404).send({
            errors: [{message: 'Não foi possível alterar o planeta informado'}]
        })
    })
})

module.exports = router