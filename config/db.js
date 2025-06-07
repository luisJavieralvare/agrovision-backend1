const mongoose = require('mongoose');
require('dotenv').config(); // Para cargar variables de .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Aunque estas opciones están deprecadas en Mongoose 6+,
      useUnifiedTopology: true, // no hacen daño y aseguran compatibilidad si usas una versión anterior.
      // Mongoose 6 ya no necesita estas opciones, pero es bueno saberlo.
    });
    console.log('MongoDB Conectado Exitosamente');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    // Salir del proceso con fallo si no se puede conectar a la BD
    process.exit(1);
  }
};

module.exports = connectDB;