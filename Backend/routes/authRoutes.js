// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ─── VOLUNTEER ROUTES ──────────────────────────────────────────────
router.post('/volunteer/register', authController.registerVolunteer);
router.post('/volunteer/login', authController.loginVolunteer);

// ─── NGO ROUTES ────────────────────────────────────────────────────
router.post('/ngo/register', authController.registerNGO);
router.post('/ngo/login', authController.loginNGO);

// ─── ADMIN ROUTES ──────────────────────────────────────────────────
router.post('/admin/login', authController.loginAdmin);

// ─── LOGOUT ROUTE ──────────────────────────────────────────────────
router.post('/logout', authController.logout);

// ─── DEBUG ROUTE (Get all users - remove in production) ─────────────
router.get('/debug/users', authController.getAllUsers);

module.exports = router;
