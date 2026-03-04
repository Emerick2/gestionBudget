require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./pool");

const schemaPath = path.join(__dirname, "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");

async function initDb() {
  try {
    await pool.query(schemaSql);
    console.log("Schéma DB appliqué avec succès (table, contraintes, trigger, index).");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("Erreur initialisation DB:", error.message);
    await pool.end();
    process.exit(1);
  }
}

initDb();