var mysql = require('mysql');
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
    region: 'us-east-1'
});

exports.handler = function (event, context, callback){

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
                let test2 = data.Payload
                console.log(test2)
                resolve(test2)
            }
            
        })
        //return(Object.getOwnPropertyNames(result.response.data))
            
        })
        
        
}

async function test(){
    
    let apple = await SecondLambdaResponse()
    console.log(apple)
    return(apple)
    //console.log(value)
}

test()
//callback(null, value)

}