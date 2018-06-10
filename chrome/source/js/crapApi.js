$(function(){
    // drawModuleDAO();

    $("#history-title").click(function(){
        $("#history").removeClass("none");
        $("#modules").addClass("none");
        $("#modules-title").removeClass("bb3");
        $(this).addClass("bb3");
        daoDrawHistory();
    });
    $("#modules-title").click(function(){
        $("#history").addClass("none");
        $("#modules").removeClass("none");
        $("#history-title").removeClass("bb3");
        $(this).addClass("bb3");
    });

    var saveAs = true;
    // 保存
    $("#save-interface").click(function(){
        if( handerStr(getValue(ID_INTERFACE_ID)) == "" || handerStr($("#id-module-id").val())== ""){
            saveAs = false;
            intitSaveInterfaceDialog();
        }else{
            // 直接保存
            $("#save-interface-name").val(getValue(ID_INTERFACE_NAME));
            var moduleId = $("#id-module-id").val();
            if( saveInterface(moduleId) ){
                alert("Success !");
            }
        }
    });

    // 另存为
    $("#save-as-interface").click(function(){
        saveAs = true;
        intitSaveInterfaceDialog();
    });

    $("#save-interface-submit").click(function(){
        saveInterface("", saveAs);
    });

    $(".close-dialog").click(function(){
        var id = $(this).attr("crap-data");
        closeMyDialog(id);
    });


    $("#history").on("click","div", function() {
        var urlInfo = $.parseJSON( $(this).attr("crap-data") );
        setValue(ID_URL, urlInfo.url);
        setValue(ID_INTERFACE_ID, "-1");
        $("#id-module-id").val("-1");
        $("#id-interface-name").val(handerStr(urlInfo.name));
        $("#id-headers-bulk-value").val(urlInfo.headers);
        $("#id-method").val(urlInfo.method);
        $("#id-method").change();

        if($.inArray(urlInfo.paramType, customerTypes) == -1){
            urlInfo.paramType = "x-www-form-urlencoded;charset=UTF-8";
            $("#id-param-type").prop("checked",true);
            $("#id-params-bulk-value").val(urlInfo.params);
            $(".key-value-edit").click();
        }else{
            $("#id-customer-type").prop("checked",true);
            // 下拉选择 customer-type
            $("#id-customer-type-select").val(urlInfo.paramType);
            $("#id-customer-type-select").change();
            $("#customer-value").val(urlInfo.params);
        }
        $("input[name='param-type']").change();


        $(".history-div").removeClass("bg-main");
        $(this).addClass("bg-main");
    });

    $("#new-interface").click(function() {
        $("#id-interface-name").val("");
        $("#id-headers-bulk-value").val("");
        $("#id-params-bulk-value").val("");
        setValue(ID_URL, "");
        setValue(ID_INTERFACE_ID, "-1");
        $("#id-module-id").val("-1");
        $("#id-method").val("GET");
        $("#id-method").change();

        $("#id-param-type").prop("checked",true);
        $("#id-params-bulk-value").val("");
        $(".key-value-edit").click();
        $("input[name='param-type']").change();

        $(".interface").removeClass("bg-main");
        $(".history-div").removeClass("bg-main");
    });
    $("#save-module-submit").click(function() {
       if($("#rename-module-name").val() == ""){
           alert("Module name can not be empty!", 5, "error", 300);
           return false;
       }
        renameModule( $("#rename-module-id").val(), $("#rename-module-name").val());
        closeMyDialog("dialog2");
    });

    /******删除接口*********/
	$("#modules").on("click",".delete-interface", function() {
        if(!myConfirm("Are you sure you want to delete? 「确定要删除吗」"))
        {
            return false;
        }
        var ids = $(this).attr("crap-data").split("|");
        daoDeleteInterface(ids[0],ids[1]);
		return false;// 不在传递至父容器
    });
    /*******上移接口**********/
    $("#modules").on("click",".up-interface", function() {
        var ids = $(this).attr("crap-data").split("|");
        daoUpInterface(ids[0],ids[1]);
        return false;// 不在传递至父容器
    });
    /*******下移接口**********/
    $("#modules").on("click",".down-interface", function() {
        var ids = $(this).attr("crap-data").split("|");
        daoDownInterface(ids[0],ids[1]);
        return false;// 不在传递至父容器
    });

    $("#modules").on("click",".delete-module", function() {
        if(!myConfirm("Are you sure you want to delete? 「确定要删除吗」"))
        {
            return false;
        }
        var moduleId = $(this).attr("crap-data");
        deleteModule(moduleId);
        return false;// 不在传递至父容器
    });
    /*******上移**********/
    $("#modules").on("click",".up-module", function() {
        var moduleId = $(this).attr("crap-data");
        upModule(moduleId);
        return false;// 不在传递至父容器
    });
    /*******下移**********/
    $("#modules").on("click",".down-module", function() {
        var moduleId = $(this).attr("crap-data");
        downModule(moduleId);
        return false;// 不在传递至父容器
    });

    $("#modules").on("click",".rename-module", function() {
        var moduleId = $(this).attr("crap-data");
        $("#rename-module-id").val(moduleId);
        lookUp('dialog2', '', '', 400 ,7,'');
        $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
        showMessage('dialog2','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });


    $("#left-enlarge").click(function(){
        if( !leftEnlarge){
            leftEnlarge = true;
            $("#left").css("width","18%");
            $("#right").css("width","82%");
            $("#left-enlarge div").html("<i class='iconfont'>&#xe605;</i>");
        }else{
            leftEnlarge = false;
            $("#left").css("width","0%");
            $("#right").css("width","100%");
            $("#left-enlarge div").html("<i class='iconfont'>&#xe641;</i>");
        }

    });
	$("#open-debug").click(function(){
			window.open("debug.html")
	});
    $("#open-json").click(function(){
        window.open("json.html")
    });

	$(".params-headers-table").on("keyup","input", function() {
      if($(this).val() != ''){
          var tr = $(this).parent().parent();
          if( tr.hasClass("last") ){
              var table = tr.parent();
              table.append(paramsTr);
              tr.removeClass("last");
          }
      }
    });
	
	$("#format-row").click(function(){
	    var rowData = originalResponseText;
	    if( rowData == ""){
            rowData = $("#response-row").val();
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $("#response-row").val(rowData);
        responseShow("response-row");
    });

    $("#format-pretty").click(function(){
        var rowData = originalResponseText;
        if( rowData == ""){
            rowData = $("#response-row").val();
        }
        try{
            $("#response-row").val(jsonFormat(rowData));
        }catch(e){
            console.warn(e)
            $("#response-row").val(rowData);
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        responseShow("response-row");
    });

    $('.response-json').on('click', function() {
       if( !formatJson() ){
            return;
       }
       changeBg("btn-default", "btn-main", "response-menu",this);
	   var value = $(this).attr("crap-data-value");
	   var key = $(this).attr("crap-data-name");
       $('#response-pretty').JSONView(key, value);
       responseShow("response-pretty");
    });

    $(".params-headers-table").on("click","i",function() {
        var tr = $(this).parent().parent();
        // 最后一行不允许删除
        if( tr.hasClass("last")){
            return;
        }
        tr.remove();
    });

    // 请求头、参数切换
  $(".params-title").click(function(){
        $(".params-title").removeClass("bb3");
        $(this).addClass("bb3");
        var contentDiv = $(this).attr("data-stage");
        $("#headers-div").addClass("none");
        $("#params-div").addClass("none");
        $("#"+contentDiv).removeClass("none");
  });

    $(".response-title").click(function(){
        $(".response-title").removeClass("bb3");

        $(this).addClass("bb3");
        var contentDiv = $(this).attr("data-stage");
        $(".response-header").addClass("none");
        $(".response-body").addClass("none");
        $(".response-cookie").addClass("none");
        $("."+contentDiv).removeClass("none");
    });



    $("#" + ID_METHOD).change(function() {
        if( getValue(ID_METHOD) == "POST" || getValue(ID_METHOD) == "PUT"){
            if($("#" + ID_CONTENT_TYPE).hasClass("none")){
                $("#" + ID_CONTENT_TYPE).removeClass("none");
            }
        }else{
            if(!$("#" + ID_CONTENT_TYPE).hasClass("none")){
                $("#" + ID_CONTENT_TYPE).addClass("none");
            }
        }
    });

    // param-type=customer
    $("#id-customer-type-select").change(function() {
        $("#id-customer-type").val( $("#id-customer-type-select").val() );
    });
    // 单选param-type监控
    $("input[name='param-type']").change(function(){
        var crapData = $("input[name='param-type']:checked").attr("crap-data");
        if( crapData && crapData=="customer") {
            $("#customer-type").removeClass("none")
            $("#params-table").addClass("none");
            $("#customer-div").removeClass("none");
        }else{
            $("#customer-type").addClass("none");
            $("#customer-div").addClass("none");
            $("#params-table").removeClass("none");
        }
    });

  // 插件调试send
  $("#send").click(function(){
	  if( showBulkHeaders ){
		 $("#headers-bulk-edit-div .key-value-edit").click();
	  }
	  if( showBulkParams ){
		 $("#params-bulk-edit-div .key-value-edit").click();
	  }
      callAjax();
  });

  // div 拖动
    $("#left").resizable(
        {
            autoHide: true,
            handles: 'e',
            maxWidth: 800,
            minWidth: 260,
            resize: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();

                divTwo = $("#right"),
                    divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
            },
            stop: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();
                divTwo = $("#right");
                divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
                ui.element.css(
                    {
                        width: ui.element.width()/parentWidth*100+"%",
                    });
            }
        });


	
})
