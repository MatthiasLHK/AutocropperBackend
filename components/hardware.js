const db = require('../database-module');

///////////////////////////////////////// HARDWARE PART //////////////////////////////////////////

function hardware_connect(req,res){ // for testing, set device to be 1001
                                    // and change the url such that para is in the axios part in frontend
    const id = req.params.device_id;
    db.one('SELECT * FROM devices WHERE device_id = $1',[id])
        .then(x=>{
            var data = 0;
            data=parseInt(x.temperature)*1000000 + parseInt(x.water*10000) + parseInt(x.light*100) + parseInt(x.humidity);
            data = data.toString();
            res.send(data);
        });
}

function hardwareControlTest(req,res){
    const id = req.body.id;
    db.none("UPDATE hardware SET code = $1 WHERE id = 1",[id])
        .then(()=>{res.status(200).json({status:'Success'});});
}

function hardwareCodeTest(req,res){
    db.one('SELECT code FROM hardware WHERE id = 1')
        .then(x=>{
            // console.log(x.code);
            res.send(x.code.toString());
        });
}

module.exports = {
    hardware_connect: hardware_connect,
    hardwareControlTest: hardwareControlTest,
    hardwareCodeTest: hardwareCodeTest,
};
