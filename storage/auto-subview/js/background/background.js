chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        config: initConfigDefine
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //Set Disable Email
    if (message.task == "setDisabledEmail") {
        console.log("In Task setDisabledEmail");
        console.log("******************");
        var nTime = parseInt(message.time);

        chrome.tabs.query({}, function (tabs) {
            $.each(tabs, function (key, value) {
                var tabCurrent = tabs[key].id;

                var sTitleGet = tabs[key].title;

                var numchk = new RegExp("^[0-9]*$");
                if (numchk.test(sTitleGet)) {
                    var nTitleGet = parseInt(tabs[key].title);

                    var flag = false;
                    if (!isNaN(nTitleGet)) {
                        var nTimeCheck = nTime - nTitleGet;
                        if (nTimeCheck == 0 || nTimeCheck < 2) {
                            flag = true;
                        }
                    }

                    if (nTime == nTitleGet || flag == true) {
                        chrome.storage.sync.get('config', function (result) {
                            var sTask = 'setDisabledEmailResult';

                            //@todo custom  handle export email die
                            var emailDied = {
                                'type': 'disableemail',
                                'email': message.email,
                                'vps': result.config.ipserver,
                                'key': result.config.keyapi,
                            };

                            chrome.tabs.sendMessage(tabCurrent, {
                                task: sTask,
                                status: 'success',
                                data: emailDied
                            });
                        });
                    }
                }
            });
        });
    }
    //Get data video comment
    if (message.task == "getDataCommentVideo") {
        console.log("In Task getDataCommentVideo");
        console.log("******************");
        var nTime = parseInt(message.time);
        var sVideo = message.video;

        chrome.tabs.query({}, function (tabs) {
            $.each(tabs, function (key, value) {
                var tabCurrent = tabs[key].id;

                var sTitleGet = tabs[key].title;

                var numchk = new RegExp("^[0-9]*$");
                if (numchk.test(sTitleGet)) {
                    var nTitleGet = parseInt(tabs[key].title);

                    var flag = false;
                    if (!isNaN(nTitleGet)) {
                        var nTimeCheck = nTime - nTitleGet;
                        if (nTimeCheck == 0 || nTimeCheck < 2) {
                            flag = true;
                        }
                    }

                    if (nTime == nTitleGet || flag == true) {
                        chrome.storage.sync.get('config', function (result) {
                            var sTask = 'getDataVideoCommentResult';
                            //@todo custom  Get data comment video
                            var configCall = {
                                "url": urlGetComments,
                                "method": "GET",
                            };
                            $.ajax(configCall)
                                .done(function (comments) {
                                    console.log("Comments Call API:");
                                    console.log(comments);
                                    console.log("******************");
                                    if (comments.length > 0) {
                                        chrome.tabs.sendMessage(tabCurrent, {
                                            task: sTask,
                                            status: 'success',
                                            data: random_item(comments)
                                        });
                                    }
                                })
                                .fail(function () {
                                    chrome.tabs.sendMessage(tabCurrent, {
                                        task: sTask,
                                        status: 'success',
                                        data: random_item(['Hay', 'đc', 'good', 'ok', 'find', 'like', 'Good', 'Xem', 'Hiểu', '#akuradio'])
                                    });
                                })
                        });
                    }
                }
            });
        });
    }

    //@todo custom  Get data video
    if (message.task == "getDataVideo") {
        console.log("In Task getDataVideo");
        console.log("******************");
        var nTime = parseInt(message.time);

        chrome.tabs.query({}, function (tabs) {
            $.each(tabs, function (key, value) {
                var tabCurrent = tabs[key].id;
                var sTitleGet = tabs[key].title;

                var numchk = new RegExp("^[0-9]*$");
                if (numchk.test(sTitleGet)) {
                    var nTitleGet = parseInt(tabs[key].title);

                    var flag = false;
                    if (!isNaN(nTitleGet)) {
                        var nTimeCheck = nTime - nTitleGet;
                        if (nTimeCheck == 0 || nTimeCheck < 2) {
                            flag = true;
                        }
                    }

                    //@todo custom  call api to get value define
                    if (nTime == nTitleGet || flag == true) {
                        chrome.storage.sync.get('config', function (result) {
                            var sTask = 'getDataVideoResult';
                            //@todo custom  call api to get value define
                            var configCallVideos = {
                                "url": urlGetVideos,
                                "method": "GET",
                            };

                            var configCallWebsNews = {
                                "url": urlGetWebsNew,
                                "method": "GET",
                            };

                            var websNewsCall = [];
                            //Get API WebsNews
                            $.ajax(configCallWebsNews)
                                .done(function (websNews) {
                                    console.log("Webs New Call API:");
                                    if (websNews.length > 0) {
                                        websNewsCall = random_arr(websNews, 10);
                                    }
                                    console.log(websNewsCall);
                                    console.log("*****************************");
                                })
                            //Get API Video
                            $.ajax(configCallVideos)
                                .done(function (videosApi) {
                                    if (videosApi.length > 0) {
                                        chrome.storage.sync.get('config', function () {
                                            var initConfig = result.config;
                                            var videoUse = random_item(videosApi);
                                            var sVideoID = videoUse.id;
                                            var sTitle = videoUse.title;
                                            var duration = initConfigDefine.time_view;     //Thoi gian xem
                                            var nTimeSub = initConfigDefine.time_sub;     //Thoi gian sub

                                            var flag = false;
                                            if (initConfig.data != '') {
                                                $.each(initConfig.data, function (key, val) {
                                                    if (val.chromeTab == tabCurrent) {
                                                        flag = true;

                                                        initConfig.data[key].videoID = sVideoID;
                                                        initConfig.data[key].videoTitle = sTitle;
                                                        initConfig.data[key].duration = duration;
                                                        initConfig.data[key].timeSub = nTimeSub;
                                                        initConfig.data[key].chromeTab = tabCurrent;
                                                    }
                                                });
                                            }
                                            initConfig.websites = websNewsCall.concat(websMain);

                                            setTimeout(function () {
                                                if (flag == false) {
                                                    initConfig.data.push({
                                                        videoID: sVideoID,
                                                        videoTitle: sTitle,
                                                        duration: duration,
                                                        timeSub: nTimeSub,
                                                        chromeTab: tabCurrent,
                                                    });
                                                }

                                                chrome.storage.sync.set({
                                                    config: initConfig
                                                });

                                                chrome.tabs.sendMessage(tabCurrent, {
                                                    task: sTask,
                                                    value: sTitle,
                                                    status: 'success',
                                                });
                                            }, 1000);
                                        });
                                    }
                                })
                                .fail(function () {
                                    chrome.tabs.sendMessage(tabCurrent, {
                                        task: sTask,
                                        value: 'Đúng là API Free, Lỗi Hoài à',
                                        status: 'success',
                                    });
                                })
                        });
                    }
                }
            });
        });
    }

    //Get info video
    if (message.task == "getInfoVideo") {
        console.log("In Task getInfoVideo");
        console.log("******************");
        var nTime = parseInt(message.time);

        chrome.tabs.query({}, function (tabs) {
            $.each(tabs, function (key, value) {
                var tabCurrent = tabs[key].id;
                var sTitleGet = tabs[key].title;

                var numchk = new RegExp("^[0-9]*$");
                if (numchk.test(sTitleGet)) {
                    var nTitleGet = parseInt(tabs[key].title);

                    var flag = false;
                    if (!isNaN(nTitleGet)) {
                        var nTimeCheck = nTime - nTitleGet;
                        if (nTimeCheck == 0 || nTimeCheck < 2) {
                            flag = true;
                        }
                    }

                    if (nTime == nTitleGet || flag == true) {
                        chrome.storage.sync.get('config', function (result) {
                            var sTask = 'getInfoVideoResult';

                            //@todo custom  getInfoVideoResult
                            chrome.tabs.sendMessage(tabCurrent, {
                                task: sTask,
                                status: 'success',
                                data: "videoUse.id" // id của video bất kỳ phải
                            });
                        });
                    }
                }
            });
        });
    }

    //getInfoVideoDetail
    if (message.task == "getInfoVideoDetail") {
        console.log("In Task getInfoVideoDetail");
        console.log("*********************");
        var nTime = parseInt(message.time);

        chrome.tabs.query({}, function (tabs) {
            $.each(tabs, function (key, value) {
                var tabCurrent = tabs[key].id;
                var sTitleGet = tabs[key].title;

                var numchk = new RegExp("^[0-9]*$");
                if (numchk.test(sTitleGet)) {
                    var nTitleGet = parseInt(tabs[key].title);

                    var flag = false;
                    if (!isNaN(nTitleGet)) {
                        var nTimeCheck = nTime - nTitleGet;
                        if (nTimeCheck == 0 || nTimeCheck < 2) {
                            flag = true;
                        }
                    }

                    if (nTime == nTitleGet || flag == true) {
                        chrome.storage.sync.get('config', function (result) {
                            var sTask = 'getInfoVideoDetailResult';

                            var dataVideoDetail = {
                                time: randomIntFromRange(100, 200),
                                time_sub: randomIntFromRange(120, 180),
                                comment: random_item(['Hay', 'đc', 'good', 'ok', 'find', 'like', 'Good', 'Xem', 'Hiểu', '#akuradio'])
                            };
                            console.log("sendMessage => timeViewAny");
                            console.log("*********************");
                            chrome.tabs.sendMessage(tabCurrent, {
                                task: sTask,
                                status: 'success',
                                data: dataVideoDetail
                            });
                        });
                    }
                }
            });
        });
    }

    //clearAllCache
    if (message.task == "clearAllCache") {
        console.log("In Task clearAllCache");
        console.log("*********************");
        var nTime = parseInt(message.time);

        chrome.tabs.query({}, function (tabs) {
            $.each(tabs, function (key, value) {
                var sTitleGet = tabs[key].title;

                var numchk = new RegExp("^[0-9]*$");
                if (numchk.test(sTitleGet)) {
                    var nTitleGet = parseInt(tabs[key].title);

                    var flag = false;
                    if (!isNaN(nTitleGet)) {
                        var nTimeCheck = nTime - nTitleGet;
                        if (nTimeCheck == 0 || nTimeCheck < 2) {
                            flag = true;
                        }
                    }

                    if (nTime == nTitleGet || flag == true) {
                        var callback = function () {
                        };
                        var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
                        var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
                        chrome.browsingData.remove({
                            "since": oneWeekAgo
                        }, {
                            "appcache": true,
                            "cache": true,
                            "cacheStorage": true,
                            "cookies": true,
                            "downloads": true,
                            "fileSystems": true,
                            "formData": true,
                            "history": true,
                            "indexedDB": true,
                            "localStorage": true,
                            "passwords": true,
                            "serviceWorkers": true,
                            "webSQL": true
                        }, callback);
                    }
                }
            });
        });
    }
});

//Random Array
function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

//Lấy 1 mảng con n phần tử random từ mảng lớn
function random_arr(arr, n) {
    var newArr = [];
    var i = 0;
    if (n > arr.length) n = arr.length;
    while (i < n) {
        let item = arr[Math.floor(Math.random() * arr.length)];
        if (!newArr.includes(item)) {
            newArr.push(item);
            i++;
        }
    }
    return newArr;
}

// Get UrlParameter
function getUrlParameter(sParam, sUrl = '') {
    if (sUrl != '') {
        var sPageURL = sUrl;
    } else {
        var sPageURL = window.location.search.substring(1);
    }
    var sURLVariables = sPageURL.split('&');
    var sParameterName;
    var i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

//Random range Minmax
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}