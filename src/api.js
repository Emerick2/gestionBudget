const express = require('express');
const router = express.Router();
const pool = require('./db/pool');

const allowedCategories = ['alimentaire', 'transport', 'loisirs', 'autre'];

function validateExpenseInput(data, isUpdate = false) {
    const errors = [];
    const { description, amount, category, date } = data;

    if (!isUpdate || description !== undefined) {
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            errors.push('Description obligatoire');
        } else if (description.trim().length > 200) {
            errors.push('Description max 200 caractères');
        }
    }

    if (!isUpdate || amount !== undefined) {
        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            errors.push('Amount doit être un nombre > 0');
        }
    }

    if (!isUpdate || category !== undefined) {
        if (!allowedCategories.includes(category)) {
            errors.push('Category invalide');
        }
    }

    if (!isUpdate || date !== undefined) {
        const parsedDate = new Date(date);
        if (!date || Number.isNaN(parsedDate.getTime())) {
            errors.push('Date invalide');
        }
    }

    return errors;
}

//GET	/api/expenses	Tous + ?category=X pour filtrer
router.get('/expenses', async (req, res) => {
    // /api/expenses?category=eau
    const { category } = req.query;
    try {
        if (category) {
            const query = 'SELECT * FROM expenses WHERE category = $1 ORDER BY date DESC, id DESC';
            const { rows } = await pool.query(query, [category]);
            return res.json(rows);
        }
        const { rows } = await pool.query('SELECT * FROM expenses ORDER BY date DESC, id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

//GET	/api/expenses/stats	Total par catégorie
router.get('/expenses/stats', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT category, COALESCE(SUM(amount), 0) AS total FROM expenses GROUP BY category ORDER BY category'
        );
        const stats = {};
        rows.forEach((row) => {
            stats[row.category] = Number(row.total);
        });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

//GET	/api/expenses/:id	Détail
router.get('/expenses/:id', async (req, res) => {
    const idCherche = Number(req.params.id);
    try {
        const { rows } = await pool.query('SELECT * FROM expenses WHERE id = $1', [idCherche]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Dépense non trouvée" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

//POST	/api/expenses	Créer
router.post('/expenses', async (req, res) => {
    const { description, amount, category, date } = req.body;
    const errors = validateExpenseInput({ description, amount, category, date });
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const query = `
            INSERT INTO expenses (description, amount, category, date)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [description.trim(), Number(amount), category, date];
        const { rows } = await pool.query(query, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

//PUT	/api/expenses/:id	Modifier
router.put('/expenses/:id', async (req, res) => {
    const idCherche = Number(req.params.id);
    const { description, amount, category, date } = req.body; 
    const errors = validateExpenseInput({ description, amount, category, date }, true);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const { rows: existingRows } = await pool.query('SELECT * FROM expenses WHERE id = $1', [idCherche]);
        if (existingRows.length === 0) {
            return res.status(404).json({ error: "Dépense non trouvée" });
        }
        const existing = existingRows[0];

        const query = `
            UPDATE expenses
            SET description = $1, amount = $2, category = $3, date = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [
            (description !== undefined ? description : existing.description).trim(),
            Number(amount !== undefined ? amount : existing.amount),
            category !== undefined ? category : existing.category,
            date !== undefined ? date : existing.date,
            idCherche,
        ];
        const { rows } = await pool.query(query, values);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }

});

//DELETE	/api/expenses/:id	Supprimer
router.delete('/expenses/:id', async (req, res) => {
    const idCherche = Number(req.params.id);
    try {
        const { rowCount } = await pool.query('DELETE FROM expenses WHERE id = $1', [idCherche]);
        if (rowCount > 0) {
        return res.status(204).send();
        }
        res.status(404).json({ error: "Dépense non trouvée" });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});


//curl https://gestion-budget.osc-fr1.scalingo.io/api/expenses/stats

module.exports = router;