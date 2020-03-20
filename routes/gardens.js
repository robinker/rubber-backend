const router = require('express').Router();
let Garden = require('../models/garden.model');

// get garden
router.route('/:id').get((req, res) => {
    Garden.findById(req.params.id)
        .then(garden => res.json(garden))
        .catch(err => res.status(400).json('Error: ' + err));
});
// update garden
router.route('/update/:id').post((req, res) => {
    payload = req.body.garden
    Garden.findById(req.params.id)
        .then(garden => {
            garden.area = payload.area
            garden.startYear = payload.startYear
            garden.species = payload.species
            garden.products = payload.products
            garden.save()
            res.json({message: "Garden Updated!", garden})
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router