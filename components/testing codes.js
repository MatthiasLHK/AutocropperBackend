const db = require('../database-module');

//////////////////////////////////////// TESTING FUNCTIONS /////////////////////////////////////////////////////
// function testingCode(req,res){
//     console.log("Starting Test code!");
//     // const id = req.params.id;
//     var test = [];
//     function help(x){
//         return db.manyOrNone('SELECT * FROM user_detail WHERE user_id = $1',[x]);
//     }
//     const t = [1,3,4];
//     t.forEach(x=>{
//         test.push(new Promise((resolve,reject)=>{resolve(help(x));}));
//     });
//     console.log(test);
//     Promise.all(test).then(x=>{console.log(x);});
// }

function testingCode(req,res){
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
        return db.multi('SELECT * FROM devices WHERE device_id = 1001;SELECT * FROM user_device WHERE device_id = 1001')
            .then(data=>{
                const x = data[0][0];
                const y = data[1][0];
                // console.log(x);
                // console.log(y);
                var temp = [];
                temp.push(x.device_id == null);
                temp.push(x.device_id);
                temp.push(x.setting_name);
                temp.push(x.temperature);
                temp.push(x.water);
                temp.push(x.light);
                temp.push(x.humidity);
                temp.push(x.edited_on);
                temp.push(y.power_on);
                // console.log(temp);
                return temp;
            });
    }
    function push(x){
        x.forEach(y=>{
            info.push(getInfo(y));
        });
        return info;
    }
    Promise.resolve(getIDs(id))
        .then(x=>{
            // console.log(x);
            x.forEach(id=>{
                // console.log(id);
                // console.log(getInfo(id));
                info.push(getInfo(id));
            });
            console.log(info);
            return info;
        })
        .then(x=>{
            Promise.all(x).then(y=>{res.send(y)});
        });
    // function push(z){
    //     z.forEach(x=>{
    //         info.push(new Promise((resolve,reject)=>{resolve(getInfo(x));}));
    //     });
    //     return info;
    // }
    // Promise.resolve(getInfo(1001)).then(x=>console.log(x));
    // Promise.resolve(getIDs(id)).then(y=>getInfo(y)).then(x=>Promise.all(x));
    // var one = [];
    // Promise.resolve(getInfo(1001)).then(x=>one=x);
    // console.log(one);
}

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////// JONAS TEST FUNCTIONS //////////////////////////////////////////////////////////////
function updateData1(req,res){
    const user = 1;
    const name = "testing";
    db.none('update tester1 set id = $1, name = $2 where id = 1' , [user, name]).then(x=>{res.send(200).json({
        status: 'success',
        message: 'updated'
    })});
}


module.exports = {
    testGetData1: testGetData1,
    testGetData2: testGetData2,
    testUploadData1: testUploadData1,
    testUploadData2: testUploadData2,
    testUpdateData: testUpdateData,
    testDeleteData: testDeleteData,
    updateData1: updateData1,
    testingCode: testingCode,
};
