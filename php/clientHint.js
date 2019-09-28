var xhr;
var timeStamp = new Date().getTime();
function showHint(str) {
    if (str.length == 0) {
        document.getElementById("txtHint").innerHTML = "<b>None</b>";
        return;
    }
    xhr = GetXmlHttpObject();
    if (xhr == null) {
        alert("Lost Requests! Please change your browser.");
        return;
    }
    var url = "getHint.php";
    url = url + "?n=" + str;
    url = url + "&stmp=" + timeStamp;
    xhr.onreadystatechange = stateChanged;
    xhr.open("GET", url, true);
    xhr.send(null);
}

function stateChanged() {
    if (xhr.readyState == 4 || xhr.readyState == "compelete") {
        document.getElementById("txtHint").innerHTML = xhr.responseText;
    }
}

function GetXmlHttpObject() {
    var xhr = null;
    xhr = new XMLHttpRequest();
    return xhr;
}