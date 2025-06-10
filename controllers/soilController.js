const recommendationService = require('../services/recommendationService');
const User = require('../models/User'); // Necesitamos el modelo User para guardar el historial

/**
 * @desc    Analiza los datos del suelo y devuelve una recomendación.
 * Si el usuario está autenticado, guarda el resultado en su historial.
 * @route   POST /api/suelo/analizar
 * @access  Public (pero con funcionalidad extra si es Privado)
 */
const analyzeSoil = async (req, res) => {
  try {
    const { textura, humedad, color } = req.body;

    if (!textura || !humedad || !color) {
      return res.status(400).json({ success: false, message: 'Datos incompletos.' });
    }

    // 1. Obtenemos la recomendación del servicio, como antes.
    const recomendacion = recommendationService.analizarSueloYRecomendar({ textura, humedad, color });

    // 2. Verificamos si la petición la hizo un usuario autenticado.
    //    El middleware 'identifyUser' (que crearemos a continuación) añadirá 'req.user' si hay un token válido.
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        // Creamos el objeto para el historial
        const historyEntry = {
          query: { textura, humedad, color },
          result: recomendacion
        };

        // Añadimos la nueva entrada al principio del array del historial
        user.recommendationHistory.unshift(historyEntry);

        // Opcional: Limitar el historial a un número de entradas (ej. las últimas 20)
        if (user.recommendationHistory.length > 20) {
            user.recommendationHistory.pop();
        }

        // Guardamos el usuario con el nuevo historial en la base de datos
        await user.save();
        console.log(`Historial guardado para el usuario: ${user.email}`);
      }
    }

    // 3. Enviamos la recomendación al frontend, sin importar si se guardó o no.
    res.status(200).json({
      success: true,
      data: recomendacion
    });

  } catch (error) {
    console.error('Error en el controlador analyzeSoil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al analizar el suelo.' 
    });
  }
};

module.exports = {
  analyzeSoil,
};