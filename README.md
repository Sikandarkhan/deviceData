I.PROJECT NAME

    deviceData

II.PREREQUISITES

    Node.js
    Node Package Manager(npm)

III.Folder Architecture & Description

    --config
    
    	---config.js (configuration of environment keys)
        ---aws-config.js
        ---database.js
        ---schema.js
        ---table.js
    
    --models
    
    	---device.js (definition of device pairing schema )
    
    	---devicedata.js (definition of device data(Movement flags) schema )

        ---patient-device-data.js (definition of patient data schema)
    
    
    ---updateValue.js 
    ---pubMessage.js(to publish a message to a topic)

IV.Running Locally

    a.git clone https://github.com/Sikandarkhan/deviceData
    
    b.cd deviceData
    
    c.npm install
    
    npm start or node updateValue.js or nodemon start  updateValue.js
	
V.Testing:

    a. run node pubMessage.js
    
    Your app should recieve the message and inserted the data in DynamoDB.
    
    Note:Parameter list need to be changed based on the requirement
