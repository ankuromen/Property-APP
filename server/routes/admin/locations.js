const express = require('express');
const locationController = require('../../controllers/admin/locationController');

const router = express.Router();

router.get('/countries', locationController.listCountries);
router.post('/countries', locationController.createCountry);
router.get('/countries/:id', locationController.getCountry);
router.patch('/countries/:id', locationController.updateCountry);
router.delete('/countries/:id', locationController.deleteCountry);

router.get('/states', locationController.listStates);
router.post('/states', locationController.createState);
router.get('/states/:id', locationController.getState);
router.patch('/states/:id', locationController.updateState);
router.delete('/states/:id', locationController.deleteState);

router.get('/cities', locationController.listCities);
router.post('/cities', locationController.createCity);
router.get('/cities/:id', locationController.getCity);
router.patch('/cities/:id', locationController.updateCity);
router.delete('/cities/:id', locationController.deleteCity);

router.get('/localities', locationController.listLocalities);
router.post('/localities', locationController.createLocality);
router.get('/localities/:id', locationController.getLocality);
router.patch('/localities/:id', locationController.updateLocality);
router.delete('/localities/:id', locationController.deleteLocality);

module.exports = router;
