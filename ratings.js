const db = require('./database-module');

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
    db.manyOrNone('SELECT user_id, setting_name, temperature, water, light, humidity FROM shared_settings ORDER BY last_updated DESC')
        .then(x=>{
            const result = [];
            for(var i=0; i<5; i++){
                result.push(x[i]);
            }
            res.send(result);
        });
}

function upVote(req,res){
    const settings_id = req.params.id;

}
module.exports = {
    getTopRated: getTopRated,
    getNewPost: getNewPost
};
