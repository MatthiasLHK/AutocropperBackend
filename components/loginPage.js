const db = require('../database-module');
const nodemailer = require("nodemailer");

function createAccount(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    const email = req.body.email;
    const auth = Math.floor(Math.random()*1000000);
    if(pass.length>20){
        res.end('Password too long, 20 characters'); // need check again;
    }
    else{
        db.none('INSERT INTO user_detail(username,password,email,created_on,authcode) VALUES($1,$2,$3,NOW(),$4)',[user,pass,email,auth])
            .then(()=>{
                db.one('SELECT user_id FROM user_detail WHERE username = $1',[user])
                    .then(x=>{
                        emailAuth(email,x.user_id)
                        .then(res.status(200).json({status:'Success',message:'Account Registered Successfully!'}));
                    })
                    .catch(err=>res.status(500).json(err));
            })
            .catch(err=>res.status(500).json(err)); // change the catch, follow jonas edit
    }
}

// function getLoginAuth(req,res){
//     const user = req.body.username;
//     const pass = req.body.password;
//     db.one('SELECT * FROM user_detail WHERE username = $1',[user])
//         .then(x=>{
//                 const p = x.password;
//                 const id = x.user_id;
//                 if(p == pass){
//                     res.status(200).json({status:'Success',message:'Login Successful', user_id: {id}}); // insert here to rediect to homepage
//                 }
//                 else {
//                     res.status(200).json({status:'Failed',message:'Failed to login'}); // clear password field
//                 }
//         });
// }

function getLoginAuth(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    db.one('SELECT * FROM user_detail WHERE username = $1',[user])
        .then(x=>{
                const p = x.password;
                const id = x.user_id;
                const verified = x.verified;
                if(verified){
                    if(p == pass){
                        res.status(200).json({status:'Success',message:'Login Successful', user_id: {id}}); // insert here to rediect to homepage
                    }
                    else {
                        res.status(200).json({status:'Failed',message:'Failed to login(Pass/user wrong)'}); // clear password field
                    }
                }
                else{
                    res.status(500).json({status:'Failed',message:'Failed to login(Not verified)'});
                }
        })
        .catch(x=>res.status(500).json({status:'Failed',message:'Failed to login(Overall)'}));
}


async function emailAuth(email,id){
    console.log(email);
    console.log(id);
    const link = await linkMaker(id);
    // const link = "https://www.youtube.com/watch?v=scsRp6qgyoY&t=415s";
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

        // html: "Test message 1"
        html: '<h1>AutoCropper Registration!</h1><p>Sir/Mdm:<br>Thank you for registering with AutoCroppers! Please proceed to verify your registration to start using your account!<br>Click here:<a href={link}>VERIFY</a></p>'
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

function test(req,res){
    // linkMaker(1).then(x=>console.log(x)).catch(err=>console.log(err)); // link linkMaker
    emailAuth("huankang1998@gmail.com").then(res.status(200).json({status:'Success'}));
}

async function linkMaker(id){
    // const data = await db.one('SELECT verified FROM user_detail WHERE user_id = $1',[id]);
    // const auth = data.verified;
    const data = await db.one('SELECT authcode FROM user_detail WHERE user_id = $1',[id]);
    const auth = data.authcode;
    var link = "frontend-url/verify/";
    link = link+id+"/"+auth;
    return link;
}

module.exports = {
    createAccount: createAccount,
    getLoginAuth: getLoginAuth,
    emailAuth: emailAuth,
    linkMaker: linkMaker,
    test: test
};
