
function queryModuleDAO(defaultProjectId, callBack){
    httpPost(MY_MODULE_URL, {"projectId" : defaultProjectId, "pageSize" : 100}, true, callBack);
}

// 渲染模块列表
var interfacesMap = {};
function drawModuleDAO(response){
    tip(response, 5);
    if (response.success == 0){
        return
    }

    var moduleArray = response.data;
    var moduleText = "";
    for(var i=0 ; i<moduleArray.length; i++){
        var module = moduleArray[i];
        var moduleName =  module.name;
        var moduleId = module.id;
        moduleText += moduleDiv.replace(/ca_moduleId/g,moduleId).replace(/ca_moduleName/g,moduleName);

        var interfaces = httpPost(MY_INTERFACE_URL, "moduleId=" + moduleId, false).data;

        var interfaceText = "";
        for(var j=0; j<interfaces.length; j++){
            var interface = interfaces[j];
            interfacesMap[interface.id] = interface;
            interfaceText += interfaceDiv.replace(/ca_name/g,interface.interfaceName)
                .replace(/ca_id/g,interface.id)
                .replace(/ca_moduleId/g,interface.moduleId);

            // TODO 多种请求方式
            if(interface.method.indexOf("GET") >= 0){
                interfaceText = interfaceText.replace("ca_methodIcon","&#xe645;");
                interfaceText = interfaceText.replace("ca_method","GET");
            }else{
                interfaceText = interfaceText.replace("ca_methodIcon","&#xe6c4;");
                interfaceText = interfaceText.replace("ca_method","POST");
            }
        }
        moduleText = moduleText.replace("ca_interfaces", interfaceText);
    }
    $("#modules").html( moduleText );
}

/*********上移*********/
function upModule(moduleId) {
    var modules = getAllmodules(moduleId);
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId){
            if(i > 0) {
                var module = modules[i];
                modules.splice(i,1);
                modules.splice(i-1, 0, module);
            }
            break;
        }
    }
    saveAllModules(modules);
    refreshSyncIco(0);
    return true;
}
/*********下移*********/
function downModule(moduleId) {
    var modules = getAllmodules(moduleId);
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId){
            if(i < modules.length-1) {
                var module = modules[i];
                modules.splice(i,1);
                modules.splice(i+1, 0, module);
            }
            break;
        }
    }
    saveAllModules(modules);
    refreshSyncIco(0);
    return true;
}
function getAllmodules(){
    var modules;
    try {
        modules = $.parseJSON(localStorage[DATA_MODULE])
    } catch (e) {
        modules = $.parseJSON("[]");
        console.warn(e);
    }
    return modules;
}
function saveAllModules(modules){
    localStorage[DATA_MODULE] = JSON.stringify(modules);
}