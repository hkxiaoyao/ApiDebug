$(function() {
    // 远程获取所有项目列表，TODO bug：只能显示前100条
    httpPost(MY_PROJECT_URL, "myself=true&pageSize=100", drawProject);
});

// 渲染项目列表方法
function drawProject(projectArray) {
    projectArray = projectArray.data;
    var projectListText = project_list_div;
    for (var i = 0; i < projectArray.length; i++) {
        projectListText += "<li><a href='javascript:void(0)' class='pl10 pr10'>" + projectArray[i].name + "</a></li>";
    }
    $("#project-list").html(projectListText);
}