var response = JSON.parse(context.getVariable("response.content"))
var path = context.getVariable("proxy.pathsuffix")

var claimIdMatch = context.getVariable("jwt.Verify-JWT-1.decoded.claim.idMatch");

var claims = {};

context.setVariable('idMatch', claimIdMatch); 

if (path === "/obtener-pm"){
    context.setVariable('nperscve', response.nperscve); 
    
}else if(path === "/autenticar-pm"){
    context.setVariable('nperscve', context.getVariable("jwt.Verify-JWT-1.decoded.claim.nperscve")); 
    context.setVariable('isAuthenticated', response.data.isAuthenticated); 
}
print(claims.idMatch)

context.setVariable('jwt-claims', JSON.stringify(claims)); 
