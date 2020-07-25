const db = require('../database-module');

function getGeneralSettings(req,res){
    db.manyOrNone('SELECT * FROM shared_settings')
        .then(x=>{res.send(x);});
}

function getPrivateSettings(req,res){
    const id = req.params.id;
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
    const comment = req.body.comment;
    console.log(id);
    db.none('INSERT INTO private_settings(user_id,setting_name,temperature,water,light,humidity,last_updated, comments, edited_on) VALUES($1,$2,$3,$4,$5,$6,NOW(), $7, NOW())'
        ,[id,name,temperature,water,light,humid,comment])
            .then(()=>{
                res.status(200).json({status:'Success',message:'Settings Saved'});
            })
            .catch(err=>res.status(200).json({status:'Failed',message:'Value must be between 0 - 100!'}));
}

function uploadSettings(req,res){
    const setting = req.body.setting_id;
    db.none('UPDATE private_settings SET shared = true WHERE settings_id = $1',[setting]);
    db.one('SELECT * FROM private_settings WHERE settings_id = $1',[setting])
        .then(x=>{
            db.none('INSERT INTO shared_settings(settings_id,user_id,setting_name,temperature,water,light,humidity,last_updated,rating,comments,edited_on) VALUES($1,$2,$3,$4,$5,$6,$7,NOW(),0,$8,NOW())'
                ,[setting,x.user_id,x.setting_name,x.temperature,x.water,x.light,x.humidity,x.comments])
                    .then(()=>{
                        res.status(200).json({status:'Success',message:'Settings Uploaded'});
                    }).catch(err=>{console.log(err);});
        })
            .catch(err=>{console.log(err);});
}


function removeUpload(req,res){
    const id = req.body.id;
    db.none('UPDATE private_settings SET shared = false WHERE settings_id = $1',[id]);
    db.none('DELETE FROM shared_settings WHERE settings_id = $1',[id])
        .then(res.status(200).json({status:'success'}))
            .catch(err=>{res.status(500).json({status:'failed'});});
}

function editSettings(req,res) {
    const settings_id = req.body.id;
    const temperature = req.body.temperature;
    const water = req.body.water;
    const light = req.body.light;
    const humidity = req.body.humidity;
    const setting_name = req.body.setting_name;
    const comment = req.body.comment;
    db.none('UPDATE private_settings SET setting_name = $1, temperature = $2, water = $3, light = $4, humidity = $5, last_updated = NOW(), comments = $7 WHERE settings_id = $6',
        [setting_name, temperature, water, light, humidity, settings_id, comment])
        .then(() => {
            res.status(200).json({status: 'Success', message: 'Settings Updated'})
        })
        .catch(err=>res.status(200).json({status:'Failed',message:'Value must be between 0 - 100!'}));
}

function deleteSettings(req, res) {
    const settings_id = req.body.settings_id;
    db.none('DELETE FROM private_settings WHERE settings_id = $1', [settings_id])
        .then(() => res.status(200).json({status: 'Success', message: 'Settings Deleted'}))
        .catch(err => console.log(err))

}

module.exports = {
    getGeneralSettings: getGeneralSettings,
    getPrivateSettings: getPrivateSettings,
    addNewSettings: addNewSettings,
    uploadSettings: uploadSettings,
    removeUpload: removeUpload,
    editSettings: editSettings,
    deleteSettings: deleteSettings
};
