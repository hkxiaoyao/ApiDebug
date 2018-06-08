function getLoginInfoDAO(callBack) {
    httpPost(INIT_URL, {}, true, callBack);
}

function drawLoginInfoDAO(response) {
    if (response.success == 1){
        setHtml(ID_USER_NAME, "Hi, " + response.data.sessionAdminName + " !");
        showDiv(ID_USER_NAME);
        hidenDiv(ID_LOGIN);
        showDiv(ID_LOGOUT);
    }
}

$("#" + ID_LOGOUT).click(function(){
    httpPost(LOGOUT_URL, {}, true, drawLogoutDAO);
});

function drawLogoutDAO(response) {
    tip(response, 5);
    if (response.success == 1){
        hidenDiv(ID_USER_NAME);
        showDiv(ID_LOGIN);
        hidenDiv(ID_LOGOUT);
    }
}
