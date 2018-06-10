function getInterface(interfaceInfo) {
    if (!interfaceInfo){
        return getNewInterface();
    }

    var paramStr = interfaceInfo.param;
    // 服务器端参数和插件参数相互转换
    var isForm = (!paramStr || paramStr.indexOf("form=") >= 0);
    if (isForm){
        var paramArray = getJson(paramStr.replace("form=", ""), "[]")
        var bulkParams = "";
        for(var i=0; i<paramArray.length; i++){
            // TODO  interfaceInfo.fullUrl = interfaceInfo.fullUrl.replace("{", )
            var p = paramArray[i].name + ":" + paramArray[i].def;
            if( p != ":"){
                bulkParams += p + "\n";
            }
        }
        paramStr = bulkParams;
    }

    // 服务器请求头和插件请求头互相转换
    var headerArray = getJson(interfaceInfo.header, "[]");
    var headerStr = "";
    for(var i=0; i<headerArray.length; i++){
        var p = headerArray[i].name + ":" + headerArray[i].def;
        if( p != ":"){
            headerStr += p + "\n";
        }
    }

    // TODO 服务器支持paramType 存储
    var paramType = (isForm ? "x-www-form-urlencoded;charset=UTF-8" : "application/json");

    return {
        "paramType": paramType,
        "moduleId": interfaceInfo.moduleId,
        "id": interfaceInfo.id,
        "name": handerStr(interfaceInfo.interfaceName),
        "method": interfaceInfo.method,
        "url": interfaceInfo.fullUrl,
        "params": paramStr,
        "headers": headerStr
    };
}

function getNewInterface() {
    return {
        "paramType": null,
        "moduleId": null,
        "id": "-1",
        "name": null,
        "method": null,
        "url": null,
        "params": null,
        "headers": null
    };
}

