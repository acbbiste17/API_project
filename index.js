const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Data = require('./model'); // Import du modèle de données
const Log = require('./logModel'); // Import du modèle de logs
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/TEST_API', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir le frontend.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});

// Fonction utilitaire pour enregistrer les logs
async function createLog(etablissementId, action) {
  try {
    const log = new Log({
      etablissementId,
      action,
      timestamp: new Date(),
    });
    await log.save();
    console.log(`Log créé : ${action} pour l'établissement ID ${etablissementId}`);
  } catch (err) {
    console.error('Erreur lors de la création du log :', err);
  }
}

// CRUD Operations pour /api/data

// 1. Route GET : Récupérer les documents avec limite
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Par défaut, page 1
  const limit = 10;  // Nombre d'éléments par page

  try {
    const data = await Data.find()
      .skip((page - 1) * limit)  // Sauter les documents des pages précédentes
      .limit(limit);  // Limiter à 10 résultats par page
    res.status(200).json(data);  // Retourner les données sous forme de JSON
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send({ error: 'Failed to fetch data', details: err });
  }
});

// Recherche par SIRET
app.get('/api/data/:siret', async (req, res) => {
  const siret = parseInt(req.params.siret, 10); // Convertir SIRET en nombre
  try {
    const data = await Data.findOne({ siret }); // Recherche stricte par SIRET
    // Créer un log pour l'action "Recherche"
    await createLog(data ? data._id : null, `Recherche par SIRET : ${siret}`);
    if (data) {
      res.status(200).json(data); // Retourne l'établissement trouvé
    } else {
      res.status(404).json({ message: 'Aucun établissement trouvé pour ce SIRET' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche par SIRET :', error);
    res.status(500).json({ error: 'Erreur interne', details: error });
  }
});

// 2. Route POST : Ajouter un nouveau document
app.post('/api/data', async (req, res) => {
  const newData = new Data(req.body);

  try {
    const savedData = await newData.save();

    // Enregistrer un log pour l'action
    await createLog(savedData._id, 'Création');

    res.status(201).json(savedData); // Renvoie l'objet créé
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Route PUT : Modifier un document existant par son ID
app.put('/api/data/:id', async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedData) {
      // Enregistrer un log pour l'action
      await createLog(updatedData._id, 'Modification');
      res.json(updatedData); // Renvoie le document mis à jour
    } else {
      res.status(404).json({ message: 'Établissement introuvable' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Route DELETE : Supprimer un document par son ID
app.delete('/api/data/:id', async (req, res) => {
  try {
    const deletedData = await Data.findByIdAndDelete(req.params.id);

    if (deletedData) {
      // Enregistrer un log pour l'action
      await createLog(deletedData._id, 'Suppression');
      res.status(200).json({ message: 'Document supprimé avec succès', data: deletedData });
    } else {
      res.status(404).json({ message: 'Établissement introuvable' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Démarrage du serveur
const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
