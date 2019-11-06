function getInfo() {
    let status = false;
    $.ajax({
        type: "GET",
        url: "php/recycleManage.php?method=getinfo",
        async: false,
        success: function (response) {
            $(".manage-data tbody")[0].innerHTML = response;
            status = true;
        }
    });
    return status;
}

function fresh() {
    if (getInfo()) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            type: 'success',
            title: '数据已成功刷新',
        })
    }
    else {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            type: 'error',
            title: '刷新失败',
        })
    }
}

function back(e) {
    let id = $(e).attr("serial");
    $.ajax({
        type: "GET",
        url: "php/recycleManage.php?method=back&id=" + id,
        success: function (response) {
            fresh();
        }
    });
}

function keep(e) {
    let id = $(e).attr("serial");
    $.ajax({
        type: "GET",
        url: "php/recycleManage.php?method=keep&id=" + id,
        success: function (response) {
            fresh();
        }
    });
}

$(document).ready(function () {
    getInfo();
});