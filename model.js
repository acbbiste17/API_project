const mongoose = require('mongoose');

const etablissementSchema = new mongoose.Schema({
  siren: { type: Number, required: true },
  nic: { type: Number, required: true },
  siret: { type: Number, required: true },
  statutDiffusionEtablissement: { type: String, required: true },
  dateCreationEtablissement: { type: Date },
  activitePrincipaleRegistreMetiersEtablissement: { type: String },
  dateDernierTraitementEtablissement: { type: String },
  etablissementSiege: { type: Boolean, required: true },
  nombrePeriodesEtablissement: { type: Number },
  libelleVoieEtablissement: { type: String },
  codePostalEtablissement: { type: Number },
  libelleCommuneEtablissement: { type: String },
  codeCommuneEtablissement: { type: Number },
  dateDebut: { type: Date },
  etatAdministratifEtablissement: { type: String },
  activitePrincipaleEtablissement: { type: String },
  nomenclatureActivitePrincipaleEtablissement: { type: String },
  caractereEmployeurEtablissement: { type: String },
});

module.exports = mongoose.model('Etablissement', etablissementSchema);
