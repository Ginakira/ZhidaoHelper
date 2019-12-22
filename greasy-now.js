// ==UserScript==
// @name         知道精选审核助手
// @namespace    https://sakata.ml/
// @version      5.4
// @description  为精选审核平台添加快捷功能
// @author       坂田银串
// @match        *://zhidao.baidu.com/review/excellentreview*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @grant        none
// @license      GPL
// ==/UserScript==

(function () {
    'use strict';
    //Value Part
    let version = 5.4;
    let interval_id1;
    let interval_id2;
    let left = "<div class=\"sakata-leftbox sakata\">\
    <li>更改完后点击任意空白处生效</li>\
    <li>跳过键：<select class=\"key-option\" id = \"sk-opt\"></select></li>\
    <li>打回键：<select class=\"key-option\" id = \"bk-opt\"></select></li>\
    <li>通过键：<select class=\"key-option\" id = \"sm-opt\"></select></li>\
    <br>\
    <li><button class=\"sakata-lbtns\" id=\"ssearch\">查询该题</button></li>\
    <li><button class='sakata-lbtns' id='clear-cnt'>计数清空</button></li>\
    <li><button class='sakata-lbtns' id='set-bkbtn'>设置模版</button></li>\
    <li><button class='sakata-lbtns' id='syncBtn'>云同步</button></li>\
    <li><a href='javascript:void(0)' id='bkBtnSwitch'>开/关模版按钮显示</a></li>\
    <li><a href='javascript:void(0)' id='refBoxSwitch'>开/关参考资料检测</a></li>\
    <li><a href='javascript:void(0)' id='errCodeSwitch'>开/关乱码检测</a></li>\
    <li><a href='javascript:void(0)' id='closeAddon'>暂时隐藏插件</a></li>\
    </div>";
    let btns = "<div class=\"sakata-tips sakata\"><a id=\"stip\">点击完按钮后请按一下空格 否则无法打回</a></div>\
    <div class=\"input-box sakata\">\
    </div>";
    let codeTrans = {
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        106: "小键盘*",
        107: "小键盘+",
        108: "小键盘Enter",
        109: "小键盘-",
        110: "小键盘.",
        111: "小键盘/",
        186: ";",
        187: "= +",
        189: "-",
        190: ". >",
        191: "/ ?",
        192: "` ~",
        219: "[{",
        220: "\\ |",
        221: "] }",
        103: "小键盘7",
        104: "小键盘8",
        105: "小键盘9",
        8: "BackSpace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        20: "CapsLock",
        27: "Esc",
        32: "Spacebar",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "LeftArrow",
        38: "UpArrow",
        39: "RightArrow",
        40: "DownArrow",
        45: "Insert",
        46: "Delete",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        96: "小键盘0",
        97: "小键盘1",
        98: "小键盘2",
        99: "小键盘3",
        100: "小键盘4",
        101: "小键盘5",
        102: "小键盘6"
    };
    let re = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/;
    let uid = $(".u-username")[0].innerText;
    //Local Storage Part
    if (!localStorage.getItem("SkipCode"))
        localStorage.setItem("SkipCode", 192);
    if (!localStorage.getItem("BackCode"))
        localStorage.setItem("BackCode", 112);
    if (!localStorage.getItem("SubmitCode"))
        localStorage.setItem("SubmitCode", 113);
    if (!localStorage.getItem("BackCount"))
        localStorage.setItem("BackCount", 0);
    if (!localStorage.getItem("SubmitCount"))
        localStorage.setItem("SubmitCount", 0);
    if (!localStorage.getItem("sbtn1"))
        localStorage.setItem("sbtn1", "模版未设置");
    if (!localStorage.getItem("sbtn2"))
        localStorage.setItem("sbtn2", "模版未设置");
    if (!localStorage.getItem("sbtn3"))
        localStorage.setItem("sbtn3", "模版未设置");
    if (!localStorage.getItem("sbtn4"))
        localStorage.setItem("sbtn4", "模版未设置");
    if (!localStorage.getItem("sbtn5"))
        localStorage.setItem("sbtn5", "模版未设置");
    if (!localStorage.getItem("sbtn6"))
        localStorage.setItem("sbtn6", "模版未设置");
    if (!localStorage.getItem("txbtn1"))
        localStorage.setItem("txbtn1", "未设置");
    if (!localStorage.getItem("txbtn2"))
        localStorage.setItem("txbtn2", "未设置");
    if (!localStorage.getItem("txbtn3"))
        localStorage.setItem("txbtn3", "未设置");
    if (!localStorage.getItem("txbtn4"))
        localStorage.setItem("txbtn4", "未设置");
    if (!localStorage.getItem("txbtn5"))
        localStorage.setItem("txbtn5", "未设置");
    if (!localStorage.getItem("txbtn6"))
        localStorage.setItem("txbtn6", "未设置");
    if (!localStorage.getItem("btnOn"))
        localStorage.setItem("btnOn", 1);
    if (!localStorage.getItem("refOn"))
        localStorage.setItem("refOn", 1);
    if (!localStorage.getItem("errOn"))
        localStorage.setItem("errOn", 1);
    //Function Part
    //Input box move to end
    function moveEnd(obj) {
        obj.focus();
        let len = obj.value.length;
        if (document.selection) {
            let sel = obj.createTextRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    }
    //Instert content to introBack-box
    function introBackInsert(appendText) {
        document.getElementById("intro-back").value += appendText + '\n';
        moveEnd(document.getElementById('intro-back'));
    }
    //Create shortcut keys option
    function createOption() {
        for (let kcode in codeTrans) {
            let opt = "<option value = " + kcode + ">" + codeTrans[kcode] + "</option>";
            $(".key-option").append(opt);
        }
    }
    //Get References
    function getRef() {
        let refs = $(".audit-detail-full :contains('参考资料') a");
        let surls = "";
        if (refs.length > 0) {
            for (let i = 0; i < refs.length; ++i) {
                let lurl = refs[i].href;
                surls += "<a href='" + lurl + "' target='view_window'>" + re.exec(lurl)[0] + "</a>  "
            }
            $(".ref-box")[0].innerHTML = "<b>参考资料网站：</b>" + surls;
        };
        if (refs.length == 0) $(".ref-box")[0].innerHTML = "<b>参考资料网站：无</b>";
    }
    //Count the amount of '?'(ErrCode)
    function errCodeCount() {
        let cnt = 0;
        let obj = $('.audit-detail-full p');
        for (let i = 0; i < obj.length; ++i) {
            let half = obj[i].innerText.split('?').length;
            let full = obj[i].innerText.split('？').length;
            cnt += half > 1 ? half - 1 : 0;
            cnt += full > 1 ? full - 1 : 0;
        }
        let tip = "<div class='reply-bad-reson sakata'><span> *【脚本检测到乱码】：</span> 回答内容中含有 " + cnt + " 个全/半角问号 </div>";
        if (cnt > 0) $('.audit-good').before(tip);
    }
    //Calculate Percent
    function toPercent(point) {
        let str = Number(point * 100).toFixed(1);
        str += "%";
        return str;
    }
    //Create Back-Button
    function createBkbtn() {
        let btname = "txbtn";
        for (let i = 1; i <= 6; ++i) {
            $(".input-box").append("<button class='input-btn' id='" + btname + i + "'>" + localStorage.getItem(btname + i) + "</button>");
        }
        $(".input-box").append("<br><br>");
    }
    //Back Button Switch
    function btnSwitch() {
        if (localStorage.btnOn == 0) localStorage.btnOn = 1;
        else localStorage.btnOn = 0;
        location.reload();
    }

    function refBoxSwitch() {
        if (localStorage.refOn == 0) localStorage.refOn = 1;
        else localStorage.refOn = 0;
        location.reload();
    }

    function errCodeSwitch() {
        if (localStorage.errOn == 0) localStorage.errOn = 1;
        else localStorage.errOn = 0;
        location.reload();
    }
    //Close Addon
    function closeAddon() {
        let s = $(".sakata");
        for (let i = 0; i < s.length; ++i) {
            s[i].remove();
        }
        clearInterval(interval_id1);
        clearInterval(interval_id2);
    }
    //Database Operation
    function cloudSync() {
        let syncData = {
            id: uid,
            pass: localStorage.SubmitCount,
            back: localStorage.BackCount
        }

        $.ajax({
            type: "POST",
            url: "https://api.jmsu.xyz/zhidao/php/syncStat.php",
            data: syncData,
            dataType: "JSON",
            success: function (response) {
                alert(response);
            }
        });
    }
    //Update Statistic spans
    function updateSpans() {
        let $Scount = $("#Scount");
        $Scount.find('span')[0].innerText = localStorage.BackCount;
        $Scount.find('span')[1].innerText = localStorage.SubmitCount;
        $Scount.find('span')[2].innerText = toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount)));
    }

    //Check Update From Server
    function checkUpdate() {
        let server_ver = 0;
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "https://api.jmsu.xyz/zhidao/php/checkUpdate.php",
            async: false,
            success: function (response) {
                server_ver = response.version;
            }
        });
        if (server_ver > version) {
            swal({
                title: "发现新版本",
                text: "请更新到最新版本以获得最佳体验",
                icon: "info",
                buttons: {
                    cancel: "忽略",
                    confirm: {
                        text: "更新",
                        value: true
                    }

                }
            }).then((value) => {
                if (value) {
                    window.open("https://greasyfork.org/scripts/389850-知道精选审核助手/code/知道精选审核助手.user.js")
                }
            })
        }
    }
    //Element Append Part
    if (localStorage.refOn == 1) $(".audit-reply-question").before("<div class='ref-box sakata'><b>参考资料网站：正在获取</b></div>");
    $(".audit-left-box").append(left);
    $(".audit-left-box").append("<div class='sakata' id='Scount'><b>今日打回：<span id='backCount'>" + localStorage.BackCount +
        "</span><br>今日通过：<span id='submitCount'>" + localStorage.SubmitCount +
        "</span><br>通过率:<span id='passPercent'>" + toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount))) + "</span></b>\<br></div>");
    if (localStorage.btnOn == 1) {
        $(".list-overflow").after(btns);
        createBkbtn();
    }
    //Styles Part
    $(".sakata-leftbox").css({
        "text-align": "center",
        "color": "#979797"
    });
    $(".sakata-lbtns").css({
        "width": "80%",
        "padding": "10",
        "cursor": "pointer",
        "border-radius": "20px",
        "background": "white",
        "color": "#1a97f0",
        "border": "2px solid #1a97f0",
        "margin": "5px"
    });
    $(".input-btn").css({
        "padding": "6px",
        "cursor": "pointer",
        "border-radius": "15px",
        "background": "#f4f7f9",
        "color": "#1a97f0",
        "border": "2px solid #1a97f0",
        "margin-top": "5px",
        "margin-right": "4px"
    });
    $("#stip").css({
        "color": "red",
        "font-size": "12px",
        "cursor": "point"
    });

    //Activities Part
    //Listening shortcut keys
    $(document).keydown(function (event) {
        if (event.keyCode == localStorage.SkipCode) { //～跳过
            $('.active')[0].click();
        }
        if (event.keyCode == localStorage.BackCode) { //F1/F7打回
            $('.audit-back-btn')[0].click();
        }
        if (event.keyCode == localStorage.SubmitCode) { //F2/F8通过
            $('.audit-submit-btn')[0].click();
        }
    });
    //READY PART
    $(document).ready(function () {
        //Hover Part
        $(".audit-back-btn").click(function () {
            let cnt1 = parseInt(localStorage.BackCount);
            cnt1 += 1;
            localStorage.BackCount = cnt1;
            updateSpans();
            cloudSync();
        });
        $(".audit-submit-btn").click(function () {
            let cnt2 = parseInt(localStorage.SubmitCount);
            cnt2 += 1;
            localStorage.SubmitCount = cnt2;
            updateSpans();
            cloudSync();
        });
        $(".sakata-lbtns").hover(function () {
            $(this).css({
                "background-color": "#1a97f0",
                "color": "white"
            });
        }, function () {
            $(this).css({
                "background": "white",
                "color": "#1a97f0"
            });
        });
        $(".input-btn").hover(function () {
            $(this).css({
                "background-color": "#1a97f0",
                "color": "white"
            });
        }, function () {
            $(this).css({
                "background": "#f4f7f9",
                "color": "#1a97f0"
            });
        });
        //Listening Part
        //When title changed - Change references' href & statistic '?'
        $(".ref-box").css({
            "color": "#01024e"
        });
        if (localStorage.refOn == 1) {
            interval_id1 = setInterval(function () {
                getRef();
            }, 1500);
        }
        if (localStorage.errOn == 1) {
            interval_id2 = setInterval(function () {
                $('.reply-bad-reson').remove();
                errCodeCount();
            }, 1500);
        }

        //Create options and load & save settings
        createOption();
        $(".key-option")[0].value = localStorage.SkipCode;
        $(".key-option")[1].value = localStorage.BackCode;
        $(".key-option")[2].value = localStorage.SubmitCode;
        $("#sk-opt").change(function () {
            localStorage.SkipCode = $("#sk-opt option:selected").val();
        });
        $("#bk-opt").change(function () {
            localStorage.BackCode = $("#bk-opt option:selected").val();
        });
        $("#sm-opt").change(function () {
            localStorage.SubmitCode = $("#sm-opt option:selected").val();
        });
        $("#clear-cnt").click(function () {
            localStorage.SubmitCount = 0;
            localStorage.BackCount = 0;
            updateSpans();
            swal({
                title: '清空成功',
                text: '统计数据已清零',
                icon: 'success',
                buttons: false,
                timer: 800,
            });
            checkUpdate();
        });
        $("#ssearch").click(function () {
            let adr = "https://www.baidu.com/s?wd=" + $(".q-tit")[0].innerText;
            window.open(adr, 'target', '');
        });
        //Set Back buttons
        $("#set-bkbtn").click(function () {
            let btnid = prompt("请输入要更改的按钮编号（1～6）： [留空取消]");
            if (btnid != null && btnid != "") {
                let btnst = prompt("按钮名称更改为：");
                let btntx = prompt("模版内容：");
                document.getElementById("txbtn" + btnid).innerText = btnst;
                localStorage.setItem("sbtn" + btnid, btntx);
                localStorage.setItem("txbtn" + btnid, btnst);
            }
        })
        //Insert back texts
        $(".input-btn").click(function () {
            introBackInsert(localStorage.getItem("sbtn" + this.id[5]));
        });
        //Back Button Switch
        $("#bkBtnSwitch").click(btnSwitch);
        $("#refBoxSwitch").click(refBoxSwitch);
        $("#errCodeSwitch").click(errCodeSwitch);

        //Close Addon
        $("#closeAddon").click(closeAddon);
        //All Data Cloud Sync
        $("#syncBtn").click(function () {
            cloudSync();
            swal({
                title: '同步成功',
                text: '数据已成功同步至服务器',
                icon: 'success',
                buttons: false,
                timer: 800,
            });
        })
        checkUpdate();
    });
})();