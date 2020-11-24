require('dotenv').config();
const bodyParser = require('body-parser');
const log = require('morgan')('dev');
const express = require('express');
const cors = require('cors');


var app = express();

// Mongo Database
const db = require('./config/config.db');

// Call the database connectivity function
db();

// Configure bodyparser
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
const bodyParserRaw = bodyParser.raw();
const bodyParserText = bodyParser.text();

// Configure app.use()
app.use(log);
app.use(express.json());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(bodyParserRaw);
app.use(bodyParserText);
app.use(cors());

// Initialise Express Router
const router = express.Router();
app.use('/api/v1', router);

app.get('/api/v1', (req, res) =>
	res.json({ message: 'Hello World! Welcome to Notes API' })
);




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`server started on port -> ${PORT}`);
});