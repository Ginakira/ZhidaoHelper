function getInfo() {
    $.ajax({
        type: "GET",
        url: "php/getStat.php?method=getinfo",
        success: function (response) {
            $(".stat-data tbody")[0].innerHTML = response;
        }
    });
}

function fresh() {
    getInfo();
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        type: 'success',
        title: '数据已成功刷新'
    });
}

function testAdd() {
    $.ajax({
        type: "GET",
        url: "php/getStat.php?method=getinfo",
        success: function (response) {
            $(".stat-data tbody").append(response);
        }
    });
}

$(document).ready(function () {
    getInfo();
});