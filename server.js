const express = require('express');
const Etablissement = require('./model');
const router = express.Router();

// Créer un nouvel établissement
router.post('/', async (req, res) => {
  try {
    const newEtablissement = new Etablissement(req.body);
    const savedEtablissement = await newEtablissement.save();
    res.status(201).json(savedEtablissement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lire tous les établissements
router.get('/', async (req, res) => {
  try {
    const etablissements = await Etablissement.find();
    res.status(200).json(etablissements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lire un établissement par ID
router.get('/:id', async (req, res) => {
  try {
    const etablissement = await Etablissement.findById(req.params.id);
    if (!etablissement) {
      return res.status(404).json({ error: 'Etablissement not found' });
    }
    res.status(200).json(etablissement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un établissement par ID
router.put('/:id', async (req, res) => {
  try {
    const updatedEtablissement = await Etablissement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEtablissement) {
      return res.status(404).json({ error: 'Etablissement not found' });
    }
    res.status(200).json(updatedEtablissement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer un établissement par ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEtablissement = await Etablissement.findByIdAndDelete(req.params.id);
    if (!deletedEtablissement) {
      return res.status(404).json({ error: 'Etablissement not found' });
    }
    res.status(200).json({ message: 'Etablissement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
