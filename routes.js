const express = require('express');
const router = express.Router();
const Student = require('./models');

router.post('/inscribir', async (req, res) => {
  try {
    const {
      carnet,
      nombre,
      direccion,
      genero,
      telefono,
      fechaNacimiento,
      carrera,
      generoPoesia,
    } = req.body;

    // Verificar si el carnet ya está registrado
    const existingStudent = await Student.findOne({ carnet: carnet });
    if (existingStudent) {
      return res.status(400).json({ message: 'Este carnet ya está registrado' });
    }

    // Validar el carnet según las condiciones
    const isValidCarnet = /^A[^0]*5[^0]*[139]$/.test(carnet);
    if (!isValidCarnet) {
      return res.status(400).json({ message: 'Carnet no válido' });
    }

    // Validar el género (solo "masculino" o "femenino" son permitidos)
    if (genero !== 'masculino' && genero !== 'femenino') {
      return res.status(400).json({ message: 'El género debe ser "masculino" o "femenino"' });
    }

    // Validar el género de poesía (solo valores específicos son permitidos)
    const allowedGeneroPoesia = ['Lirico', 'Epico', 'Dramatico'];
    if (!allowedGeneroPoesia.includes(generoPoesia)) {
      return res.status(400).json({ message: 'El género de poesía debe ser "Lirico", "Epico" o "Dramatico"' });
    }

    // Calcular fecha de declamación omitiendo fines de semana
    const currentDate = new Date();
    let daysToAdd = 5;
    while (daysToAdd > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        daysToAdd--;
      }
    }
    const fechaDeclamacion = new Date(currentDate);

    // Calcular la edad del estudiante
    const birthDate = new Date(fechaNacimiento);
    const age = currentDate.getFullYear() - birthDate.getFullYear() - (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);

    // Verificar si el estudiante tiene 18 años o más
    if (age < 18) {
      return res.status(400).json({ message: 'El estudiante debe tener 18 años o más para inscribirse' });
    }

    const student = new Student({
      carnet,
      nombre,
      direccion,
      genero,
      telefono,
      fechaNacimiento,
      carrera,
      generoPoesia,
      fechaInscripcion: new Date(),
      fechaDeclamacion,
    });

    await student.save();

    res.json({ message: 'Estudiante inscrito exitosamente' });
  } catch (error) {
    console.error('Error al inscribir estudiante:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/reporte', async (req, res) => {
  try {
    const reportData = await Student.find({}, { _id: 0, __v: 0 });
    res.json(reportData);
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
