// Note: See http://blog.garstasio.com/you-dont-need-jquery/ and http://youmightnotneedjquery.com/ for JS commands that don't require jQuery
$(document).ready(function(){

// Menu

(function() {
  $(".flyout-btn").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".overlay").toggleClass("open");
    $(".flyout").find("a").removeClass();
    return $(".flyout").removeClass("flyout-init fade").toggleClass("expand");
  });

  $(".flyout").find("a").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".flyout").removeClass("expand").addClass("fade");
    return $(this).addClass("clicked");
  });

  $(".share").find("a").click(function() {
    return $(this).addClass("clicked");
  });


  $(".more, .more-back").click(function() {
  $(".card-container").first().toggleClass("hover");
  $(".back").toggleClass("iefix");
  });


  $(".share").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".overlay").toggleClass("open");
  });


// var backOfCard = $('.back').first().detach();

// $(".more").click(function(){
//     $(".card").append(backOfCard);
// });

// $(".more-back").click(function(){
//     $(".card").backOfCard();
// });


  

}).call(this);


});


