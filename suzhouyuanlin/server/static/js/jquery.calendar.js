(function ($) {
    var isEmpty = {},
        isSlec = {},
        //提前n天
        isSection = 0,
        //添加不可选中
        unSelect = " ",
        //循环添加other 单个区间
        Number1 = 0,
        //循环添加other 多个个区间
        Number2 = 0;
    $.fn.calendar = function (method) {
        // 如果第一个参数是字符串, 就查找是否存在该方法, 找到就调用; 如果是object对象, 就调用init方法;.
        if (methods[method]) {
            // 如果存在该方法就调用该方法
            // apply 是吧 obj.method(arg1, arg2, arg3) 转换成 method(obj, [arg1, arg2, arg3]) 的过程.
            // Array.prototype.slice.call(arguments, 1) 是把方法的参数转换成数组.
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            // 如果传进来的参数是"{...}", 就认为是初始化操作.
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.calendar');
        }
    };



    // 不把方法扩展在 $.fn.calendar 上. 在闭包内建个"methods"来保存方法, 类似共有方法.
    var methods = {
        /**
         * 初始化方法
         * @param _options
         * @return {*}
         */
        init: function (_options) {
            return this.each(function () {

                var $this = $(this);
                var opts = $.extend({}, $.fn.calendar.defaults, _options);
                var multiselectflag = 0;
                var multiselectOne = [];
                var sd = (typeof opts.selecteday != 'string') ? opts.selecteday[0].split("-") : opts.selecteday.split("-");
                myyear = sd[0],
                    mymonth = sd[1].replace(/\b(0+)/gi, "") - 1;

                $this.addClass("calendar-panel").width(opts.width);
                calendar.makecalendar($this, opts);
                $this.find("td:not(.other)").live("click", function () {
                    var flagM = $(this).attr("data");
                    var day = $(this).data("day");
                    var myyear = $(this).parent().parent().parent().data("year"),
                        mymonth = $(this).parent().parent().parent().data("month");
                    var month = $(this).parent().parent().parent().data("month");
                    var date = myyear + "-" + private_methods.p(month + 1) + "-" + private_methods.p(day);
                    $this.find("td:not(.other)").removeClass("selecteds").each(function () {
                        var day = $(this).data("day");
                        //$(this).find(".date-title").text(day);
                    });
                    var stock = $(this).find(".price").data("stock"),
                        childPrice = $(this).find(".price").attr("data-childprice"),
                        childStock = $(this).find(".price").data("childstock");
                    if (stock == "undefined" || typeof(stock) == "undefined") {
                        $(this).addClass("selecteds");
                    } else {
                        $(this).addClass("selecteds");
                    }
                    switch (flagM) {
                        case "prevM":
                            if (mymonth == 0) {
                                date = (parseFloat(myyear) - 1) + "-12-" + private_methods.p(day);
                            }
                            else {
                                date = myyear + "-" + p(mymonth) + "-" + private_methods.p(day);
                            }
                            break;
                        case "nextM":
                            if (mymonth + 2 > 12) {
                                date = (parseFloat(myyear) + 1) + "-01-" + private_methods.p(day);
                            }
                            else {
                                date = myyear + "-" + private_methods.p(parseFloat(mymonth) + 2) + "-" + private_methods.p(day);
                            }
                            break;
                    }
                    if (opts.multiselect) {
                        if (!$(this).data("selected") && multiselectflag < 2) {
                            multiselectflag++;
                        } else {
                            multiselectflag = 1;
                            // $this.find("td.selected").find(".calendar-explian").html("");
                            $this.find("td").removeClass('selected').removeData("selected");
                            $this.find("td").removeClass('selecteds');
                        }
                        var selecteddate = $this.find("td.selected"),
                            oneyear = selecteddate.parent().parent().parent().data("year"),
                            onemonth = selecteddate.parent().parent().parent().data("month"),
                            oneday = selecteddate.find("span").find("i").text() == "今天" ? mydate.getDate() : selecteddate.find("span").find("i").text();
                        var onedate = oneyear + "-" + private_methods.p(onemonth + 1) + "-" + private_methods.p(oneday);
                        console.log(date)
                        if (!private_methods.duibi(onedate, date)) {
                            multiselectflag = 1;
                            $this.find("td").removeClass('selected').removeData("selected");
                            $this.find("td").removeClass('selecteds');
                        } else if (private_methods.dateDiff(onedate, date) > opts.optionaldays) {
                            alert("日历选择大于" + opts.optionaldays + "天！");
                            multiselectflag = 1;
                            return false;
                        }
                        var table = $(this).parent().parent().parent();
                        var index = table.find("td").index($(this)), oneindex = table.find("td").index(selecteddate);
                        if (month == onemonth) {
                            table.find("td:lt(" + index + "):gt(" + oneindex + ")").addClass('selecteds');
                        } else if (month > onemonth) {
                            var first = table.find("td").index(table.find("td[data=prevM]:last")),
                                last = table.prev().find("td").index(table.prev().find("td[data=nextM]:first"));
                            var previndex = table.prev().find("td").index(selecteddate);
                            table.prev().find("td:lt(" + last + "):gt(" + previndex + ")").addClass('selecteds');
                            if (first < 0) {
                                table.find("td:lt(" + index + ")").addClass('selecteds');
                            } else {
                                table.find("td:lt(" + index + "):gt(" + first + ")").addClass('selecteds');
                            }
                        } else if (month < onemonth) {
                            var first = table.find("td").index(table.find("td[data=prevM]:last")),
                                last = table.prev().find("td").index(table.prev().find("td[data=nextM]:first"));
                            var previndex = table.prev().find("td").index(selecteddate);
                            table.prev().find("td:lt(" + last + "):gt(" + previndex + ")").addClass('selecteds');
                            if (first < 0) {
                                table.find("td:lt(" + index + ")").addClass('selecteds');
                            } else {
                                table.find("td:lt(" + index + "):gt(" + first + ")").addClass('selecteds');
                            }
                        }
                        $(this).data("selected", true).addClass('selected');
                        if (multiselectflag == 1) {
                        }
                        if (multiselectflag == 2) {
                            opts.onClick(this, [onedate, date]);
                        }
                    } else {
                        if (childStock != "undefined" && typeof(childStock) != "undefined") {
                            stock = [stock, childStock];
                        }
                        if (childPrice == "undefined" || typeof(childPrice) == "undefined") {
                            opts.onClick(this, date, $(this).find(".price").find("strong").text(), stock);
                        }
                        else {
                            opts.onClick(this, date, [$(this).find(".price").find("strong").text(), childPrice], stock);
                        }
                    }
                    if(selectTicketNum){
                        let currentTicketPrice = +$('.price.orderPrice b').text()
                        $('#amount').val(selectTicketNum)
                        $('#totla').text('￥'+(selectTicketNum*currentTicketPrice).toFixed(2))
                    }
                });
            });
        },
        publicMethod: function () {
            private_methods.demoMethod();
        }
    };

    // 私有方法
    var private_methods = {
        flipFuns: function (year, month, opts) {
            calendar.makeDateHtml(year, month, opts);
        },
        p: function (s) {
            return s < 10 ? '0' + s : s;
        },
        duibi: function (a, b) {
            var starttimes = 0, lktimes = 0;
            if (a != null && b != null) {
                var arr = a.split("-");
                var starttime = new Date(arr[0], parseInt(arr[1]) - 1, arr[2]);
                starttimes = starttime.getTime();
                var arrs = b.split("-");
                var lktime = new Date(arrs[0], parseInt(arrs[1]) - 1, arrs[2]);
                lktimes = lktime.getTime();
                if (starttimes >= lktimes) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        },
        dateDiff: function (strDateStart, strDateEnd) {
            var strSeparator = "-"; //日期分隔符
            var oDate1;
            var oDate2;
            var iDays;
            oDate1 = strDateStart.split(strSeparator);
            oDate2 = strDateEnd.split(strSeparator);
            var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
            var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
            return iDays;
        },
        price: function (date, opts) {
            var len = opts.settingdata.length, pricetext = "", show = false, stock = "", pageForm = "";//用来记录页面传递过来的数据
            if (len > 0) {
                // if(opts.priceZero){
                //     show=true;
                // }
                for (var i = 0; i < len; i++) {
                    var targetdate = (opts.settingdata[i].curDate ? opts.settingdata[i].curDate.substring(0, 10) : opts.settingdata[i].curDate);
                    if (date == targetdate) {
                        if (!opts.settingdata[i].price && !opts.priceZero) {
                            pricetext = "<span class='price' data-childstock='" + opts.settingdata[i].childStock +
                                "' data-stock='" + opts.settingdata[i].usableNum + "' data-childPrice='" +
                                opts.settingdata[i].childPrice + "'>" +
                                "<strong>暂无价格</strong></span>";
                        } else {
                            pricetext = "<span class='price' data-childstock='" + opts.settingdata[i].childStock +
                                "' data-stock='" + opts.settingdata[i].usableNum + "' data-childPrice='" + opts.settingdata[i].childPrice + "'>" +
                                "<em>￥</em><strong>" + opts.settingdata[i].price + "</strong></span>";
                        }


                        if (!opts.settingdata[i].usableNum || opts.settingdata[i].usableNum == '0' || !opts.settingdata[i].price) {
                            if (opts.multiselect) {
                                if (!opts.settingdata[i - 1].usableNum || opts.settingdata[i - 1].usableNum == '0' || !opts.settingdata[i - 1].price) {
                                    show = false;
                                } else {
                                    show = true;
                                }
                            } else {
                                show = false;
                            }

                        } else {
                            show = true;
                        }
                        if (opts.priceZero && opts.settingdata[i].usableNum && typeof opts.settingdata[i].price == 'number') {
                            show = true;
                        }
                        stock = opts.settingdata[i].usableNum;
                    }
                    if (opts.settingdata[i].pageForm != null) {
                        pageForm = "ztc";//wztcinfoaction中的pageForm用在这里
                    }
                }
            }
            console.log([pricetext, show, stock, pageForm]);
            return [pricetext, show, stock, pageForm];
        },
        settingdate: function (data) {
            var date = [];
            $.each(data, function (i) {
                if(data[i].curDate){
                    date.push(data[i].curDate.substring(0, 10));
                }
            });
            return date;
        }
    };

    var mydate = new Date(),
        monthArray = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayArray = ["日", "一", "二", "三", "四", "五", "六"];
    var myyear = "", mymonth = "";
    //函数主体
    var calendar = {
        calendarHead: $("<div>", {
            "class": "calendar-head",
            "html": "<ul><li></li><li></li><li></li><li></li><li></li></ul>"
        }),
        monthdays: function (year) {
            var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
                monthdays[1] = 29;
            }
            return monthdays;
        },
        flip: function (id, text, funs, opts) {
            var yearPrev = $("<a>", {
                "id": id,
                "href": "javascript:void(0);",
                "html": "<i class='icon-jiantou " + text + "'></i>"
            }).bind("click", function () {
                if (funs) {
                    switch (id) {
                        case "yearPrev":
                            myyear--;
                            break;
                        case "monthPrev":
                            mymonth--;
                            if (mymonth < 0) {
                                myyear--;
                                mymonth = 11;
                            }
                            break;
                        case "monthNext":
                            mymonth++;
                            if (mymonth > 11) {
                                myyear++;
                                mymonth = 0;
                            }
                            break;
                        case "yearNext":
                            myyear++;
                            break;
                    }
                    //重置不选中循环次数
                    // isSection = Number2 = Number1 = parkModelId;
                    $.get('/dateRefresh', {myyear, mymonth: (mymonth + 1)}, function (data) {
                        var isLimitings = data[0].data;
                        if(isLimitings.length > 0){
                            for(var a=0; a < isLimitings.length;a++){
                                isLimitings[a].parkModelId = parkModelId;
                            }
                        }
                        if (data[0].respCode == 200) {
                            $('#calendar').attr('data-list', isLimitings)
                        }
                        opts.settingdata = isLimitings;
                        funs(myyear, mymonth, opts);
                    })

                    var calender = $('#calendar');
                    if (calender.length > 0) {
                        var _tr = calender.find('tr');
                        var trLength = _tr.length;
                        var lastTr = _tr.eq(parseInt(trLength) - 1);
                        var LaTrTds = lastTr.find('td');
                        LaTrTds.each(function () {
                            var _this = $(this);
                            if (!(_this.attr('data-day'))) {
                                _this.addClass('other');
                            }
                        })
                    }
                    $(".time-text").click(function () {
                        $("#calendar-panel,#mask").show();
                    });
                    $("#dialogClose,#mask").click(function () {
                        dialogClose();
                    });
                }
            });
            return yearPrev;
        },
        today: function (year, month) {
            var year = $("<span>", {
                "id": "today-year",
                "html": year + "年"
            });
            var month = $("<span>", {
                "id": "today-month",
                "html": monthArray[month]
            });
            return [year, month];
        },
        calendarContent: $("<div>", {
            "class": "calendar-contnet"
        }),
        dayHtml: function () {
            var html = "<tr>";
            $.each(dayArray, function (i) {
                html += "<th>" + dayArray[i] + "</th>";
            });
            html += "</tr>";
            return html;
        },
        ieDate: function (date) {
            return new Date(Date.parse(date.replace(/-/g, "/"))).getTime()
        },
        dateHtml: function (year, month, opts) {
            //接收外部传过来提前的天数
            if(parkModelId){
                isSection = Number2 = Number1 = parkModelId;
            }
            var html = "<tr>",
                monthdays = this.monthdays(year),
                days = monthdays[month],
                presentDate = new Date(year, month),
                prevdays = monthdays[month - 1],
                flag = true;
            if (month == 0) {
                monthdays = this.monthdays(year - 1);
                prevdays = monthdays[11];
            }
            var today = mydate.getFullYear() + "-" + private_methods.p(mydate.getMonth() + 1) + "-" + private_methods.p(mydate.getDate());
            for (var i = presentDate.getDay(); i > 0; i--) {
                var tyear = month == 0 ? year - 1 : year;
                var tmonth = month == 0 ? 12 : month;
                var previtemDay = tyear + "-" + private_methods.p(tmonth) + "-" + private_methods.p(monthdays[tmonth - 1] - presentDate.getDay() + i + 1);
                if (opts.optionsdays != null || opts.settingdata.length > 0) {
                    html += "<td ";
                    if ($.inArray(previtemDay, private_methods.settingdate(opts.settingdata)) == -1) {
                        html += " class='other'";
                    }
                    html += " class='other' data='prevM'><span class='date-title'><i>" + (prevdays - (i - 1)) + "</i></span><p class='calendar-explian'></p>"
                }
                else {
                    if (private_methods.duibi(previtemDay, opts.stratday) || private_methods.duibi(opts.endday, previtemDay)) {

                        html += "<td class='other' data='prevM'><span class='date-title'><i>" + (prevdays - (i - 1)) + "</i></span><p class='calendar-explian'></p>";
                    }
                    else {
                        html += "<td class='prevM' data='prevM'><span class='date-title'><i>" + (prevdays - (i - 1)) + "</i></span><p class='calendar-explian'></p>";
                    }
                }
                //html +=(monthdays[tmonth - 1] - presentDate.getDay() + i + 1) + "</td>";
            }
            for (var j = 0; j < days; j++) {
                var itemDay = year + "-" + private_methods.p(month + 1) + "-" + private_methods.p(j + 1);
                var pricedata = private_methods.price(itemDay, opts);

                html += "<td ";
                if (typeof opts.selecteday != 'string') {
                    if (today == itemDay) {
                    //如果提前天数为0 添加 今天不能被选中
                        if(isSection > 0){
                            unSelect = "other"
                        }
                        if ($.inArray(today, private_methods.settingdate(opts.settingdata)) > -1) {
                            if (pricedata[1]) {
                                html += " class='today "+unSelect+"' data-day='" + (j + 1) + "'>";
                            } else {
                                html += "class="+unSelect+" data-day='" + (j + 1) + "'>";
                            }
                        }
                        else {
                            if (this.ieDate(opts.selecteday[0]) <= this.ieDate(itemDay) && this.ieDate(opts.selecteday[1]) >= this.ieDate(itemDay)) {
                                html += " data-day='" + (j + 1) + "' class='selecteds "+unSelect+"'>";
                            } else {
                                html += " data-day='" + (j + 1) + "' class="+unSelect+">";
                            }
                        }
                        html += "<span class='date-title'><i>今天</i></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                    }
                    else if (this.ieDate(opts.selecteday[0]) <= this.ieDate(itemDay) && this.ieDate(opts.selecteday[1]) >= this.ieDate(itemDay)) {
                        html += "data-day='" + (j + 1) + "' class='selecteds'><span class='date-title'><i>" + (j + 1) + "</i></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                    } else {
                        if (opts.optionsdays != null || opts.settingdata.length > 0) {
                            if ($.inArray(itemDay, private_methods.settingdate(opts.settingdata)) == -1) {
                                html += " class='other'";
                            } else if (pricedata[1] == 'false' || pricedata[1] == false) {
                                html += " class='other'";
                            }

                        }
                        else {
                            //alert("0:"+pricedata[0]+"1:"+pricedata[1]+"2:"+pricedata[2]+"3:"+pricedata[3])
                            if (private_methods.duibi(itemDay, opts.stratday) || private_methods.duibi(opts.endday, itemDay)) {
                                html += " class='other";
                            }
                            else if ((presentDate.getDay() + j + 1) % 7 == 0 || (presentDate.getDay() + j + 1) % 7 == 1) {
                                html += " class='weekend ";
                            } else {
                                html += " class='"
                            }
                            //添加是不能预订的方法
                            // if(pricedata[1]=='false' || pricedata[1]==false){
                            //  html+=" other'";
                            // }else{
                            //  html += "'";
                            // }
                            html += "'";
                        }

                        if (pricedata[2] != null && pricedata[2] != 0) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>余" + pricedata[2] + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[3] != null && pricedata[3] == 'ztc') {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == true || pricedata[2] < 1 && pricedata[1] == true) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>库存不限</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == false || pricedata[2] < 1 && pricedata[1] == false) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i>";
                            if (!opts.showTock) {
                                html += "<em>暂无库存</em></span>";
                                html += "<p class='calendar-explian'>" + pricedata[0] + "</p>";
                            } else {
                                html += "<em>无限库存</em></span>";
                                html += "<p class='calendar-explian'>" +
                                    "<span class='price' data-childstock='undefined' data-stock='99999' data-childprice='undefined'><em>￥</em><strong>" + opts.dayPrice + "</strong></span>" +
                                    "</p>";
                            }

                        } else if (pricedata[2] != null && pricedata[2] == 0) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>余" + 0 + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        }


                    }
                } else {
                    // 如果循环的每一天的日期是  今天
                    if(isSection > 0){
                        unSelect = "other"
                    }else{
                        unSelect = " "
                    }
                    if (today == itemDay) {
                        if ($.inArray(today, private_methods.settingdate(opts.settingdata)) > -1&&!opts.showTock) {
                            if (pricedata[1]) {
                                html += " class='today "+unSelect+"' data-day='" + (j + 1) + "'>";
                            } else {
                                html += " class='other ' data-day='" + (j + 1) + "'>";
                            }
                        }else if(opts.showTock){
                            html+=" class=' "+unSelect+"' data-day='"+(j + 1)+"'>";
                        }
                        else {
                            html += " class='other'>";
                        }


                        if (pricedata[2] != null && pricedata[2] != 0) {
                            html += "<span class='date-title'><i>今天</i><em>余" + pricedata[2] + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[3] != null && pricedata[3] == 'ztc') {
                            html += "<span class='date-title'><i>今天</i></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == true || pricedata[2] < 1 && pricedata[1] == true) {
                            html += "<span class='date-title'><i>今天</i><em>库存不限</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == false || pricedata[2] < 1 && pricedata[1] == false) {
                            html += "<span class='date-title'><i>今天</i>";
                            if (!opts.showTock) {
                                html += "<em>暂无库存</em></span>";
                                html += "</span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                            } else {
                                html += "<em>无限库存</em></span>";
                                html += "<p class='calendar-explian'>" +
                                    "<span class='price' data-childstock='undefined' data-stock='99999' data-childprice='undefined'><em>￥</em><strong>" + opts.dayPrice + "</strong></span>" +
                                    "</p>";
                            }

                        } else if (pricedata[2] != null && pricedata[2] == 0) {
                            html += "<span class='date-title'><i>今天</i><em>余" + 0 + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        }

                    }
                    else if (opts.selecteday == itemDay) {


                        if (pricedata[2] != null && pricedata[2] != 0) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>余" + pricedata[2] + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[3] != null && pricedata[3] == 'ztc') {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == true || pricedata[2] < 1 && pricedata[1] == true) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>库存不限</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == false || pricedata[2] < 1 && pricedata[1] == false) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i>";
                            if (!opts.showTock) {
                                html += "<em>暂无库存</em></span>";
                                html += "<p class='calendar-explian'>" + pricedata[0] + "</p>";
                            } else {
                                html += "<em>无限库存</em></span>";
                                html += "<p class='calendar-explian'>" +
                                    "<span class='price' data-childstock='undefined' data-stock='99999' data-childprice='undefined'><em>￥</em><strong>" + opts.dayPrice + "</strong></span>" +
                                    "</p>";
                            }

                        } else if (pricedata[2] != null && pricedata[2] == 0) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>余" + 0 + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        }
                        //如果选择的日期不是今天
                    } else {
                        if (opts.optionsdays != null || opts.settingdata.length > 0) {
                            //无限库存返回多个 区间
                            //如果返回一个区间
                            if(opts.settingdata.length == 1){
                                //如果 当月的每一天itemDay 不在返回的日期区间 并且 itemDay的时间小于今天 或者 是itemDay大于这个区间的最后一天  的全部加other 日期不可选择
                                if ($.inArray(itemDay, private_methods.settingdate(opts.settingdata)) == -1&&this.ieDate(itemDay)<this.ieDate(today) || this.ieDate(opts.settingdata[0].endDate) < this.ieDate(itemDay)) {
                                html += " class='other'";
                            }else if(opts.showTock){
                                    var isOther =" ";
                                    //根据后台返回的提前天数  修改不是今天的   应该不被选中的日期
                                    if(isSection > 1 && Number1 > 1 && (this.ieDate(itemDay) - this.ieDate(today) <= 24*60*60*1000)){
                                        isOther = "other"
                                        Number1--;
                                    }else{
                                        isOther = " "
                                    }
                                    html+=" class='"+isOther+"'";
                            }else if (pricedata[1] == 'false' || pricedata[1] == false) {
                                html += " class='other'";
                            }
                                //如果返回多个区间
                            }else{
                                //循环多个无限库存的区间
                                for(var x = 0; x < opts.settingdata.length ; x++){
                                    //如果每一天itemDay 的日期在  每一个循环的区间的中间
                                    if(this.ieDate(opts.settingdata[x].startDate) <= this.ieDate(itemDay) && this.ieDate(itemDay) <= this.ieDate(opts.settingdata[x].endDate)){
                                        //如果在循环的区间并且itemDay 小于今天的 添加  other 日期禁止选择
                                        if(this.ieDate(itemDay) < this.ieDate(today)){
                                            html+=" class='other'";
                                        }else{
                                            //根据后台返回的提前天数  来过滤出  提前几天应该不被选中  如果是UNLIMIT（无限库存）并且第一个数组   或者   日库存DAILY
                                            if(isSection > 1 && Number2 > 1 &&(opts.settingdata[x].stockModel == "UNLIMIT" && x == 0 && (this.ieDate(itemDay) - this.ieDate(today) <= 24*60*60*1000) || opts.settingdata[x].stockModel == "DAILY")){
                                                html+=" class='other'"
                                                Number2--;
                                            }
                                        }
                                        html += " class=' '";
                                        //否则在日期 中不添加other属性  可以选择
                                        //给isSlec对象中添加一个属性 （今天的日期）  如果是无限库存 就给这个属性一个true 标志
                                        isSlec[itemDay] = true

                                    }
                                }
                                //如果isSlec 对象中没有 itemDay 属性没有true 标志的  给添加一个other类名  让改日期不能被选中
                                if(!isSlec[itemDay]){
                                    html+=" class='other'";
                                }
                            }
                        }
                        else {
                            //alert("0:"+pricedata[0]+"1:"+pricedata[1]+"2:"+pricedata[2]+"3:"+pricedata[3])
                            if (private_methods.duibi(itemDay, opts.stratday) || private_methods.duibi(opts.endday, itemDay)) {
                                html += " class='other";
                            }
                            else if ((presentDate.getDay() + j + 1) % 7 == 0 || (presentDate.getDay() + j + 1) % 7 == 1) {
                                html += " class='weekend other";
                            } else {

                                html += " class='other'"

                            }
                            //添加是不能预订的方法
                            // if(pricedata[1]=='false' || pricedata[1]==false){
                            //  html+=" other'";
                            // }else{
                            //  html += "'";
                            // }
                            html += "'";
                        }

                        if (pricedata[2] != null && pricedata[2] != 0) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>余" + pricedata[2] + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[3] != null && pricedata[3] == 'ztc') {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == true || pricedata[2] < 1 && pricedata[1] == true) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>库存不限</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        } else if (pricedata[2] == null && pricedata[1] == false || pricedata[2] < 1 && pricedata[1] == false) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i>";

                            console.log(opts.dayPrice);
                            if (!opts.showTock) {

                                html += "<em>暂无库存</em></span>";
                                html += "</span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                            }else {
                                //无限库存返回多个 区间
                                //如果返回一个区间
                                if(opts.settingdata.length < 2){
                                    //如果 返回为空  或者 一个区间 并且 itemDay 的日期大于这个区间的结束日期 (这个区间之后)  添加暂无库存
                                if(!opts.settingdata[0] || (opts.settingdata[0].endDate && this.ieDate(itemDay) > this.ieDate(opts.settingdata[0].endDate))){
                                    html += "<em>暂无库存</em></span>";
                                    html += "</span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                                }else{
                                    html += "<em>无限库存</em></span>";
                                    html += "<p class='calendar-explian'>" +
                                        "<span class='price' data-childstock='undefined' data-stock='99999' data-childprice='undefined'><em>￥</em><strong>" + opts.dayPrice + "</strong></span>" +
                                        "</p>";
                                    }
                                }else {
                                    //如果返回多个区间
                                    for (var x = 0; x < opts.settingdata.length; x++) {
                                        //如果每一天itemDay 的日期在  每一个循环的区间的中间
                                        if(this.ieDate(opts.settingdata[x].startDate) <= this.ieDate(itemDay) && this.ieDate(itemDay) <= this.ieDate(opts.settingdata[x].endDate)){
                                            html += "<em>无限库存</em></span>";
                                            html += "<p class='calendar-explian'>" +
                                                "<span class='price' data-childstock='undefined' data-stock='99999' data-childprice='undefined'><em>￥</em><strong>" + opts.dayPrice + "</strong></span>" +
                                                "</p>";
                                            //给isEmpty   根据itemDay给isEmpty对象添加一个属性并给一个true 标志
                                            isEmpty[itemDay] = true
                                        }

                                    }
                                    //如果今天已经存在无限库存 则不需要添加暂无库存   （）
                                    if(!isEmpty[itemDay]){
                                        html += "<em>暂无库存</em></span>";
                                        html += "</span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                                    }
                                    // if (this.ieDate(opts.settingdata[0].startDate) < this.ieDate(itemDay) && this.ieDate(itemDay) < this.ieDate(opts.settingdata[opts.settingdata.length - 1].endDate)) {
                                    //
                                    // }else {
                                    //     html += "<em>暂无库存</em></span>";
                                    //     html += "</span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                                    // }

                                }
                            }

                        } else if (pricedata[2] != null && pricedata[2] == 0) {
                            html += " data-day='" + (j + 1) + "'><span class='date-title'><i>" + (j + 1) + "</i><em>余" + 0 + "件</em></span><p class='calendar-explian'>" + pricedata[0] + "</p>";
                        }

                    }
                }

                html += "</td>";
                if ((presentDate.getDay() + j + 1) % 7 == 0) {
                    html += "<tr>";
                }
            }
            for (var k = 0; k < 42 - presentDate.getDay() - days; k++) {
                var nextitemDay = year + "-" + private_methods.p(month + 2) + "-" + private_methods.p(k + 1);
                if (month + 2 > 12) {
                    nextitemDay = (year + 1) + "-01-" + private_methods.p(k + 1);
                }
                if (opts.optionsdays != null || opts.settingdata.length > 0) {
                    html += "<td ";
                    if ($.inArray(nextitemDay, private_methods.settingdate(opts.settingdata)) == -1) {
                        html += " class='other'";
                    }
                    html += " class='other' data='nextM'><span class='date-title'><i>" + (k + 1) + "</i></span><p class='calendar-explian'></p>";
                }
                else {
                    if (private_methods.duibi(nextitemDay, opts.stratday) || private_methods.duibi(opts.endday, nextitemDay)) {
                        html += "<td class='other' data='nextM'><span class='date-title'><i>" + (k + 1) + "</i></span><p class='calendar-explian'></p>";
                    } else {
                        html += "<td class='nextM other' data='nextM'><span class='date-title'><i>" + (k + 1) + "</i></span><p class='calendar-explian'></p>";
                    }
                }
                //html +="<span class='date-title'>"+(k + 1) + "</span><p class='calendar-explian'></p></td>";
                if ((presentDate.getDay() + days + k + 1) % 7 == 0) {
                    html += "<tr>";
                }
            }
            html += "</tr>";
            return html;
        },
        makeDateHtml: function (year, month, opts) {
            this.calendarContent.html("");
            this.calendarHead.find("li:eq(2)").html("");
            if (opts.multiselect) {
                for (var i = 0; i < 2; i++) {
                    month = month + i;
                    if (month > 11) {
                        year++;
                        month = 0;
                    }
                    $("<table>", {width: "50%"}).data({
                        "year": year,
                        "month": month
                    }).append(this.dayHtml(), this.dateHtml(year, month, opts)).appendTo(this.calendarContent);
                    if (i == 1) {
                        this.calendarHead.find("li:eq(2)").append(this.today(year, month + i)[0], this.today(year, month)[1]);
                    } else {
                        this.calendarHead.find("li:eq(2)").append(this.today(year, month + i)[0], this.today(year, month)[1], "至");
                    }

                }
            } else {
                $("<table>", {width: "100%"}).data({
                    "year": year,
                    "month": month
                }).append(this.dayHtml(), this.dateHtml(year, month, opts)).appendTo(this.calendarContent);
                this.calendarHead.find("li:eq(2)").append(this.today(year, month)[0], this.today(year, month)[1]);
            }

            //this.calendarContent.html("").append(this.dayHtml(), this.dateHtml(year, month,opts));
            //this.calendarHead.find("li:eq(2)").html("").append(headhtml.join(","));
        },
        makecalendar: function (obj, opts) {
            var $calendarHead = this.calendarHead,
                $calendarContent = this.calendarContent;
            //$calendarHead.find("li:eq(0)").append(this.flip("yearPrev", "<<", flipFuns));
            $calendarHead.find("li:eq(1)").html(this.flip("monthPrev", "monthPrev", private_methods.flipFuns, opts));
            $calendarHead.find("li:eq(3)").html(this.flip("monthNext", "monthNext", private_methods.flipFuns, opts));
            //$calendarHead.find("li:eq(4)").append(this.flip("yearNext", ">>", flipFuns));
            if (typeof opts.selecteday != 'string') {
                for (var i = 0; i < 2; i++) {
                    var selectd = opts.selecteday[i].split("-");
                    this.makeDateHtml(selectd[0], selectd[1].replace(/\b(0+)/gi, "") - 1, opts);
                }
            } else {
                var selectd = opts.selecteday.split("-");
                this.makeDateHtml(selectd[0], selectd[1].replace(/\b(0+)/gi, "") - 1, opts);
            }
            //this.makeDateHtml(2015, 2);


            $(obj).append($calendarHead, $calendarContent);
        }
    };
    // 默认参数
    $.fn.calendar.defaults = {
        width: "auto",
        selecteday: mydate.getFullYear() + "-" + (mydate.getMonth() + 1) + "-" + mydate.getDate(),
        stratday: mydate.getFullYear() + "-" + (mydate.getMonth() + 1) + "-" + mydate.getDate(),
        endday: null,
        showTock: false,
        dayPrice: null,
        optionsdays: null,
        multiselect: false,
        priceZero: false,
        settingdata: [],
        onClick: function (evl, date) {
        }
    };

})(jQuery);