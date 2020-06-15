const express = require("express");
const cors = require('cors');
const Joi = require('joi');
const pool = require("./database");
const pgp = require('pg-promise')({});
const cn = 'postgres://MatthiasLHK:autocropper123@db-autocropper-v2.czixlgpzza3d.ap-southeast-1.rds.amazonaws.com:5432/autocropperdb';
const db = pgp(cn);

const app = express();

app.use(express.json());
app.use(cors());

// database data
const data = db.manyOrNone('SELECT user_id, username, password, email, created_on FROM account')
    .then(x=>{app.get('/', (req, res) => {
        res.send(x);
    });
});


// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('server has started on port ' + port));
