var deferred; // = $.Deferred();
var offline = false;
var API_HOST = "https://api-staging.1self.co";
var username = "martin";

function getCards() {

    deferred = $.Deferred();

    var url;

    var sort_by_date = function(a, b) {
        return new Date(b.cardDate).getTime() - new Date(a.cardDate).getTime();
    };

    if (offline) {
        url = "offline_json/offline.json";
    } else {
        // Get the ajax requests out of the way early because they
        // are typically longest to complete

        var minStdDev = getQSParam().minStdDev;
        var maxStdDev = getQSParam().maxStdDev;

        url = API_HOST + '/v1/users/';
        url += username + '/cards';
        url += '?extraFiltering=true';
        url += minStdDev ? '&minStdDev=' + minStdDev : '&minStdDev=' + "0.5";
        url += maxStdDev ? '&maxStdDev=' + maxStdDev : '';
    }

    console.log(url);

    $.getJSON(url,
            function() {
                console.log("accessed api for cards");
            })
        .done(function(data) {

            data.sort(sort_by_date);
            console.log('card data', data);
            // window.cardData = data;
            deferred.resolve(data);
        })
        .fail(function(data) {
            console.log('error getting cards', data);

        });
}

$(function() {
    getCards();

});





