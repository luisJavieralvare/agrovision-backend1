const express = require('express');
const router = express.Router();

const { analyzeSoil } = require('../controllers/soilController');
// Importamos nuestro nuevo middleware
const { identifyUser } = require('../middleware/authMiddleware');

// CAMBIO: Ahora usamos el middleware 'identifyUser'.
// Esto identificará al usuario si está logueado, pero permitirá el paso si no lo está.
router.post('/analizar', identifyUser, analyzeSoil);

module.exports = router;