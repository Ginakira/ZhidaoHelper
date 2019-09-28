// ==UserScript==
// @name         BETA知道精选审核助手
// @namespace    https://sakata.ml/
// @version      3.410
// @description  为精选审核平台添加快捷功能
// @author       坂田银串
// @match        *://zhidao.baidu.com/review/excellentreview*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @license      GPL
// ==/UserScript==

(function () {
    'use strict';
    //Value Part
    var left = "<div class=\"sakata-leftbox\">\
    <li>更改完后点击任意空白处生效</li>\
    <li>跳过键：<select class=\"key-option\" id = \"sk-opt\"></select></li>\
    <li>打回键：<select class=\"key-option\" id = \"bk-opt\"></select></li>\
    <li>通过键：<select class=\"key-option\" id = \"sm-opt\"></select></li>\
    <br>\
    <li><button class=\"sakata-lbtns\" id=\"ssearch\">查询该题</button></li>\
    <li><button class='sakata-lbtns' id='clear-cnt'>计数清空</button></li>\
    <li><a href=\"https://greasyfork.org/scripts/389850\" target=\"view_window\">脚本更新页面</a></li>\
    </div>";
    var btns = "<div class=\"sakata-tips\"><a id=\"stip\">点击完按钮后请按一下空格 否则无法打回</a></div>\
    <div class=\"input-box\">\
    <button class=\"input-btn\" id=\"sbtn1\">配图问题</button>\
    <button class=\"input-btn\" id=\"sbtn2\">区别罗列</button>\
    <button class=\"input-btn\" id=\"sbtn3\">丰富正文</button>\
    <button class=\"input-btn\" id=\"sbtn4\">调整排版</button>\
    <button class=\"input-btn\" id=\"sbtn5\">序号格式</button>\
    <button class=\"input-btn\" id=\"sbtn6\">少五扩展</button>\
    <br><br>\
    </div>";
    var backText = {
        "sbtn1": "配图须符合基本要求",
        "sbtn2": "请使用序列号、条理清晰的、从多方面阐述提问主体间的区别",
        "sbtn3": "请丰富正文内容使正文内容更加完整",
        "sbtn4": "请调整内容的排版段落与段落之间上下空一行",
        "sbtn5": "每个序号需要顶格单独一行",
        "sbtn6": "罗列/列举类少于五种则需添加扩展资料来丰富回答"
    };
    var codeTrans = {
        112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8",
        120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 106: "小键盘*", 107: "小键盘+",
        108: "小键盘Enter", 109: "小键盘-", 110: "小键盘.", 111: "小键盘/", 186: ";", 187: "= +", 189: "-", 190: ". >",
        191: "/ ?", 192: "` ~", 219: "[{", 220: "\\ |", 221: "] }", 103: "小键盘7", 104: "小键盘8", 105: "小键盘9",
        8: "BackSpace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control",
        18: "Alt", 20: "CapsLock", 27: "Esc", 32: "Spacebar", 33: "PageUp", 34: "PageDown",
        35: "End", 36: "Home", 37: "LeftArrow", 38: "UpArrow", 39: "RightArrow", 40: "DownArrow",
        45: "Insert", 46: "Delete", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6",
        55: "7", 56: "8", 57: "9", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G",
        72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q",
        82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 96: "小键盘0",
        97: "小键盘1", 98: "小键盘2", 99: "小键盘3", 100: "小键盘4", 101: "小键盘5", 102: "小键盘6"
    };
    var re = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/;
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
    //Function Part
    //Input box move to end
    function moveEnd(obj) {
        obj.focus();
        var len = obj.value.length;
        if (document.selection) {
            var sel = obj.createTextRange();
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
        for (var kcode in codeTrans) {
            var opt = "<option value = " + kcode + ">" + codeTrans[kcode] + "</option>";
            $(".key-option").append(opt);
        }
    }
    //Get References
    function getRef() {
        var refs = $(".audit-detail-full :contains('参考资料') a");
        var surls = "";
        if (refs.length > 0) {
            for (var i = 0; i < refs.length; ++i) {
                var lurl = refs[i].href;
                surls += "<a href='" + lurl + "' target=‘view_window’>" + re.exec(lurl)[0] + "</a>  "
            }
            $(".ref-box")[0].innerHTML = "<b>参考资料网站：</b>" + surls;
        };
        if (refs.length == 0) $(".ref-box")[0].innerHTML = "<b>参考资料网站：无</b>";
    }
    //Calculate Percent
    function toPercent(point) {
        var str = Number(point * 100).toFixed(1);
        str += "%";
        return str;
    }
    //Element Append Part
    $(".audit-reply-question").before("<div class='ref-box'><b>参考资料网站：正在获取</b></div>");
    $(".audit-left-box").append(left);
    $(".audit-left-box").append("<div id='Scount'><b>今日打回：" + localStorage.BackCount
        + "<br>今日通过：" + localStorage.SubmitCount
        + "<br>通过率:" + toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount))) + "</b>\<br></div>");
    //Styles Part
    $(".sakata-leftbox").css({ "text-align": "center", "color": "#979797" });
    $(".sakata-lbtns").css({
        "width": "80%", "padding": "10", "cursor": "pointer", "border-radius": "20px",
        "background": "white", "color": "#1a97f0", "border": "2px solid #1a97f0", "margin": "5px"
    });
    $(".input-btn").css({
        "padding": "6px", "cursor": "pointer", "border-radius": "15px", "background": "#f4f7f9",
        "color": "#1a97f0", "border": "2px solid #1a97f0", "margin-top": "5px", "margin-right": "4px"
    });
    $("#stip").css({ "color": "red", "font-size": "12px", "cursor": "point" });

    //Activities Part
    //Listening shortcut keys
    $(document).keydown(function (event) {
        if (event.keyCode == localStorage.SkipCode) {//～跳过
            $('.active')[0].click();
        }
        if (event.keyCode == localStorage.BackCode) {//F1/F7打回
            $('.audit-back-btn')[0].click();
        }
        if (event.keyCode == localStorage.SubmitCode) {//F2/F8通过
            $('.audit-submit-btn')[0].click();
        }
    });
    //READY PART
    $(document).ready(function () {
        //Hover Part
        $(".audit-back-btn").click(function () {
            var cnt1 = parseInt(localStorage.BackCount);
            cnt1 += 1;
            localStorage.BackCount = cnt1;
            $("#Scount")[0].innerHTML = "<div id='Scount'><b>今日打回：" + localStorage.BackCount
                + "<br>今日通过：" + localStorage.SubmitCount
                + "<br>通过率:" + toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount))) + "</b></div>"
        });
        $(".audit-submit-btn").click(function () {
            var cnt2 = parseInt(localStorage.SubmitCount);
            cnt2 += 1;
            localStorage.SubmitCount = cnt2;
            $("#Scount")[0].innerHTML = "<div id='Scount'><b>今日打回：" + localStorage.BackCount
                + "<br>今日通过：" + localStorage.SubmitCount
                + "<br>通过率:" + toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount))) + "</b></div>"
        });
        $(".sakata-lbtns").hover(function () {
            $(this).css({ "background-color": "#1a97f0", "color": "white" });
        }, function () {
            $(this).css({ "background": "white", "color": "#1a97f0" });
        });
        $(".input-btn").hover(function () {
            $(this).css({ "background-color": "#1a97f0", "color": "white" });
        }, function () {
            $(this).css({ "background": "#f4f7f9", "color": "#1a97f0" });
        });
        //Listening Part
        //Show references' href
        $(".ref-box").css({ "color": "#01024e" });
        setInterval(getRef, 1500);
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
            $("#Scount")[0].innerHTML = "<div id='Scount'><b>今日打回：" + localStorage.BackCount
                + "<br>今日通过：" + localStorage.SubmitCount
                + "<br>通过率:" + toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount))) + "</b></div>"
        });
        $("#ssearch").click(function () {
            var adr = "https://www.baidu.com/s?wd=" + $(".q-tit")[0].innerText;
            window.open(adr, 'target', '');
        });
        //Show the help info
        $("#shelp").click(function () {
            alert(help);
        });
        //Insert back texts
        $(".input-btn").click(function () {
            introBackInsert(backText[this.id]);
        });
    });
})();