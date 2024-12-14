// models/Winner.js
const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  wheelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wheel', 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  prize: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Winner', winnerSchema);
