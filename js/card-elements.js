function createCardText(cardData, colour) {
    var cardText = '';

    if (cardData.type === "top10" || cardData.type === "bottom10") {
        var template1 = '{{comparitor}} {{action_pl}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b>'; // e.g. [Yesterday]: [6th] [fewest] [commit]s in [a day] [ever]
        var template2 = '{{comparitor}} {{action_pp}} {{property}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b>'; // [Yesterday]: [6th] [most] [commit]ted [file changes] in [a day] [ever]
        var template3 = '{{comparitor}} {{objects}} {{action_pl}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b>'; // [Yesterday]: [6th] [fewest] [music track] [listen]s in [a day] [ever]
        // var template4 = '<b>{{eventDate}}</b><br>{{comparitor}} {{action_pl}} to {{property}} in {{eventPeriod}} {{comparisonPeriod}}'; // [Yesterday]: [6th] [fewest] [listen]s [to Royksopp] in [a day] [ever]
        // var template5 = '<b>{{eventDate}}</b><br>{{comparitor}} {{objects}} {{property}} in {{eventPeriod}} {{comparisonPeriod}}'; // [Yesterday]: [6th] [fewest] [computer desktop] [all distracting percent] in [a day] [ever]
        var template6 = '{{value}} {{action_pl}} to {{property}}<br>Your {{comparitor}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b>'; // [Yesterday]: [13] [listens] to [Four Tet]<br>Your [6th] [fewest] in [a day]
        var template7 = '{{value}} of your {{objects}} was {{property}}<br>Your {{comparitor}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b><br><a onclick="logInfoClick(this);" class="infoLink" href="https://www.rescuetimecom/dashboard/for/the/day/of/{{cardDate}}" target="_blank" style="color:{{colour}}"><i class="fa fa-info-circle"></i> More info at RescueTime.com</a>'; // [Yesterday]: [1.2%] of your [computer use] was [business]<br>Your [6th] [fewest] in [a day]
        var template8 = '{{value}} {{property}}<br>Your {{comparitor}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b>'; // [Yesterday]: [2609] [steps]<br>Your [6th] [fewest] in [a day]
        var template9 = '{{value}} {{objects}} {{property}}<br>Your {{comparitor}} in {{eventPeriod}} {{comparisonPeriod}}<br><b class="event-date" >{{eventDate}}</b>'; // [Yesterday]: [34] [google] [visits]<br>Your [6th] [fewest] in [a day]

        var templateDefault = '<br class="event-date" ><b>{{eventDate}}</b>{{value}} {{{objects}}} {{{action_pp}}} {{{property}}}<br>Your {{comparitor}} in {{eventPeriod}} {{comparisonPeriod}}'; // [Yesterday]: [1.2] {objects} {actions} {properties}<br>Your [6th] [fewest] in [a day]

        var supplantObject = {
            eventDate: stripAtDetail(dateRangetext(cardData.startRange, cardData.endRange)),
            comparitor: createComparitorText(cardData.position, cardData.type),
            eventPeriod: "a day",
            comparisonPeriod: "",
            colour: colour
        };

        var propertiesObj = buildPropertiesTextAndGetValue(cardData.properties.sum);

        if (cardData.actionTags[0] === "commit" || cardData.actionTags[1] === "push") {
            if (cardData.properties.sum.__count__) {
                supplantObject.action_pl = displayTags(pluralise(cardData.actionTags));
                cardText = template1.supplant(supplantObject);
                // console.log("template1");
            } else {
                supplantObject.action_pp = displayTags(pastParticiple(cardData.actionTags));
                supplantObject.property = propertiesObj.propertiesText;
                cardText = template2.supplant(supplantObject);
                // console.log("template2", cardData.actionTags);
            }
        } else if (cardData.actionTags[0] === "listen") {
            if (cardData.properties.sum.__count__) {
                supplantObject.action_pl = displayTags(pluralise(cardData.actionTags));
                supplantObject.objects = displayTags(cardData.objectTags);
                cardText = template3.supplant(supplantObject);
                // console.log("template3");
            } else {
                supplantObject.action_pl = displayTags(pluralise(cardData.actionTags));
                supplantObject.property = propertiesObj.propertiesText;
                supplantObject.value = propertiesObj.value;
                cardText = template6.supplant(supplantObject);
                // console.log("template6");
            }
        } else if (cardData.actionTags[0] === "use") {
            supplantObject.property = "&quot;" + propertiesObj.propertiesText + "&quot;";
            supplantObject.objects = customFormatObjTags(displayTags(cardData.objectTags));
            supplantObject.value = propertiesObj.value;
            supplantObject.cardDate = cardData.cardDate;
            cardText = template7.supplant(supplantObject);
            // console.log("template7", cardData.actionTags);

        } else if (cardData.actionTags[0] === "develop") {
            if (cardData.chart.indexOf('.duration') > 0) {
                supplantObject.property = "coding";
            } else {
                supplantObject.property = "coding sessions";
            }
            supplantObject.value = propertiesObj.value;
            cardText = template8.supplant(supplantObject);

        } else if (cardData.actionTags[0] === "exercise") {

            if (cardData.actionTags[1] === "walk") {
                if (cardData.chart.indexOf('steps') > 0) {
                    supplantObject.property = propertiesObj.propertiesText;
                } else {
                    supplantObject.property = "walks";
                }
                supplantObject.value = propertiesObj.value;
                cardText = template8.supplant(supplantObject);
            } else if (cardData.actionTags[1] === "ride") {
                if (cardData.propertyName === "distance.sum") {
                    supplantObject.property = "metres ridden";
                    supplantObject.value = propertiesObj.value;
                    cardText = template8.supplant(supplantObject);
                }
            }
            // console.log("template8");

        } else if (cardData.actionTags[0] === "browse" && cardData.chart.indexOf('times-visited') > 0) {
            supplantObject.property = propertiesObj.propertiesText;
            supplantObject.value = propertiesObj.value;
            supplantObject.objects = customFormatObjTags(displayTags(cardData.objectTags));
            cardText = template9.supplant(supplantObject);
            // console.log("template9");
        }

        if (cardText === '') {
            supplantObject.property = propertiesObj.propertiesText;
            supplantObject.action_pp = displayTags(pastParticiple(cardData.actionTags));
            supplantObject.objects = displayTags(cardData.objectTags);
            supplantObject.value = propertiesObj.value;
            cardText = templateDefault.supplant(supplantObject);
            // console.log("templateDefault");
        }

        cardText = cardText.supplant(supplantObject);

        cardData.cardText = cardText;
    }
}

function buildPropertiesTextAndGetValue (propertiesObject) {
    // debugger;
    var returnString = '';
    var objectKey = Object.keys(propertiesObject)[0];
    var prevObjectKey;
    var counter = 0;
    var returnObj = {};
    var isDuration = false;
    var isPercent = false;

    while (objectKey && objectKey !== "__count__") {
        var propertyText = unhyphenate(customFormatProperty(objectKey));
        propertiesObject = propertiesObject[objectKey];
        prevObjectKey = objectKey;

        if (objectKey.indexOf('duration') >= 0) {
            isDuration = true;
        } else if (objectKey.indexOf('percent') >= 0) {
            isPercent = true;
        }

        if (typeof propertiesObject === 'object')
            objectKey = Object.keys(propertiesObject)[0];
        else
            objectKey = null;

        if (propertyText !== "") {
            // returnString += '<span class="property-text" style="color: {{colour}}">' + propertyText + '</span>';
            returnString += propertyText;
            if (objectKey && objectKey !== "__count__") {
                returnString += ": ";
            }
        }
        counter++;
    }

    returnObj.propertiesText = returnString.trim();

    if (objectKey === "__count__") {
        returnObj.value = propertiesObject[objectKey];
    } else {
        returnObj.value = propertiesObject;
    }

    if (isDuration)
        if (returnObj.value < 60)
            returnObj.value = setPrecision(returnObj.value) + " seconds";
        else
            returnObj.value = moment.duration(returnObj.value, "seconds").humanize();
    else if (isPercent)
        returnObj.value = setPrecision(returnObj.value) + '%';

    return returnObj;
}

String.prototype.supplant = function(o) {
    return this.replace(
        /\{\{([^{}]*)\}\}/g,
        function(a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function createComparitorText(position, type) {
    var comparitorText = '';

    comparitorText = (type === "top10" ? "most" : "fewest");

    if (position > 0)
        comparitorText = ordinal_suffix_of(position + 1, true) + ' ' + comparitorText;

    return comparitorText;
}

function pluralise(stringArray) {
    var toReturn = [];
    for (var i in stringArray) {
        var plural;
        if (stringArray[i] === "push")
            plural = "es";
        else
            plural = "s";
        toReturn.push(stringArray[i] + plural);
    }
    return toReturn;
}

function pastParticiple(stringArray) {
    var toReturn = [];
    for (var i in stringArray) {
        var pp;
        if (stringArray[i] === "commit")
            pp = "ted";
        else
            pp = "s";
        toReturn.push(stringArray[i] + pp);
    }
    return toReturn;
}

function unhyphenate(toUnhyphenate) {
        return toUnhyphenate.replace(/\^/g, '.').replace(/-/g, ' ');
}

function customFormatProperty(propertyText) {
    if (propertyText === "artist-name")
        return "";
    else if (propertyText === "album-name")
        return "tracks from the album";
    else if (propertyText.indexOf('percent') >= 0)
        return propertyText.replace('percent', '').trim();
    else if (propertyText.indexOf('duration') >= 0)
        return propertyText.replace('duration', '').trim();
    else if (propertyText.indexOf('times-visited') >= 0)
        return propertyText.replace('times-visited', 'visits').trim();
    else
        return propertyText;
}

function customFormatObjTags(objTagsString) {
    if (objTagsString === "computer desktop") 
        return "computer time";
    else
        return objTagsString;
}

function setPrecision(numberToSet) {
    var returnString = numberToSet.toPrecision(3) + '';
    while (returnString.indexOf('.') >= 0 && (returnString.charAt(returnString.length - 1) === '0' || returnString.charAt(returnString.length - 1) === '.')) {
        returnString = returnString.substring(0, returnString.length - 1);
    }
    return returnString;
}

function stripAtDetail(stringToStrip) {
    stringArr = stringToStrip.split(' at ');
    stringArr[0] = stringArr[0].replace('Last ', '');
    return stringArr[0];
}


function dateRangetext(startRange, endRange) {
    var rangeText;
    var now = moment();

    if (startRange === endRange) {
        // single moment
        startRange = moment(startRange);
        rangeText = startRange.calendar(); //'Yesterday';
    } else {
        // range of time
        startRange = moment(startRange);
        endRange = moment(endRange);
        rangeText = startRange.format('lll') + ' - ' + endRange.format('lll');
    }

    return rangeText;
}

function setSourceElements (cardData) {
    if (cardData.actionTags && cardData.objectTags) {

        if (cardData.actionTags[0] === "use") {
            cardData.dataSource = 'rescue-time';
        }

        else if (cardData.actionTags[0] === "listen") {
            cardData.dataSource = 'last-fm';
        }
            
        else if (cardData.actionTags[0] === "exercise") {
            cardData.dataSource = 'google-fit';
        }
            
        else if (cardData.actionTags[0] === "browse") {
            cardData.dataSource = 'visit-counter';
        }
            
        else if (cardData.actionTags[0] === "develop") {
            cardData.dataSource = 'sublime';
        }
            
        else if (cardData.objectTags.indexOf("github") >= 0) {
            cardData.dataSource = 'github';
        }
        else {
            cardData.dataSource = 'unknown-data-source';
        }
    } 
}


function renderThumbnailMedia($cardLi, cardData) {

    if (cardData.thumbnailMedia) {
        var iFrameSrc = cardData.thumbnailMedia;
        iFrameSrc += '?lineColour=' + stripHash(getColour(cardData.colourIndex));
        iFrameSrc += '&highlightCondition=' + cardData.type;
        iFrameSrc += '&highlightDates=' + getHighlightDates(cardData);
        iFrameSrc += '&doTransitions=true';
        iFrameSrc += '&dataSrc=' + encodeURIComponent(API_HOST + cardData.chart);
        $cardLi.find(".chart-iframe").attr("src", iFrameSrc);
    }
}

