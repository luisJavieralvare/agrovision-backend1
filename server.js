// 1. Importaciones
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User'); 

// Importar nuestras rutas
const soilRoutes = require('./routes/soilRoutes');
const authRoutes = require('./routes/authRoutes'); // <- Se importa aquí

// 2. Configuraciones Iniciales
dotenv.config();
connectDB();

// 3. Inicialización de la Aplicación Express
const app = express();

// 4. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Rutas de la API

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de AgroVision está funcionando correctamente!');
});

// Ruta de prueba de DB
app.get('/testdb', async (req, res) => {
    try {
      console.log('--- Iniciando prueba de escritura en la base de datos ---');
      const testUser = await User.create({ name: 'TestDB User', email: `test-${Date.now()}@test.com`, password: 'testpassword123' });
      console.log('--- Usuario de prueba creado exitosamente en la base de datos ---');
      res.status(200).send(`<h1>Prueba Exitosa</h1><p>Se creó el usuario: ${testUser.name}</p>`);
    } catch (error) {
      console.error('--- ¡ERROR EN LA PRUEBA DE ESCRITURA! ---', error);
      res.status(500).send(`<h1>Falló la Prueba de Escritura</h1><p>Error: ${error.message}</p>`);
    }
});

// --- ESTA LÍNEA ES LA MÁS IMPORTANTE PARA EL ERROR 404 ---
// Montar las rutas de autenticación bajo el prefijo '/api/auth'
// Asegúrate de que esta línea exista y sea correcta.
app.use('/api/auth', authRoutes);

// Montar las rutas de análisis de suelo
app.use('/api/suelo', soilRoutes);


// 6. Arranque del Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});