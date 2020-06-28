const express = require("express");
const cors = require('cors');
const Joi = require('joi');
const pool = require("./database");
// const pgp = require('pg-promise')();
// const cn = 'postgres://MatthiasLHK:autocropper123@db-autocropper-v2.czixlgpzza3d.ap-southeast-1.rds.amazonaws.com:5432/autocropperdb';
// const db = pgp(cn);

const app = express();

app.use(express.json());
app.use(cors());

const R = require("./routes");

app.use('/',R);




/////////////////////////////////// TESTING COMMANDS /////////////////////////////////////////////////
app.get('/',(req,res)=>{
    res.send("Welcome, successfully set up remote! Matt and Jonas! Testing round 2 for editiing changes!");
});

app.get('/connected',(req,res)=>{
    res.send("connected");
});

app.get('/connected/:name',(req,res)=>{
    const user = req.params.name;
    // console.log(user);
    res.send(user+' connected');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////// CONNECTION TO HARDWARE /////////////////////////////////////////////

app.get('/connected_device/:device_id/set_settings/:setting_id',(req,res)=>{ // for testing, set device to be 1001
                                                                             // and change the url such that para is in the axios part in frontend
    const id = req.params.setting_id;
    const data = 0;
    db.one('SELECT * FROM private_settings WHERE setting_id = $1',[id])
        .then(x=>{
            data = parseInt(x.temperature)*1000000 + parseInt(x.water*10000) + parseInt(x.light*100) + parseInt(x.humidity);
            res.send(data);
        });
});

app.get('/connected_device/1001/set_settings',(req,res)=>{
    res.send('44332211');
});

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('server has started on port ' + port));

module.exports = app;
