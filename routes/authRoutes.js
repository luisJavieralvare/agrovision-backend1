const express = require('express');
const router = express.Router();

// Importamos la nueva función del controlador
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  deleteHistoryItem,
  deleteProfile // <-- Se importa la nueva función
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas privadas
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/history/:historyId', protect, deleteHistoryItem);

// --- NUEVA RUTA PARA ELIMINAR EL PERFIL DEL USUARIO ---
router.delete('/profile', protect, deleteProfile);

module.exports = router;