const API_BASE = '/api/expenses';

// Récupérer les dépenses (avec filtre optionnel)
async function fetchExpenses(category = '') {
  const url = category ? `${API_BASE}?category=${encodeURIComponent(category)}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des dépenses');
  }
  return res.json();
}

// Récupérer les stats par catégorie
async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des stats');
  }
  return res.json(); // objet { "catégorie": total, ... }
}

// Afficher la liste des dépenses
function renderExpenses(expenses) {
  const container = document.getElementById('expenses-list');
  container.innerHTML = '';
  expenses.forEach(e => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <span>${e.description}</span>
      <span class="amount">${e.amount}€</span>
      <span><span class="badge ${e.category}">${e.category}</span></span>
      <span>${e.date}</span>
    `;
    container.appendChild(row);
  });
}

// Afficher les stats
function renderStats(stats) {
  const container = document.getElementById('stats-list');
  container.innerHTML = '';

  // stats attendu: { "charge fixe": 100, "eau": 20, ... }
  Object.entries(stats).forEach(([category, total]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-label">${category}</div>
      <div class="stat-value">${total}€</div>
    `;
    container.appendChild(card);
  });
}

// Rafraîchir liste + stats
async function refreshAll() {
  const category = document.getElementById('filter-category').value;
  try {
    const [expenses, stats] = await Promise.all([
      fetchExpenses(category),
      fetchStats(),
    ]);
    renderExpenses(expenses);
    renderStats(stats);
  } catch (err) {
    console.error(err);
    alert('Erreur lors du chargement des données');
  }
}

// Gestion du formulaire d'ajout
document.getElementById('expense-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    description: form.description.value,
    amount: Number(form.amount.value),
    category: form.category.value,
    date: form.date.value,
  };

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      alert('Erreur: ' + (data.errors || data.error || 'Inconnue'));
    } else {
      form.reset();
      await refreshAll();
    }
  } catch (err) {
    console.error(err);
    alert('Erreur réseau lors de la création de la dépense');
  }
});

// Filtre par catégorie
document.getElementById('filter-category').addEventListener('change', refreshAll);

// Chargement initial
refreshAll();

// const API_BASE = '/api/expenses';

// async function fetchExpenses(category = '') {
//   const url = category ? `${API_BASE}?category=${category}` : API_BASE;
//   const res = await fetch(url);
//   return res.json();
// }

// async function fetchStats() {
//   const res = await fetch(`${API_BASE}/stats`);
//   return res.json();
// }

// function renderExpenses(expenses) {
//   const ul = document.getElementById('expenses-list');
//   ul.innerHTML = '';
//   expenses.forEach(e => {
//     const li = document.createElement('li');
//     li.textContent = `${e.date} - ${e.description} - ${e.amount}€ [${e.category}]`;
//     ul.appendChild(li);
//   });
// }

// function renderStats(stats) {
//   const ul = document.getElementById('stats-list');
//   ul.innerHTML = '';
  
//   Object.entries(stats).forEach(([category, total]) => {
//     const li = document.createElement('li');
//     li.textContent = `${category}: ${total}€`;
//     ul.appendChild(li);
//   });
// }

// async function refreshAll() {
//   const category = document.getElementById('filter-category').value;
//   const [expenses, stats] = await Promise.all([
//     fetchExpenses(category),
//     fetchStats(),
//   ]);
//   renderExpenses(expenses);
//   renderStats(stats);
// }

// document.getElementById('expense-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const form = e.target;
//   const body = {
//     description: form.description.value,
//     amount: Number(form.amount.value),
//     category: form.category.value,
//     date: form.date.value,
//   };

//   const res = await fetch(API_BASE, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) {
//     const data = await res.json();
//     alert('Erreur: ' + (data.errors || data.error));
//   } else {
//     form.reset();
//     await refreshAll();
//   }
// });

// document.getElementById('filter-category').addEventListener('change', refreshAll);

// refreshAll();
