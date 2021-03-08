var aws = require('aws-sdk');
var lambda = new aws.Lambda({
    region: 'us-east-1'
});




exports.handler = function (event, context, callback){
const test = lambda.invoke({
    FunctionName: 'arn:aws:lambda:us-east-1:742033175622:function:pcbot_price',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(event, null, 2)
}, function(error, data){
    if (error){
        context.done('error', error)
    }
    if(data.Payload){
        const stuff = data.Payload
    }
}
)
}