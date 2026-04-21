const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');

// GET all NGOs
router.get('/', ngoController.getAllNGOs);

// GET NGO by ID
router.get('/:id', ngoController.getNGOById);

// GET NGOs by category
router.get('/category/:category', ngoController.getNGOsByCategory);

// POST create new NGO
router.post('/', ngoController.createNGO);

// DELETE NGO by ID
router.delete('/:id', ngoController.deleteNGO);

module.exports = router;
