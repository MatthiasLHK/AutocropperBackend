const express = require("express");
const cors = require('cors');
const Joi = require('joi');
const pool = require("./database");
const pgp = require('pg-promise')();
const cn = 'postgres://MatthiasLHK:autocropper123@db-autocropper-v2.czixlgpzza3d.ap-southeast-1.rds.amazonaws.com:5432/autocropperdb';
const db = pgp(cn);

const app = express();

app.use(express.json());
app.use(cors());


app.get('',(req,res)=>{
    res.send("Welcome, successfully set up remote! Matt and Jonas! Testing round 2 for editiing changes!");
});

// database data
// const data = db.manyOrNone('SELECT user_id, username, password, email, created_on FROM account')
//     .then(x=>{app.get('/profile', (req, res) => {
//         console.log(res.data);
//         res.send(x);
//     });
// });
//
// app.get('/results/:id', (req, res) => {
//     const setting_id = req.params.id;
//     db.one("SELECT * from settings where setting_id = $1", [setting_id])
//     .then(result => {
//         res.send(result);
//     })
//     .catch(error => {
//         console.log(error)
//     })
// })
//
// app.get('/profile/:user', (req, res) => {
//     const userId = req.params.user;
//     db.one("SELECT * from account where user_id = $1", [userId])
//     .then(result => {
//         res.send(result);
//     })
//     .catch(error => {
//         console.log(error)
//     })
// });
//
// app.delete('/profile/:id', async (req, res) => {
//     const { id } = req.params;
//     db.result('delete from account where user_id = $1', id)
//     .then(result => {
//         res.status(200).json({
//             status: 'success',
//             message: 'Removed user ' + id
//         });
//     })
//     .catch(error => {
//         console.log(error)
//     })
// })
//
//
// app.put('/profile/:id', (req, res) => {
//     const userId = req.params.id;
//     const username = "jonasngs";
//     db.none('update account set username=$1 where user_id=$2', [username, userId])
//     .then(result => {
//         res.send(result);
//     })
//     .catch(error => {
//         console.log(error)
//     })
// })
//
//
// app.post('/set_data', (req, res) => {
//     const temp = req.body.temperature;
//     const water = req.body.water;
//     const light= req.body.light;
//     const humidity= req.body.humidity;
//     const name = "corn";
//     db.none('insert into settings (plant_name, temperature, humidity, light, water)' +
//             'values($1, $2, $3, $4, $5)', [name, temp, humidity, light, water])
//             .then(result => {
//                 res.status(200).json({
//                     status: 'success',
//                     message: 'added new plant'
//                 });
//             })
//             .catch(error => {
//                 console.log(error)
//             })
//             });
//
// app.post('/login', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const email = req.body.email;
//     const created_on = NOW();
//     const login = null;
//     db.none('insert into account (username, password, email, created_on, last_login)' +
//             'values($1, $2, $3, NOW(), $4)', [username, password, email, login])
//             .then(result => {
//                 res.status(200).json({
//                     status: 'success',
//                     message: 'successfully registered'
//                 });
//             })
//             .catch(error => {
//                 console.log(error)
//             })
//             });


// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('server has started on port ' + port));

module.exports = db;
