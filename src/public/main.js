const API_BASE = '/api/expenses';

async function fetchExpenses(category = '') {
  const url = category ? `${API_BASE}?category=${category}` : API_BASE;
  const res = await fetch(url);
  return res.json();
}

async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

function renderExpenses(expenses) {
  const ul = document.getElementById('expenses-list');
  ul.innerHTML = '';
  expenses.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.date} - ${e.description} - ${e.amount}€ [${e.category}]`;
    ul.appendChild(li);
  });
}

function renderStats(stats) {
  const ul = document.getElementById('stats-list');
  ul.innerHTML = '';
  stats.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.category}: ${s.total}€`;
    ul.appendChild(li);
  });
}

async function refreshAll() {
  const category = document.getElementById('filter-category').value;
  const [expenses, stats] = await Promise.all([
    fetchExpenses(category),
    fetchStats(),
  ]);
  renderExpenses(expenses);
  renderStats(stats);
}

document.getElementById('expense-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    description: form.description.value,
    amount: form.amount.value,
    category: form.category.value,
    date: form.date.value,
  };

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    alert('Erreur: ' + (data.errors || data.error));
  } else {
    form.reset();
    await refreshAll();
  }
});

document.getElementById('filter-category').addEventListener('change', refreshAll);

refreshAll();
