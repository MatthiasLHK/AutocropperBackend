const db = require('./database-module');

function getConnectedDevice(req,res){
    const id = req.params.id;
    db.manyOrNone('SELECT pair_id, device_id, registered_on, power_on FROM user_device WHERE user_id = $1',[id]).then(x=>{res.send(x)});
}

function getFullConnectedDevice(req,res){
    const id = req.params.id;
    var ids = [];

    function getIDs(x){
        return db.manyOrNone('SELECT device_id FROM user_device WHERE user_id = $1',[x])
            .then(x=>{
                x.forEach(row=>{
                    ids.push(row.device_id);
                });
                return ids;
            });
    }

    var info = [];

    function getInfo(x){
        return db.multi('SELECT * FROM devices WHERE device_id = $1;SELECT * FROM user_device WHERE device_id = $1',[x])
            .then(data=>{
                const x = data[0][0];
                const y = data[1][0];
                var temp = [];
                temp.push(x.device_id);
                temp.push(x.setting_name);
                temp.push(x.temperature);
                temp.push(x.water);
                temp.push(x.light);
                temp.push(x.humidity);
                temp.push(x.edited_on);
                temp.push(y.power_on);
                return temp;
            });
    }
    Promise.resolve(getIDs(id))
        .then(x=>{
            x.forEach(id=>{
                console.log(id);
                info.push(getInfo(id));
            });
            return info;
        })
        .then(x=>{
            Promise.all(x).then(y=>{res.send(y)});
        });
}

function registerNewDevice(req,res){
    const id = req.params.user_id;
    const device = req.body.device_id;
    db.none('INSERT INTO devices(device_id) VALUES($1)',[device])
        .then(
            db.none('INSERT INTO user_device(user_id,device_id,registered_on,power_on) VALUES($1,$2,NOW(),FALSE)',[id,device])
            .then(()=>{
                res.status(200).json({status:'Success',message:'Added new device'});
            })
        );
}

function sendDevice(req,res){
    const setting_id = req.body.setting_id;
    const device_id = req.body.device_id;
    console.log(setting_id);
    console.log(device_id);
    db.one('SELECT * FROM private_settings WHERE settings_id = $1',[setting_id])
        .then(x=>{
            // res.status(200).json(x);
            const t = x.temperature;
            const w = x.water;
            const l = x.light;
            const h = x.humidity;
            const name = x.setting_name;
            db.none('UPDATE devices SET temperature=$1, water=$2, light=$3, humidity=$4, edited_on=NOW(), setting_name=$5 WHERE device_id = $6',[t,w,l,h,name,device_id])
                .catch(err=>{res.status(500).json({status:'Failed',message:'Failed to upload(2)'});});
        })
        // .catch(err=>{res.status(500).json({status:'Failed',message:'Failed to upload(1)'});});
        .catch(err=>res.status(500).json(err));
}

module.exports = {
    getConnectedDevice: getConnectedDevice,
    getFullConnectedDevice: getFullConnectedDevice,
    registerNewDevice: registerNewDevice,
    sendDevice: sendDevice
};
