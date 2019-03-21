const Joi = require('joi');
const SchemaModel = require('../config/schema');

const tableName = `patient-device-details`;
const optionalKeys = ['address','age','deviceid'];
const PatientAndDeviceSchema = {
    hashKey: 'nurseid',
    rangeKey: 'patientid',
    timestamps: true,
    schema: Joi.object({
        deviceid:Joi.string(),
        nurseid: Joi.string(),
        patientid: Joi.string(),
        name: Joi.string(),
        age: Joi.number(),
        address: Joi.object(),
        bednumber: Joi.number(),
        joinedAt:Joi.string(),
        lastseen:Joi.string(),
        count:Joi.number()
	}).optionalKeys(optionalKeys).unknown(true)
};
const attToGet = ['patientid','nurseid','name','age','address','deviceid','bednumber','joinedAt','lastseen','count'];
const attToQuery = ['patientid','nurseid','name','age','address','deviceid','bednumber','joinedAt','lastseen'];

const optionsObj  = {
    attToGet,
    attToQuery,
    tableName:tableName
};
const Patient = SchemaModel(PatientAndDeviceSchema,optionsObj);

module.exports = Patient;