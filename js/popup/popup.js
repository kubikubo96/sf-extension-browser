jQuery(document).ready(function ($) {
    chrome.storage.sync.get('config', function (result) {
        var initConfig = result.config;

        //Get and Set IpServer
        if (initConfig.ipserver == '') {
            $.getJSON("https://api.ipify.org/?format=json", function (e) {
                $("#value-ipserver").val(e.ip);
                initConfig.ipserver = e.ip;

                $("#value-ipserver").val(e.ip);

                chrome.storage.sync.set({
                    config: initConfig
                });
            });
        } else {
            $("#value-ipserver").val(initConfig.ipserver);
        }

        $("#value-keyapi").val(initConfig.keyapi);

        if (initConfig.start == 'yes') {
            $("#btn-runvideo").html('Tool Đang Chạy...');
            $("#btn-getip").html('Tool Đang Chạy...');
        }
    });

    //Get IP Server
    $("body").on("click", "#btn-getip", function (event) {
        event.preventDefault();

        var ipServer = $.trim($("#value-ipserver").val());
        var keyapi = $.trim($("#value-keyapi").val());

        if (ipServer == '' || keyapi == '') {
            $(".result").html('<p class="alert alert-danger error">IP Server và Key API không được rỗng</p>');
        } else {
            var oThis = $(this);
            $(oThis).html('Loadding...');
            $(oThis).prop('disabled', true);
            $("#value-ipserver").prop('disabled', true);
            $("#value-keyapi").prop('disabled', true);

            $(".result").html('<p class="alert alert-primary">Đang lấy dữ liệu...</p>');

            //@todo custom  config option
            chrome.storage.sync.get('config', function (result) {
                var config = result.config;
                config.keyapi = keyapi;
                config.ipserver = ipServer;

                chrome.storage.sync.set({
                    config: config
                }, function () {
                });

                $(".result").html('<p class="alert alert-primary">Lấy dữ liệu thành công.</p>');
                $("#btn-getip").html('Tool Đang Được Chạy...');

                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        task: "runVideo",
                        valueData: 'yes',
                    });
                });
            });
        }
    });

    //Btn Run Video
    $("body").on("click", "#btn-runvideo", function (event) {
        event.preventDefault();

        var oThis = $(this);
        var keyapi = $.trim($("#value-keyapi").val());
        $(this).html('Đang Lấy Dữ Liệu...');
        $(oThis).prop('disabled', true);

        //@todo custom  config option
        $(".result").html('<p class="alert alert-primary">Đang lấy dữ liệu...</p>');
        chrome.storage.sync.get('config', function (result) {
            var config = result.config;
            config.keyapi = keyapi;
            chrome.storage.sync.set({
                config: config
            }, function () {
            });

            $(".result").html('<p class="alert alert-primary">Lấy dữ liệu thành công.</p>');
            $(oThis).html('Tool Đang Được Chạy...');

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    task: "runVideo",
                    valueData: 'yes',
                });
            });
        });
    });

    //Btn Cancel
    $("body").on("click", "#btn-cancel", function (event) {
        event.preventDefault();

        //Set config rong
        chrome.storage.sync.set({
            config: initConfigDefine
        });

        $("#btn-runvideo").html('Khởi Chạy');
    });

    $("body").on("click", "#btn-resetlogin", function (event) {
        event.preventDefault();

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                task: "removeCookie",
                valueData: 'yes',
            });
        });
    });
});


