const data = ["test1", "test2", "test3"]
name_database=[]
for (var i = 0; i < data.length; i++){
    const statement = "[" + i + "]" + " Name: " + data[i] + "\n"
    name_database.push(statement)
}


let lambda_response = {     
    "dialogAction": {     
        "type": "ElicitSlot",

    "message": {       
        "contentType": "PlainText",
        "content": data.join(' ').toString()
},
"intentName": "Budget",
"slots": {
    "Budget_Amount": "test",
    "Purpose": "test",
    "games_played": "test",
    "monitor_resolution": "test" 
    // "games_played": null
},
"slotToElicit": "database_selection"

} 

};
console.log(lambda_response)

//console.log(name_database[0])

//console.log(data[0])

