// 渲染接口
function queryInterfaceDAO(moduleId, callBack) {
    httpPost(MY_INTERFACE_URL, {"moduleId" : moduleId}, true, drawInterfaceDAO, moduleId);
}
function drawInterfaceDAO(response, moduleId) {
    var interfaceText = "";
    var interfaces = response.data;
    tip(response, 3, "接口加载成功！");
    for (var j = 0; j < interfaces.length; j++) {
        var interface = interfaces[j];
        interfacesMap[interface.id] = interface;
        interfaceText += interfaceDiv.replace(/ca_name/g, interface.interfaceName)
            .replace(/ca_id/g, interface.id)
            .replace(/ca_moduleId/g, interface.moduleId);

        // TODO 多种请求方式
        if (interface.method.indexOf("POST") >= 0) {
            interfaceText = interfaceText.replace("ca_methodIcon", "&#xe6c4;");
            interfaceText = interfaceText.replace("ca_method", "POST");
        } else {
            interfaceText = interfaceText.replace("ca_methodIcon", "&#xe645;");
            interfaceText = interfaceText.replace("ca_method", "GET");
        }
    }
    setHtml(ID_MODULE_INTERFACE + moduleId, interfaceText);
    setAttr(ID_MODULE_INTERFACE + moduleId, ATTR_HAS_LOAD_INTERFACE, true);
}



/*********新增接口*********/
function daoSaveInterface(moduleId, paramType, id, name, method, url, params, headers, status) {
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
        "status": status
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
    for (var i = 0; i < interfaceArray.length; i++) {
        if (interfaceArray[i].id == id) {
            interfaceArray.splice(i, 1);
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
    for (var i = 0; i < interfaces.length; i++) {
        if (interfaces[i].id == id) {
            if (i > 0) {
                var interface = interfaces[i];
                interfaces.splice(i, 1);
                interfaces.splice(i - 1, 0, interface);
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
    for (var i = 0; i < interfaces.length; i++) {
        if (interfaces[i].id == id) {
            if (i < interfaces.length - 1) {
                var interface = interfaces[i];
                interfaces.splice(i, 1);
                interfaces.splice(i + 1, 0, interface);
            }
            break;
        }
    }
    // TODO 更新服务端排序
    saveAllInterfaces(moduleId, interfaces);
    return true;
}

function getInterfacesByModuleId(moduleId) {
    var interfaces;
    try {
        interfaces = $.parseJSON(localStorage[DATA_INTERFACE + moduleId]);
    } catch (e) {
        interfaces = $.parseJSON("[]");
        console.warn(e);
    }
    return interfaces;
}
function saveAllInterfaces(moduleId, interfaces) {
    localStorage[DATA_INTERFACE + moduleId] = JSON.stringify(interfaces);
}