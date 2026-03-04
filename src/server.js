require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const api = require('./api');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

if (api){
  app.use('/api', api);
}
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index', function (req, res) {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));

// on y accède en fesant : http://localhost:3000
// https://gestion-budget.osc-fr1.scalingo.io/


require("dotenv").config();
console.log("DATABASE_URL", process.env.DATABASE_URL ? "réussite" : "erreur")
if ( !process. env.DATABASE_URL){
	console.log("erreur");
	process.exit(1);
}
