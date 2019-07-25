$(function () {
    //大大的banner
    $('#top_slider').slide({
        titCell: '.hd ul',
        mainCell: '.bd ul',
        autoPlay: true,
        autoPage: "<li><a></a></li>",
        effect: 'fold',
        interTime: 4000,
        delayTime: 1500
    });

    //notice
    $(".home-notice").slide({
        titCell: ".hd ul",
        mainCell: ".bd ul",
        autoPage: true,
        effect: "leftLoop",
        autoPlay: true,
        vis: 3,
        interTime: 3500,
        delayTime: 1000
    });
    // $(".home-notice").slide({
    //     titCell: ".hd ul",
    //     mainCell: ".bd ul",
    //     autoPage: true,
    //     effect: "leftMarquee",
    //     autoPlay: true,
    //     vis: 3,
    //     interTime: 50,
    //     scroll:1
    // });

    //ticket
    $(".ticket-m").slide({
        titCell: ".hd ul",
        mainCell: ".bd ul",
        autoPage: true,
        effect: "leftLoop",
        autoPlay: true,
        vis: 1,
        interTime: 5500,
        delayTime: 2500
    });

    $(".news-m li a").mousedown(function(){
        $(this).find(".ico-r").animate({"left":"40%"},200).animate({"left":"100%"},150);
    });
    $(".news-m li a").hover(function(){

    },function(){

        $(this).find(".ico-r").animate({"left":"20px"},200);
    });


});