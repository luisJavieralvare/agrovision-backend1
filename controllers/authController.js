const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Función para REGISTRAR un nuevo usuario
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, proporciona nombre, email y contraseña' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', token: token });
    } else {
      res.status(400).json({ success: false, message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Función para INICIAR SESIÓN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, proporciona email y contraseña' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', token: token });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Función para OBTENER DATOS del perfil
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch(error){
    console.error('Error en getMe:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Función para ACTUALIZAR DATOS del perfil
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          bio: updatedUser.bio,
          location: updatedUser.location,
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

/**
 * @desc    Eliminar un registro del historial de recomendaciones de un usuario
 * @route   DELETE /api/auth/history/:historyId
 * @access  Private
 */
const deleteHistoryItem = async (req, res) => {
  try {
    // El middleware 'protect' ya nos dio el usuario en req.user
    const user = await User.findById(req.user.id);
    
    // El ID del registro del historial que queremos borrar viene en los parámetros de la URL
    const historyIdToDelete = req.params.historyId;

    if (user) {
      // Usamos el método .pull() de Mongoose para eliminar un elemento de un array
      // que coincida con el _id proporcionado.
      user.recommendationHistory.pull({ _id: historyIdToDelete });

      // Guardamos el documento del usuario con el array del historial ya modificado
      await user.save();

      res.status(200).json({ 
        success: true, 
        message: 'Registro del historial eliminado correctamente' 
      });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar registro del historial:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


/**
 * @desc    Eliminar la cuenta de un usuario
 * @route   DELETE /api/auth/profile
 * @access  Private
 */
const deleteProfile = async (req, res) => {
  try {
    // El middleware 'protect' ya nos dio el usuario en req.user
    // Usamos findByIdAndDelete para encontrar y borrar el documento del usuario en un solo paso.
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      // Este caso es raro si el token es válido, pero es una buena salvaguarda.
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Enviamos una respuesta de éxito. El frontend se encargará de desloguear al usuario.
    res.status(200).json({ 
      success: true, 
      message: 'Tu cuenta ha sido eliminada permanentemente.' 
    });

  } catch (error) {
    console.error('Error al eliminar el perfil:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};




// Exportamos TODAS las funciones que usamos en nuestras rutas.
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteHistoryItem,
  deleteProfile,
};