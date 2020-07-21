const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const L = require('./components/loginPage');
const D = require('./components/devices');
const P = require('./components/profiles');
const R = require('./components/ratings');
const S = require('./components/settings');
const T = require('./components/testing codes');
const H = require('./components/hardware');
const Hash = require('./components/hashing');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/login-Auth',L.getLoginAuth); // login auth //
app.post('/register',L.createAccount); // register Account //
app.post('/email',L.emailAuth);
app.post('/test',L.test);
app.get('/verify',L.verify);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/connected-devices-homepage/:id',D.getConnectedDevice); // get basic info on registered DEVICES //
app.post('/push-to-device/',D.sendDevice);
app.get('/profile/connected-devices-profile/:id',D.getFullConnectedDevice); // get full info on registered DEVICES //
app.post('/profile/register-new-device/:user_id',D.registerNewDevice); // add new device to Account //
app.get('/devices/active/:id',D.getFullConnectedDevice);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/top-5-rated',R.getTopRated); // get info on the top 5 SETTINGS //
app.get('/newly-posted',R.getNewPost); // get info on the 5 newest SETTINGS //
app.put('/upVote/:id',R.upVote);
app.put('/downVote',R.downVote);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/getProfile/:id',P.getProfile); // get profile info //
app.post('/profile-initial/:id', P.initialProfile);
app.post('/profile-update/:id',P.updateProfile);
app.get('/getUserDetails/:id', P.getUserDetails);
app.get('/browse-user-settings/:user', P.browseUserSettings);
app.get('/browse-user-profile/:user', P.browseUserProfile);
app.get('/browse-user-details/:user', P.browseUserDetails);
app.put('/update-comment/:settings_id', P.updateComment);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/browse/settings-g',S.getGeneralSettings); // get list of all shared SETTINGS //
app.post('/un-upload/',S.removeUpload);
app.get('/settings-p/:id',S.getPrivateSettings); // get all private SETTINGS //
app.post('/settings-p',S.addNewSettings); // add a saved SETTINGS //
app.post('/settings-p/upload',S.uploadSettings); //
app.put('/edit-settings/', S.editSettings);
app.put('/delete-settings/', S.deleteSettings);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/test-post-data1/:id/:name',T.testUploadData1);
app.post('/test-post-data2/:id/:name',T.testUploadData2);
app.get('/test-get-data1',T.testGetData1);
app.get('/test-get-data2',T.testGetData2);
app.post('/test-update/:id/:name',T.testUpdateData);
app.post('/test-delete/:id',T.testDeleteData);
app.put('/update-data1',T.updateData1);
app.get('/testing-site/:id',T.testingCode);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/connected_device/:device_id/set_settings/:setting_id',H.hardware_connect);
app.post('/hardware-control',H.hardwareControlTest);
app.get('/hardware-control-code',H.hardwareCodeTest);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/hash',Hash.idMaker);


module.exports = app;
