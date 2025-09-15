var response = JSON.parse(context.getVariable("response.content"))


if (response.httpStatus === 200) {
    context.setVariable("jwt-variable",context.getVariable("jwt-variable"))
}else{
    context.setVariable("jwt-variable","Unauthorized")
}
