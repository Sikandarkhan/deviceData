
var awsIot = require('aws-iot-device-sdk');
const moment = require('moment-timezone');
const deviceData = require('./models/devicedata.js');
const Device = require('./models/device.js');
const patientDevicedata = require('./models/patient-device-data.js');
const randomstring = require("randomstring");

var device = awsIot.device({
    keyPath: '/etc/pubsub/eaca24cf92-private.pem.key',
    certPath: '/etc/pubsub/eaca24cf92-certificate.pem.crt',
    caPath: '/etc/pubsub/AmazonRootCA1.pem',
    clientId: 'Smartwaterbottle12',
    host: 'a2qq8o64rgd3z6.iot.ap-south-1.amazonaws.com'
});

// const device = awsIot.device({
//     keyPath: './MessageBroker/eaca24cf92-private.pem.key',
//     certPath: './MessageBroker/eaca24cf92-certificate.pem.crt',
//     caPath: './MessageBroker/AmazonRootCA1.pem',
//     clientId: 'Pixieee',
//     host: 'a2qq8o64rgd3z6.iot.ap-south-1.amazonaws.com'
// });

device.subscribe('Iot-AWS');
device.on('message', function(topic, payload) {
    console.log('recieved message', topic, payload.toString());
    var message = payload.toString().replace(/\u0000/g,'');
    DeviceUpdatevalue(message,function(err,reply){
        if(err){
            console.log("error while sending Notification:",err);

        }else{
            if(reply.status=="success")
            console.log("data Updated  sends Successfully:",JSON.stringify(reply));
            else
            console.log("eror:",JSON.stringify(reply));
        }

    });

});


DeviceUpdatevalue = (message,callback)=>{
    
    console.log("\n Device data updatevalues api start\n");
    console.log("message:",message);
    var payload = JSON.parse(message);
    //console.log(payload);
    console.log(payload.data);
    var data = payload.data;
    if(data!=undefined){
        const deviceid= data.deviceid;
        const flag = data.flag;
        //console.log("data::",data);
        var datetime = moment(Date.now()).tz('Asia/Kolkata').format('YYYY-MM-DD HH:MM');  // => '2015/01/02 23:14:05'
        var date = moment(Date.now()).tz('Asia/Kolkata').format('YYYY-MM-DD hh:mm a');
        console.log("time::",date);
        Device.getItem({
            deviceid : data.deviceid
        }, {}, (err, devicedata) => {
            if (err) {
                console.log('err: ', err);
                callback(err, {status:'failure',errorDescription:err});

            } else if (Object.keys(devicedata).length === 0) {
                callback(null,{status:'failure',message: 'device not found!'});
            }else{
                //console.log("devicedata::",devicedata);
                const p_id = devicedata.patientid;
                const n_id = devicedata.nurseid;
                console.log("\np_id",p_id);
                console.log("\nn_id",n_id);
                const uid = randomstring.generate({
                    length: 24,
                    charset: 'alphabetic'
                });
                var insertParams ={
                    id:uid,
                    deviceid: data.deviceid,
                    flag: data.flag,
                    patientid: devicedata.patientid,
                    createdAt:datetime,
                    date:date
                };
                deviceData.createItem(insertParams,{table: 'device-data'},   
                (err,item) =>{
                    if(err){
                        console.log('err: ', err);
                        callback(err,{status:'failure',errorDescription:err});
                    }else{
                        //console.log("inserted device data:::",item);
                        deviceData.query(data.deviceid).then((data) => {
                            const count = data.length; 
                            console.log("suma:::",data.length); 
                            var updateParams = {
                                nurseid:n_id,
                                patientid: p_id,
                                lastseen: date,
                                count : count
                            };
                            patientDevicedata.updateItem(updateParams,{},(err, result)=>{
                                if(err){
                                    console.log("error while updating lastseen:" + err);
                                    callback(err,{
                                        status: "error",
                                        message: "Error while updating lastseen"
                                    }); 
                                }else{
                                    //device.subscribe('Iot-AWS-Hackathon');
                                    var data = JSON.stringify({
                                        "status": "success",
                                        "data":{
                                            patientid:p_id,
                                            flag:flag,
                                            lastseen:date,
                                            count:count
                                        },
                                    });
                                    console.log("message to published:::::::",data);
                                    device.publish('Iot-AWS-Hackathon', data);
                                    console.log('message sends successfully...');
                                    //console.log("updated lastseen:::", result);
                                    callback(null,{status:'success',message: 'data updated successfully!'});
                                }

                            });
                            
                        }).catch((err) => {
                            console.log("error while getting all patients::" + err);
                            callback(err,{
                                status: "error",
                                message: "Error while getting all patients"
                            });
                        });
                         
                    }
                    
                });
            }
        });
        

        
    }
    
};
