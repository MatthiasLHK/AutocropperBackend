const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


const ascii = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9"];



function idMaker(){
    const min = 0;
    const max = 34;
    var code = "";
    for(i=0; i<10; i++){
        var ran = parseInt(Math.random()*(max-min)+min);
        const d = ascii[ran];
        code = code + d;
    }
    return code;
}

function hasher(password){
    const h = bcrypt.hashSync(password,salt);
    return h;
}

function checkPass(hash,password){
    return bcrypt.compareSync(password, hash);
}

function test(req,res){
    res.send(checkPass(1));
}

module.exports = {
    idMaker: idMaker,
    hasher: hasher,
    test: test,
    checkPass: checkPass
};
