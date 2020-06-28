const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const Q = require("./queries");

app.post('/login-Auth',Q.getLoginAuth); // login auth //
app.post('/register',Q.createAccount); // register Account //
app.get('/connected-devices-homepage/:user_id',Q.getConnectedDevice); // get basic info on registered DEVICES //
app.get('/top-5-rated',Q.getTopRated); // get info on the top 5 SETTINGS //
app.get('/newly-posted',Q.getNewPost); // get info on the 5 newest SETTINGS //
app.get('/profile/info/:user_id',Q.getProfile); // get profile info //
app.get('/profile/connected-devices-profile/:user_id',Q.getFullConnectedDevice); // get full info on registered DEVICES //
app.post('/profile/register-new-device/:user_id/:device_id',Q.registerNewDevice); // add new device to Account //
app.get('/devices/active/:user_id',Q.getFullConnectedDevice);
app.get('/browse/settings-g',Q.getGeneralSettings); // get list of all shared SETTINGS //
app.get('/settings-p/:user_id',Q.getPrivateSettings); // get all private SETTINGS //
app.post('/settings-p/:user_id/add/:name/:temperature/:water/:light/:humidity',Q.addNewSettings); // add a saved SETTINGS //
app.post('/settings-p/:user_id/:setting_id/upload',Q.uploadSettings); //

app.post('/test-post-data1',Q.testUploadData1);
app.post('/test-post-data2',Q.testUploadData2);
app.get('/test-get-data1',Q.testGetData1);
app.get('/test-get-data2',Q.testGetData2);

module.exports = app;
