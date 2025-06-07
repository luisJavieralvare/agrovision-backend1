const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- NUEVO SUB-ESQUEMA PARA CADA REGISTRO DEL HISTORIAL ---
const RecommendationHistorySchema = new mongoose.Schema({
  query: {
    textura: String,
    humedad: String,
    color: String,
  },
  result: {
    tipoSueloIdentificado: String,
    cultivosSugeridos: [String],
    consejos: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, añade un nombre'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor, añade un correo electrónico'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, añade un correo electrónico válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, añade una contraseña'],
    minlength: 6,
    select: false,
  },
  
  bio: {
    type: String,
    default: "Apasionado/a por la agricultura urbana en Medellín.",
    maxlength: 500
  },
  location: {
    type: String,
    default: "Medellín, Antioquia",
    trim: true,
  },
  avatarUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  coverImageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1770'
  },
  tags: {
    type: [String],
    default: ["Huerto Urbano", "Sostenibilidad", "Medellín"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // --- CAMBIO AQUÍ: AÑADIMOS EL CAMPO PARA EL HISTORIAL ---
  recommendationHistory: [RecommendationHistorySchema],

});

// --- El resto del archivo (hooks de contraseña, etc.) se mantiene igual ---
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);