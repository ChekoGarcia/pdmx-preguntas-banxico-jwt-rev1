const ErrorCodes = {
    INVALID_TYPE: '400.0',
    ENUM_MISMATCH: '400.1',
    // String errors
    STRING_LENGTH_SHORT: '400.2',
    STRING_LENGTH_LONG: '400.2',
    STRING_PATTERN: '400.2',
    // Object errors
    OBJECT_REQUIRED: '400.3',
    NOT_ALLOWED: '400.5',
    DEFAULT: '400.4'
};

const content = context.getVariable('OASValidation.OAS-ValidateContract.fault.cause');
const errorsPayload = [];

var errorMessage = content.match(/failed with reason: "\[(.*?)]"/)[1].replace(new RegExp('\"', 'g'), "'");
var pathName = content.match(/failed with reason: "\[(.*?)] (.*?)"/);
print("pathNamepathName ---> " + pathName);
if(pathName!== null){
    var path = pathName[1];
}
const errors = errorMessage.split('ERROR - ');

errors.shift();

errors.forEach(error => {
    const errorObj = {};
    if (error.includes('Instance type')
        || error.includes('is not a valid')
        || error.includes('is invalid')
        || error.includes('Numeric instance is')
        || error.includes('Value for int32 leads to overflow')
    ) {
        errorObj.code = ErrorCodes.INVALID_TYPE;
    } else if (error.includes('not found in enum')) {
        errorObj.code = ErrorCodes.ENUM_MISMATCH;
        errorObj.message = path + " el valor proporcionado no coincide con el catálogo.";
    } else if (error.includes('is too short')) {
        errorObj.code = ErrorCodes.STRING_LENGTH_SHORT;
        errorObj.message = path + " el valor proporcionado está por debajo del límite permitido.";
    } else if (error.includes('is too long')) {
        errorObj.code = ErrorCodes.STRING_LENGTH_LONG;
        errorObj.message = path + " el valor proporcionado excede el límite permitido.";
    } else if (error.includes('ECMA 262 regex')) {
        errorObj.code = ErrorCodes.STRING_PATTERN;
        errorObj.message = path + " el valor proporcionado contiene caracteres no permitidos.";
    } else if (error.includes('has missing required properties') || error.includes('is required')) {
        errorObj.code = ErrorCodes.OBJECT_REQUIRED;
    } else if (error.includes('operation not allowed')){
         errorObj.code = ErrorCodes.NOT_ALLOWED;
    } else if (error.includes('has properties which are not allowed by the schema')){
        errorObj.code = ErrorCodes.NOT_ALLOWED;
        errorObj.message = path + " el objeto tiene propiedades que no están permitidas por el esquema."
    }else if (error.includes('No API path found that matches request ')){
        errorObj.code = ErrorCodes.NOT_ALLOWED;
        errorObj.message = path + " no se encontró ninguna ruta que coincida con la solicitud.";
    }else {
        errorObj.code = ErrorCodes.DEFAULT;
        errorObj.message = 'Information cannot be processed, ' + context.getVariable('request.path')
        
    }

    errorObj.message = errorObj.message || error;
    errorsPayload.push(errorObj);
});

context.setVariable("errorMessage", JSON.stringify({ errors: errorsPayload.sort(function (a, b) { return a.code - b.code }) }));
