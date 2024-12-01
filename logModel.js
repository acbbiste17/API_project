const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  etablissementId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID de l'établissement
  action: { type: String, required: true }, // Action effectuée (e.g., création, modification, suppression)
  timestamp: { type: Date, default: Date.now } // Heure de l'action
});

module.exports = mongoose.model('Log', logSchema);
