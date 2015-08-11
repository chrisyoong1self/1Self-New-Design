function buildStack (stack) {
    var numberOfCardsToShow = 3;
    var skip = 0;
    deferred.done(function(cardsArray) {
    	console.log(cardsArray.length);
        cardsArrayGlobal = cardsArray.reverse();

        if (numberOfCardsToShow > cardsArray.length) {
            numberOfCardsToShow = cardsArray.length;
        }

        var $liTemplate = $(".li-template");

        for (var i = numberOfCardsToShow + skip - 1; i >= skip; i--) {
            setSourceElements(cardsArray[i]);
            var $li = addToStack($liTemplate, stack, cardsArray[i], i, (i === skip));
            
            if (i === skip) {
	          	markCardUnique($li[0], 'topOfMain');
	        	renderThumbnailMedia($li, cardsArray[i]);
            };

       	}

    });
}

function markCardUnique(cardEl, label) {
    $('.stack li').removeClass(label);
    if (cardEl !== undefined) {
        $(cardEl).addClass(label);
    }
}

function stripHash(stringToStrip) {
    return stringToStrip.replace('#', '');
}

function getColour(idx) {
    var colourArray = ['#dd2649', '#00a2d4', '#e93d31', '#f2ae1c', '#61b346', '#cf4b9a', '#367ec0', '#00ad87'];
    return "#000000";
    // return colourArray[idx % colourArray.length];
}

function getHighlightDates(cardData) {
    if (cardData.startRange === cardData.endRange) {
        return cardData.startRange;
    }
}

function bringToTop(cardLi) {
	if (cardLi) {
		var $cardLi = $(cardLi);
		var $cardUl = $cardLi.parent();
		$cardLi.detach();
		$cardUl.append(cardLi);
	}
}

function addToStack ($liTemplate, stack, cardData, cardIndex, renderThumbnail) {
	var $li = $liTemplate.clone();
	var liHtml = $li[0];
	var $card = createCard(cardData);
	$li.removeClass("li-template");
	liHtml.cardIndex = cardIndex;
	var $stack = $(".stack");

	$stack.append($li);
	console.log($li.find(".card-container"));
	$li.find(".card-container").append($card);
	$li.removeClass("card-hide");
	$card.removeClass("card-hide");
	assignCardHandlers($li);

    stack.createCard(liHtml);
    liHtml.classList.add('in-deck');

    return $li;
}

function assignCardHandlers ($li) {
	$li.find(".more, .more-back").click(function() {
		$li.find(".card-container").toggleClass("hover");
		$li.find(".back").toggleClass("iefix");
 	 });
}

function injectCardData (cardData, $card) {
	createCardText(cardData, "green");

	var $headline = $card.find(".headline");
	$headline.prepend(cardData.cardText);
	$headline.addClass(cardData.dataSource);
}

function createCard (cardData) {
	var $card; 

	if (cardData.type ==="date") {
		$card = $(".card-template.date-card").clone();

	} else if (cardData.type === "top10" || cardData.type === "bottom10") {
		$card = $(".card-template.top-ten-card").clone();
		injectCardData(cardData, $card);
	}

	$card.removeClass("card-template");
	return $card;
}


$(document).ready(function(){ 

    var stack;
    var discardPile = [];

    stack = gajus.Swing.Stack();

    stack.on('throwout', function (e) {

    	var $cardList = $(".stack li");

        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');
        e.target.classList.remove('in-deck');
        e.target.classList.add('removed-from-deck');
        discardPile.push(e.target);

        markCardUnique(e.target, 'topOfDiscard');
        e.target.thrownX = 1;
        e.target.thrownY = 78;
        var cardsOnDiscard = discardPile.length;
        var newTop = $cardList[$cardList.length - 1 - cardsOnDiscard];
        markCardUnique(newTop, 'topOfMain');

        bringToTop(newTop);


        if ($cardList.length - 1 - cardsOnDiscard >= 0) {
            // bringToTop($cardList[$cardList.length - 1 - cardsOnDiscard]);
            $cardList[$cardList.length - 1 - cardsOnDiscard].cardVisibleAt = (new Date()).getTime();
        }
        
        // renderThumbnailMedia($cardList[$cardList.length - 1 - cardsOnDiscard]);
        // e.target.classList.remove('in-deck');
        // console.log('thrown out', e.target.id, discardPile);   
        // sendGAEvent('thrown-out-' + e.target.getAttribute('cardIndex'), e.target.getAttribute('cardId'), e.target.getAttribute('cardIndex'));

        // markCardRead(username, e.target, cardReloadCount); // username is declared globally in index.html
            


    });

    stack.on('throwin', function(e) {
        discardPile.pop();
        var cardEl = $(discardPile[discardPile.length - 1])[0];
        markCardUnique(e.target, 'topOfMain');
        markCardUnique(cardEl, 'topOfDiscard');
        $(e.target).show();
    
        e.target.classList.add('in-deck');
        e.target.classList.remove('removed-from-deck');
        console.log('thrown in', e.target.id, discardPile);

        // sendGAEvent('thrown-in-' + e.target.getAttribute('cardIndex'), e.target.getAttribute('cardId'), e.target.getAttribute('cardIndex'));
    });

	$(".next").click(function(){
	throwOutNext(stack);
	});

	$(".previous").click(function(){
	throwInPrevious(stack);
	});

	buildStack(stack);

});


function throwInPrevious(stack){
	var $cardToThrow = $(".topOfDiscard");
	var cardLi = $cardToThrow[0];

	if (cardLi) {
		var card = stack.getCard(cardLi);
		card.throwIn(cardLi.thrownX, cardLi.thrownY);
	}
}

function throwOutNext(stack){
	var $cardToThrow = $(".topOfMain");
	var cardLi = $cardToThrow[0];

	if (cardLi) {
	    var card = stack.getCard(cardLi);
	    cardLi.thrownY = getRandomInt(-100, 100);
	    cardLi.thrownX = 1;
	    card.throwOut(cardLi.thrownX, cardLi.thrownY);
	//     sendGAEvent('button-thrown-out-' + cardLi.getAttribute('cardIndex'), cardLi.getAttribute('cardId'), cardLi.getAttribute('cardIndex'));            
	// } else {
	//     $('.getMoreCardsBtn').addClass('standard-shadow');
	//     $('.getMoreCardsBtn').hide();
	//     $('.bottom-of-stack-container .loading').show();
	//     $('.bottom-of-stack-container h1').text('Loading cards...').removeClass("bottom-of-stack-large-text");
	//     $('.bottom-of-stack-container p').hide();
	//     $('.bottom-of-stack-container .tellMeAboutNewCardsBtn').hide();

	//     getCards();
	//     cardReloadCount++;
	//     setUpStack();
	//     buildStack(stack);

	//     sendGAEvent('get-more-cards');
	}
}