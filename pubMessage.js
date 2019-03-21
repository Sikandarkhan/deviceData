const awsIot = require('aws-iot-device-sdk');
const device = awsIot.device({
    keyPath: './MessageBroker/eaca24cf92-private.pem.key',
    certPath: './MessageBroker/eaca24cf92-certificate.pem.crt',
    caPath: './MessageBroker/AmazonRootCA1.pem',
    clientId: 'sjbddhsbsbfhvbsvbsnbfbfsjfsjdf',
    host: 'a2qq8o64rgd3z6.iot.ap-south-1.amazonaws.com'
});
// const device = awsIot.device({
//     keyPath: '/etc/pubsub/eaca24cf92-private.pem.key',
//     certPath: '/etc/pubsub/eaca24cf92-certificate.pem.crt',
//     caPath: '/etc/pubsub/AmazonRootCA1.pem',
//     clientId: 'SmartmilkBottle',
//     host: 'a2qq8o64rgd3z6.iot.ap-south-1.amazonaws.com'
// });
device.subscribe('Iot-AWS');
var data = JSON.stringify({
    "status": "success",
    "data":{
        deviceid:"A1:B2:C3:D3",
        flag:1
    },
});
console.log(data, typeof data);
device.publish('Iot-AWS', data);
console.log('message sends successfully...');