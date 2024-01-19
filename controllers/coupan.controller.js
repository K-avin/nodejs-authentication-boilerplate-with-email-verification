const express         = require('express');
const router          = express.Router();
const Joi             = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorize       = require('../middleware/authorize')
const Role            = require('../config/role');
const coupanService   = require('../services/coupan.service');

// routes
router.get('/all', authorize(Role.Admin), getAll);
router.get('/:id', authorize(Role.Admin), getById);
router.post('/create', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;


function getAll(req, res, next) {
    coupanService.getAll()
        .then(coupans => res.json(coupans))
        .catch(next);
}

function getById(req, res, next) {
    coupanService.getById(req.params.id)
        .then(coupan => coupan ? res.json(coupan) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name      : Joi.string().required(),
        type      : Joi.boolean().required(),
        discount  : Joi.number().required(),
        expireDate: Joi.date().required(),
        status    : Joi.boolean().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    coupanService.create(req.body)
        .then(coupan => res.json(coupan))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        name      : Joi.string().required(),
        type      : Joi.boolean().required(),
        discount  : Joi.number().required(),
        expireDate: Joi.date().required(),
        status    : Joi.boolean().required(),
    };

    const schema = Joi.object(schemaRules);
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    coupanService.update(req.params.id, req.body)
        .then(coupan => res.json(coupan))
        .catch(next);
}

function _delete(req, res, next) {
    coupanService.delete(req.params.id)
        .then(() => res.json({ message: 'Coupan deleted successfully' }))
        .catch(next);
}