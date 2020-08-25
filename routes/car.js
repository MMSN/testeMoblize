const express = require('express');

const carController = require('../controllers/car');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

//Get com filtro
//router.get('/index/:filter', isAuth, naverController.getNaversFilter);

// Get All navers
router.get('/index', carController.getCars); 

// Get One naver by id
router.get("/show/:carId", carController.getCar); 

// Create One Route
router.post("/store", carController.postCar);

// Edit One Route PUT version
//router.put("/update/:naverId", isAuth, naverController.updateNaver);

// Edit One Route PATCH version
//router.patch("/clients/:id", );

// Delete One Route
//router.delete("/delete/:naverId", isAuth, naverController.deleteNaver);

module.exports = router;