
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
                const sql2 = "SELECT * FROM pc_games.steam_games WHERE name LIKE CONCAT(?,'%') AND minimum_requirements NOT IN ('','NaN') AND types = 'app' LIMIT 5";
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



async function getSecondResult(rows, halftime) {
                        const data = []
                        for (var i = 0; i < rows.length; i++){
                        //Parse response from database
                        const query = rows[i].minimum_requirements
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
                                "monitor_resolution": resolution 
                                // "games_played": null
                            },
                            "slotToElicit": "database_selection"
                            
                         } 
                        
                        };
                        callback(null,lambda_response)
                        }
                        else if (data.length > 1 && database_num != null) {
                            const response_data = await SecondLambdaResponse()
                            const jsonObject = JSON.parse(response_data)
                            try{
                                console.log(Object.getOwnPropertyNames(jsonObject))
                                console.log(jsonObject.value)
                                console.log(jsonObject.value['purpose'])
                                
                            }
                            catch (err) {
                                console.log("Error")
                            }
                            
                            //console.log(test5['value']['purpose'])
                            const statement = "Name: " + rows[database_num].name + "\n" + " Minimum Requirements: " + "\n" + data[database_num][0] + "\n" + data[database_num][1] + "\n" + data[database_num][2] + "\n"
                            let lambda_response = {
                                "dialogAction": {
                                        "type": "Close",
                                        "fulfillmentState": "Fulfilled",
                                        "message": {
                                          "contentType": "PlainText",
                                          "content": "Steam Requirements:" + "\n" + statement.toString() + "\n" + "\n" + "Purpose: " + jsonObject.value['purpose'] + "\n" +  "Budget: " + jsonObject.value['budget'] + "\n" + "Resolution: " + jsonObject.value['resolution']
                                        }
                                }
                            }
                            callback(null,lambda_response)
        
                            
                        }
                        else{
                            const apple = function (x){
                                const string_database = []
                                for (var i = 0; i < data.length; i++){
                                const statement = "\n"+ "Name: " + rows[i].name + "\n" + " Minimum Requirements: " + "\n" + data[i][0] + "\n" + data[i][1] + "\n" + data[i][2] + "\n"
                                string_database.push(statement)
                            }
                            return(string_database)
                            }
                            let lambda_response = {
                                "dialogAction": {
                                        "type": "Close",
                                        "fulfillmentState": "Fulfilled",
                                        "message": {
                                          "contentType": "PlainText",
                                          "content": "Steam Requirements:" + "\n" + "\n" + (apple(data).toString()) + "\n" 
                                        }
                                }
                            }
                            console.log(lambda_response)
                            callback(null,lambda_response)
                        }
            
                
                
                
            }

async function SecondLambdaResponse(){
    let params = {
        FunctionName: 'arn:aws:lambda:us-east-1:742033175622:function:pcbot_price',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ 
            purpose : "test1",
            budget : "test2",
            resolution: "test3"
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
    try{
        
        const first = await getResult(game_choice)
        const second = await getSecondResult(first)
        return(second)
        
    }
    catch (err) {
        console.log(err)
    }
}

var purpose = event.currentIntent.slots.Purpose.toLowerCase();
var budget = parseInt(event.currentIntent.slots.Budget_Amount.replace(/\D/g,''));
var games = event.currentIntent.slots.games_played;
var resolution = event.currentIntent.slots.monitor_resolution;
var database_num = event.currentIntent.slots.database_selection



if (purpose.includes("gaming")) {
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
                                "value": "2K"
                            },
                            {
                                "text": "3840x2160",
                                "value": "4K"
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


 // If user selects streaming as a purpose
    else if (event.currentIntent.slots.Purpose == "Streaming") {
        let lambda_response = {     
            "sessionAttributes": {
                "budget":  event.currentIntent.slots.Budget_Amount,
        },   
            "dialogAction": {     
                "type": "Close",
                "fulfillmentState": "Fulfilled",
        
            "message": {       
                "contentType": "PlainText",
                "content": "Your budget of " + event.currentIntent.slots.Budget_Amount + " has been confirmed"
        },
     } 
    };
    return lambda_response;
    }
}
    
    
    
}