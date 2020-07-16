const db = require('../database-module');
const nodemailer = require("nodemailer");

function createAccount(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    const email = req.body.email;

    if(pass.length>20){
        res.end('Password too long, 20 characters'); // need check again;
    }
    else{
        db.none('INSERT INTO user_detail(username,password,email,created_on) VALUES($1,$2,$3,NOW())',[user,pass,email])
            .then(()=>{res.status(200).json({status:'Success',message:'Account Registered Successfully!'});})
            .catch(e=> res.send("failed")); // change the catch, follow jonas edit
        // res.send(user+pass+email);
    }
}

function getLoginAuth(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    db.one('SELECT * FROM user_detail WHERE username = $1',[user])
        .then(x=>{
                const p = x.password;
                const id = x.user_id;
                if(p == pass){
                    res.status(200).json({status:'Success',message:'Login Successful', user_id: {id}}); // insert here to rediect to homepage
                }
                else {
                    res.status(200).json({status:'Failed',message:'Failed to login'}); // clear password field
                }
        });
}

async function emailAuth(email){
    var transport = {
        host: 'smtp.gmail.com', // e.g. smtp.gmail.com
        auth: {
            user: 'orbital.autocropper@gmail.com',
            pass: 'Autocropper123'
        }
    }
    var transporter = nodemailer.createTransport(transport);
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log('All works fine, congratz!');
      }
    });
    var mail = {
        from: 'orbital.autocropper@gmail.com',
        to: email,
        subject: 'Autocropper testing 1',

        html: "Test message 1"
    }

    transporter.sendMail(mail,(err,data)=>{
        if(err){
            res.status(500).json({status:'Failed'});
        }
        else{
            res.status(200).json({status:'Success'});
        }
    });
}

module.exports = {
    createAccount: createAccount,
    getLoginAuth: getLoginAuth,
    emailAuth: emailAuth
};
// exports.createAccount=createAccount;
// exports.getLoginAuth=getLoginAuth;
