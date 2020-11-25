

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.database
});

connection.connect();

exports.handler = (event, context) => {

    connection.query("SELECT * FROM steam_games WHERE name = 'Grand Theft Auto V: Premium Online Edition'", function(rows, fields) {
        /*var x;
        for (x in fields){
            if ((fields[x].name) === "Grand Theft Auto V: Premium Online Edition"){
                console.log(fields[x].url);
            }}
        */
        console.log(fields[0].url)
        context.succeed('Success');
        // console.log(err)
    });

};






/*
exports.handler = async (event) => {
    console.log(event)
    // variables from user input
    var purpose = event.currentIntent.slots.Purpose.toLowerCase();
    var budget = parseInt(event.currentIntent.slots.Budget_Amount.replace(/\D/g,''));
    var games = event.currentIntent.slots.games_played
    // if user selects gaming as a purpose, and games has not yet been specified, will ask them for it
    if (purpose.includes("gaming")) {
        if (games == null) {
        let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
        
            "message": {       
                "contentType": "PlainText",
                "content": "Your budget of " + budget + " has been confirmed \
                \
                What kind of games do you play?"
        },
        "intentName": "Budget",
        "slots": {
            "Budget_Amount": budget,
            "Purpose": purpose,
            // "games_played": null
        },
        "slotToElicit": "games_played"
        
     } 
    
    }
    return lambda_response;
    }
    // If games has a value, then print statement and move on
    else if (games != null){
        var resolution = event.currentIntent.slots.monitor_resolution
        if (resolution == null) {
            let lambda_response = {     
            "dialogAction": {     
                "type": "ElicitSlot",
            "slotToElicit": "monitor_resolution",
            "intentName": "Budget",
            "slots": {},
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
        
                    } 
     return lambda_response;  
    }
    else if (resolution != null) {
        // code here to RDS database
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
    }
    return lambda_response;
    }
    
    
};

*/
