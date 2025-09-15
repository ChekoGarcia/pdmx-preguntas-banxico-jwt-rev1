var request = JSON.parse(context.getVariable("request.content"));
var claimIdMatch = context.getVariable("jwt.Verify-JWT-1.decoded.claim.idMatch");


var path = context.getVariable("proxy.pathsuffix")
var jwtMatch = (claimIdMatch && request.folioMatch === claimIdMatch) ? true : false;

if(jwtMatch && path === "/autenticar-pm"){
    var claimIdNperscve = context.getVariable("jwt.Verify-JWT-1.decoded.claim.nperscve");
    jwtMatch = (claimIdNperscve === request.nperscve)
}


context.setVariable("jwtMatch", jwtMatch);

const errorsPayload = [];
const errorObj = {};

if(!jwtMatch){
    errorObj.code = "401.2";
    errorObj.message = 'Invalid JWT, please verify your information.';
}

errorsPayload.push(errorObj);
context.setVariable("errorMessage", JSON.stringify({ errors: errorsPayload.sort(function (a, b) { return a.code - b.code }) }));

