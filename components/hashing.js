function idMaker(){
    const min = 33;
    const max = 126;
    var code = "";
    for(i=0; i<10; i++){
        var ran = parseInt(Math.random()*(max-min)+min);
        // console.log(ran);
        const d = String.fromCharCode(ran);
        code = code + d;
        // console.log(code);
    }
    console.log(code);
    return code;
}

module.exports = {
    idMaker: idMaker
};
