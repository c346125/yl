$(function () {
    var second = 60;
    //图片验证码
    $(".yzm-box em, .yzm-box img").click(function () {
        imgCheck();
    });
    //刷新验证码
    function refreshCode(){
        $('.yzm-box img').attr('src',$('.yzm-box img').attr('src').split('?')[0]+"?"+Math.random())
    }

    //表单验证
    var validator;
    function registerAllValidate() {
        validator = $("#mobileregisterform").validate({
            rules: {
                loginName: {
                    required: true,
                    isMobile: true
                },
                loginPass: {
                    required: true,
                    rangelength: [6, 20],
                    regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/
                },
                rePassword: {
                    required: true,
                    equalTo: "#loginPass"
                },
                code:{
                    required:true,
                    maxlength:4
                },
                checkCode:{
                    required:true,
                    maxlength:6,
                    digits:true
                }
            }
        });
    }
    var validatorlogin = $("#mobileloginform").validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            },
            loginPass: {
                required: true,
                rangelength: [6, 20]
            },
            checkcode: {
                required: true,
                maxlength:6,
                digits:true
            },
            code:{
                required:true,
                maxlength:4
            }
        }
    });
    document.onkeydown = function (e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode === 13) {
            if ($("#mobileregisterform").length > 0) {
                registerClick();
            } else {
                if ($('.form-login').eq(0).hasClass('slt')) {
                    loginClick();
                } else {
                    quickLogin()
                    telLoginFun()
                }
            }

        }
    };
    $("#login").click(function () {
        loginClick()
    });

    function loginClick() {
        if (validatorlogin.form()) {
            var params = $('#mobileloginform').parseForm();
            $.post('/leaguerLogin', params)
                .success(function (data) {
                    var datas = data;
                    if (datas.respCode == 200) {
                        if (datas.curUrl) {
                            window.location.href = datas.curUrl;
                        } else {
                            window.location.href = '/member/info';
                        }
                    } else {
                        dilogbox(datas.respCode, datas.respMsg)
                        imgCheck()
                    }
                })
                .error(function (err) {
                    window.location.href = '/error';
                    imgCheck()
                });
        }
    }

    //注册按钮点击
    $("#register").click(function () {
        if($("#mobileregisterform").validate()){
            $("#mobileregisterform").validate().destroy()
            registerAllValidate()
            if(validator.form()){
                registerClick()
            }
        }
    });

    function registerClick() {
        if (validator.form()) {
            var loginName = $("#loginNameMobileRan").val();
            var loginPass = $("#loginPass").val();
            var rePassword = $("#rePassword").val();
            var imgCode = $('#phoneverification .img-check input').val();
            var checkCode = $("#checkCodePmMobile").val();
            var url = '/signIn?loginName=' + loginName + '&loginPass=' + loginPass  + '&rePassword=' + rePassword + '&checkCode='+checkCode+"&wayCode=3&imgCode="+imgCode;
            $.ajax({
                url: url,
                type: 'GET',
                success: function (data) {
                    console.log(data);
                    if (data[0].respCode == 200) {
                        dilogbox(data[0].respCode, '注册成功', '/login')
                    } else {
                        dilogbox(data[0].respCode, data[0].respMsg)
                    }
                }
            })
        }
    }

    //点击发送验证码按钮
    var validatorCheck1;
    function validatorCheckRegister(){
        validatorCheck1 = $("#mobileregisterform").validate({
            rules: {
                loginName: {
                    required: true,
                    isMobile: true
                },
                code:{
                    required: true,
                    maxlength:4
                }
            }
        });
    }
    $(".btn-dcode").click(function () {
        var loginName = $("#loginNameMobileRan").val(),
            imgCode = $('.img-check .code').val();
        if($("#mobileregisterform").validate()){
            $("#mobileregisterform").validate().destroy()
        }
        validatorCheckRegister()
        if(validatorCheck1.form()){
            $.post('/checkCode', {mobile: loginName, codeWay :1,imgCode: imgCode})
                .success(function (data) {
                    if (data[0].respCode == '200') {
                        waitTime(document.getElementById('btn-dcode'));
                    } else {

                        dilogbox(data[0].respCode, data[0].respMsg, 'javascript:;');
                        imgCheck()
                    }
                })
        }
    });

    function waitTime(obj) {
        if (second === 0) {
            obj.removeAttribute('disabled');
            obj.value = '获取动态码';
            second = 60;
        } else {
            obj.setAttribute('disabled', true);
            obj.value = '重新发送(' + second + ')';
            second -= 1;
            setTimeout(function () {
                waitTime(obj);
            }, 1000);
        }
    }

    //验证码提交
    var telLoginCode = $("#mobileform").validate({
        rules: {
            mobile: {
                required: true,
                isMobile: true
            },
            code: {
                required: true,
                maxlength: 4
            }
        }
    });
    $(".yzm-btn").click(function () {
        if(telLoginCode.form()){
            var form = {
                mobile: $("#loginName1").val(),
                codeWay:1,
                imgCode:$('.slt').find('input[name=code]').val()
            };
            $.post('/checkCode', form)
                .success(function (data) {
                    if (data[0].respCode == 200) {
                        waitTime(document.getElementById('yzm-text'));
                    } else {
                        imgCheck()
                        dilogbox(data[0].respCode, data[0].respMsg, 'javascript:;');
                        if(data[0].respCode != 400){
                            imgCheck()
                        }
                    }
                })
        }
    });

    //手机快捷登录
    var telLogin;
    function quickLogin(){
        telLogin= $("#mobileform").validate({
            rules: {
                mobile: {
                    required: true,
                    isMobile: true
                },
                smsCode: {
                    required: true,
                    maxlength: 6,
                    digits:true
                },
                code: {
                    required: true,
                    maxlength:4
                }
            }
        });
    }
    $("#telLogin").click(function () {
        if($("#mobileform").validate()){
            $("#mobileform").validate().destroy()
            quickLogin()
            telLoginFun()
        }
    });

    function telLoginFun() {
        if (telLogin.form()) {
            var params = $('#mobileform').serialize();
            $.post('/leaguerMobileLogin', params)
                .success(function (data) {
                    console.log(data);
                    var datas = data[0];
                    if (datas.respCode == 200) {
                        if (datas.curUrl) {
                            window.location.href = datas.curUrl;
                        } else {
                            window.location.href = '/member/info';
                        }
                    } else {
                        dilogbox(datas.respCode, datas.respMsg)
                    }
                })
                .error(function (err) {
                    window.location.href = '/error';
                });
        }
    }
    $(".img-check img").click(function () {
        $(this).attr('src',$(this).attr('src').split('?')[0]+'?'+Math.random())
    });
});

function imgCheck() {
    var img = $(".yzm-box img");
    var src = img.attr('src').split('?')[0];
    img.attr('src', src + '?' + Math.random())
    // $.post('/captchap')
    //     .success(function (data) {
    //         $(".yzm-box img").attr('src','data:image/jpg;base64,'+data);
    //     });
}