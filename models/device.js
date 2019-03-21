const Joi = require('joi');
const SchemaModel = require('../config/schema');

const optionalKeys = ['createdAt'];

const deviceDataSchema = {
    hashKey: 'deviceid',
    timestamps: true,
    schema: Joi.object({
        patientid: Joi.string(),
        deviceid: Joi.string(),
        nurseid: Joi.string(),
        createdAt: Joi.string(),
    }).optionalKeys(optionalKeys).unknown(true)
};

const attToGet = ['patientid','nurseid','deviceid','createdAt'];
const attToQuery = ['patientid','nurseid','deviceid','createdAt'];

const optionsObj  = {
    attToGet,
    attToQuery,
    tableName:'device-pairing'
};

const DeviceData = SchemaModel(deviceDataSchema,optionsObj);

module.exports = DeviceData;