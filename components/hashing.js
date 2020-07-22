const ascii = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9"];

function idMaker(){
    const min = 0;
    const max = 34;
    var code = "";
    for(i=0; i<10; i++){
        var ran = parseInt(Math.random()*(max-min)+min);
        // if(ran == 60 || ran == 62){
        //     ran = ran + 1;
        // }
        const d = ascii[ran];
        code = code + d;
        // console.log(code);
    }
    return code;
}

module.exports = {
    idMaker: idMaker
};
