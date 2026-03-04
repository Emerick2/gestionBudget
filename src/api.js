const express = require('express');
const router = express.Router();

const listDepance = [
    { id:1,description : 'ma dépance1', amount : 60, category :'charge fixe', date : '04-03-2026' },
    { id:2,description : 'ma dépance2', amount : 40, category :'charge fixe', date : '04-03-2026' },
    { id:3,description : 'ma dépance3', amount : 20, category :'eau', date : '04-03-2026' }
];

//GET	/api/expenses	Tous + ?category=X pour filtrer
router.get('/expenses', (req, res) => {
    // /api/expenses?category=eau
    const { category } = req.query;
    let resultats = listDepance;
    if (category) {
        resultats = listDepance.filter(d => 
            d.category.toLowerCase() === category.toLowerCase()
        );
    }
    res.json(resultats);
});

//GET	/api/expenses/stats	Total par catégorie
router.get('/expenses/stats', (req, res) => {
    const stats = {};

    listDepance.forEach(depense => {
        const category = depense.category;
        
        if (stats[category]) {
            stats[category]+=depense.amount;
        } else {
            stats[category] = depense.amount;
        }
    });
    res.json(stats);
});

//GET	/api/expenses/:id	Détail
router.get('/expenses/:id', (req, res) => {
    const idCherche = req.params.id;

    const depense = listDepance.find(d => d.id == idCherche);

    if (!depense) {
        return res.status(404).json({ error: "Dépense non trouvée" });
    }
    res.json(depense);
});

//POST	/api/expenses	Créer
router.post('/expenses', (req, res) => {
    const { description, amount, category, date } = req.body;
    const nouvelleObjet = {
        id : listDepance.length+1,
        description : description,
        amount : amount,
        category : category,
        date: date || new Date().toISOString().split('T')[0]
    }
    listDepance.push(nouvelleObjet);
    res.status(201).json(nouvelleObjet);
});

//PUT	/api/expenses/:id	Modifier
router.put('/expenses/:id', (req, res) => {
    const idCherche = req.params.id;
    const { description, amount, category, date } = req.body; 

    const index = listDepance.findIndex(d => d.id == idCherche);

    if (index === -1) {
        return res.status(404).json({ error: "Dépense non trouvée" });
    }

    listDepance[index] = {
        ...listDepance[index],
        description: description || listDepance[index].description,
        amount: amount || listDepance[index].amount,
        category: category || listDepance[index].category,
        date: date || listDepance[index].date
    };

    res.json(listDepance[index]);
});

//DELETE	/api/expenses/:id	Supprimer
router.delete('/expenses/:id', (req, res) => {
    const idCherche = req.params.id;
    const index = listDepance.findIndex(d => d.id == idCherche);

    if (index !== -1) {
        listDepance.splice(index, 1);
        return res.status(204).send();
    }
    res.status(404).json({ error: "Dépense non trouvée" });
});


//curl https://gestion-budget.osc-fr1.scalingo.io/api/expenses/stats

module.exports = router;