const db = require('../database-module');
const nodemailer = require("nodemailer");
const path = require('path');
const Hash = require('./hashing');

function createAccount(req,res){
    const user = req.body.username;
    var pass = req.body.password;
    const email = req.body.email;
    const auth = Math.floor(Math.random()*1000000);
    const id = Hash.idMaker();
    if(pass.length>20){
        res.end('Password too long, 20 characters'); // need check again;
    }
    else{
        pass = Hash.hasher(pass);
        db.none('INSERT INTO user_detail(user_id,username,password,email,created_on,authcode) VALUES($1,$2,$3,$4,NOW(),$5)',[id,user,pass,email,auth])
            .then(()=>{
                db.one('SELECT user_id FROM user_detail WHERE username = $1',[user])
                    .then(x=>{
                        emailAuth(email,x.user_id)
                        .then(res.status(200).json({status:'Success',message:'Account Registered Successfully!'}));
                    })
                    .catch(err=>res.status(500).json(err));
            })
            .catch(err=>res.status(500).json(err));
    }
}

function getLoginAuth(req,res){
    console.log("getLoginAuth function is called");
    const user = req.body.username;
    const pass = req.body.password;
    db.one('SELECT * FROM user_detail WHERE username = $1',[user])
        .then(x=>{
                const p = x.password;
                const id = x.user_id;
                const verified = x.verified;
                if(verified){
                    console.log("verified");
                    console.log(p);
                    console.log(pass);
                    console.log(Hash.checkPass(p,pass));
                    if(Hash.checkPass(p,pass)){
                        console.log("Pass is correct");
                        res.status(200).json({status:'Success',message:'Login Successful', user_id: {id}}); // insert here to rediect to homepage
                    }
                    else {
                        res.status(200).json({status:'Failed',message:'Failed to login(Pass wrong)'}); // clear password field
                    }
                }
                else{
                    console.log("Not verified");
                    res.status(200).json({status:'Failed',message:'Failed to login(Not verified)'});
                }
        })
        .catch(x=>res.status(200).json({status:'Failed',message:'Failed to login(Username wrong)'}));
}


async function emailAuth(email,id){
    console.log(email);
    console.log(id);
    const link = await linkMaker(id);
    console.log(link);
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
        from: 'AutoCroppers <orbital.autocropper@gmail.com>',
        to: email,
        subject: 'Autocropper testing 1',
        html: `<h1>AutoCropper Registration!</h1>
                <p>Sir/Mdm:
                <br>Thank you for registering with AutoCroppers! Please proceed to verify your registration
                to start using your account!
                <br>Click here:<a href=${link}>VERIFY</a>
                </p>`
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

async function linkMaker(id){
    const data = await db.one('SELECT authcode FROM user_detail WHERE user_id = $1',[id]);
    const auth = data.authcode;
    var link = "https://autocropperverify.herokuapp.com/";
    // var link = "https://localhost:3000/";
    link = link+id+"/"+auth;
    return link;
}

async function verify(req,res){
    const id = req.body.user_id;
    const code = req.body.authcode;
    console.log(id);
    console.log(code);
    const authcode = await db.one('SELECT authcode FROM user_detail WHERE user_id = $1',[id]);
    if(code == authcode.authcode){
        return db.none('UPDATE user_detail SET verified=true WHERE user_id = $1',[id]);
    }
    else{
        return res.status(500).json({status:'Failed'});
    }
}

function test(req,res){
    // linkMaker(1).then(x=>console.log(x)).catch(err=>console.log(err)); // link linkMaker
    // emailAuth("huankang1998@gmail.com").then(res.status(200).json({status:'Success'}));
    // verify(2,383239).then(x=>console.log(x));
}

module.exports = {
    createAccount: createAccount,
    getLoginAuth: getLoginAuth,
    emailAuth: emailAuth,
    linkMaker: linkMaker,
    test: test,
    verify: verify
};
