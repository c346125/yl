$(function(){
    //分享
     $('#share-2').share({sites: [ 'weibo','wechat']});

    if($(".item-tkt").length>0){
		$(".typelist").on('click','.look-tkt-pinfo',function () {
	        $(this).parent().parent().next().find(".tkt-pinfo").toggle(0);
	    });
		$(".typelist").on('click','.up-btn',function(){
			$(this).parent().parent().hide();
		})
	}


    if($(".go-map-a").length>0){
        $(".go-map-a").click(function(){
            $("html, body").animate({
                scrollTop: ($($(this).attr("gomap")).offset().top-48) + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
        })
    }
    //评论初始化


	// var modelCode=$(".modelCode").val();
    // var modelId =$('.modelId').val();
    // var filterObj={"currPage":1,"pageSize":2,"modelCode":modelCode,"commentLevel":0,modelId:modelId};
    // commentAjax(filterObj);
    //评论条件搜索
    // $(".comment-tab a").click(function () {
    //     var level=$(this).data("level");
    //     $(this).addClass('on').siblings().removeClass('on');
    //     filterObj.commentLevel=level;
    //     commentAjax(filterObj);
    // })
});
function commentAjax(sendData) {
    $.ajax({
        url:'/comment',
        type:"POST",
        data:sendData,
        success:function(data){
            var datas=data[0].data;
            pageHtml(datas);
            pageLay(sendData.currPage,datas.pages,sendData);
            if(sendData.commentLevel==0){
                $(".comment-num").html(datas.total+'条评论');
                $(".count").html(datas.total);
                $(".border-base-b").find('em').html(datas.avgScore);
                $(".info-menu .branch em").html(datas.avgScore);
                $(".comm-top.love-num i").addClass('no-love');
                if(Number(datas.avgScore).toFixed(0)==5){
                    $(".comm-top .love-num i").removeClass('no-love')
                }else{
                    $(".comm-top .love-num i").eq(Number(datas.avgScore).toFixed(0)).prevAll().removeClass('no-love');
                }
            }
        }
    })
}

function pageLay(curPage, totalCount, senddata) {
    laypage({
        cont: 'page',
        pages: totalCount,
        curr: curPage,
        groups: 3,
        prev: '上一页',
        next: '下一页',
        jump: function (obj, first) {
            if (!first) {
                senddata.currPage = obj.curr;
                $.post('/comment', senddata)
                    .success(function (data) {
                        pageHtml(data[0].data)
                    });
            }
        }
    });
}
function pageHtml(data) {
    var _html="";
    if(data.records.length>0){
        for(var i=0;i<data.records.length;i++){
            _html+='<div class="border-base-b dd">';
            _html+='<div class="h6">';
            _html+='<div class="comment-time c-9">'+data.records[i].createTime+'</div>';
            if(data.records[i].isAnonymous=='T'){
                _html+='<div class="user font-t">匿名评论</div>';
            }else{
                _html+='<div class="user font-t">'+nameHide(data.records[i].leaguerName) +'</div>';
            }
            _html+='</div>';
            _html+='<div class="love-num pt10">';
            for(var s=0;s<data.records[i].score;s++){
                _html+='<i></i>';
            }
            for(var x=0;x<(5-data.records[i].score);x++){
                _html+='<i class="no-love"></i>';
            }
            _html+='</div>';
            _html+='评论内容：';
            _html+='<p class="user-answer c-9">'+data.records[i].content+'</p>';
            if(data.records[i].replyContent){
                _html+='回复评论：';
                _html+='<p class="user-answer c-9">'+data.records[i].replyContent+'</p>';
            }
            // _html+='<p class="server-answer c-f6">'+pageData.page[i].ans+'</p>';
            _html+='</div>';
        }
    }else{
        _html='<div class="no-data">暂无数据</div>'
    }
    $(".comment-html").html(_html);
    var dataScore = $('#comment .c-red').text()
    if(Number(dataScore).toFixed(0)==5){
        $(".comm-top .love-num i").removeClass('no-love')
    }else{
        $(".comm-top .love-num i").eq(Number(dataScore).toFixed(0)).prevAll().removeClass('no-love');
    }

}

function nameHide(str) {
    if(str.length==11){
        return str.slice(0,3)+'***'+str.slice(8);
    }else{
        return str.slice(0,1)+'***';
    }
}
//票型列表

function ticketProduct(data) {
    $.ajax({
        url: (currentLimiting==='F' ? '/detail/flowFalse/' :'/detail/flowTrue/')+ module,
        type:'post',
        data:data,
        success:function (data) {
            console.log(data);
            if(data[0].data){
                renderProduct(data[0].data, currentLimiting);
            }else{
                $('.item-typelist tbody').html('<tr><td colspan="4">暂无</td></tr>');
            }

        },
        error:function (data) {
            console.log(data);
        }
    })
}
//渲染票型列表
function renderProduct(data, type) {
    var rh='';
    if(type==='F'){
        if(data.frontParkTicketVoList.length){
            data.frontParkTicketVoList.forEach(function (v) {
                rh+='<tr>' +
                    '<td>'+v.modelName+'</td>' +
                    '<td>'+ ticketType(v.ticketType)+'</td>' +
                    '<td class="c-price">￥'+v.price+'</td>' +
                    '<td class="td-oper">';
                rh+= '<a href="javascript:;" data-url="/order/park/'+v.modelCode+"?currentLimiting="+currentLimiting+'" class="'+(currentLimiting==='F'|| 'no_check')+'">立即预订</a>'  +
                    '</td>' +
                    '</tr>'
            })
        }else{
            rh='<tr><td colspan="4">暂无</td></tr>'
        }
    }else{
        if(data.length){
            data.forEach(function (v) {
                rh+='<tr>' +
                    '<td>'+v.modelName+'</td>' +
                    '<td>'+ ticketType(v.ticketType)+'</td>' +
                    '<td class="c-price">￥'+v.price+'</td>' +
                    '<td class="td-oper">';
                rh+= '<a href="javascript:;" data-url="/order/park/'+v.modelCode+"?currentLimiting="+currentLimiting+'" class="'+(currentLimiting==='F'|| 'no_check')+'">立即预订</a>'  +
                    '</td>' +
                    '</tr>'
            })
        }else{
            rh='<tr><td colspan="4">暂无</td></tr>'
        }
    }

    $('.item-typelist tbody').html(rh);

}

//渲染日历选择列表---未来7天
function calendarList(flags) {
    if( $('.list-date') ){
        $('.list-date span').each(function (i,v) {
            var tDate=GetDateStr(i + flags),
                tMoth=tDate.slice(5,12).split('-')[0],
                tDay=tDate.slice(5,12).split('-')[1];
            $(v).data('date', GetDateStr(i + flags) ).html( Number(tMoth)+'月'+Number(tDay)+'日' );
            $(v).attr('data-time',tDate)
        });
    }
}



//不限流查询
function flowFalse(t){
    var tDate= $(t).data('date');
    $(t).addClass('on').siblings().removeClass('on');
    var parkId=$(t).data('goodscode')
    var travelDate=$(t).data('time')
    var data={
        parkId:parkId,
        saleChannel:'PC',
        travelDate:travelDate
    }
    ticketProduct(data)

}

//限流查询
function flowTrue(t) {
    var tDate= $(t).data('date');
    console.log(t)
    $(t).addClass('on').siblings().removeClass('on');
    $('.list-field').html('');
    var _html='';
    $('.item-typelist').find('.td-oper a').addClass('no_check');
    $.ajax({
        url:'/detail/flow',
        type:'get',
        data:{
            modelCode:modelCode,
            startDate:tDate,
            endDate:tDate,

        },
        success:function (data) {
            console.log(data);
            if(data[0].respCode==200){
                if(data[0].data.length){
                    data[0].data[0].datail.forEach(function (v) {
                        _html+='<div data-id="'+v.id+'" class="item-field" data-stime="'+v.startTime+'" data-etime="'+v.endTime+'" data-num="'+v.usableNum+'"><strong>'+(v.limitName ? v.limitName :'')+'</strong><span class="time">'+v.startTime.slice(0,5)+'-'+v.endTime.slice(0,5)+'</span><span class="surplus">剩余：'+v.usableNum+'</span></div>';
                    })
                }else{
                    _html+="暂无"
                }
            }else{
                _html+="错误"
            }
            $('.list-field').html(_html);
        },
        error:function (data) {
            console.log(data);
        }
    })
    var parkId=$(t).data('goodscode')
    var travelDate=$(t).data('time')
    var data={
        parkId:parkId,
        saleChannel:'PC',
        travelDate:travelDate
    }
    ticketProduct(data)
    // var dom='';
    // dom+='<tbody>'
    // // for (var i=0;i<data.length;i++){
    // dom+= '<tr>'+
    //     '<td>'+"aaaa"+'</td>'+
    //     '<td>全价成人票</td>'+
    //     '<td>成人票</td>'+
    //     '<td class="c-price">￥8000</td>'+
    //     '<td class="td-oper"><a href="javascript:;" data-url="/order/park/PKTK-201810-9128" class="no_check">立即预订</a></td>'+
    //     '</tr>'
    // // }
    //
    // $('.item-tkt').html(dom)
//票价查询
//     $.ajax({
//         url:'/detail/:module/:productCode',
//         type:'get',
//         data:{
//             modelCode:modelCode,
//             startDate:tDate,
//             endDate:tDate
//         },
//         success:function (data) {
//             console.log(data);
//             if(data[0].respCode==200){
//                 if(data[0].data.length){
//                     data[0].data[0].datail.forEach(function (v) {
//                         _html+='<div class="item-field" data-stime="'+v.startTime+'" data-etime="'+v.endTime+'" data-num="'+v.usableNum+'"><strong>'+v.limitName+'</strong><span class="time">'+v.startTime.slice(0,5)+'-'+v.endTime.slice(0,5)+'</span><span class="surplus">剩余：'+v.usableNum+'</span></div>';
//                     })
//                 }else{
//                     _html+="暂无"
//                 }
//             }else{
//                 _html+="错误"
//             }
//             $('.list-field').html(_html);
//         },
//         error:function (data) {
//             console.log(data);
//         }
//     })

}

//
// $('detail-wrap #px').on('click','.time',function () {
//     console.log('aaaaaaaaaaaaaaaaaaaaaaa')
// })





