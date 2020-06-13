const express = require("express");
const cors = require('cors');
const Joi = require('joi');
const pool = require("./database");

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("hello world");
});

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('server has started on port ' + port));