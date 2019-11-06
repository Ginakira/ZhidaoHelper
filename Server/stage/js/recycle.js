function getInfo() {
    let status = false;
    $.ajax({
        type: "GET",
        url: "php/getRecycleUpload.php?method=getinfo",
        async: false,
        success: function (response) {
            $(".recycle-data tbody")[0].innerHTML = response;
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

function readMark(e) {
    let id = $(e).attr("serial");
    $.ajax({
        type: "GET",
        url: "php/getRecycleUpload.php?method=read&id=" + id,
        success: function (response) {
            fresh();
        }
    });
}

function addRecycle() {
    Swal.mixin({
        input: 'textarea',
        confirmButtonText: '下一步 &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
    }).queue([
        {
            title: '主问题',
            text: '请复制要上报回收的主问题'
        },
        '备注信息',
    ]).then((result) => {
        if (result.value) {
            let d = new Date();
            let upData = {
                question: result.value[0],
                comments: result.value[1],
                time: (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes(),
                status: 200,
            }
            $.ajax({
                type: "POST",
                url: "php/addRecycle.php",
                data: upData,
                dataType: "JSON",
                success: function (response) {
                    Swal.fire({
                        title: '上报完成!',
                        type: 'success',
                        html:
                            '<div><b>主问题</b>: <small>' +
                            response.question +
                            '</small></div><div><b>备注</b>：<small>' +
                            response.comments +
                            '</small></div>',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    getInfo();
                },
                error: function (response) {
                    Swal.fire({
                        title: '上报失败!',
                        type: 'error',
                        text: '请检查网络连接或刷新页面'
                    });
                }
            });
        }
    });
}

$(document).ready(function () {
    getInfo();
});