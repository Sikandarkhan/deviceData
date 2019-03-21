const table = require('./table');
const dynogels = require('./database').dynogels;
const Bluebird = require('bluebird');
module.exports = function (Schema, optionsObj) {
	const tableName = optionsObj.tableName || table.tableName;
	console.log("tableName::", tableName);
	const Model = dynogels.define(tableName, Schema);
	const selectTable = (name) => {
		Model.config({tableName: name});
	};

	// //CRUD operations for Models
	// we can pass an array of items and they will all be created
	const createItem = (params, optionsObj, callback) => {
		const localTable = optionsObj.table || tableName;
		const createCallback = () => {
			selectTable(localTable);
			Model.create(params, {overwrite:optionsObj.overwrite || false}, 
				(err, createdData) => { //{overwrite:false} to not overwrite existing records
				if (err) console.log('\nItem creation err\n', err);
				else {
					console.log('\nCreated an item in the table\n');
					callback(null, createdData.attrs);
				}
			});
		};
		table.checkAndCreateTable(localTable, createCallback);
	};

	const getItem = (params, optionsObj, callback) => {
		const getCallback = (err, result)=> {
			if (err) {
				console.log(`Get item err..\n\n`, err);
				callback(err, {});
			} else if (!result) {
				// console.log('result: ', result);
				console.log(`\nNo item found..`);
				callback(null, false);
			} else {
				console.log(`\nGet item success..`);
				// console.log('result: ', result);
				callback(null, result.attrs);
			}
		};

		if (!optionsObj || !optionsObj.attToGet) {
			Model.get(params, getCallback);
		} else {
			Model.get(params, {
				AttributesToGet: optionsObj.attToGet
			}, getCallback);
		}
	};

	const updateItem = (params, conditionObj, callback)=> {
		Model.update(params, conditionObj, (err, updatedData) => {
			if (err) console.log('\nItem Update error', err);
			else {
				console.log('Updated data');
				callback(null, updatedData.attrs);
			}
		});
	};

	const deleteItem = (params, conditionObj) => {
		//$del will remove items from the object
		Model.destroy(params, conditionObj, (err,data) => {
			if (err) console.log('err:\n\n', err);
			else console.log(`Removed an object with ${params.collectionID} from db`);
		});
	};

	const batchGetItem = (params, conditionObj) => {
		Model.getItems(params, conditionObj, (err, batchData) => {
			if (err) console.log('err:\n\n', err);
			else {
				console.log(`Batch items:\n\n`);
				const dataAttrs = data.Items.map((value)=> value.attrs);
				callback(null,dataAttrs);
			}
		});
	};

	const query = (hashkey) => {

		return new Bluebird((resolve, reject) =>{
		
			const queryCallback = (err, data)=> {
				if (err) {
					console.log('Query error:\n\n', err);
					reject(err);
				}
				else {
					console.log(`\nQuery Batch items:`);
					const dataAttrs = data.Items.map((value)=> value.attrs);
					resolve(dataAttrs);
				}
			};

			if (!optionsObj)
				Model.query(hashkey).loadAll().exec(queryCallback);
			else
				Model.query(hashkey).attributes(optionsObj.attToQuery).exec(queryCallback);
		});

	};




	return {
		selectTable,
		createItem,
		getItem,
		updateItem,
		deleteItem,
		batchGetItem,
		query
	};

};