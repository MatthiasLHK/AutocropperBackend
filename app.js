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

/////////////////////// GETTING LIST OF CONNECTED DEVICES OF THE USER ////////////////////////////////

// app.get('/connected_devices/:id',(req,res)=>{
//     const id = req.params.id;
//     db.manyOrNone('SELECT pair_id, device_id, registered_on, power_on FROM user_device WHERE user_id = id').then(x=>{res.send(x)});
// });

app.get('/connected_devices/:user_id',(req,res)=>{
    const user_id = req.params.user_id;
    db.manyOrNone('SELECT id, name FROM tester WHERE id = $1',[user_id]).then(x=>{res.send(x)});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////// GETTING THE SETTINGS OF A DEVICE ////////////////////////////////

app.get('/connected_devices/settings/:device_id',(req,res)=>{
    const device_id = req.params.device_id;
    db.manyOrNone('SELECT temperature, water, light, humidity, edited_on FROM devices WHERE device_id = $1',[device_id])
        .then(x=>res.send(x));
});

// to get all settings for all connected device of a user

// app.get('/connected_devices_settings/:user_id',(req,res)=>{
//     const user_id = req.params.user_id;
//     const list_of_settings_of_user = [];
//     const list_registered_devices = [];
//
//     db.manyOrNone('SELECT device_id FROM user_device WHERE user_id = $1',[user_id])
//         .then(x=>{
//             x.forEach(row=>{
//                 const id = row.device_id;
//                 list_registered_devices.push(id);
//             });
//             list_registered_devices.forEach(id=>{
//                 db.manyOrNone('SELECT * FROM devices WHERE device_id = $1',[id])
//                     .then(x=>{
//                         console.log(x);
//                         });
//             });
//             console.log(list_of_settings_of_user);
//         });
// });

app.get('/connected_devices_settings/:user_id',(req,res)=>{
    const list_of_settings_of_user = [];
    const list_registered_devices = [];


    const user_id = req.params.user_id;
    console.log(user_id);

    db.manyOrNone('SELECT name FROM tester WHERE id = $1',[user_id])
        .then(x=>{
            x.forEach(row=>{
                const name = row.name;
                list_registered_devices.push(name);
            });
            console.log(list_registered_devices); // point A
            res.send(list_registered_devices);
        });
        console.log(list_registered_devices); // point B
});


//////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////// LOGIN AUTH ///////////////////////////////////////////

app.get('/login/:username/:password',(req,res)=>{
    const user = req.params.username;
    const pass = req.params.password;

    db.manyOrNone('SELECT password FROM user_detail WHERE username = $1',[user])
        .then(x=>{
                const p = x.password;
                if(p = pass){
                    res.send('Successful login'); // insert here to rediect to homepage
                }
                else{
                    res.send('Failed to login'); // clear password field
                }
        });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////// REGISTER /////////////////////////////////////////////



app.post('/register/:username/:password/:email',(req,res)=>{
    const user = req.params.username;
    const pass = req.params.password;
    const email = req.params.email;

    if(pass.length>20){
        res.send('Password too long, 20 characters');
    }
    else{
        // db.none('INSERT INTO user_detail($1,$2,$3,NOW())',[user,pass,email])
        //     .catch(e=>res.send('Username taken $1',[e]));
        console.log(user);
        console.log(pass);
        console.log(email);
        res.send(user+pass+email);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

// app.post('/test/:id/:name',(req,res)=>{
//     const id = req.params.id;
//     const name = req.parmas.name;
//
//     db.none('INSERT INTO tester (id,name) VALUES ($1,$2)',[id,name]);
//     res.send('done');
// });
//
// app.post('/login', (req, res) => {
//     res.send('done');
// });

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

module.exports = db;
