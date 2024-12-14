// models/Wheel.js
const mongoose = require('mongoose');

const wheelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  numOptions: { type: Number, required: true }, // Jumlah total opsi
  options: [{
    text: { type: String, required: true },
    code: { type: String, required: true }, // Kode untuk setiap opsi
    position: { type: Number, required: true } // Posisi di wheel (0-based)
  }],
  link: { type: String },
  createdBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Wheel', wheelSchema);