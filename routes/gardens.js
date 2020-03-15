const router = require('express').Router();
let Garden = require('../models/garden.model');

// get garden
router.route('/:id').get((req, res) => {
    Garden.findById(req.params.id)
        .then(garden => res.json(garden))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router