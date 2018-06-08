/**
 * 准则
 * dao层的方法必须以DAO结尾
 * http请求必须以：query、update、save、get、delete开头
 * 渲染方法：draw开头
 * id、class命名用-分割
 * 常量必须大写，以_分割
 * div命名必须以id-开头，如：id-
 * 缓存数据必须以DATA_开头
 */

$(function() {
    // 远程获取所有项目列表，TODO bug：只能显示前100条
    fadeIn(ID_FLOAT, 300);
    queryProjectDAO(drawProjectDAO);
    drawModule();
    fadeOut(ID_FLOAT, 300);
    getLoginInfoDAO(drawLoginInfoDAO);
});

$("#refresh-module").click(function(){
    drawModule();
});

// 切换项目
$("body").on('click',"#id-def-project-id",function(){
    var projectId = $(this).attr(ATTR_PROJECT_ID);
    var projectName = $(this).attr(ATTR_PROJECT_NAME);
    saveLocalData(DATA_DEF_PROJECT_ID, projectId);
    saveLocalData(DATA_DEF_PROJECT_NAME, projectName);
    setHtml(ID_DEF_PROJECT_NAME, projectName);
    drawModule();
});

// 渲染模块页面
function drawModule() {
    var defaultProjectName = getLocalData(DATA_DEF_PROJECT_NAME, null);
    var defaultProjectId = getLocalData(DATA_DEF_PROJECT_ID, null);
    if (defaultProjectName && defaultProjectId){
        setHtml(ID_DEF_PROJECT_NAME, defaultProjectName);
        queryModuleDAO(defaultProjectId, drawModuleDAO);
    }
}
