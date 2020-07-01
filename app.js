const express = require("express");
const cors = require('cors');
const Joi = require('joi');
const pool = require("./database");

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

app.get('/connected_device/1001/set_settings',(req,res)=>{
    res.send('55224550');
});

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('server has started on port ' + port));

module.exports = app;
