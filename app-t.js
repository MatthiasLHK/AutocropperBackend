const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/verify.htm'));
  //__dirname : It will resolve to your project folder.
});

app.use('/', router);
app.listen(process.env.port || 3000);
