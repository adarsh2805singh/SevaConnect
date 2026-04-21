const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// GET all volunteers
router.get('/', volunteerController.getAllVolunteers);

// GET volunteer by ID
router.get('/:id', volunteerController.getVolunteerById);

// POST create new volunteer
router.post('/', volunteerController.createVolunteer);

// DELETE volunteer by ID
router.delete('/:id', volunteerController.deleteVolunteer);

module.exports = router;
