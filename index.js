
var mysql = require('mysql');
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
    region: 'us-east-1'
});


exports.handler = function (event, context, callback){

var connection = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.database
});

function getResult(game_choice){
    // Querys the database for the game selected by user, if no exact result a list of 5 closest options will be displayed
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM pc_games.steam_games WHERE name LIKE ?";
        connection.query(sql, [game_choice], (err, rows, fields) => {
            if (rows.length > 0){
                console.log(rows)
                console.log("This is being executed")
                resolve(rows)
            }
            if (err){
                console.log(err)
            }
            else{
                console.log("This else is being executed")
                const sql2 = "SELECT * FROM pc_games.steam_games WHERE name LIKE CONCAT(?,'%') AND reccommended_requirements NOT IN ('','NaN') AND types = 'app' LIMIT 5";
                connection.query(sql2, [game_choice], (err, rows, fields) => {
                if (!err && !false){
                    resolve(rows)
                }
                else{
                    reject(console.log(err))
                }
            })
            }
            connection.end()
        })
        
        })

}


async function mining_func(jsonstring){
    // Function that takes response for second lambda function and parses and returns
    // This is tied specifically to mining purpose to skip database query
    const jsonObject2 = JSON.parse(jsonstring)
    const jsonObject = JSON.parse(jsonObject2)
    if (jsonObject.value['Funds'] == false){
            
            let lambda_response = {
            "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                      "contentType": "PlainText",
                      "content": "RECCOMENDED HARDWARE" + "\n" + "\n" + "GPU: " + jsonObject.value['GPU']['Name'] + 
                      "\n" +  "Price: " + jsonObject.value['GPU']['Price'] + "\n" + "Memory: " + jsonObject.value['GPU']["Memory"] + "\n" + "\n" + "CPU: " + 
                      jsonObject.value['CPU']['Name'] + "\n" + "Price: " + jsonObject.value['CPU']['Price'] + "\n" +"Cores/Threads: " +
                      jsonObject.value['CPU']['Cores/Threads'] + "\n" + "Frequency: " + jsonObject.value['CPU']['Base/Boost GHz']
                    }
            }
        }
            console.log(lambda_response)
            callback(null, lambda_response)
            
        }
        
        else{
            let lambda_response = {
            "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                      "contentType": "PlainText",
                      "content": "RECCOMENDED HARDWARE" + "\n" + "\n" + "WARNING: Budget may not be enough for Graphics Card at that resolution. Increase budget." + "\n" + "\n" + "GPU: " + jsonObject.value['GPU']['Name'] + 
                      "\n" +  "Price: " + jsonObject.value['GPU']['Price'] + "\n" + "Memory: " + jsonObject.value['GPU']["Memory"] + "\n" + "\n" + "CPU: " + 
                      jsonObject.value['CPU']['Name'] + "\n" + "Price: " + jsonObject.value['CPU']['Price'] + "\n" +"Cores/Threads: " +
                      jsonObject.value['CPU']['Cores/Threads'] + "\n" + "Frequency: " + jsonObject.value['CPU']['Base/Boost GHz']
                    }
            }
        }
            console.log(lambda_response)
            callback(null, lambda_response)
        }
}



async function final_func2(data, rows, database_num, jsonstring){
    //Parses second lambda response and returns
    //Used for purposes gaming and streaming
    console.log("JSON String" + jsonstring)
    const jsonObject2 = JSON.parse(jsonstring)
    console.log("Object 1" + jsonObject2)
    const jsonObject = JSON.parse(jsonObject2)
    console.log("Object 2" + jsonObject)
        try{
        var statement = "Name: " + rows[database_num].name + "\n" + " Recommended Requirements: " + "\n" + data[database_num][0] + "\n" + data[database_num][1] + "\n" + data[database_num][2] + "\n"    
        }
        catch (err) {
            let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
        
            "message": {       
                "contentType": "PlainText",
                "content": "The database could not find the game you entered." + "\n" + "\n" + "Please Enter Another Game Now:"
        },
        "intentName": "Budget",
        "slots": {
            "Budget_Amount": budget,
            "Purpose": purpose,
            "monitor_resolution": resolution,
            "brand_preference_graphics": brand_preference_graphics,
            "brand_preference_cpu": brand_preference_cpu
        },
        "slotToElicit": "games_played"
        
        } 
    
        };
        callback(null,lambda_response);
    }
        
        if (jsonObject.value['Funds'] == false){
            
            let lambda_response = {
            "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                      "contentType": "PlainText",
                      "content": "Steam Requirements:" + "\n" + statement.toString() + "\n" + "\n" + "RECCOMENDED HARDWARE" + "\n" + "\n" + "GPU: " + jsonObject.value['GPU']['Name'] + 
                      "\n" +  "Price: " + jsonObject.value['GPU']['Price'] + "\n" + "Memory: " + jsonObject.value['GPU']["Memory"] + "\n" + "\n" + "CPU: " + 
                      jsonObject.value['CPU']['Name'] + "\n" + "Price: " + jsonObject.value['CPU']['Price'] + "\n" +"Cores/Threads: " +
                      jsonObject.value['CPU']['Cores/Threads'] + "\n" + "Frequency: " + jsonObject.value['CPU']['Base/Boost GHz']
                    }
            }
        }
            console.log(lambda_response)
            callback(null, lambda_response)
            
        }
        
        else{
            let lambda_response = {
            "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                      "contentType": "PlainText",
                      "content": "Steam Requirements:" + "\n" + statement.toString() + "\n" + "\n" + "RECCOMENDED HARDWARE" + "\n" + "\n" + "WARNING: Budget may not be enough for Graphics Card at that resolution. Increase budget." + "\n" + "\n" + "GPU: " + jsonObject.value['GPU']['Name'] + 
                      "\n" +  "Price: " + jsonObject.value['GPU']['Price'] + "\n" + "Memory: " + jsonObject.value['GPU']["Memory"] + "\n" + "\n" + "CPU: " + 
                      jsonObject.value['CPU']['Name'] + "\n" + "Price: " + jsonObject.value['CPU']['Price'] + "\n" +"Cores/Threads: " +
                      jsonObject.value['CPU']['Cores/Threads'] + "\n" + "Frequency: " + jsonObject.value['CPU']['Base/Boost GHz']
                    }
            }
        }
            console.log(lambda_response)
            callback(null, lambda_response)
        }
        
        
}


async function final_func(){
    // Executes second lambda function, returns results
    return new Promise((resolve, reject) => {
        const response_data = SecondLambdaResponse()

        resolve(response_data)
        
    })
    
}




async function getSecondResult(rows, halftime) {
    //Parses output from database query, if not exact match will prompt
    //user to select an option from 5 given. Once satisfied, will ask for 
    //GPU and CPU preferences
    const data = []
    for (var i = 0; i < rows.length; i++){
    //Parse response from database
    const query = rows[i].reccommended_requirements
    // Removes semi colon and commas from output
    const rows_parsed = query.replace(/[:,]/g,' ');
    //Removes excessive white space
    const rows_parsed2 = rows_parsed.replace(/\s+/g,' ').trim()
    //Seperates output and only includes sections that Begin with Processor and end with Storage
    var part = rows_parsed2.substring(
    rows_parsed2.lastIndexOf(" Processor") + 1, 
    rows_parsed2.lastIndexOf("Storage")
    );
    //Replaces the three categories with a semi colon for visibility
    var rows_parsed3 = part.replace(/Processor/g,"Processor:").replace(/Graphics/g,",Graphics:").replace(/Memory/g,",Memory:")
    // Splits the output into three sections by a comma representing the three categories
    var rows_parsed4 = rows_parsed3.split(',');
    data.push(rows_parsed4)
    }
    
    if (data.length > 1 && database_num == null){
        const result_names = function (x){
            const name_database = []
            for (var i = 0; i < data.length; i++){
            const statement = "[" + i + "]" + " Name: " + rows[i].name + "\n"
            name_database.push(statement)
        }
        return(name_database)

        }
        let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
        
            "message": {       
                "contentType": "PlainText",
                "content": result_names(data).join(' ').toString()
        },
        "intentName": "Budget",
        "slots": {
            "Budget_Amount": budget,
            "Purpose": purpose,
            "games_played": games,
            "monitor_resolution": resolution,
            "brand_preference_graphics": brand_preference_graphics,
            "brand_preference_cpu": brand_preference_cpu
            // "games_played": null
        },
        "slotToElicit": "database_selection"
        
     } 
    
    };
    callback(null,lambda_response)
    }
    else if ((data.length > 1 && database_num != null) || (data.length <= 1)){
        if (brand_preference_graphics == null){
                let lambda_response = {     
                    "dialogAction": {     
                        "type": "ElicitSlot",
                    "slotToElicit": "brand_preference_graphics",
                    "intentName": "Budget",
                    "slots": {"Budget_Amount": budget, "Purpose": purpose, "games_played": games, "monitor_resolution": resolution, 
                    "database_selection": database_num},
                    "responseCard": {
                        "genericAttachments": [
                            { 
                                "buttons": [
                                    {
                                        "text": "AMD",
                                        "value": "AMD"
                                    },
                                    {
                                        "text": "NVIDIA",
                                        "value": "NVIDIA"
                                    },
                                    {
                                        "text": "No Preference",
                                        "value": "Either"
                                    },
                                ],
                                "subTitle": "Select a preference for graphics card manufactuer",
                                "title": "Graphics Card Brand"
                            }
                            ],
                            "version": 1,
                            "contentType": "application/vnd.amazonaws.card.generic"
                            
                                    }
                                    }
                
                            };
             callback(null,lambda_response); 
            }
        else if(brand_preference_graphics != null){
            if (brand_preference_cpu == null){
                let lambda_response = {     
                "dialogAction": {     
                    "type": "ElicitSlot",
                "slotToElicit": "brand_preference_cpu",
                "intentName": "Budget",
                "slots": {"Budget_Amount": budget, "Purpose": purpose, "games_played": games, "monitor_resolution": resolution, "database_selection": database_num, 
                "brand_preference_graphics": brand_preference_graphics},
                "responseCard": {
                    "genericAttachments": [
                        { 
                            "buttons": [
                                {
                                    "text": "AMD",
                                    "value": "AMD"
                                },
                                {
                                    "text": "Intel",
                                    "value": "Intel"
                                },
                                {
                                    "text": "No Preference",
                                    "value": "Either"
                                },
                            ],
                            "subTitle": "Select a preference for CPU manufactuer",
                            "title": "CPU Brand"
                        }
                        ],
                        "version": 1,
                        "contentType": "application/vnd.amazonaws.card.generic"
                        
                                }
                                }
            
                        };
         callback(null,lambda_response); 
            }
            }
        
        if (database_num === null){
            const second_lambda = await final_func()
            const response = await final_func2(data, rows, 0, second_lambda)
            // return response
        }
        else if (database_num != null){
            const second_lambda = await final_func()
            const response = await final_func2(data, rows, database_num, second_lambda)
            // return response
        }
        
        
        
    }
}

async function SecondLambdaResponse(){
    //Second lambda function reference, executed by finalfunc()
    let params = {
        FunctionName: 'arn:aws:lambda:us-east-1:742033175622:function:pcbot_price',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ 
            purpose : purpose,
            budget : budget,
            resolution: resolution,
            brand_preference_graphics: brand_preference_graphics,
            brand_preference_cpu: brand_preference_cpu
        })
        };
        return new Promise((resolve, reject) => {
            
            lambda.invoke(params, function(err, data){
            if(err){
                reject(err)
            }
            else{
                //console.log(data)
                let response_data = data.Payload
                //console.log(test2)
                resolve(response_data)
            }
            
        })
        //return(Object.getOwnPropertyNames(result.response.data))
            
        })
        
        
}


async function doSomething(game_choice) {
    //Triggers the two larger functions and returns results from getSecondResult
    try{
        
        const first = await getResult(game_choice)
        const second = await getSecondResult(first)
        return(second)
        
    }
    catch (err) {
        console.log(err)
    }
}
const purpose = event.currentIntent.slots.Purpose.toLowerCase();
const budget = parseInt(event.currentIntent.slots.Budget_Amount.replace(/\D/g,''));
const games = event.currentIntent.slots.games_played;
const resolution = event.currentIntent.slots.monitor_resolution;
const database_num = event.currentIntent.slots.database_selection
const brand_preference_graphics = event.currentIntent.slots.brand_preference_graphics
const brand_preference_cpu = event.currentIntent.slots.brand_preference_cpu



if (purpose) {
    if (purpose == "mining"){
        if (brand_preference_graphics == null){
        let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
            "slotToElicit": "brand_preference_graphics",
            "intentName": "Budget",
            "slots": {"Budget_Amount": budget, "Purpose": purpose},
            "responseCard": {
                "genericAttachments": [
                    { 
                        "buttons": [
                            {
                                "text": "AMD",
                                "value": "AMD"
                            },
                            {
                                "text": "NVIDIA",
                                "value": "NVIDIA"
                            },
                            {
                                "text": "No Preference",
                                "value": "Either"
                            },
                        ],
                        "subTitle": "Select a preference for graphics card manufactuer",
                        "title": "Graphics Card Brand"
                    }
                    ],
                    "version": 1,
                    "contentType": "application/vnd.amazonaws.card.generic"
                    
                            }
                            }
        
                    };
     callback(null,lambda_response);
    }
            else if(brand_preference_graphics != null){
                if (brand_preference_cpu == null){
                    
                let lambda_response = {     
                "dialogAction": {     
                    "type": "ElicitSlot",
                "slotToElicit": "brand_preference_cpu",
                "intentName": "Budget",
                "slots": {"Budget_Amount": budget, "Purpose": purpose, "brand_preference_graphics": brand_preference_graphics},
                "responseCard": {
                    "genericAttachments": [
                        { 
                            "buttons": [
                                {
                                    "text": "AMD",
                                    "value": "AMD"
                                },
                                {
                                    "text": "Intel",
                                    "value": "Intel"
                                },
                                {
                                    "text": "No Preference",
                                    "value": "Either"
                                },
                            ],
                            "subTitle": "Select a preference for CPU manufactuer",
                            "title": "CPU Brand"
                        }
                        ],
                        "version": 1,
                        "contentType": "application/vnd.amazonaws.card.generic"
                        
                                }
                                }
            
                        };
                callback(null,lambda_response);
                }
                else if(brand_preference_cpu != null){
                // console.log("This is being executed")
                (async () => {
                const second_lambda = await final_func()
                const response = await mining_func(second_lambda)
                })();
            }
            }
        
        }
    else if (purpose != "mining"){
        if (games == null) {
        let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
        
            "message": {       
                "contentType": "PlainText",
                "content": "Your budget of " + budget + " has been confirmed." + "\n" + " Name a game that you play?"
        },
        "intentName": "Budget",
        "slots": {
            "Budget_Amount": budget,
            "Purpose": purpose,
            // "games_played": null
        },
        "slotToElicit": "games_played"
        
     } 
    
    };
    callback(null,lambda_response);
    }
    // If games has a value, then print statement and move on
    else if (games != null){
        if (resolution == null) {
            let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
            "slotToElicit": "monitor_resolution",
            "intentName": "Budget",
            "slots": {"Budget_Amount": budget, "Purpose": purpose, "games_played": games},
            "responseCard": {
                "genericAttachments": [
                    { 
                        "buttons": [
                            {
                                "text": "1920x1080",
                                "value": "1080"
                            },
                            {
                                "text": "2560x1440",
                                "value": "1440"
                            },
                            {
                                "text": "3840x2160",
                                "value": "2560"
                            },
                            {
                                "text": "Not sure",
                                "value": "1080"
                            }
                        ],
                        "subTitle": "What resolution monitor do you play at?",
                        "title": "Monitor Resolution"
                    }
                    ],
                    "version": 1,
                    "contentType": "application/vnd.amazonaws.card.generic"
                    
                            }
                            }
        
                    };
     callback(null,lambda_response);  
        }
        
    


    
else if (resolution != null) {
    const game_choice = event.currentIntent.slots.games_played;
    doSomething(game_choice)
            
        }
    

}
}
}

}
    
    
    
// }
