jQuery(document).ready(function ($) {
    var aDomain = initConfigDefine.websites;
    var config = '';

    var sYB = 'www.youtube.com';
    var sGo = 'www.google.com';
    var sBi = 'www.bing.com';
    var sAc = 'accounts.google.com';
    var sLinkLogin = 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dvi%26next%3D%252F&amp%3Bhl=vi&amp%3Bpassive=false&amp%3Bservice=youtube&amp%3Builel=0&flowName=GlifWebSignIn&flowEntry=AddSession';

    if (typeof chrome.runtime.onMessage === "undefined") {
    } else {
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.task == "runVideo" && message.valueData == 'yes') {
                window.location.href = 'https://' + sYB;
            }

            if (message.task == "removeCookie" && message.valueData == 'yes') {
                window.location.href = 'https://www.youtube.com/?removecookie=yes';
            }
        });
    }

    var checkRemoveCookie = getUrlParameter('removecookie');
    if (checkRemoveCookie != undefined && checkRemoveCookie == 'yes') {
        eraseCookie('vtyoutubeaccounts');

        chrome.storage.sync.set({
            config: initConfigDefine
        });

        $('p.extension-show-info').remove();
        var sHtml = '<p class="extension-show-info">Reset Login Thành Công!</p>';
        $(sHtml).appendTo('body');
    }

    //Get Account
    chrome.storage.sync.get('config', function (result) {
        config = result.config;
        console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
        console.log("          Get Account In chrome.storage.sync content      🏍");

        console.log("🏍   ConfigDefine:                                        🏍");
        console.log(config);
        console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
        if (config.start == "yes") {
            aDomain = config.websites;

            var flagLogin = false;
            var flagRundom = true;
            var sUrlFull = window.location.href;
            var sDomain = location.hostname;

            //Account
            if (sDomain == sAc) {
                flagLogin = true;
                flagRundom = false;
                var flag = false;

                var sAccount = random_item(config.account.split(/\r?\n/));
                console.log("DOING  <==> Get Account");
                console.log("sAccount:");
                console.log(sAccount);
                console.log("*********************");
                if (sAccount != '') {
                    var aAccount = sAccount.split('|');
                    var sEmail = $.trim(aAccount[0]);
                    var sPassWord = $.trim(aAccount[1]);
                    var sEmailRecovery = $.trim(aAccount[2]);
                    if (sEmail != '' && sPassWord != '') {
                        flag = true;
                        chrome.storage.sync.get('config', function (result) {
                            var initConfig = result.config;

                            initConfig.data = [];
                            chrome.storage.sync.set({
                                config: initConfig
                            });
                        });

                        console.log("Run fun auToLoginAccount AFTER Get Account");
                        console.log("********************************");
                        auToLoginAccount(sEmail, sPassWord, sEmailRecovery);
                    }
                }

                if (flag == false) {
                    console.log("DOING  <==> Go to Google Page");
                    console.log("*********************");
                    window.location.href = 'https://' + sGo;
                }
            }

            //Youtube
            if (sDomain == sYB) {
                console.log("In Domain Youtube");
                console.log("*****************");

                //Nếu chưa login youtube thì chuyển về trang login
                setTimeout(() => {
                    var currentUrl = window.location.href;
                    if (currentUrl == 'https://www.youtube.com/') {
                        if (!loginYT()) {
                            $('p.extension-show-info').remove();
                            var sHtml = '<p class="extension-show-info error">Chưa đăng nhập, đang chuyển trang đăng nhập </p>';
                            $(sHtml).appendTo('body');
                            setTimeout(() => {
                                window.location.href = sLinkLogin;
                                return false;
                            }, 5000);
                        }
                    }
                }, 1000 * 120); //2p

                flagRundom = false;
                var checkHome = true;

                var randomSearch = random_item([1, 1, 1, 1, 1, 0, 0, 0, 0, 0]);
                console.log("randomSearch:" + randomSearch);
                console.log("*****************");
                var currentUrl = window.location.href;
                if (randomSearch == 1 && currentUrl == 'https://www.youtube.com/') {
                    autoScrollBrowser();

                    $('p.extension-show-info').remove();
                    var sHtml = '<p class="extension-show-info">Đang tìm video bất kỳ của Akuradio trong đề xuất </p>';
                    $(sHtml).appendTo('body');

                    var configGetIds = {
                        "url": urlGetIDs,
                        "method": "GET",
                    };
                    var listIds = dIDs;
                    $.ajax(configGetIds)
                        .done(function (ids) {
                            console.log("Get IDs API Success");
                            console.log("*********************");
                            if (ids.length > 0) {
                                listIds = ids;
                            }
                        })

                    setTimeout(() => {

                        checkFound = false;
                        /*================= START Find video in suggest page home youtube =================*/

                        $("#contents a#thumbnail").each(function () {
                            var idVideo = youtube_parser($(this).attr('href'));
                            if (listIds.includes(idVideo)) {
                                checkFound = true;
                                $(this)[0].click();

                                viewXem(parseInt(randomIntFromRange(800, 1500)) + parseInt(randomIntFromRange(10, 50)));

                                return false
                            }
                        });

                        setTimeout(() => {
                            if (checkFound == false) {
                                window.location.href = 'https://' + sGo;
                            }
                        }, 1000 * 30);

                    }, 1000 * 50);

                } else {
                    /*================= START Detail Video =================*/
                    var checkDetailVideo = youtube_parser(sUrlFull);
                    if (checkDetailVideo != false && checkDetailVideo != '') {
                        checkHome = false;
                        setTimeout(function () {
                            if ($(".extension-show-info.viewvideo").length) {
                            } else {
                                var nDuration = '';
                                $.each(config.data, function (key, val) {
                                    if (val.videoID == checkDetailVideo) {
                                        nDuration = val.duration;
                                    }
                                });

                                if (nDuration == '') {
                                    nDuration = 300;
                                }

                                console.log("Run Fun viewXem when Domain == Youtube");
                                console.log("*********************");
                                viewXem(parseInt(nDuration) + parseInt(randomIntFromRange(10, 50)));
                            }
                        }, randomIntFromRange(4000, 7000));
                    }
                    /*================= END Detail Video =================*/
                    /*================= START Find video in form search =================*/
                    var checkSearch = getUrlParameter('search_query');
                    console.log("Start find video in YOUTUBE");
                    console.log("*********************");
                    if (checkSearch != undefined && checkSearch != '') {
                        checkHome = false;

                        var sTitle = $('#search-form input#search').val();
                        if ($("#contents a.ytd-thumbnail").length && sTitle != '') {
                            var sVideoID = '';
                            var nDuration = 300;

                            if (config.data != '') {
                                $.each(config.data, function (key, val) {
                                    if (val.videoTitle == sTitle) {
                                        sVideoID = val.videoID;
                                        nDuration = val.duration;
                                    }
                                });
                            }

                            if (sVideoID != '') {
                                console.log("sVideoID:" + sVideoID);
                                $('p.extension-show-info').remove();
                                var sHtml = '<p class="extension-show-info">Đang tìm Video có ID: ' + sVideoID + '</p>';
                                $(sHtml).appendTo('body');

                                console.log("Run Fun autoScrollBrowser when Find Video");
                                autoScrollBrowser();

                                setTimeout(function () {
                                    var check = false;
                                    $("#contents a.ytd-thumbnail").each(function (i, obj) {
                                        if ($(this).attr('href') != undefined) {
                                            var idVideoGet = youtube_parser($(this).attr('href'));
                                            if (idVideoGet != false && idVideoGet == sVideoID) {
                                                console.log("idVideoGet == sVideoID");
                                                check = true;

                                                $(this).find('.no-transition').click();

                                                viewXem(parseInt(nDuration) + parseInt(randomIntFromRange(10, 50)));

                                                return false;
                                            }
                                        }
                                    });

                                    setTimeout(function () {
                                        if (check == false) {
                                            window.location.href = 'https://' + sYB;
                                        }
                                    }, 1500);
                                }, randomIntFromRange(12000, 18000));
                            } else {
                                window.location.href = 'https://' + sYB;
                            }
                        } else {
                            window.location.href = 'https://' + sYB;
                        }
                        console.log("***********************");
                    }
                    /*================= END Find video =================*/


                    if (sUrlFull == 'https://' + sYB + '/' || checkHome == true) {
                        if (config.account != '' && config.account != null && readCookie('vtyoutubeaccounts') == null) {
                            flagLogin = true;

                            if (config.autoremovecache == 'yes') {
                                console.log("In clear cache trình duyệt");
                                console.log("***********************");
                                $('p.extension-show-info').remove();
                                var sHtml = '<p class="extension-show-info">Đang xóa cache trình duyệt...</p>';
                                $(sHtml).appendTo('body');

                                flagRundom = false;

                                var date = new Date();
                                var seconds = Math.round(date.getTime() / 1000);
                                var sTime = seconds.toString();
                                document.title = sTime;

                                chrome.runtime.sendMessage({
                                    task: "clearAllCache",
                                    time: sTime,
                                });

                                setTimeout(function () {
                                    createCookie('vtyoutubeaccounts', 'yes', config.timechangeemail);
                                }, 10000);
                            } else {
                                createCookie('vtyoutubeaccounts', 'yes', config.timechangeemail);
                                return false;
                            }
                        }

                        if (flagLogin == false) {
                            var nRandom = random_item([1, 1, 3, 1, 1, 3, 1, 1, 2]);

                            if (nRandom == 1) {
                                autoSearchData('youtube');
                            }

                            if (nRandom == 2) {
                                setTimeout(function () {
                                    randomHomeYT();
                                }, randomIntFromRange(5000, 10000));
                            }

                            if (nRandom == 3) {
                                autoRedrectRandomLink();
                            }
                        }
                    }
                }
            }

            //Google
            if (sDomain == sGo && config.search_google == 'yes') {
                console.log("In Domain Google");
                console.log("*******************");
                flagRundom = false;
                var checkSearch = getUrlParameter('q');
                console.log("checkSearch:" + checkSearch);
                if (checkSearch == undefined) {
                    var check = random_item([1, 2, 1]);
                    if (check == 1) {
                        autoSearchData('google');
                    } else {
                        autoRedrectRandomLink();
                    }
                } else {
                    setTimeout(function () {
                        console.log("Start Find Video In Google");
                        var sTitle = $('input.gLFyf').val();
                        if (sTitle == undefined) { sTitle = $('.tsf-p #lst-ib').val(); }
                        if (sTitle == undefined) { sTitle = $('.wQnou input.JSAgYe').val(); }
                        if (sTitle == undefined) { sTitle = $('input#lst-ib').val(); }
                        if (sTitle == undefined) {
                            var aTitle = document.title.split(' - ');
                            sTitle = aTitle[0];
                        }
                        console.log("sTitle:" + sTitle);
                        if (sTitle == undefined || sTitle == '') {
                            window.location.href = 'https://' + sGo + '/';
                        }

                        var sVideoID = '';
                        if (sTitle != '' && sTitle != undefined) {
                            if (config.data != '') {
                                $.each(config.data, function (key, val) {
                                    if (val.videoTitle == sTitle) {
                                        sVideoID = val.videoID;
                                    }
                                });
                            }
                            console.log("sVideoID:" + sVideoID);
                            if (sVideoID != '') {

                                console.log("Run autoScrollBrowser Khi Tìm Video");
                                autoScrollBrowser();

                                $('p.extension-show-info').remove();
                                var sHtml = '<p class="extension-show-info">Đang tìm Video có ID: ' + sVideoID + '</p>';
                                $(sHtml).appendTo('body');

                                setTimeout(function () {
                                    var flag = false;

                                    //Tab Tất Cả
                                    if ($('#search a').length) {
                                        $("#search a").each(function () {
                                            var idVideoGet = youtube_parser($(this).attr('href'));
                                            if (idVideoGet != false && idVideoGet == sVideoID) {
                                                console.log("idVideoGet == sVideoID");
                                                flag = true;
                                                $(this)[0].click();
                                                return;
                                            }
                                        });
                                    }

                                    //Tab Video
                                    if ($(".yuRUbf > a").length) {
                                        $(".yuRUbf > a").each(function (index, value) {
                                            var idVideoGet = youtube_parser($(this).attr('href'));
                                            console.log("Tab Video idVideoGet:" + idVideoGet);
                                            if (idVideoGet != false && idVideoGet == sVideoID) {
                                                flag = true;
                                                $(this)[0].click();
                                                return;
                                            }
                                        });
                                    }

                                    //Tab other
                                    if ($("#rso .rc .r > a").length) {
                                        $("#rso .rc .r > a").each(function (index, value) {
                                            var idVideoGet = youtube_parser($(this).attr('href'));
                                            console.log("Tab other idVideoGet:" + idVideoGet);
                                            if (idVideoGet != false && idVideoGet == sVideoID) {
                                                flag = true;
                                                $(this)[0].click();
                                                return;
                                            }
                                        });
                                    }

                                    setTimeout(function () {
                                        if (flag == false) {
                                            //Tab Not Tab Hinh Anh
                                            if ($("#hdtb-msb-vis .hdtb-mitem.hdtb-msel").length) {
                                                //Chuyen Tab
                                                if ($("#hdtb-msb-vis .hdtb-mitem.hdtb-msel").next().find('a').attr('href') == undefined) {
                                                    window.location.href = 'https://' + sGo + '/';
                                                } else {
                                                    $("#hdtb-msb-vis .hdtb-mitem.hdtb-msel").next().find('a')[0].click();
                                                }
                                            }

                                            //Tab Hinh Anh
                                            if ($(".T47uwc .NZmxZe").length) {
                                                $(".T47uwc .rQEFy.NZmxZe").next()[0].click();
                                            }

                                            setTimeout(function () {
                                                window.location.href = 'https://' + sGo + '/';
                                            }, 5000);
                                        }
                                    }, 2500);
                                }, randomIntFromRange(8000, 15000));
                            } else {
                                window.location.href = 'https://' + sGo + '/';
                            }
                        }
                        console.log("*********************");
                    }, 1500);
                }
            }

            //Bing
            if (sDomain == sBi && config.search_bing == 'yes') {
                console.log("In Domain Bing");
                console.log("*******************");
                flagRundom = false;
                var checkSearch = getUrlParameter('q');
                if (checkSearch == undefined) {
                    var check = random_item([1, 2, 1]);
                    if (check == 1) {
                        autoSearchData('bing');
                    } else {
                        autoRedrectRandomLink();
                    }
                } else {
                    console.log("Start Find Video in Bing");
                    console.log("*********************");
                    var checkDetail = getUrlParameter('view');
                    console.log("checkDetail:" + checkDetail);
                    if (checkDetail == undefined) {
                        var sTitle = $('#sb_form #sb_form_q').val();
                        console.log("sTitle:" + sTitle);
                        if (sTitle != '' && sTitle != undefined) {
                            if (config.data != '') {
                                $.each(config.data, function (key, val) {
                                    if (val.videoTitle == sTitle) {
                                        sVideoID = val.videoID
                                    }
                                });
                            }

                            console.log("sVideoID:" + sVideoID);
                            if (sVideoID != '') {
                                console.log("Run autoScrollBrowser khi tìm video");
                                autoScrollBrowser();

                                $('p.extension-show-info').remove();
                                var sHtml = '<p class="extension-show-info">Đang tìm Video có ID: ' + sVideoID + '</p>';
                                $(sHtml).appendTo('body');

                                setTimeout(function () {
                                    //tim kiếm video theo id
                                    console.log("DOING <=> Tìm Video ở Bing:");
                                    if ($('#b_results a').length) {
                                        var flag = false;

                                        //@kubikubo search ping
                                        $('#b_results a').each(function () {
                                            var idVideoGet = youtube_parser($(this).attr('href'));
                                            if (idVideoGet == sVideoID) {
                                                console.log("idVideoGet:" + idVideoGet);
                                                console.log("sVideoID:" + sVideoID);
                                            }
                                            if (idVideoGet != false && idVideoGet == sVideoID) {
                                                flag = true;
                                                if ($(this)[0]) {
                                                    $(this)[0].click();
                                                }
                                                if ($(this)) {
                                                    $(this).click();
                                                }

                                                //Chuyển hướng về trang google nếu lỗi
                                                setTimeout(() => {
                                                    window.location.href = 'https://' + sGo + '/';
                                                }, 1000 * 10);

                                                return;
                                            }
                                        });


                                        $(".dg_b .dg_u .mc_vtvc_link").each(function (index, value) {
                                            var dataGet = $(this).find('.vrhdata').attr('vrhm');
                                            if (dataGet != undefined) {
                                                var aArr = $.parseJSON(dataGet);
                                                if (aArr['murl'] != '') {
                                                    var idVideoGet = youtube_parser(aArr['murl']);
                                                    if (idVideoGet != false && idVideoGet == sVideoID) {
                                                        flag = true;
                                                        $(this)[0].click();
                                                        return;
                                                    }
                                                }
                                            }
                                        });

                                        setTimeout(function () {
                                            if (flag == false) {
                                                window.location.href = random_item(aDomain);
                                            }
                                        }, 15000);
                                    } else {
                                        //chuyen tab
                                        if ($(".b_scopebar li.b_active").next().length) {
                                            $(".b_scopebar li.b_active").next().find('a')[0].click();
                                        } else {
                                            window.location.href = random_item(aDomain);
                                        }
                                    }
                                    console.log("*********************");
                                }, randomIntFromRange(8000, 15000));
                            } else {
                                console.log("DOING <=> Chuyển trang bất kỳ nếu sVideoID = '' ");
                                window.location.href = random_item(aDomain);
                            }
                        } else {
                            console.log("DOING <=> Chuyển trang bất kỳ nếu sTitle = '' ");
                            window.location.href = random_item(aDomain);
                        }
                    } else {
                        console.log("Nếu checkDetail != Undefine ==> Vào đây:");
                        console.log("*********************");
                        setTimeout(function () {
                            var nDuration = '';
                            var idVideoGet = youtube_parser($("#mm_vdmb_keydata .mmvdp_meta_title_link").attr('href'));
                            if (idVideoGet != false) {
                                $.each(config.data, function (key, val) {
                                    if (val.videoID == idVideoGet) {
                                        nDuration = val.duration;
                                    }
                                });
                            }

                            setTimeout(function () {
                                if (nDuration == '') {
                                    nDuration = 300;
                                }

                                nDuration = parseInt(nDuration) + parseInt(randomIntFromRange(10, 50));

                                $('p.extension-show-info').remove();
                                var sHtml = '<p class="extension-show-info">' +
                                    'Thời gian xem video còn lại: <span id="extension-clock">' + nDuration + '</span>s' +
                                    '</p>';
                                $(sHtml).appendTo('body');

                                var sTime = setInterval(function () {
                                    nDuration--;
                                    if (nDuration >= 0) {
                                        $("#extension-clock").html(nDuration);
                                    }

                                    if (nDuration === 0 || nDuration <= 0) {
                                        window.location.href = random_item(aDomain);
                                        clearInterval(sTime);
                                    }
                                }, 1000);

                            }, 1500);
                        }, 2500);
                    }
                }
            }

            if (flagRundom == true) {
                autoRedrectRandomLink();
            }
        }
    });

    //Auto search
    function autoSearchData(sDomain = '') {
        console.log("🌳🌳 In Fun autoSearchData");
        console.log("*****************");
        $('p.extension-show-info').remove();
        var sHtml = '<p class="extension-show-info">Đang lấy video để xem...</p>';
        $(sHtml).appendTo('body');

        if (sDomain == 'youtube') {
            $('#search-form input#search').val('');
        }

        if (sDomain == 'google') {
            $('.tsf input.gLFyf').val('');
        }

        if (sDomain == 'bing') {
            $('#sb_form_q').val('');
        }

        var flagCheck = true;
        var date = new Date();
        var seconds = Math.round(date.getTime() / 1000);
        var sTime = seconds.toString();

        document.title = sTime;

        chrome.runtime.sendMessage({
            task: "getDataVideo",
            time: sTime,
        });

        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.task == "getDataVideoResult") {
                if (message.status == 'success') {
                    console.log("Data Call API:");
                    console.log(message);
                    console.log("**************");
                    var sTtitle = message.value;

                    $('p.extension-show-info').remove();
                    var sHtml = '<p class="extension-show-info">Từ khóa tìm kiếm: ' + sTtitle + '</p>';
                    $(sHtml).appendTo('body');

                    if (sDomain == 'bing') {
                        if ($('form#sb_form').length) {
                            $('#sb_form_q').bind('autotyped', function () {
                                setTimeout(function () {
                                    $("form#sb_form .search").click();
                                }, randomIntFromRange(800, 2200));

                            }).autotype(sTtitle, { delay: randomIntFromRange(80, 200) });
                        } else {
                            window.location.href = random_item(aDomain);
                        }
                    }

                    if (sDomain == 'google') {
                        if ($('input.gLFyf').length) {
                            $('input.gLFyf').click();
                            $('input.gLFyf').bind('autotyped', function () {
                                setTimeout(function () {
                                    $("#tsf").submit();
                                    $("form").submit();
                                }, randomIntFromRange(800, 2200));
                            }).autotype(sTtitle, { delay: randomIntFromRange(80, 200) });
                        } else {
                            window.location.href = random_item(aDomain);
                        }
                    }

                    if (sDomain == 'youtube') {
                        if ($('#search-form input#search').length) {
                            $('#search-form input#search').bind('autotyped', function () {
                                setTimeout(function () {
                                    try {
                                        document.getElementById('search-form').submit();
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    // if($("#search-icon-legacy")) {
                                    //     $("#search-icon-legacy").click();
                                    // }
                                }, randomIntFromRange(800, 2200));
                            }).autotype(sTtitle, { delay: randomIntFromRange(80, 200) });
                        } else {
                            window.location.href = random_item(aDomain);
                        }
                    }
                }

                if (message.status == 'fail') {
                    flagCheck = false;
                    $('p.extension-show-info').remove();
                    var sHtml = '<p class="extension-show-info error">' + message.value + '</p>';
                    $(sHtml).appendTo('body');
                }
            }
        });

        setTimeout(function () {
            if (flagCheck == true) {
                window.location.href = random_item(aDomain);
            }
        }, 1000 * 100);
    }

    //Login account
    function auToLoginAccount(sEmail = '', sPassWord = '', sEmailRecovery = '') {
        console.log("🌳🌳 In Fun auToLoginAccount");
        console.log("Email: " + sEmail);
        console.log("PassWord: " + sPassWord);
        console.log("EmailRecovery: " + sEmailRecovery);
        console.log("***************");
        var flagCheck = false;
        $('p.extension-show-info').remove();
        var sHtml = '<p class="extension-show-info">' +
            '- Email: ' + sEmail + '<br>' +
            '- Mật Khẩu: ' + sPassWord + '<br>' +
            '- Email Khôi Phục: ' + sEmailRecovery +
            '</p>';
        $(sHtml).appendTo('body');

        var sUrlFull = window.location.href;

        var checkLinkCurrent = sUrlFull.split('?continue=');
        if (checkLinkCurrent.length == 2) {
            checkLinkCurrent = checkLinkCurrent[0];
        } else {
            checkLinkCurrent = '';
        }

        setTimeout(function () {
            //Email Disabled
            var nCheck = sUrlFull.split("/disabled/").length;
            if (nCheck == 2) {
                flagCheck = true;
                sendEmailDisabled(sEmail);
            }

            //UserName
            var checkLink = sUrlFull.split('/identifier');
            if (checkLink.length == 2) {
                flagCheck = true;

                $('p.extension-show-info').remove();
                var sHtml = '<p class="extension-show-info">- Email: ' + sEmail + '</p>';
                $(sHtml).appendTo('body');

                if ($("input[type=email]").length) {
                    $("input[type=email]").click();
                    $("input[type=email]").val(sEmail);
                } else {
                    $(".CxRgyd > div > .d2CFce input.whsOnd").click();
                    $(".CxRgyd > div > .d2CFce input.whsOnd").val(sEmail);
                }

                setTimeout(function () {
                    $(".qhFLie .U26fgb").click(); //BTN Tiep theo
                    $("button.VfPpkd-LgbsSe").click(); //BTN Tiep theo

                    console.log("Run Fun auToLoginAccountChange In auToLoginAccount. TASK : UserName");
                    console.log("****************************");
                    auToLoginAccountChange(sEmail, sPassWord, sEmailRecovery, checkLinkCurrent);

                    return false;
                }, randomIntFromRange(2000, 3000));
            }

            //Password
            var checkLink = sUrlFull.split('/challenge/pwd');
            if (checkLink.length == 2) {
                flagCheck = true;

                $('p.extension-show-info').remove();
                var sHtml = '<p class="extension-show-info">- Mật Khẩu: ' + sPassWord + '</p>';
                $(sHtml).appendTo('body');

                if ($("input[type=password]").length) {
                    $("input[type=password]").click();
                    $("input[type=password]").val(sPassWord);
                } else {
                    $(".SdBahf input.whsOnd").click();
                    $(".SdBahf input.whsOnd").val(sPassWord);
                }

                setTimeout(function () {
                    $(".qhFLie .U26fgb").click(); //BTN Tiep theo
                    $(".qhFLie button.VfPpkd-LgbsSe").click(); //BTN Tiep theo

                    console.log("Run Fun auToLoginAccountChange In auToLoginAccount. TASK : Password");
                    console.log("****************************");
                    auToLoginAccountChange(sEmail, sPassWord, sEmailRecovery, checkLinkCurrent);

                    return false;
                }, randomIntFromRange(2000, 3000));
            }

            //Chon nut: xac nhan email khoi phuc cua bạn
            var checkLink = sUrlFull.split('/challenge/selection');
            if (checkLink.length == 2) {
                flagCheck = true;

                $(".OVnw0d .JDAKTe .lCoei").each(function (index) {
                    if ($(this).attr('data-challengetype') == 12) {
                        $(this).click();

                        auToLoginAccountChange(sEmail, sPassWord, sEmailRecovery, checkLinkCurrent);

                        return false;
                    }
                });
            }

            //Email khoi phuc
            var checkLink = sUrlFull.split('/challenge/kpe');
            if (checkLink.length == 2) {
                flagCheck = true;

                $('p.extension-show-info').remove();
                var sHtml = '<p class="extension-show-info">- Email khôi phục: ' + sEmailRecovery + '</p>';
                $(sHtml).appendTo('body');

                if ($("input[type=email]").length) {
                    $("input[type=email]").click();
                    $("input[type=email]").val(sEmailRecovery);
                } else {
                    $(".Xb9hP .whsOnd").val(sEmailRecovery);
                }

                setTimeout(function () {
                    $(".zQJV3 .qhFLie .U26fgb").click(); //BTN Tiep theo
                    $(".qhFLie button.VfPpkd-LgbsSe").click(); //BTN Tiep theo

                    auToLoginAccountChange(sEmail, sPassWord, sEmailRecovery, checkLinkCurrent);

                    return false;
                }, randomIntFromRange(2000, 3000));
            }

            if (flagCheck == false) {
                window.location.href = sLinkLogin;
            }
        }, randomIntFromRange(3000, 4500));
    }

    //AuToLoginAccountChange
    function auToLoginAccountChange(sEmail = '', sPassWord = '', sEmailRecovery = '', checkLinkCurrent = '') {
        console.log("🌳🌳 In Fun auToLoginAccountChange");
        console.log("Email: " + sEmail);
        console.log("PassWord: " + sPassWord);
        console.log("EmailRecovery: " + sEmailRecovery);
        console.log("checkLinkCurrent: " + checkLinkCurrent);
        console.log("***************");

        var nTimeChangeAccount = 0;

        $('p.extension-show-info error').remove();
        var sHtml = '<p class="extension-show-info error">Đang đợi chuyển hướng trang đăng nhập: <span id="extension-clock">' + nTimeChangeAccount + '</span>s</p>';
        $(sHtml).appendTo('body');

        var sTimeChange = setInterval(function () {
            nTimeChangeAccount++;

            $("#extension-clock").html(nTimeChangeAccount);

            if (nTimeChangeAccount >= 20) {
                clearInterval(sTimeChange);

                window.location.href = sLinkLogin;
            } else {
                var sUrlFull = window.location.href;

                var checkLinkCurrentTemp = sUrlFull.split('?continue=');
                if (checkLinkCurrentTemp.length == 2) {
                    checkLinkCurrentTemp = checkLinkCurrentTemp[0];
                } else {
                    checkLinkCurrentTemp = '';
                }

                if (checkLinkCurrent != checkLinkCurrentTemp) {
                    clearInterval(sTimeChange);

                    $('p.extension-show-info.error').remove();

                    auToLoginAccount(sEmail, sPassWord, sEmailRecovery);
                }
            }
        }, 1000);
    }

    //send Email Disabled
    function sendEmailDisabled(sEmail = '') {
        console.log("🌳🌳 In Fun sendEmailDisabled");
        console.log("Email:" + sEmail);
        console.log("********************");
        //Remove Email In storage Chrome
        chrome.storage.sync.get('config', function (result) {
            var initConfig = result.config;

            var aAccountNew = [];
            var aAccount = initConfig.account.split(/\r?\n/);
            $.each(aAccount, function (key, value) {
                var aAccountTemp = value.split('|');
                var sEmailRemove = $.trim(aAccountTemp[0]);
                if (sEmailRemove != sEmail) {
                    aAccountNew.push(value);
                }
            });

            //Lưu Email die về máy
            var elmDownEmail = document.createElement('a');
            var numFile = Math.floor(Math.random() * 1000);
            var fileName = 'email_die_' + numFile + '.txt';
            elmDownEmail.href = "data:application/octet-stream," + encodeURIComponent(sEmail);
            elmDownEmail.download = fileName;
            elmDownEmail.click();
        });

        var date = new Date();
        var seconds = Math.round(date.getTime() / 1000);
        var sTime = seconds.toString();
        document.title = sTime;

        chrome.runtime.sendMessage({
            task: "setDisabledEmail",
            time: sTime,
            email: sEmail
        });

        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.task == "setDisabledEmailResult") {
                window.location.href = sLinkLogin;
            }
        });
    }

    //Check Login Youtube
    function loginYT() {
        console.log("Kiểm tra Login:");
        var elmNotLg = $("#masthead-container #end ytd-button-renderer a");
        var elmLg = $('#avatar-btn img');
        var logged = true;

        if (elmNotLg) {
            if (elmNotLg.length > 0) {
                logged = false;
            } else {
                logged = true;
            }
        }

        if (elmLg) {
            if (elmLg.length > 0) {
                logged = true;
            } else {
                elmLg = false;
            }
        }

        console.log("Login: " + logged);
        console.log("*********************");

        return logged;
    }

    //View videos
    function viewXem(nDuration = '') {
        console.log("🌳🌳 In Fun viewXem");
        if (readCookie('vtyoutubeaccounts') == null) {
            createCookie('vtyoutubeaccounts', 'yes', config.timechangeemail);
        } else {
            setTimeout(function () {
                chrome.storage.sync.get('config', function (result) {
                    var initConfig = result.config;

                    var nView = initConfig.views;
                    console.log("nView:" + nView);
                    console.log("nDuration:" + nDuration);
                    if (nView < 4) {
                        var flag = false;
                        var aDataVideo = '';
                        var sVideoID = youtube_parser(window.location.href);
                        var nTimeSub = 70;

                        //Xem Video Lan 2 trở đi
                        if (nDuration == '') {
                            console.log("Xem Video Lần 2 trở đi");
                            console.log("sVideoID:" + sVideoID);
                            console.log("******************");
                            if (sVideoID != false && sVideoID != '') {
                                var date = new Date();
                                var seconds = Math.round(date.getTime() / 1000);
                                var sTimeData = seconds.toString();
                                document.title = sTimeData;

                                chrome.runtime.sendMessage({
                                    task: "getInfoVideoDetail",
                                    time: sTimeData,
                                    videoID: sVideoID
                                });

                                chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                                    if (message.task == "getInfoVideoDetailResult") {
                                        if (message.status == 'success') {
                                            aDataVideo = message.data;
                                            flag = true;
                                        }

                                        if (message.status == 'error') {
                                            window.location.href = random_item(aDomain);
                                        }
                                    }
                                });
                            } else {
                                window.location.href = random_item(aDomain);
                            }
                        } else {
                            //Xem Video Lan 1
                            if (initConfig.account != '') {
                                console.log("Xem Video Lần 1:");
                                console.log('*************************');
                                if (sVideoID != false && sVideoID != '') {
                                    $.each(initConfig.data, function (key, val) {
                                        if (val.videoID == sVideoID) {
                                            nTimeSub = val.timeSub;
                                        }
                                    });
                                }

                                //Thực hiện autoLike
                                setTimeout(() => {
                                    console.log("Run autoLike in Fun viewXem");
                                    console.log('*************************');
                                    autoLike();
                                }, 2500);

                                //Thực hiện autoSubscribe
                                setTimeout(function () {
                                    console.log("Run autoSubscribe in Fun viewXem");
                                    console.log("******************");
                                    autoSubscribe(nTimeSub);

                                }, 2500);

                                //Thực hiện getComment
                                setTimeout(function () {
                                    console.log("Run getComment in Fun viewXem");
                                    console.log("*****************");
                                    getComment();
                                }, randomIntFromRange(60000, 130000));


                                //Thực hiện ACTION
                                setTimeout(function () {
                                    console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
                                    console.log("Run MANY ACTION in Fun videoXem");
                                    actionSeeNoty();
                                    actionPause();
                                    actionZoom();
                                    actionShowMoreDes();
                                    actionSortComment();
                                    actionAutoNextVideo();
                                    actionClicktoNext();
                                    actionSound();
                                    checkViewDone();
                                    console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
                                }, 2500);
                            }
                        }

                        //Play Video
                        setTimeout(function () {
                            console.log("Play Video:");
                            console.log("******************");
                            var aLabel = ['Phát (k)', 'Play (k)'];
                            var sLabel = $("button.ytp-play-button").attr("aria-label");

                            $(aLabel).each(function (key, value) {
                                if (value == sLabel) {
                                    $("button.ytp-play-button").click();
                                }
                            });
                        }, randomIntFromRange(6000, 10500));

                        setTimeout(function () {
                            if (flag == true) {
                                nDuration = 0;
                                if (typeof aDataVideo.time != 'undefined' || aDataVideo.time != undefined) {
                                    nDuration = aDataVideo.time;

                                    if (initConfig.account != '') {
                                        if (aDataVideo.time_sub > 0) {
                                            nTimeSub = aDataVideo.time_sub;
                                        }
                                        console.log("Run autoSubscribe in Fun viewXem");
                                        autoSubscribe(nTimeSub);
                                        console.log("*******************");


                                        console.log("Run autoLike in Fun viewXem");
                                        autoLike();
                                        console.log("*******************");

                                        setTimeout(function () {
                                            console.log("Run autoComment in Fun viewXem");
                                            console.log("*********************");
                                            autoComment(random_item(aDataVideo.comment));
                                        }, randomIntFromRange(60000, 130000));

                                        console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
                                        console.log("Run MANY ACTION in Fun viewXem");
                                        actionSeeNoty();
                                        actionPause();
                                        actionZoom();
                                        actionShowMoreDes();
                                        actionSortComment();
                                        actionAutoNextVideo();
                                        actionClicktoNext();
                                        actionSound();
                                        checkViewDone();
                                        console.log("🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍🏍");
                                    }
                                }
                            }

                            console.log("Run autoScrollBrowser in viewXem");
                            console.log("******************");
                            autoScrollBrowser();

                            //run new page nếu hết thời gian xem
                            if (nDuration <= 0) {
                                console.log("Run new Page khi hết thời gian xem");
                                console.log("******************");
                                window.location.href = random_item(aDomain);
                            }

                            var minTScroll = nDuration - 500;
                            var maxTScroll = nDuration - 300;
                            if (minTScroll > 0) {
                                setTimeout(() => {
                                    console.log("Run autoScrollBrowser Lần 2 in viewXem");
                                    console.log("******************");
                                    autoScrollBrowser();
                                }, randomIntFromRange(minTScroll, maxTScroll) * 1000);
                            }

                            $('p.extension-show-info').remove();
                            var sHtml = '<p class="extension-show-info viewvideo">Đang xem video lần thứ ' + nView + ': <span id="extension-clock">' + nDuration + '</span>s</p>';
                            $(sHtml).appendTo('body');

                            console.log("Đang xem video lần thứ nView:" + nView);
                            console.log("nDuration:" + nDuration);
                            console.log("******************");
                            var sTime = setInterval(function () {
                                nDuration--;

                                if (nDuration >= 0) {
                                    $("#extension-clock").html(nDuration);
                                }

                                if (nDuration == 20) {
                                    nDuration = 0;
                                    clearInterval(sTime);

                                    var iView = nView + 1;
                                    if (iView >= 4) {
                                        initConfig.views = 1;
                                        chrome.storage.sync.set({
                                            config: initConfig
                                        });

                                        window.location.href = random_item(aDomain);
                                    } else {
                                        initConfig.views = iView;
                                        try {
                                            chrome.storage.sync.set({
                                                config: initConfig
                                            });
                                        } catch (error) {
                                            console.error(error);
                                        }

                                        console.log("Đang tìm video lần:" + nView);
                                        console.log("nDuration:" + nDuration);
                                        console.log("******************");
                                        $('p.extension-show-info').remove();
                                        var sHtml = '<p class="extension-show-info">Đang tìm video lần ' + iView + '</p>';
                                        $(sHtml).appendTo('body');

                                        var aVideoID = '';
                                        var date = new Date();
                                        var seconds = Math.round(date.getTime() / 1000);
                                        var sTimeData = seconds.toString();
                                        document.title = sTimeData;

                                        chrome.runtime.sendMessage({
                                            task: "getInfoVideo",
                                            time: sTimeData,
                                            videoID: sVideoID
                                        });

                                        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                                            console.log("Get Data In Task getInfoVideoResult:");
                                            console.log("message:");
                                            console.log(message);
                                            console.log("******************");
                                            if (message.task == "getInfoVideoResult") {
                                                if (message.status == 'success') {
                                                    aVideoID = message.data;
                                                }
                                            }
                                        });

                                        setTimeout(function () {
                                            console.log("aVideoID:" + aVideoID);
                                            console.log("******************");
                                            if (aVideoID == '') {
                                                initConfig.views = 1;
                                                chrome.storage.sync.set({
                                                    config: initConfig
                                                });
                                                window.location.href = random_item(aDomain);
                                            } else {
                                                var configGetIds = {
                                                    "url": urlGetIDs,
                                                    "method": "GET",
                                                };
                                                var listIds = dIDs;
                                                $.ajax(configGetIds)
                                                    .done(function (ids) {
                                                        console.log("Get IDs API Success");
                                                        console.log("*********************");
                                                        if (ids.length > 0) {
                                                            listIds = ids;
                                                        }
                                                    })
                                                var flagCheck = false;
                                                //@todo Xử lý tìm xem 1 video bất kỳ trong danh sách đề xuất 
                                                var listIDVideos = [];
                                                var maxIDsRandom = 10;
                                                setTimeout(() => {
                                                    $("#related ytd-watch-next-secondary-results-renderer .ytd-watch-next-secondary-results-renderer #thumbnail").each(function () {
                                                        var idVideo = youtube_parser($(this).attr('href'));
                                                        if (idVideo) {
                                                            listIDVideos.push(idVideo);
                                                        }
                                                        if (listIDVideos.length > maxIDsRandom) {
                                                            return false;
                                                        }
                                                    });
                                                    console.log("listIDVideos:");
                                                    console.log(listIDVideos);
                                                    var anyID = random_item(listIDVideos);
                                                    console.log("anyID:" + anyID);
                                                    console.log("******************");
                                                    var sRandomView = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
                                                    if (random_item(sRandomView) == 1) {
                                                        $("#related ytd-watch-next-secondary-results-renderer .ytd-watch-next-secondary-results-renderer #thumbnail").each(function () {
                                                            var idVideo = youtube_parser($(this).attr('href'));
                                                            if (listIds.includes(idVideo)) {
                                                                flagCheck = true;

                                                                $(this)[0].click();

                                                                viewXem(parseInt(randomIntFromRange(800, 1500)) + parseInt(randomIntFromRange(10, 50)));

                                                                return false
                                                            }
                                                        });
                                                    } else {
                                                        $("#related ytd-watch-next-secondary-results-renderer .ytd-watch-next-secondary-results-renderer #thumbnail").each(function () {
                                                            var idVideo = youtube_parser($(this).attr('href'));
                                                            if (idVideo && idVideo == anyID) {
                                                                flagCheck = true;

                                                                $(this)[0].click();

                                                                viewXem();

                                                                return false
                                                            }
                                                        });
                                                    }

                                                }, 5000);

                                                setTimeout(function () {
                                                    console.log("flagCheck:" + flagCheck);
                                                    console.log("******************");
                                                    if (flagCheck == false) {
                                                        initConfig.views = 1;
                                                        chrome.storage.sync.set({
                                                            config: initConfig
                                                        });

                                                        window.location.href = random_item(aDomain);
                                                    }
                                                }, 15000);
                                            }
                                        }, 3700);
                                    }
                                }
                            }, 1000);
                        }, 5000);
                    } else {
                        initConfig.views = 1;
                        chrome.storage.sync.set({
                            config: initConfig
                        });

                        window.location.href = random_item(aDomain);
                    }
                });
            }, 2500);
        }
    }

    //Action Phóng to video hoặc full màn hình
    function actionZoom(timeAZ = 25) {
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In Fun actionZoom");
            timeAZ = parseInt(timeAZ) + randomIntFromRange(0, 60);
            console.log("timeAZ:" + timeAZ);
            console.log("******************");
            setTimeout(() => {
                if ($('button.ytp-size-button.ytp-button')[0]) {
                    $('button.ytp-size-button.ytp-button')[0].click();
                }
            }, 25 * 1000);
        }
    }

    //Action hiển thị thêm phần mô tả
    function actionShowMoreDes(timeASM = 280) {
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In Fun actionShowMoreDes");
            timeASM = parseInt(timeASM) + randomIntFromRange(0, 60);
            console.log("timeASM:" + timeASM);
            console.log("******************");
            setTimeout(() => {
                if ($('.more-button.style-scope.ytd-video-secondary-info-renderer')[0]) {
                    $('.more-button.style-scope.ytd-video-secondary-info-renderer')[0].click();
                }
                setTimeout(() => {
                    if ($('.less-button.style-scope.ytd-video-secondary-info-renderer')[0]) {
                        $('.less-button.style-scope.ytd-video-secondary-info-renderer')[0].click();
                    }
                }, 2500);
            }, timeASM * 1000);
        }
    }

    //Action sort comment
    function actionSortComment(timeASC = 230) {
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In Fun actionSortComment");
            timeASC = parseInt(timeASC) + randomIntFromRange(0, 60);
            console.log("timeASC:" + timeASC);
            console.log("******************");
            setTimeout(() => {
                if ($('.dropdown-trigger.style-scope.yt-dropdown-menu')[0]) {
                    $('.dropdown-trigger.style-scope.yt-dropdown-menu')[0].click();
                }
                setTimeout(() => {
                    if ($('tp-yt-paper-item .style-scope.yt-dropdown-menu')[0]) {
                        $('tp-yt-paper-item .style-scope.yt-dropdown-menu')[0].click();
                    }
                }, 2500);
            }, timeASC * 1000);
        }
    }

    //Action button auto next video
    function actionAutoNextVideo(timeANV = 350) {
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In Fun actionAutoNextVideo");
            timeANV = parseInt(timeANV) + randomIntFromRange(0, 60);
            console.log("timeANV:" + timeANV);
            console.log("******************");
            setTimeout(() => {
                if ($('.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]')[0]) {
                    $('.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]')[0].click();
                }
            }, timeANV * 1000);
        }
    }

    //Action button next video
    function actionClicktoNext() { //600s
        if (random_yes_no(2, 8) == 'yes') {
            console.log("🌳🌳 In Fun actionClicktoNext");
            var timeCTN = parseInt(initConfigDefine.time_view) - 200;
            timeCTN = parseInt(timeCTN) + randomIntFromRange(0, 60);
            console.log("timeCTN:" + timeCTN);
            console.log("******************");
            setTimeout(() => {
                if ($('.ytp-next-button.ytp-button')[0]) {
                    $('.ytp-next-button.ytp-button')[0].click();
                }
            }, timeCTN * 1000);
        }
    }

    //Action disable, enable sound
    function actionSound(timeASD = 130) {
        if (random_yes_no(2, 8) == 'yes') {
            console.log("🌳🌳 In Fun actionSound");
            timeASD = parseInt(timeASD) + randomIntFromRange(0, 60);
            console.log("timeASD:" + timeASD);
            console.log("******************");
            setTimeout(() => {
                if ($('.ytp-mute-button.ytp-button')[0]) {
                    $('.ytp-mute-button.ytp-button')[0].click();
                }
            }, timeASD * 1000);
        }
    }

    //Action Pause xem video and another action when pause video
    function actionPause(timeP = 100) {// 100 <=> 100
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In Fun actionPause");
            console.log("timeP:" + timeP);
            console.log("******************");
            timeP = parseInt(timeP) + randomIntFromRange(0, 60);
            setTimeout(() => {

                $('p.extension-show-comment').remove();
                var sHtml = '<p class="extension-show-comment"><strong>Dừng video để thực hiện các action</strong> ' + "" + '</p>';
                $(sHtml).appendTo('body');

                console.log("DOING  <==> PAUSE Video");
                console.log("***********************");
                //pause videos
                if ($('video.html5-main-video')) {
                    $('video.html5-main-video').click();
                }

                setTimeout(() => {
                    console.log("DOING  <==> CLICKED settings");
                    console.log("***********************");
                    //click settings
                    $('.ytp-button.ytp-settings-button')[0].click();
                    var elmOpSettings = $('.ytp-popup.ytp-settings-menu .ytp-panel-menu .ytp-menuitem');

                    //click vào chất lượng videos
                    if (elmOpSettings.length > 0) {
                        console.log("DOING  <==> Chọn chất lượng video");
                        elmOpSettings.each(function () {
                            if ($(this).find('.ytp-menuitem-label') && ($(this).find('.ytp-menuitem-label').text().trim() == 'Chất lượng' || $(this).find('.ytp-menuitem-label').text().trim() == 'Quality')) {
                                $(this)[0].click();
                                return false;
                            }
                        });

                        //click chọn chất lượng videos
                        setTimeout(() => {
                            elmOpQl = $('.ytp-popup.ytp-settings-menu .ytp-menuitem');

                            var arrQuality = [];
                            if (elmOpQl && elmOpQl.length > 0) {
                                elmOpQl.each(function () {
                                    switch ($(this).text().trim()) {
                                        case '144p':
                                            arrQuality.push('240p');
                                            break;
                                        case '240p':
                                            arrQuality.push('360p');
                                            break;
                                        case '360p':
                                            arrQuality.push('480p');
                                            break;
                                        case '720p':
                                            arrQuality.push('720p');
                                            break;
                                        default:
                                            arrQuality.push('144p');
                                            break;
                                    }
                                });

                                var oneQuality = random_item(arrQuality);
                                console.log("quality:" + oneQuality);
                                elmOpQl.each(function () {
                                    if ($(this).text().trim() == oneQuality) {
                                        $(this)[0].click();
                                        return false;
                                    }
                                });
                            }
                            console.log("***********************");
                        }, 2500);

                        setTimeout(() => {
                            console.log("DOING  <==> Tiếp tục phát");
                            console.log("***********************");
                            //tiếp tục phát video
                            if ($('video.html5-main-video')) {
                                $('video.html5-main-video').click();
                            }
                            $('p.extension-show-comment').remove();
                        }, 10000);
                    }
                }, 2500);
            }, timeP * 1000);
        }
    }

    //Action Xem thông báo
    function actionSeeNoty(timeSnt = 200) {// 200 <=> 200s
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In Fun actionSeeNoty");
            console.log("timeSnt:" + timeSnt);
            console.log("******************");

            timeSnt = parseInt(timeSnt) + randomIntFromRange(0, 60);
            var elmNoty = $('.ytd-notification-topbar-button-renderer')[0];
            if (elmNoty) {
                setTimeout(() => {
                    console.log("Bật xem thông báo");
                    console.log("**************");

                    $('p.extension-show-comment').remove();
                    var sHtml = '<p class="extension-show-comment"><strong>Bật xem thông báo</strong> ' + "" + '</p>';
                    $(sHtml).appendTo('body');

                    elmNoty.click();

                    //Sau 2s bật thông báo thì scroll màn thông báo
                    setTimeout(() => {
                        var elmWapperNoty = $('#contentWrapper #container.menu-container');
                        var nTimeScrollBottom = randomIntFromRange(7500, 9000);
                        var nTimeScrollTop = randomIntFromRange(7500, 9000);
                        var nTimeTotal = nTimeScrollBottom + nTimeScrollTop + randomIntFromRange(2000, 6000);
                        var iTemp = 0;
                        var sTime = setInterval(function () {
                            nTimeScrollBottom = randomIntFromRange(7500, 9000);
                            nTimeScrollTop = randomIntFromRange(7500, 9000);
                            nTimeTotal = nTimeScrollBottom + nTimeScrollTop + randomIntFromRange(2000, 6000);

                            var heightScroll = $(document).height() - randomIntFromRange(0, 800);

                            elmWapperNoty.animate({ scrollTop: heightScroll }, nTimeScrollBottom);

                            if (iTemp == 0) {
                                elmWapperNoty.animate({ scrollTop: 0 }, nTimeScrollTop);
                            } else {
                                setTimeout(function () {
                                    elmWapperNoty.animate({ scrollTop: 0 }, nTimeScrollTop);
                                }, nTimeScrollBottom);
                            }

                            if (iTemp >= 1) {
                                clearInterval(sTime)
                            }

                            iTemp++;

                        }, nTimeTotal);
                    }, 2000);
                }, timeSnt * 1000);

                setTimeout(() => {
                    console.log("Tắt xem thông báo");
                    console.log("**************");

                    $('p.extension-show-comment').remove();
                    var sHtml = '<p class="extension-show-comment"><strong>Tắt xem thông báo</strong> ' + "" + '</p>';
                    $(sHtml).appendTo('body');


                    setTimeout(() => {
                        $('p.extension-show-comment').remove();
                    }, randomIntFromRange(800, 2000));

                    elmNoty.click();
                }, (timeSnt + 30) * 1000); //tắt xem thông báo sau thời gian bật thông báo + 30s
            }
        }
    }

    function checkViewDone() {
        //Kiểm tra xem đã xem hết video chưa
        setTimeout(() => {
            console.log("Check Done:");
            setInterval(() => {
                var elmPause = $('.ytp-play-button.ytp-button');
                if (elmPause) {
                    if (elmPause.attr('title') == "Phát lại" || elmPause.attr('title') == "Replay") {
                        console.log("Check Done: TRUE");
                        window.location.href = random_item(aDomain);
                        return false;
                    }
                }
            }, 1000 * 5); //5s check lại 1 lần
            console.log("************");
        }, 1000 * 60); //1p thì bắt đầu check
    }

    //Auto Subscrible
    function autoSubscribe(timeSub = 70) {
        console.log("🌳🌳 In Fun autoSubscribe");
        console.log("timeSub:" + timeSub);
        console.log("******************");
        var timeSub = parseInt(timeSub) + randomIntFromRange(0, 60);
        var attr = $("#meta-contents #subscribe-button #notification-preference-button").attr('hidden');
        if (typeof attr !== typeof undefined && attr !== false) {
            //Chua dang ky
            setTimeout(function () {
                $("#meta-contents #subscribe-button tp-yt-paper-button.style-scope").click();
                setTimeout(function () {
                    $("#meta-contents #subscribe-button a.ytd-subscription-notification-toggle-button-renderer yt-icon-button#button").click();
                    setTimeout(function () {
                        $("#items .ytd-menu-popup-renderer:nth-child(1)").click();
                    }, randomIntFromRange(2000, 4000));
                }, randomIntFromRange(2000, 4000));
            }, timeSub * 1000);
        } else {
            //Da dang ky
        }
    }

    //Auto Redirect RandomLink
    function autoRedrectRandomLink(lbl = '', sClass = '') {
        console.log("🌳🌳 In fun autoRedrectRandomLink");
        console.log(lbl);
        console.log(sClass);
        console.log("******************");
        var counter = randomIntFromRange(10, 40);

        if (counter > 10) {
            setTimeout(function () {
                var heightScroll = $(document).height() - randomIntFromRange(0, 600);
                $('html, body').animate({ scrollTop: heightScroll }, randomIntFromRange(3000, 10000));
            }, randomIntFromRange(4000, 10000));
        }

        if (lbl == '') {
            lbl = 'Đang chạy tạm thời sẽ chuyển hướng trang sau: ';
        }

        $('p.extension-show-info').remove();
        var sHtml = '<p class="extension-show-info ' + sClass + '">' +
            lbl + ' <span id="extension-clock">' + counter + '</span>s' +
            '</p>';
        $(sHtml).appendTo('body');

        setInterval(function () {
            counter--;
            if (counter >= 0) {
                $("#extension-clock").html(counter);
            }

            if (counter === 0) {
                window.location.href = random_item(aDomain);
                clearInterval(counter);
            }

        }, 1000);
    }

    //Get Comment
    function getComment() {
        console.log("🌳🌳 In  Fun getComment");
        var sVideo = youtube_parser(window.location.href);
        console.log("sVideo:" + sVideo);
        console.log("**************");
        if (sVideo != false) {
            if ($("#header #placeholder-area").length) {
                $("#header #placeholder-area").click();
                setTimeout(function () {
                    var date = new Date();
                    var seconds = Math.round(date.getTime() / 1000);
                    var sTime = seconds.toString();
                    document.title = sTime;

                    chrome.runtime.sendMessage({
                        task: "getDataCommentVideo",
                        time: sTime,
                        video: sVideo
                    });

                    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                        if (message.task == "getDataVideoCommentResult") {
                            if (message.status == 'success') {
                                console.log("Run autoComment In getComment");
                                console.log("******************");
                                autoComment(message.data);
                            }
                        }
                    });
                }, randomIntFromRange(1500, 2500));
            }
        }
    }

    //Auto Comment
    function autoComment(sComment) {
        var commented = false;
        if (random_yes_no() == 'yes') {
            console.log("🌳🌳 In fun autoComment");
            console.log("******************");

            var countComments = 0;
            var enableComment = false;
            //check comment enable
            if ($('#comments #contents.style-scope.ytd-item-section-renderer'))
                enableComment = true;

            //count comment
            if ($('#comments #contents.style-scope.ytd-item-section-renderer .ytd-comment-thread-renderer'))
                countComments = $('#comments #contents.style-scope.ytd-item-section-renderer .ytd-comment-thread-renderer').length;

            console.log("enableComment:" + enableComment);
            console.log("countComments:" + countComments);
            if (enableComment && sComment != '' && countComments < 4) {
                var sComment = sComment + random_item(['', '.', '..', '...', '!', '!!', '!!!', ' @', ' @@', ' @@@!', '..!..', ' <3', ' <3 <3', ' <3<3<3']);
                console.log("Nội dung Comment:" + sComment);
                console.log("******************");
                $('p.extension-show-comment').remove();
                var sHtml = '<p class="extension-show-comment"><strong>Nội dung bình luận:</strong> ' + sComment + '</p>';
                $(sHtml).appendTo('body');

                if (document.querySelector('#simplebox-placeholder'))
                    document.querySelector('#simplebox-placeholder').click();

                if ($("#comment-dialog #commentbox #contenteditable-root"))
                    $("#comment-dialog #commentbox #contenteditable-root").html(sComment);

                if ($("#comment-dialog #commentbox .ytd-commentbox.style-primary"))
                    $("#comment-dialog #commentbox .ytd-commentbox.style-primary").removeAttr('disabled');

                if ($("#comment-dialog #commentbox .ytd-commentbox.style-primary #button"))
                    $("#comment-dialog #commentbox .ytd-commentbox.style-primary #button").attr('tabindex', 0);

                if ($("#comment-dialog #commentbox .ytd-commentbox.style-primary #button"))
                    $("#comment-dialog #commentbox .ytd-commentbox.style-primary #button").attr('aria-disabled', false);

                if ($("#comment-dialog #commentbox .ytd-commentbox.style-primary #button"))
                    $("#comment-dialog #commentbox .ytd-commentbox.style-primary #button").removeAttr('style');

                setTimeout(function () {
                    console.log("DOING <=> Comment videos");
                    console.log("******************");
                    if ($("#comment-dialog #commentbox #submit-button"))
                        $("#comment-dialog #commentbox #submit-button").click();
                    setTimeout(() => {
                        if ($('p.extension-show-comment'))
                            $('p.extension-show-comment').remove();
                        commented = true;
                    }, randomIntFromRange(800, 2000));
                }, randomIntFromRange(800, 2000));
            }
        }
        //Nếu chưa comment và chưa tắt show-comment
        setTimeout(() => {
            if (commented == false) {
                if ($('p.extension-show-comment'))
                    $('p.extension-show-comment').remove();
            }
        }, 6000);
    }

    //Auto Like
    function autoLike() {
        console.log("🌳🌳 In fun autoLike");
        console.log("*************");
        if ($("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer").length) {
            setTimeout(function () {
                if ($("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer.style-default-active").length) {
                    //Da like or Dislike
                } else {
                    var check = random_yes_no(8, 2);
                    if (check == 'yes') {
                        $("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(1) a")[0].click();
                    } else {
                        $("#menu-container #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(2) a")[0].click();
                    }
                }
            }, randomIntFromRange(100, 200) * 1000);
        }
    }

    //Auto Scroll Brower
    function autoScrollBrowser() {
        console.log("🌳🌳 In Fun autoScrollBrowser");
        console.log("*********************");
        var nTimeScrollBottom = randomIntFromRange(7500, 9000);
        var nTimeScrollTop = randomIntFromRange(7500, 9000);
        var nTimeTotal = nTimeScrollBottom + nTimeScrollTop + randomIntFromRange(2000, 6000);
        var iTemp = 0;
        var sTime = setInterval(function () {
            nTimeScrollBottom = randomIntFromRange(7500, 9000);
            nTimeScrollTop = randomIntFromRange(7500, 9000);
            nTimeTotal = nTimeScrollBottom + nTimeScrollTop + randomIntFromRange(2000, 6000);

            var heightScroll = $(document).height() - randomIntFromRange(0, 800);

            $('html, body').animate({ scrollTop: heightScroll }, nTimeScrollBottom);

            if (iTemp == 0) {
                $('html, body').animate({ scrollTop: 0 }, nTimeScrollTop);
            } else {
                setTimeout(function () {
                    $('html, body').animate({ scrollTop: 0 }, nTimeScrollTop);
                }, nTimeScrollBottom);
            }

            if (iTemp >= 1) {
                clearInterval(sTime)
            }

            iTemp++;

        }, nTimeTotal);
    }

    //Random Home YT
    function randomHomeYT() {
        console.log("🌳🌳 In Fun randomHomeYT");
        console.log('******************');
        if ($("ytd-rich-item-renderer.style-scope").length) {
            var nItem = randomIntFromRange(1, $("ytd-rich-item-renderer.style-scope").length);
            var flag = true;
            $("ytd-rich-item-renderer.style-scope").each(function (i, obj) {
                if ((i + 1) == nItem) {
                    if ($(this).find("#thumbnail").attr('href') != undefined) {
                        viewXem(randomIntFromRange(50, 150));

                        $(this).find("#thumbnail")[0].click();
                    } else {
                        flag = false;
                    }
                }
            });

            if (flag == false) {
                window.location.href = 'https://' + sYB;
            }
        } else {
            window.location.href = 'https://' + sYB;
        }
    }

    //Get Param url
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
    }

    //Get ID Video from url
    function youtube_parser(url) {
        if (url != '' && url != undefined) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            if (match != undefined) {
                return (match && match[7].length == 11) ? match[7] : false;
            }
        }

        return false;
    }

    //Random Array
    function random_item(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    //Random range Minmax
    function randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //Random Yes = 3, No = 7
    function random_yes_no(yes = 3, no = 7) {
        arrYesNO = [];
        for (let i = 0; i < yes; i++) {
            arrYesNO.push('yes');
        }
        for (let j = 0; j < no; j++) {
            arrYesNO.push('no');
        }
        return random_item(arrYesNO);
    }

    //Create Cookie
    function createCookie(name, value, minute) {
        var expires;

        if (minute) {
            var date = new Date();

            date.setTime(date.getTime() + (minute * 60 * 1000));

            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";

        setTimeout(function () {
            window.location.href = sLinkLogin;
        }, 2500);
    }

    //Read cookie
    function readCookie(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    //Delete cookie
    function eraseCookie(name) {
        createCookie(name, "", -1);
    }
});
