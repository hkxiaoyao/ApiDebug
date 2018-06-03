/*********新增接口*********/
function daoSaveInterface(moduleId, paramType, id, name, method, url, params, headers,status) {
    var interfaces;
    try {
        interfaces = $.parseJSON(localStorage[DATA_INTERFACE + moduleId])
    } catch (e) {
        interfaces = $.parseJSON("[]");
        console.warn(e);
    }
    var h = {
        "paramType": paramType,
        "moduleId": moduleId,
        "id": id,
        "name": name,
        "method": method,
        "url": url,
        "params": params,
        "headers": headers,
        "status":status
    };

    // 如果已经存在则删除
    for (var i = 0; i < interfaces.length; i++) {
        if (interfaces[i].id == h.id) {
            h.interfaceId = interfaces[i].interfaceId;
            h.status = interfaces[i].status;
            h.moduleId = interfaces[i].moduleId;
            interfaces.splice(i, 1);
            break;
        }
    }
    interfaces.unshift(h);
    localStorage[DATA_INTERFACE + moduleId] = JSON.stringify(interfaces);
    refreshSyncIco(0);
}

/**********删除接口*********/
function daoDeleteInterface(moduleId, id) {
    var interfaceArray = getLocalJson(DATA_INTERFACE + moduleId);

    // 如果已经存在则删除
    for(var i=0; i<interfaceArray.length;i++){
        if(interfaceArray[i].id == id){
            interfaceArray.splice(i,1);
            break;
        }
    }
    // TODO 删除远程接口
    saveLocalJson(DATA_INTERFACE + moduleId, interfaceArray);
    return true;
}

/*********上移接口*********/
function daoUpInterface(moduleId, id) {
    var interfaces = getInterfacesByModuleId(moduleId);
    for(var i=0; i<interfaces.length;i++){
        if(interfaces[i].id == id){
            if(i > 0) {
                var interface = interfaces[i];
                interfaces.splice(i,1);
                interfaces.splice(i-1, 0, interface);
            }
            break;
        }
    }
    // TODO 更新服务端排序
    saveAllInterfaces(moduleId, interfaces);
    return true;
}
/*********下移接口*********/
function daoDownInterface(moduleId, id) {
    var interfaces = getInterfacesByModuleId(moduleId);
    for(var i=0; i<interfaces.length;i++){
        if(interfaces[i].id == id){
            if(i < interfaces.length-1) {
                var interface = interfaces[i];
                interfaces.splice(i,1);
                interfaces.splice(i+1, 0, interface);
            }
            break;
        }
    }
    // TODO 更新服务端排序
    saveAllInterfaces(moduleId, interfaces);
    return true;
}

function getInterfacesByModuleId(moduleId){
    var interfaces;
    try{
        interfaces = $.parseJSON( localStorage[DATA_INTERFACE + moduleId] );
    }catch(e){
        interfaces = $.parseJSON( "[]" );
        console.warn(e);
    }
    return interfaces;
}
function saveAllInterfaces(moduleId, interfaces){
    localStorage[DATA_INTERFACE + moduleId] = JSON.stringify(interfaces);
}