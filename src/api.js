const express = require('express');
const router = express.Router();

const listDepance = [
    { id:1,description : 'ma dépance1', amount : 60, category :'charge fixe', date : '04-03-2026' },
    { id:2,description : 'ma dépance2', amount : 40, category :'charge fixe', date : '04-03-2026' },
    { id:3,description : 'ma dépance3', amount : 20, category :'eau', date : '04-03-2026' }
];


router.get('/expenses', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/expenses/stats', (req, res) => {
    const stats = {};

    listDepance.forEach(depense => {
        const category = depense.category;
        
        if (stats[category]) {
            stats[category]++;
        } else {
            stats[category] = 1;
        }
    });
    res.json(stats);
});

router.get('/expenses/:id', (req, res) => {
    const idCherche = req.params.id;

    const depense = listDepance.find(d => d.id == idCherche);

    if (!depense) {
        return res.status(404).json({ error: "Dépense non trouvée" });
    }
    res.json(depense);
});

router.post('/expenses', (req, res) => {
    const description = "ma dépance1";
    const amount = 60;
    const category ="charge fixe";
    const date = "04-03-2026";
    const nouvelleObjet = {
        id : listDepance.length+1,
        description : description,
        amount : amount,
        category : category,
        date : date
    }
    listDepance.push(nouvelleObjet);
});

router.put('/expenses/:id', (req, res) => {
//   res.json({ status: 'ok' });
});

router.delete('/expenses/:id', (req, res) => {
//   res.json({ status: 'ok' });
});


//curl https://gestion-budget.osc-fr1.scalingo.io/api/expenses/stats
/*
GET	/api/expenses	Tous + ?category=X pour filtrer
GET	/api/expenses/stats	Total par catégorie
GET	/api/expenses/:id	Détail
POST	/api/expenses	Créer
PUT	/api/expenses/:id	Modifier
DELETE	/api/expenses/:id	Supprimer
*/

module.exports = router;