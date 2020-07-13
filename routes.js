const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const Q = require("./queries");

app.post('/login-Auth',Q.getLoginAuth); // login auth //
app.post('/register',Q.createAccount); // register Account //
app.get('/connected-devices-homepage/:id',Q.getConnectedDevice); // get basic info on registered DEVICES //
app.get('/top-5-rated',Q.getTopRated); // get info on the top 5 SETTINGS //
app.get('/newly-posted',Q.getNewPost); // get info on the 5 newest SETTINGS //
app.get('/getProfile/:id',Q.getProfile); // get profile info //
app.get('/profile/connected-devices-profile/:id',Q.getFullConnectedDevice); // get full info on registered DEVICES //
app.post('/profile/register-new-device/:user_id',Q.registerNewDevice); // add new device to Account //
app.get('/devices/active/:id',Q.getFullConnectedDevice);
app.get('/browse/settings-g',Q.getGeneralSettings); // get list of all shared SETTINGS //
app.get('/settings-p/:id',Q.getPrivateSettings); // get all private SETTINGS //
app.post('/settings-p',Q.addNewSettings); // add a saved SETTINGS //
app.post('/settings-p/upload',Q.uploadSettings); //
app.post('/profile-initial/:id', Q.initialProfile);
app.post('/profile-update/:id',Q.updateProfile);
app.get('/getUserDetails/:id', Q.getUserDetails);
app.get('/browse-user-settings/:user', Q.browseUserSettings);
app.get('/browse-user-profile/:user', Q.browseUserProfile);
app.get('/browse-user-details/:user', Q.browseUserDetails);
app.put('/update-comment/:settings_id', Q.updateComment);
app.post('/push-to-device/:setting_id/:device_id',Q.sendDevice);
app.post('/un-upload/',Q.removeUpload);

app.post('/test-post-data1/:id/:name',Q.testUploadData1);
app.post('/test-post-data2/:id/:name',Q.testUploadData2);
app.get('/test-get-data1',Q.testGetData1);
app.get('/test-get-data2',Q.testGetData2);
app.post('/test-update/:id/:name',Q.testUpdateData);
app.post('/test-delete/:id',Q.testDeleteData);
app.get('/connected_device/:device_id/set_settings/:setting_id',Q.hardware_connect);
app.put('/update-data1',Q.updateData1);
app.post('/hardware-control',Q.hardwareControlTest);
app.get('/hardware-control-code',Q.hardwareCodeTest);

app.get('/testing-site/:id',Q.testingCode);

module.exports = app;
