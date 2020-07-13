const db = require('../database-module');

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
    const settings_id = req.body.id;
    db.none('UPDATE shared_settings SET rating=rating+1 WHERE settings_id = $1',[settings_id])
        .then(()=>res.status(200).json({status:'success'}))
            .catch(err=>res.status(500).json({err}));
}

function downVote(req,res){
    const settings_id = req.body.id;
    db.none('UPDATE shared_settings SET rating=rating-1 WHERE settings_id = $1',[setting_id])
        .then(()=>res.status(200).json({status:'success'}))
            .catch(err=>res.status(500).json({err}));
}
module.exports = {
    getTopRated: getTopRated,
    getNewPost: getNewPost,
    upVote: upVote,
    downVote: downVote
};
