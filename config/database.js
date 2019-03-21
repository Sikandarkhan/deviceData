const dynogels = require('dynogels');
const storeName = require('./config').STORE_NAME;

const AWS = require('./aws-config');

const ddb = new AWS.DynamoDB();
dynogels.dynamoDriver(ddb);

module.exports = {
    dynogels,
    ddb,
    storeName,
};