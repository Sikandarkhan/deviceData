const database = require('./database');
const dynogels = database.dynogels;
const ddb = database.ddb;

const tableName = require('./config').TABLE_NAME;

// // Creating a table is an async operation
const createTables = (tableName,callback)=> {
    const tableSettings = {};
    tableSettings[tableName] = { //default settings for the table
        readCapacity: 5,
        writeCapacity: 1
    };
    dynogels.createTables(tableSettings, (err) => {
    if (err) {
        console.log('Error creating table: ', err);
    } else {
        console.log('Table has been created');
        callback(true);
    }
});
};

//Check if the table exists
const checkTableState = (tablename, statusCallback)=> {
    statusCallback = statusCallback || console.log;
    ddb.describeTable({ TableName: tablename }, (err, response) => {
        if (err) {
            console.log('\nerr', 'Table not found');
            statusCallback(false);
        }
        else {
            console.log(`${tablename} is the active table`);
            statusCallback(true);
        }
    });
};

const checkAndCreateTable = (tableName, callback)=> {
    callback = callback || console.log;
    checkTableState(tableName, exists =>{
        if(!exists){
            createTables(tableName,done => {
               if (done) {
                   console.log(`Created the table: ${tableName}`);
                  callback();
               }
           });
       } else {
           callback();
       }
    })
};

module.exports = {
    tableName,
    checkTableState,
    createTables,
    checkAndCreateTable
}