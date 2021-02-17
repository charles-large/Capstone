
//edit test 6
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.database
});

function getResult(game_choice){
            return new Promise(function(resolve, reject) {
            connection.connect();
            //const games = "Battle Brothers";
            var sql = "SELECT * FROM pc_games.steam_games WHERE name LIKE ?";
            connection.query(sql, [game_choice], function(err, rows, fields){
                if (err) {
                    return reject(err);
                }
                //console.log(games)
                //console.log(rows)
                //console.log(fields)
                //console.log(fields[0].minimum_requirements)
                resolve(rows);
            });
            connection.end()
            });
        }


exports.handler = function (event, context, callback){
    console.log(event);
    // variables from user input
    var purpose = event.currentIntent.slots.Purpose.toLowerCase();
    var budget = parseInt(event.currentIntent.slots.Budget_Amount.replace(/\D/g,''));
    var games = event.currentIntent.slots.games_played;
    var resolution = event.currentIntent.slots.monitor_resolution;
    // if user selects gaming as a purpose, and games has not yet been specified, will ask them for it
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
        // code here to RDS database
        const game_choice = event.currentIntent.slots.games_played;
        getResult(game_choice).then(function(rows) {
            //Parse response from database
            const query = rows[0].minimum_requirements
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
            //
    let lambda_response = {
                "dialogAction": {
                        "type": "Close",
                        "fulfillmentState": "Fulfilled",
                        "message": {
                          "contentType": "PlainText",
                          "content": "Name: " + rows[0].name + "\n" + " Minimum Requirements: " + "\n" + rows_parsed4[0] + "\n" + rows_parsed4[1] + "\n" + rows_parsed4[2] 
                        }
                }
            }
            console.log(lambda_response)
            callback(null,lambda_response)
    //console.log("Requirements getting through " + rows[0].minimum_requirements)
})//.catch((err) => setImmediate(() => { throw err; }));


        
    

        
    
    }
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
    
    
};
