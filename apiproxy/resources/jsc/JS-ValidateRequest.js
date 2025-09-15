var bodyRequest = JSON.parse(context.getVariable("request.content"));
var isValidRequest;
var path = context.getVariable("proxy.pathsuffix")
const ErrorCodes = {
    FORBIDDEN: '401.3',
    UNAUTHORIZED: '401.2'
    };
const errorsPayload = [];

const errorObj = {};

const keysIdcdc = ['idCDC', 'idCdc', 'id_cdc', 'idcdc'];
const keysEmail = ['email', 'correo'];

function isKeyValid(keys, request) {
    // Se devuelve el valor de inmediato si se encuentra la clave en el request
    return keys.find(key => key in request) ? request[keys.find(key => key in request)] : "";
}


    const claimEmail = context.getVariable("jwt.Verify-JWT-1.decoded.claim.email");
    const claimIdcdc = context.getVariable("jwt.Verify-JWT-1.claim.idcdc"); 	

    var idcdc = "";
    var email = "";

    // Comprobamos si alguna de las claves de idCDC está en el bodyRequest
    idcdc = isKeyValid(keysIdcdc, bodyRequest);
    if (idcdc) {
        isValidRequest = (idcdc === claimIdcdc);
    } else {
        // Si no se encontró idcdc, verificamos las claves de email
        email = isKeyValid(keysEmail, bodyRequest);
        if(email){
            isValidRequest = (email === claimEmail);    
        }
        
    }

    if(path === "/obtener"){
        var folioMatch = context.getVariable("jwt.Verify-JWT-1.decoded.claim.idMatch");
    
        isValidRequest = folioMatch === bodyRequest.folioMatch
    }

    context.setVariable("isValidRequest", isValidRequest);


if(!isValidRequest){
    errorObj.code = ErrorCodes.FORBIDDEN;
    errorObj.message = 'You do not have access to this information.';
}

errorsPayload.push(errorObj);
context.setVariable("errorMessage", JSON.stringify({ errors: errorsPayload.sort(function (a, b) { return a.code - b.code }) }));