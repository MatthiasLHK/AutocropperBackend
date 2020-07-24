const db = require('../database-module');

function initialProfile(req,res){
    const id = req.params.id;
    const name = "";
    const bio = "";
    const picture = "";
    const location = "";
    const company = "";
        db.none('INSERT INTO profiles(user_id,name,user_bio,picture_url,location,company) VALUES($1,$2,$3,$4,$5,$6)',[id,name,bio,picture,location,company])
            .then(()=>{
                res.status(200).json({status:'Success',message:'Initialise empty profile'});
            }).catch(err=>{console.log(err)});
}

function updateComment(req, res) {
    const id = req.params.settings_id;
    const comment = req.body.comments;
    const shared = req.body.shared;
    db.none('UPDATE private_settings SET comments = $1 WHERE settings_id = $2', [comment, id])
        .then(() => {
            if (shared) {
                db.none('UPDATE shared_settings SET comments = $1 WHERE settings_id = $2', [comment, id])
                    .then(() => {
                        res.status(200).json({status: 'Success', message: "Updated Comments only in private and shared settings"});
                    })
            } else {
                res.status(200).json({status: 'Success', message: "Updated Comments only in private settings"});
            }
        }).catch(err => console.log(err))
}

function getProfile(req,res){
    const id = req.params.id;
    db.one('SELECT * FROM profiles WHERE user_id = $1',[id])
        .then(x=>{
            res.send(x);
        })
        .catch(err => res.send('failed'));
}

function updateProfile(req,res){
    const id = req.params.id;
    const name = req.body.name;
    const bio = req.body.bio;
    const picture = req.body.picture;
    const location = req.body.location;
    const company = req.body.company;
    if(bio.length>10485760){
        res.status(500).json({status:'Failed',message:'Bio too long'});
    }
    else{
        db.none('update profiles set name = $2, user_bio = $3, picture_url = $4, location = $5, company = $6 where user_id = $1',
        [id, name, bio, picture, location, company])
            .then(()=>{
                res.status(200).json({status:'Success',message:'profile updated'});
            });
    }
}

function getUserDetails(req, res) {
    const id = req.params.id;
    db.manyOrNone('SELECT * FROM user_detail WHERE user_id = $1', [id])
        .then(x => res.send(x))
}

function browseUserSettings(req, res) {
    const user = req.params.user;
    db.manyOrNone('SELECT user_id FROM user_detail WHERE username = $1', [user])
        .then(x => {
            const id = x[0].user_id;
            db.manyOrNone('SELECT * FROM shared_settings WHERE user_id = $1', [id])
                .then(data => {
                    res.send(data);
                })
                .catch(err => res.send("no settings"))
        })
        .catch(err => res.send("failed"))
}

function browseUserProfile(req, res) {
    const user = req.params.user;
    db.manyOrNone('SELECT user_id FROM user_detail WHERE username = $1', [user])
        .then(x => {
            const id = x[0].user_id;
            db.manyOrNone('SELECT name, user_bio, picture_url, location, company FROM profiles WHERE user_id = $1', [id])
                .then(data => {
                    res.send(data)
                })
                .catch(err => res.send("no profile"))
        })
        .catch(err => res.send("failed"))
}

function browseUserDetails(req, res) {
    const user = req.params.user;
    db.manyOrNone('SELECT user_id FROM user_detail WHERE username = $1', [user])
        .then( x=> {
            console.log(x);
            const id = x[0].user_id;
            db.manyOrNone('SELECT username, email FROM user_detail WHERE user_id = $1', [id])
                 .then(data => {
                     res.send(data)
                 })

        })
        .catch(err => res.send("failed"))
}

module.exports = {
    initialProfile: initialProfile,
    updateComment: updateComment,
    getProfile: getProfile,
    updateProfile: updateProfile,
    getUserDetails: getUserDetails,
    browseUserSettings: browseUserSettings,
    browseUserProfile: browseUserProfile,
    browseUserDetails: browseUserDetails
};
