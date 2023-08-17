const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  carnet: String,
  nombre: String,
  direccion: String,
  genero: String,
  telefono: String,
  fechaNacimiento: Date,
  carrera: String,
  generoPoesia: String,
  fechaInscripcion: Date,
  fechaDeclamacion: Date,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
