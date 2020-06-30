const pgp = require('pg-promise')();
const cn = 'postgres://MatthiasLHK:autocropper123@db-autocropper-v2.czixlgpzza3d.ap-southeast-1.rds.amazonaws.com:5432/autocropperdb';
const db = pgp(cn);



function createAccount(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    const email = req.body.email;

    if(pass.length>20){
        res.end('Password too long, 20 characters'); // need check again;
    }
    else{
        db.none('INSERT INTO user_detail(username,password,email,created_on) VALUES($1,$2,$3,NOW())',[user,pass,email])
            .then(()=>{res.status(200).json({status:'Success',message:'Account Registered Successfully!'});})
            .catch(e=>res.send('Username taken, $1',[e])); // change the catch, follow jonas edit
        // res.send(user+pass+email);
    }
}

function getLoginAuth(req,res){
    const user = req.body.user;
    const pass = req.body.pass;
    db.one('SELECT password FROM user_detail WHERE username = $1',[user])
        .then(x=>{
                const p = x.password;
                if(p == pass){
                    res.status(200).json({status:'Success',message:'Login Successful'}); // insert here to rediect to homepage
                }
                else{
                    res.status(500).json({status:'Failed',message:'Failed to login'}); // clear password field
                }
        });
}

function getConnectedDevice(req,res){
    const id = req.body.id;
    db.manyOrNone('SELECT pair_id, device_id, registered_on, power_on FROM user_device WHERE user_id = $1',[id]).then(x=>{res.send(x)});
}

function getFullConnectedDevice(req,res){
    const id = req.body.id;
    db.manyOrNone('SELECT pair_id, device_id, registered_on, power_on FROM user_device WHERE user_id = id')
        .then(x=>{
            const device_ids = [];
            x.forEach(row=>{
                device_ids.push(row.device_id);
            });
            const fullSettings = [];
            device_ids.forEach(r=>{
                db.one('SELECT * FROM devices WHERE device_id = $1',[r])
                    .then(y=>{
                        fullSettings.push(y);
                    })
                        .then(res.send(fullSettings));
            });
        });
}

function getTopRated(req,res){
    db.manyOrNone('SELECT * FROM shared_settings ORDER BY rating DESC')
        .then(x=>{
            const result = [];
            for(var i=0; i<5; i++){
                result.push(x[i]);
            }
            res.send(result);
        });
}

function getNewPost(req,res){
    db.manyOrNone('SELECT * FROM shared_settings ORDER BY last_updated_on DESC')
        .then(x=>{
            const result = [];
            for(var i=0; i<5; i++){
                result.push(x[i]);
            }
            res.send(result);
        });
}

function getProfile(req,res){
    const id = req.body.user_id;
    db.one('SELECT * FROM user_detail WHERE user_id = $1',[id]).then(x=>res.send(x));
}

function registerNewDevice(req,res){
    const id = req.body.user_id;
    const device = req.body.device_id;
    db.none('INSERT INTO user_device(user_id,device_id,registered_on,power_on VALUES($1,$2,NOW(),FALSE)',[id,device])
        .then(()=>{
            res.status(200).json({status:'Success',message:'Added new device'});
        });
}

function getGeneralSettings(req,res){
    db.manyOrNone('SELECT * FROM shared_settings')
        .then(x=>{res.send(x);});
}

function getPrivateSettings(req,res){
    const id = req.body.user_id;
    db.manyOrNone('SELECT * FROM private_settings WHERE user_id = $1',[id])
        .then(x=>{res.send(x);});
}

function addNewSettings(req,res){
    const name = req.body.name;
    const id = req.body.user_id;
    const temperature = req.body.temperature;
    const water = req.body.water;
    const light = req.body.light;
    const humid = req.body.humidity;
    db.none('INSERT INTO private_settings(user_id,setting_name,temperature,water,light,humidity,last_updated) VALUES($1,$2,$3,$4,$5,$6,NOW())'
        ,[id,name,temperature,water,light,humid])
            .then(()=>{
                res.status(200).json({status:'Success',message:'Settings Saved'});
            });
}

function uploadSettings(req,res){
    const id = req.body.user_id;
    const setting_id = req.body.setting_id;
    db.one('SELECT * FROM private WHERE user_id = $1,setting_id = $2',[id,setting_id])
        .then(x=>{
            db.none('INSERT INTO shared_settings(user_id,setting_name,temperature,water,light,humidity,last_updated) VALUES($1,$2,$3,$4,$5,$6,NOW())'
                ,[x.user_id,x.setting_id,x.temperature,x.water,x.light,x.humidity])
                    .then(()=>{
                        res.status(200).json({status:'Success',message:'Settings Uploaded'});
                    });
        });
}

function uploadProfile(req,res){
    const id = req.body.id;
    const bio = req.body.bio;
    const image = req.body.image;
    if(bio.length>10485760){
        res.status(500).json({status:'Failed',message:'Bio too long'});
    }
    else{
        db.none('INSERT INTO profiles(user_id,bio,picture_url) VALUES($1,$2,$3)',[id,bio,image])
            .then(()=>{
                res.status(200).json({status:'Successful',message:'Profile Created'});
            });
    }
}

function getProfile(req,res){
    const id = req.body.id;
    db.one('SELECT * FROM profiles WHERE user_id = $1',[id])
        .then(x=>{
            res.send(x);
        });
}

function updateProfile(req,res){
    const id = req.body.id;
    const bio = req.body.bio;
    const image = req.body.image;
    db.none('UPDATE profiles WHERE user_id = $1 SET bio = $2, picture_url = $3',[id,bio,image])
        .then(()=>{
            res.status(200).json({status:'Successful',message:'Updated User Profile!'});
        });
}

////////////////////////////////////////// UNIT TESTING FUNCTIONS //////////////////////////////////////////

function testGetData1(req,res){
    db.manyOrNone('SELECT * FROM tester1').then(x=>{res.send(x)});
}

function testGetData2(req,res){
    db.manyOrNone('SELECT * FROM tester2').then(x=>{res.send(x)});
}

function testUploadData1(req,res){
    const id = req.params.id;
    const name = req.params.name;
    db.none('INSERT INTO tester1(id,name) VALUES($1,$2)',[id,name])
        .then(()=>{
            res.status(200).json({status:'success',message:'added'});
        }).catch(e=>{res.send(e)});
}

function testUploadData2(req,res){
    const id = req.params.id;
    const name = req.params.name;
    db.none('INSERT INTO tester2(id,name) VALUES($1,$2)',[id,name])
        .then(()=>{
            res.status(200).json({status:'success',message:'added'});
        }).catch(e=>{res.send(e)});
}

function testUpdateData(req,res){
    const id = req.params.id;
    const name = req.params.name;
    db.none('UPDATE tester1 SET name = $2 WHERE id = $1',[id,name])
        .then(()=>{
            res.status(200).json({status:'Success',message:'Successfully Updated Data'});
        }).catch(x=>{res.send('Failed to update data');});
}

function testDeleteData(req,res){
    const id = req.params.id;
    db.none('DELETE FROM tester1 WHERE id = $1',[id])
        .then(()=>{
            res.status(200).json({status:'success',message:'Data Removed'});
        })
            .catch(x=>{
                res.status(500).json({status:'failure',message:'Failed to Delete'});
            });
}

module.exports = {
    getLoginAuth: getLoginAuth,
    createAccount: createAccount,
    getConnectedDevice: getConnectedDevice,
    getTopRated: getTopRated,
    getNewPost: getNewPost,
    getProfile: getProfile,
    getFullConnectedDevice: getFullConnectedDevice,
    registerNewDevice: registerNewDevice,
    getFullConnectedDevice: getFullConnectedDevice,
    getGeneralSettings: getGeneralSettings,
    getPrivateSettings: getPrivateSettings,
    addNewSettings: addNewSettings,
    uploadSettings: uploadSettings,
    testGetData1: testGetData1,
    testGetData2: testGetData2,
    uploadProfile: uploadProfile,
    getProfile: getProfile,
    updateProfile: updateProfile,
    testUploadData1: testUploadData1,
    testUploadData2: testUploadData2,
    testUpdateData: testUpdateData,
    testDeleteData: testDeleteData

};
