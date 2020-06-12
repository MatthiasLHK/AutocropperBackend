const express = require("express");
const cors = require('cors');
const Joi = require('joi'); // joi is used for data validation

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("hello world");
});

app.get('/api/testing/:id', (req, res) => {
    res.send(req.query);
})



// PORT
const port = process.env.PORT || 3000;

app.listen(port);