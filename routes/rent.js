const express = require('express');

const rentController = require('../controllers/rent');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Create One Route
router.post("/store", isAuth, rentController.postRent);

module.exports = router;