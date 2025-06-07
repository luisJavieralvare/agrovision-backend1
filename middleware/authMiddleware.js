const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Este middleware 'protect' se mantiene igual. Protege rutas obligatoriamente.
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'No autorizado, el token falló' });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'No autorizado, no hay token' });
  }
};

// --- NUEVO MIDDLEWARE 'OPTIONAL' ---
// Este middleware identifica al usuario si hay un token, pero no da error si no lo hay.
const identifyUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Si el token es inválido o expiró, simplemente no hacemos nada y continuamos.
      // req.user no se establecerá.
      console.log('Token presente pero inválido. Petición tratada como no autenticada.');
    }
  }
  // Si no hay token o si el token falló, simplemente continuamos a la siguiente ruta.
  next();
};

// Exportamos ambos middlewares
module.exports = { protect, identifyUser };