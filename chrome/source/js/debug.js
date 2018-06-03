$(function() {
    // 远程获取所有项目列表，TODO bug：只能显示前100条
    httpPost(MY_PROJECT_URL, "myself=true&pageSize=100", drawProject);
    refreshModule();
});

// 刷新模块
function refreshModule() {
    var defaultProjectName = getLocalData(DATA_DEF_PROJECT_NAME, null);
    var defaultProjectId = getLocalData(DATA_DEF_PROJECT_ID, null);
    if (defaultProjectName && defaultProjectId){
        $("#" + ID_DEFAULT_PROJECT_NAME).html(defaultProjectName);
        $("#float").fadeIn(300);
        httpPost(MY_MODULE_URL, "projectId=" + defaultProjectId + "&pageSize=100", drawModule);
    }
}

$("#refresh-module").click(function(){
    refreshModule();
});

// 切换项目
$("body").on('click',".def-project-id",function(){
    var projectId = $(this).attr(ATTR_PROJECT_ID);
    var projectName = $(this).attr(ATTR_PROJECT_NAME);
    saveLocalData(DATA_DEF_PROJECT_ID, projectId);
    saveLocalData(DATA_DEF_PROJECT_NAME, projectName);
    $("#" + ID_DEFAULT_PROJECT_NAME).html(projectName);
    refreshModule();
});

// 渲染项目列表方法
function drawProject(projectArray) {
    projectArray = projectArray.data;
    var projectListText = project_list_div;
    for (var i = 0; i < projectArray.length; i++) {
        var project = projectArray[i];
        projectListText += "<li><a href='#' class='def-project-id pl10 pr10' " +
            "crap-data-project-name='" + project.name + "' crap-data-project-id='" + project.id+ "'>" + project.name + "</a></li>";
    }
    $("#project-list").html(projectListText);
}

// 渲染模块列表
function drawModule(moduleArray){
    // 模块对应的项目ID为 用户ID + "-debug"该项目模块下只有接口调试记录，可以共享，一个用户有且仅有一个调试目录
    moduleArray = moduleArray.data;

    var moduleText = "";
    for(var i=0 ; i<moduleArray.length; i++){
        var module = moduleArray[i];
        var moduleName =  module.name;
        var moduleId = module.id;
        moduleText += moduleDiv.replace(/ca_moduleId/g,moduleId).replace(/ca_moduleName/g,moduleName);
        var interfaces = getLocalJson(DATA_INTERFACE + moduleId);

        var interfaceText = "";
        // for(var j=0; j<interfaces.length; j++){
        //     if(interfaces[j].status == -1){
        //         continue;
        //     }
        //     interfaceText += interfaceDiv.replace(/ca_interfaceInfo/g,JSON.stringify(interfaces[j]))
        //         .replace(/ca_name/g,interfaces[j].name)
        //         .replace(/ca_id/g,interfaces[j].id)
        //         .replace(/ca_moduleId/g,interfaces[j].moduleId);
        //
        //     if(interfaces[j].method == "GET"){
        //         interfaceText = interfaceText.replace("ca_methodIcon","&#xe645;");
        //         interfaceText = interfaceText.replace("ca_method","GET");
        //     }else{
        //         interfaceText = interfaceText.replace("ca_methodIcon","&#xe6c4;");
        //         interfaceText = interfaceText.replace("ca_method","POST");
        //     }
        // }
        moduleText = moduleText.replace("ca_interfaces", interfaceText);
    }
    $("#modules").html( moduleText );
    $("#float").fadeOut(300);
}

