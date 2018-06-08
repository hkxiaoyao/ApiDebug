var leftEnlarge = true;
function formatJson(){
    var rowData = originalResponseText;
    if( rowData == ""){
        rowData = $("#response-row").val();
    }
    if(rowData == ""){
        alert("Please click [Send] button to get a response");
        return false;
    }
    try {
        $.parseJSON( rowData );
    } catch (e) {
        console.warn(e);
        alert("Response data is not json");
        return;
    }
    if( $("#response-row").hasClass("hidden") == false){
        $("#response-row").addClass("hidden");
    }
    $("#response-pretty").removeClass("none");
    $("#response-pretty").JSONView(rowData);
    return true;
}

function changeBg(removeClass, addClass, selectClass,click_button){
    $("."+selectClass).removeClass(addClass);
    $("."+selectClass).addClass(removeClass);
    $(click_button).removeClass(removeClass);
    $(click_button).addClass(addClass);
}

function responseShow(showDiv){
    if( showDiv == "response-row"){
        if( $("#response-row").hasClass("hidden")){
            $("#response-row").removeClass("hidden");
        }
        if( $("#response-pretty").hasClass("none") == false){
            $("#response-pretty").addClass("none");
        }
    }else if( showDiv == "response-pretty"){
        if( $("#response-row").hasClass("hidden") == false){
            $("#response-row").addClass("hidden");
        }
        $("#response-pretty").removeClass("none");
    }

}

function getHeadersStr(){
    var headers = "";
    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                if(key.trim() != "" || val.value.trim() != ""){
                    headers += "&"+key + "=" + val.value
                }
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
    return headers;
}

function getHeaders(request){
    if( $("#method").val() == "POST")
        request.setRequestHeader("Content-Type", $('input:radio[name="param-type"]:checked').val());

    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                request.setRequestHeader(key, val.value);
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
}

function getParams(){
    var texts = $("#params-div input[type='text']");
    var data = "";
    // 获取所有文本框
    var key = "";

    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage")  == "value"){
                if( key != "") {
                    data += "&" + key + "=" + val.value;
                }
            }else if(val.getAttribute("data-stage")  == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(e);
            alert(ex);
        }
    });
    return data;
}

var originalResponseText = "";
function callAjax() {
    originalResponseText = "";
    var url = $("#url").val().trim().split("?")[0] + "?";
    var method = $("#method").val();
    var urlParamsStr = "";
    var params =  getParams();

    // 表单参数优先url参数
    if( $("#url").val().indexOf("?") > 0){
        urlParamsStr = $("#url").val().split("?")[1];
        var urlParams = urlParamsStr.split("&");
        for(var i=0; i<urlParams.length; i++ ){
            if( urlParams[i] != "" && urlParams[i].indexOf("=") > 0){
                if(params.indexOf("&" + urlParams[i].split("=")[0]) < 0){
                    url += "&" + urlParams[i];
                }
            }
        }
    }
    if(  $.inArray($('input:radio[name="param-type"]:checked').val(), customerTypes) == -1) {
        params = (params.length > 0 ? params.substr(1) : params);
    }else{
        params = $("#customer-value").val();
    }

    url = url.replace("?&", '?');
    if( url.endWith("?")){
        url = url.substr(0 - url.length-1);
    }
    $("#float").fadeIn(300);
    $.ajax({
        type : method,
        url : url,
        async : true,
        data : params,
        beforeSend: function(request) {
            getHeaders(request);
        },
        complete: function(responseData, textStatus){
            if(textStatus == "error"){
                $("#response-row").val("Status:" + responseData.status + "\nStatusText:" + responseData.statusText +"\nTextStatus: " + textStatus +"\nCould not get any response\n\nThere was an error connecting to " + url);
                $("#format-row").click();
            }
            else if(textStatus == "success"){
                try{
                    originalResponseText = responseData.responseText;
                    var data = responseData.responseText;
                    $("#response-row").val(data);
                    var head = responseData.getAllResponseHeaders().toString().huanhang();
                    $(".response-header .headers").html(head);
                    var general ="Request URL: " + url +"<br>Request Method: " + method +"<br>Status Code: " + responseData.status;
                    $(".response-header .general").html(general);
                    $("#response-pretty").html("");

                    var rootDomainStr =getRootDomain(url);
                    chrome.cookies.getAll({domain: rootDomainStr}, function(cookies){
                        $(".response-cookie .table tr").empty();
                        $(".response-cookie .table").append("<tr class='fb'><td>Name</td> <td>Value</td> <td>Path</td><td>Domain</td><td>ExpirationDate</td></tr>");
                        var a =  document.createElement('a');
                        a.href = url;
                        for(i=0; i<cookies.length;i++) {
                            if( ("."+a.host).endWith(cookies[i].domain) ){
                                var cookieStr = "<tr>";
                                cookieStr += "<td class='w-p-10 break-word'>" + cookies[i].name + "</td>";
                                cookieStr += "<td class='w-p-30 break-word'>"  + cookies[i].value + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>"  + cookies[i].path + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].domain +"</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].expirationDate +"</td>";
                                cookieStr += "</tr>";
                                $(".response-cookie .table").append(cookieStr)
                            }
                        }
                    });
                }catch(e){
                    $("#format-row").click();
                }

                try {
                    $.parseJSON( data );
                    $("#json-expand").click();
                } catch (e) {
                    $("#format-row").click();
                }
            }else{
                $("#response-row").val("textStatus: " + textStatus +"\n\n There was an error connecting to " + url);
                $("#format-row").click();
            }
            $("#float").fadeOut(300);
        }
    });
    if(url.indexOf("?") < 0){
        url += "?";
    }
    if( method == "GET"){
        if(params.trim() == ""){
            if(url.endWith("?") || url.endWith("&") ){
                url = url.substr(0, url.length-1);
            }
        }else{
            url = (url +"&"+ params).replace("&&", '&').replace("?&", '?');
        }
        $("#url").val(url);
    }

    // 记录历史
    try{
        var history = getLocalJson(DATA_HISTORY);
        if(  $.inArray($('input:radio[name="param-type"]:checked').val(), customerTypes) == -1) {
            params = params.replace(/=/g, ":").replace(/&/g,"\n");
        }

        if( url.endWith("?")){
            url = url.substr(0, url.length-1);
        }

        var h  ={"paramType": $("input[name='param-type']:checked").val(), "name": $("#interface-name").val(),"method":method, "url" : url,
            "params" : params, "headers": getHeadersStr().replace(/=/g, ":").replace(/&/g,"\n")};

        // 如果已经存在则删除
        for(var i=0; i<history.length;i++){
            if(JSON.stringify(history[i]) == JSON.stringify(h)){
                history.splice(i,1);
            }
        }

        history.unshift(h);
        // 如果历史记录>20，则删除最后一个
        if(history.length > 20){
            history.pop();
        }
        // 保存历史数据
        saveLocalData(DATA_HISTORY, JSON.stringify(history))
    }catch(e){
        console.warn(e);
    }
    daoDrawHistory();
}

function getRootDomain(url) {
    var a =  document.createElement('a');
    a.href = url;
    var hosts =a.host.split('.');
    return hosts.length ==2 ? a.host : hosts[hosts.length-2]+"."+hosts[hosts.length-1];
}


function deleteModule(moduleId) {
    var modules;
    try{
        modules = $.parseJSON( localStorage[DATA_MODULE] )
    }catch(e){
        modules = $.parseJSON( "[]" );
        console.warn(e);
    }

    // 如果已经存在则删除
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId){
            modules[i].status = -1;
            break;
        }
    }
    localStorage[DATA_MODULE] = JSON.stringify(modules);
    refreshSyncIco(0);
    return true;
}


function renameModule(moduleId,moduleName) {
    var modules;
    try{
        modules = $.parseJSON( localStorage[DATA_MODULE] )
    }catch(e){
        modules = $.parseJSON( "[]" );
        console.warn(e);
    }

    // 如果已经存在则删除
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId){
            modules[i].moduleName = moduleName;
            break;
        }
    }
    localStorage[DATA_MODULE] = JSON.stringify(modules);
    refreshSyncIco(0);
    return true;
}
function saveModule(moduleName, moduleId,status) {
    var modules;
    try {
        modules = $.parseJSON(localStorage[DATA_MODULE])
    } catch (e) {
        modules = $.parseJSON("[]");
        console.warn(e);
    }
    // 如果已经存在则删除
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId) {
            modules.splice(i, 1);
        }
    }
    var m = {"moduleName": moduleName, "moduleId": moduleId,"status":status};
    modules.unshift(m);
    localStorage[DATA_MODULE] = JSON.stringify(modules);
    refreshSyncIco(0);
    return modules;
}

// save interface and module
function saveInterface(moduleId, saveAs) {
    if( handerStr($("#url").val()) == ""){
        alert("Url can not be null");
        return false;
    }
    if( handerStr($("#save-interface-name").val()) == ""){
        alert("Interface name can not be null");
        return false;
    }
    // if moduleId is null,then create a new moduleId, but moduleNmae must be input
    if( handerStr($("#save-module-id").val()) == "" && handerStr(moduleId) == ""){
        moduleId = "ffff-"+new Date().getTime() + "-" + random(10);
        var moduleName = $("#save-module-name").val();
        if( handerStr(moduleName) == ""){
            alert("Module name can not be null");
            return;
        }
        // save module
        saveModule( moduleName, moduleId, 0, 1);
    }else{
        if( handerStr(moduleId) == "" ){
            moduleId = $("#save-module-id").val();
        }
    }

    // if interfaceId is null, meaning it's a new interface,should create a id
    // if id is not null, but saveAs is true,meaning should create a new interface base on the current interface,so id should be created
    var id = $("#interface-id").val();
    if( handerStr(id) == "" || saveAs){
        id = "ffff-"+new Date().getTime() + "-" + random(10);
    }

    var method = $("#method").val();
    var params =  getParams();

    // if params submit by form, then should format params, else mean param is custom and nothing need to do
    // as:
    // a:666
    // b:777
    var paramType = $('input:radio[name="param-type"]:checked').val();
    if(  $.inArray(paramType, customerTypes) == -1) {
        params = params.replace(/=/g, ":").replace(/&/g,"\n");
    }else{
        params = $("#customer-value").val();
    }

    var headers = getHeadersStr().replace(/=/g, ":").replace(/&/g,"\n");
    var paramType = "";
    if(method != "GET"){
        paramType = $("input[name='param-type']:checked").val()
    }

    var name = $("#save-interface-name").val();
    var url = $("#url").val();
    daoSaveInterface(moduleId, paramType, id, name, method, url, params, headers, 0, 1);
    closeMyDialog("dialog");
    return true;
}

function intitSaveInterfaceDialog(){
    $("#save-interface-name").val($("#interface-name").val());
    // 循环获取所有module
    var modules = getLocalJson(DATA_MODULE);

    $("#save-module-id").find("option").remove();
    $("#save-module-id").append("<option value='-1'>--Click to select module/folder--</option>");
    for(var i=0 ; i<modules.length; i++) {
        if(modules[i].status != -1) {
            $("#save-module-id").append("<option value='" + modules[i].moduleId + "'>" + modules[i].moduleName + "</option>");
        }
    }
    openDialog("Save interface:" + $("#interface-name").val(),500);
}

/****状态码转提示*************/
function getErrorTip(status){
	if(status == 404){
		return "-ERR_FILE_NOT_FOUND: file not found!";
	}
	if(status == 500){
		return "";
	}
}
/**********打开Dialog******************/
function openDialog(title,iwidth){
    if(!iwidth){
        iwidth = 400;
    }
    //对话框最高为浏览器的百分之80
    lookUp('dialog', '', '', iwidth ,7,'');
    $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
    showMessage('dialog','false',false,-1);
    showMessage('fade','false',false,-1);
    title = title? title:"编辑";
    $("#dialog-title").html(title);
}
function closeMyDialog(tagDiv){
    iClose(tagDiv);
    iClose('fade');
}
/************************覆盖弹框**************************************/
function alert(tipMessage, tipTime, isSuccess, width){
    if( !width){
        width = 200;
    }
	tipTime = tipTime?tipTime:2;
	if(tipMessage!=""){
		if(tipMessage!="false"&&tipMessage!=false) {
            $("#alert-div").html(tipMessage);
            if (tipMessage.length > 35){
                width = 300;
            }
            if (tipMessage.length > 75){
                width = 500;
            }
            if (tipMessage.length > 150){
                width = 800;
            }
        }
	}
	$("#alert-div").css("left",  ($(window).width()/2 - width/2) +"px").css("width", width+"px");
    $("#alert-div").removeClass("text-success");
    $("#alert-div").removeClass("text-error");
    $("#alert-div").addClass("text-" + isSuccess);

	showMessage("alert-div",tipMessage,false,tipTime);
}

/************************覆盖弹框**************************************/
function tip(response, tipTime){
    var isSuccess = response.success;

    var tipMessage = "";
    if (isSuccess == 1 || isSuccess == "success"){
        isSuccess = "success";
        tipMessage = "操作成功！";
    }else {
        isSuccess = "error";
        tipMessage = "错误信息:" + response.error.message;
    }
    tipTime = tipTime?tipTime:2;
    if(tipMessage!=""){
        if(tipMessage!="false"&&tipMessage!=false) {
            $("#" + ID_TIP).html(tipMessage);
        }
    }

    $("#" + ID_TIP).removeClass("text-success");
    $("#" + ID_TIP).removeClass("text-error");
    $("#" + ID_TIP).addClass("text-" + isSuccess);
    showMessage(ID_TIP,tipMessage,false,tipTime);
}
function myConfirm(message){
    var begin = Date.now();

    var result = window.confirm(message);
    var end = Date.now();
    if (end - begin < 10) {
        alert("Please do not disable popups,it's dangerous!「请勿禁用【确认】弹窗，直接操作非常危险」", 5, "error", 500);
        return true;
    }
    return result;
}
/** *********************页面提示信息显示方法************************* */
/**
 * 显示的div，提示信息，是否晃动，自动隐藏时间：-1为不隐藏，其它为隐藏时间（单位秒) message
 * 为false时表示不需要提示信息，仅需要显示div即可
 */
function showMessage(id,message,ishake,time){
    if(message!=""){
        if(message!="false"&&message!=false)
            $("#"+id).html(message);
        $("#"+id).fadeIn(300);
        if(ishake){
            shake(id);
        }
        if(time!=-1){
            if(isNaN(time))
                time=2000;
            else if(time>0)
                time = time * 1000;
            setTimeout(function(){
                if(time!=0){
                    $("#"+id).fadeOut(500);
                }
                else{
                    $("#"+id).fadeOut(300);
                }
                $("#"+id).hide("fast");
            },time);
        }
    }
}
// 晃动div
function shake(o){
    var $panel = $("#"+o);
    var box_left =0;
    $panel.css({'left': box_left});
    for(var i=1; 4>=i; i++){
        $panel.animate({left:box_left-(8-2*i)},50);
        $panel.animate({left:box_left+2*(8-2*i)},50);
    }
}
/*******************************************************************************
 * 根据点击位置设置div左边
 *
 * @param id
 * @param e
 *            为空时，局浏览器中部
 * @param lHeight
 * @param lWidth
 * @param onMouse
 *            div是否覆盖点击的点:(0).不覆盖，div居浏览器中部 (1).X轴居中 (2).Y轴居中 (3).X、Y轴均居中
 *            (4).右下方,(5).id左下方 6:居中，不需要考虑浏览器滚动 7：居中，高度不定，最大不超过浏览器80%
 */
function lookUp(id, e, lHeight, lWidth ,onMouse, positionId) {
    var lObj = self.document.getElementById(id);
    var lTop;
    var lLeft;
    //居中，高度不定，最大不超过浏览器80%
    if(onMouse==7){
        lLeft=$(window).width()/2 - (lWidth/2);
        lObj.style.top = '200px';
        lObj.style.width = lWidth + 'px';
        lObj.style.height = "auto";
        lObj.style.left = lLeft + 'px';
        return;
    }

    //如果传入了event
    if(e.clientY&&onMouse&&onMouse!=0){
        lTop = e.clientY;
        lLeft = e.clientX;
        if(onMouse==1){
            lLeft = lLeft - (lWidth/2);
        }else if(onMouse==2){
            lTop = lTop - (lHeight/2);
        }
        else if(onMouse==3){
            lTop = lTop - (lHeight/2);
            lLeft = lLeft - (lWidth/2);
        }else if(onMouse==4){
            lTop = e.clientY;
            lLeft = e.clientX;
        }
    }else{
        lTop=$(window).height()/2 - (lHeight/2);
        lLeft=$(window).width()/2 - (lWidth/2);
    }
    if(onMouse==5){
        lTop = $("#"+positionId).offset().top+$("#"+positionId).outerHeight()-1;
        lLeft = $("#"+positionId).offset().left-1;
    }
    if (lLeft < 0) lLeft = 5;
    if ((lLeft + lWidth*1) > $(window).width()) lLeft = $(window).width() - lWidth - 20;
    if ((lTop + lHeight*1) > $(window).height()) lTop =  $(window).height() - lHeight - 70;

    lObj.style.width = lWidth + 'px';
    lObj.style.left = (lLeft + document.documentElement.scrollLeft) + 'px';

    lObj.style.height = lHeight + 'px';
    lObj.style.top =  lTop + 'px';
}

/**************************** 隐藏div *******************************/
function iClose(id){
    $("#"+id).fadeOut(300);
}
function iShow(id){
    $("#"+id).fadeIn(300);
}

String.prototype.endWith=function(endStr){
    var str = this;
    if(endStr.length == 0 || this.length == 0){
        return false;
    }
    if(str.length < endStr.length){
        return false;
    }
    str = str.substr(str.length - endStr.length);
    return (str == endStr)
}
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
String.prototype.huanhang = function () {
    return this.replace(/\n/g, "<br>");
}
function handerStr(str){
    if( !str || str.trim() == "" || str == "NaN" || str == "undefined" || str == "-1"){
        return "";
    }
    return str.trim();
}
function random(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
}
//chrome.windows.create({url :"debug.html" },function(){});//函数后面都有一个functon(){},这个应该标识执行函数的意思吧。
/**
 * 刷新是否同步颜色标识
 * -1：初始化，从数据库读取
 * 1：同步
 * 0：有未同步数据
 * @param isSync
 */
function refreshSyncIco(isSync){
    var key = "crap-debug-isSync";
    var value = "";
    if(isSync == -1){
        value = getLocalData(key, 'false');
    }else if(isSync == 1){
        value = "true";
        saveLocalData(key, value);
    }else if(isSync == 0){
        value = "false";
        saveLocalData(key, value);
    }
    $("#synch-ico").removeClass("GET");
    $("#synch-ico").removeClass("POST");
    if(value == "true"){
        $("#synch-ico").addClass("GET");
    }else if(value == "false"){
        $("#synch-ico").addClass("POST");
    }
}
