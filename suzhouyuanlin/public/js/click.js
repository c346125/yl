
   //查询触发事件元素
$("[data-date=date]")
//2.绑定触发函数
.click(
  function(){
    //3.查找要修改的元素
    //4.修改元素
    $(this).addClass('on').siblings().removeClass('on');
    
  }
)
$('.list-field').on('click', '.item-field',
    function() {
     
      $(this).addClass('on').siblings().removeClass('on');
      $(this).children("span:last-child").addClass("on");
      $(this).siblings().children("span:last-child").removeClass("on");
    }) 

$('.item-typelist').on('click', '.td  a',
    function() {
      if ($(this).hasClass('no_check')) {
        if ($('.list-field').text() === "暂无") {
          alert('暂无可选择时段')
        } else {
          alert('请选择时段');
        }
    } 
});