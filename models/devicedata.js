const Joi = require('joi');
const SchemaModel = require('../config/schema');

const optionalKeys = ['flag','patientid','date'];

const deviceDataSchema = {
    hashKey: 'deviceid',
    rangeKey: 'id',
    timestamps: true,
    schema: Joi.object({
        id:Joi.string(),
        patientid: Joi.string(),
        deviceid: Joi.string(),
        flag: Joi.number(),
        createdAt: Joi.string(),
        date:Joi.string()
    }).optionalKeys(optionalKeys).unknown(true)
};

const attToGet = ['patientid','deviceid', 'flag','createdAt','date'];
const attToQuery = ['patientid','deviceid', 'flag','createdAt'];

const optionsObj  = {
    attToGet,
    attToQuery,
    tableName:'device-data'
};

const DeviceData = SchemaModel(deviceDataSchema,optionsObj);

module.exports = DeviceData;