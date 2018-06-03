/***********获取本地存储的数据**********/
function getLocalData(key, def){
    try{
        var value = localStorage[key];
        if(value){
            return value;
        }
        if (def) {
            return def;
        }else{
            return "[]";
        }
    }catch(e){
        console.error(e);
        if (def) {
            return def;
        }else{
            return "[]";
        }
    }
}

function getLocalJson(key, def) {
    return $.parseJSON( getLocalData(key, def) );
}

/*********存储数据至本地***********/
function saveLocalData(key,value){
    try{
        localStorage[key] = value;
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

function saveLocalJson(key,value){
    try{
        localStorage[key] = JSON.stringify(value);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

/********* http *******/
function httpPost(url, myData, callBack){
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        data: myData,
        beforeSend: function (request) {
            // 通过body传递参数时后需要设置
            //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        complete: function (responseData, textStatus) {
            if (textStatus == "error") {
                alert("网络异常，Status:" + responseData.status + "\nStatusText:" + responseData.statusText + "\nTextStatus: " + textStatus, 5, "error");
                return $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"未知错误\",\"message\":网络异常\"\"}}")
            }

            else if (textStatus == "success") {
                var responseJson = $.parseJSON(responseData.responseText);
                if (responseJson.success == 1) {
                    callBack(responseJson);
                }else{
                    alert("错误码：" + responseJson.error.code + "，错误信息" + responseJson.error.message, 5, "error");
                    callBack(responseJson);
                }
            }
        }
    });
}