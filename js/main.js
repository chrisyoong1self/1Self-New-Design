// Note: See http://blog.garstasio.com/you-dont-need-jquery/ and http://youmightnotneedjquery.com/ for JS commands that don't require jQuery


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
  $(".card-container").toggleClass("hover");
  $(".back").toggleClass("iefix");
  });


  $(".share").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".share-buttons-wrap").toggleClass("hide zoomIn");
    $(".overlay").toggleClass("open");
  });


  // Settings More

    $(".settings .more").click(function() {
    $(".setting-card").toggleClass("open");
  });


  $(".share").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".share-buttons-wrap").toggleClass("hide zoomIn");
    $(".overlay").toggleClass("open");
  });




  $('.removed-from-deck').delay(1000).remove();


  $(".flyout").find("a").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    }, 550);       
});

  


// var backOfCard = $('.back').first().detach();

// $(".more").click(function(){
//     $(".card").append(backOfCard);
// });

// $(".more-back").click(function(){
//     $(".card").backOfCard();
// });


  

}).call(this);





