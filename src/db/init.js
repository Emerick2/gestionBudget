require("dotenv").config();
const pool = require("./pool");

const createExpensesTable = `
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  description VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(30) NOT NULL CHECK (category IN ('alimentaire', 'transport', 'loisirs', 'autre')),
  date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function initDb() {
  try {
    await pool.query(createExpensesTable);
    console.log("Table expenses créée ou déjà existante.");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("Erreur initialisation DB:", error.message);
    await pool.end();
    process.exit(1);
  }
}

initDb();