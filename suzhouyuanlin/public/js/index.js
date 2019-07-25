// 轮播图
//定义全局变量和定时器
var i = 0 ;
var timer;

$(document).ready(function(){
    //用jquery方法设置第一张图片显示，其余隐藏
    $('.item').eq(0).show().siblings('.item').hide();

    //调用showTime()函数（轮播函数）
    showTime();

    //当鼠标经过下面的数字时，触发两个事件（鼠标悬停和鼠标离开）
    $('.in').hover(function(){
        //获取当前i的值，并显示，同时还要清除定时器
        i = $(this).index();
        Show();
        clearInterval(timer);
    },function(){
        //
        showTime();
    });

    // //鼠标点击左侧的箭头
    // $('.btn1').click(function(){
    //     clearInterval(timer);
    //     if(i == 0){
    //         i = 5;//注意此时i的值
    //     }
    //     i--;
    //     Show();
    //     showTime();
    // });

    // //鼠标点击右侧的箭头
    // $('.btn2').click(function(){
    //     clearInterval(timer);
    //     if(i == 4){
    //         i = -1;//注意此时i的值
    //     }
    //     i++;
    // //     Show();
    // //     showTime();
    // });


});


//创建一个showTime函数
function showTime(){
    //定时器
     timer = setInterval(function(){
        //调用一个Show()函数
        Show();
        i++;
        //当图片是最后一张的后面时，设置图片为第一张
        if(i==5){ i=0;}
    },2000);
}


//创建一个Show函数
function Show(){
    //在这里可以用其他jquery的动画
    $('.item').eq(i).fadeIn(500).siblings('.item').fadeOut(500);
    //给.tab创建一个新的Class为其添加一个新的样式，并且要在css代码中设置该样式
    $('.in').eq(i).addClass('bg').siblings('.in').removeClass('bg');

}
// 跑马灯
$(function(){
var $btnLeft=$(".prev");
var $btnRight=$(".next");
  $btnRight.click(function(){
     
      $(".car").removeClass("ooo").addClass('oo')
      
  })
  $btnLeft.click(function(){
      
      $(".car").addClass("ooo").removeClass("oo")
  })

})
  new Vue({
      el:"#app",
      data:{
          carousel:[],
         scenic:[],
         message:[],
         m1:{}
      },
      created() {
          axios.get(
              "http://127.0.0.1:3000/index",
              {
             
              }
          ).then(result=>{
              this.carousel=result.data.carousel;
            this.scenic=result.data.scenic;
            this.m1=result.data.message[0];
            this.message=result.data.message.slice(1);
            
          })
      },
    })