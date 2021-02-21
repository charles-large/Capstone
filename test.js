function getResult(game_choice){
    return new Promise((resolve, reject) => {
    connection.connect();
    //const game_choice = "Battle Brothers";
    var sql = "SELECT * FROM pc_games.steam_games WHERE name LIKE ?";
    connection.query(sql, [game_choice], (err, rows, fields) => {
        if (err) {
            var sql = "SELECT * FROM pc_games.steam_games WHERE name LIKE CONCAT(?,'%') AND minimum_requirements NOT IN ('','NaN') AND types = 'app' LIMIT 5";
            connection.query(sql, [game_choice], (err, rows, fields) => {
                if (err){
                    reject("No matches found")
                }

                resolve(rows)

            }) 
        }
        
        resolve(rows);
    });
    connection.end()
    });
}




getResult(game_choice).then((rows) => {
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
})