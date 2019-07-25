if ($.validator) {
    $.validator.prototype.elements = function() {
        var validator = this,
            rulesCache = {};
        // Select all valid inputs inside the form (no submit or reset buttons)
        return $(this.currentForm)
            .find("input, select, textarea, [contenteditable]")
            .not(":submit, :reset, :image, :disabled")
            .not(this.settings.ignore)
            .filter(function() {
                var name = this.id || this.name || $(this).attr("name"); // For contenteditable
                if (!name && validator.settings.debug && window.console) {
                    console.error("%o has no name assigned", this);
                }
                // Set form expando on contenteditable
                if (this.hasAttribute("contenteditable")) {
                    this.form = $(this).closest("form")[0];
                }
                // Select only the first element for each name, and only those with rules specified
                if (name in rulesCache || !validator.objectLength($(this).rules())) {
                    return false;
                }
                rulesCache[name] = true;
                return true;
            });
    }
}



jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    // var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(16[0-9]{9})|(19[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(19[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
    //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
    return this.optional(element) || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}, "请输入正确的身份证号码");


// 合法字符
jQuery.validator.addMethod("isAvailable", function(value, element) {
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:<>]");
    return this.optional(element) || !pattern.test(value);
}, "请输入合法字符");

// 判断是否中文姓名
jQuery.validator.addMethod("isChineseName", function(value, element) {
    return this.optional(element) || (/^[\u0391-\uFFE5]+$/.test(value) && (value.length > 1 && value.length < 9));
}, "请输入正确的姓名");
jQuery.validator.addMethod("isNumber", function(value, element) {
    return this.optional(element) || (/^[\u0391-\uFFE5]+$/.test(value));
}, "请输入正确的地址");

// 输入空格
jQuery.validator.addMethod("isKonge", function(value, element) {
    return this.optional(element) || /^\S+$/.test(value);
}, "不允许输入空格");

jQuery.validator.addMethod("regex", function(value, element, regexpr) {
    return regexpr.test(value);
}, "密码必须是数字和字母或特殊字符组合");



jQuery.validator.addMethod("stringMinLength", function(value, element, param) {
    var length = value.length;
    for ( var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return this.optional(element) || (length >= param);
}, $.validator.format("最少输入{0}个字符"));
// 字符最大长度验证（一个中文字符长度为2）
jQuery.validator.addMethod("stringMaxLength", function(value, element, param) {
    var length = value.length;
    for ( var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return this.optional(element) || (length <= param);
}, $.validator.format("最多输入{0}个字符"));

//不能输入中文
jQuery.validator.addMethod('isNotChinese', function(value, element) {
    return this.optional(element) || (/^[a-zA-Z0-9]+$/.test(value));
}, '不能输入中文');


//校验身份证好
jQuery.validator.addMethod('IdentityCard', function(value, element) {
    return this.optional(element) || IdentityCodeValid(value);
}, '请输入正确的身份证号码(15-18位)');
//身份证验证
function isIdCardNo(num) {
    //if (isNaN(num)) {alert("输入的不是数字！"); return false;}
    var len = num.length,
        re;
    if (len == 15)
        re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
    else if (len == 18)
        re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
    else {
        //alert("输入的数字位数不对。");
        return false;
    }
    var a = num.match(re);
    if (a != null) {
        if (len == 15) {
            var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
            var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        } else {
            var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
            var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        }
        if (!B) {
            //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。");
            return false;
        }
    }
    if (!re.test(num)) {
        //alert("身份证最后一位只能是数字和字母。");
        return false;
    }
    return true;
}

//身份证校验




//验证身份证函数
function checkIdcard(idcard) {
    idcard = idcard.toString();
    //var Errors=new Array(“验证通过!”,”身份证号码位数不对!”,”身份证号码出生日期超出范围或含有非法字符!”,”身份证号码校验错误!”,”身份证地区非法!”);
    var Errors = new Array(true, false, false, false, false);
    var area = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
    var idcard, Y, JYM;
    var S, M;
    var idcard_array = new Array();
    idcard_array = idcard.split('');
    //地区检验
    if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
    //身份号码位数及格式检验
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}/; //测试出生日期的合法性
            } else {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}/; //测试出生日期的合法性
            }
            if (ereg.test(idcard)) return Errors[0];
            else return Errors[2];
            break;
        case 18:
            //18 位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]/; //闰年出生日期的合法性正则表达式
            } else {
                ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]/; //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) { //测试出生日期的合法性
                //计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
                    (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
                    (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
                    (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
                    (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
                    (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
                    (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
                    parseInt(idcard_array[7]) * 1 +
                    parseInt(idcard_array[8]) * 6 +
                    parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = 'F';
                JYM = '10X98765432';
                M = JYM.substr(Y, 1); //判断校验位
                if (M == idcard_array[17]) return Errors[0]; //检测ID的校验位
                else return Errors[3];
            } else return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
}


// 最新的身份证验证
const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //系数
const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; //校验码对照表
const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;

function IdentityCodeValid(id) {
    let tip = '';
    let pass = true;
    try {
        //号码规则校验
        if (!format.test(id)) {
            tip = '身份证号码不合规';
            pass = false;
        }
        //出生年月日校验，前正则限制起始年份为1900;
        let year = id.substr(6, 4), //身份证年
            month = id.substr(10, 2), //身份证月
            date = id.substr(12, 2), //身份证日
            time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
            now_time = Date.parse(new Date()), //当前时间戳
            dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
        if (time > now_time || date > dates) {
            tip = '出生日期不合规';
            pass = false;
        }
        //校验码判断
        const id_array = id.split('');
        let sum = 0;
        for (let k = 0; k < 17; k++) {
            sum += parseInt(id_array[k]) * parseInt(c[k]);
        }
        if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
            tip = '身份证校验位不合规';
            pass = false;
        }
    } catch (e) {
        tip = '身份证格式错误';
        pass = false;
    }
    //if (!pass) alert(tip);
    return pass;
}