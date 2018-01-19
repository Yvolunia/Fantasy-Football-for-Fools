// Once the page is loaded
$(document).ready(function() {

    // Global Variables
    var baseRankingUrl = 'http://api.fantasy.nfl.com/v1/players/editordraftranks?'; //season=2017&count=100&offset=0&format=json'
    var basePlayerUrl = 'http://api.fantasy.nfl.com/v1/players/details?'; //playerId=2540175&statType=seasonStats&format=json'
    var Qbs = [];
    var Rbs = [];
    var Wrs = [];
    var Tes = [];
    var K = [];
    var Def = [];
    var offset = 0;
    var count = 1;
    var pickCount = 0;
    var today = new Date();
    var lastYear = today.getFullYear() - 1;

    //do {
    var tbody = $("#list")
        .children()
        .eq(1)

    var picks = $("#picks")
        .children()
        .eq(1)


    var queryURL = baseRankingUrl + 'season=' + lastYear + '&count=100&offset=' + offset + '&format=json'

    $.get(queryURL).done(function(response) {

        for (var i = 0; i < response.players.length; i++) {
            //if (response.players[i].position === 'QB') {
            //Qbs.push(response.players[i].firstName + ' ' + response.players[i].lastName + ',' + response.players[i].teamAbbr + ',' +
            //response.players[i].rank + ',' + response.players[i].id);
            //}
            //$("#topPlayers").append("<li class='list-group-item'>" + count + '. ' + response.players[i].firstName + ' ' +
            //response.players[i].lastName + ' - ' + response.players[i].position + ' - ' + response.players[i].teamAbbr + "</li>");
            //count++;

            tbody.append("<tr></tr>");
            var tr = tbody.children().eq(i);
            tr.attr("class", response.players[i].position);
            tr.attr("class", 'userPicks');
            tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
            var th = tr.children("th");
            var td = tr.children("td");


            // Setting the inner text of each td in the first row
            var button = $("<button>");
            button.attr("class", "letter-button button letter-button-color");
            button.data("data-playerId", response.players[i].id);
            button.data("data-firstName", response.players[i].firstName);
            button.data("data-lastName", response.players[i].lastName);
            button.data("data-teamAbbr", response.players[i].teamAbbr);
            button.data("data-position", response.players[i].position);
            button.text("Choose");

            th.eq(0).append(button);

            th.eq(1).text(count);

            td.eq(0).text(response.players[i].firstName);

            td.eq(1).text(response.players[i].lastName);

            td.eq(2).text(response.players[i].teamAbbr);

            td.eq(3).text(response.players[i].position);

            count++;

        }

    });

    offset += 100;

    var queryURL = baseRankingUrl + 'season=' + lastYear + '&count=100&offset=' + offset + '&format=json'

    $.get(queryURL).done(function(response) {

        for (var i = 0; i < response.players.length; i++) {
            //if (response.players[i].position === 'QB') {
            //Qbs.push(response.players[i].firstName + ' ' + response.players[i].lastName + ',' + response.players[i].teamAbbr + ',' +
            //response.players[i].rank + ',' + response.players[i].id);
            //}
            //$("#topPlayers").append("<li class='list-group-item " + response.players[i].position + "'>" + count + '. ' + response.players[i].firstName + ' ' +
            //response.players[i].lastName + ' - ' + response.players[i].position + ' - ' + response.players[i].teamAbbr + "</li>");

            //count++;

            tbody.append("<tr></tr>");
            var tr = tbody.children().eq(offset + i);
            tr.attr("class", response.players[i].position);
            tr.attr("class", 'userPicks');
            tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
            var th = tr.children("th");
            var td = tr.children("td");


            // Setting the inner text of each td in the first row
            var button = $("<button>");
            button.attr("class", "letter-button button letter-button-color");
            button.data("data-playerId", response.players[i].id);
            button.data("data-firstName", response.players[i].firstName);
            button.data("data-lastName", response.players[i].lastName);
            button.data("data-teamAbbr", response.players[i].teamAbbr);
            button.data("data-position", response.players[i].position);
            button.text("Choose");

            th.eq(0).append(button);

            th.eq(1).text(count);

            td.eq(0).text(response.players[i].firstName);

            td.eq(1).text(response.players[i].lastName);

            td.eq(2).text(response.players[i].teamAbbr);

            td.eq(3).text(response.players[i].position);

            count++;
        }

    });



    //} 
    //while (length < 15);



    $(".button").on("click", function() {

        if (pickCount < 10) {

            pickCount++;
            console.log(pickCount);

            var dataPositionId = $(this).data('data-playerId');
            var dataFirstName = $(this).data('data-firstName');
            var dataLastName = $(this).data('data-lastName');
            var dataTeam = $(this).attr('data-teamAbbr');
            var dataPosition = $(this).attr('data-position');
            console.log(dataPositionId);
            console.log(dataFirstName);
            console.log(dataLastName);
            console.log(dataTeam);
            console.log(dataPosition);

            picks.append("<tr></tr>");
            var tr = picks.children().eq(pickCount);
            tr.data("data-playerId", $(this).data('data-playerId'));
            tr.data("data-firstName", $(this).data('data-firstName'));
            tr.data("data-lastName", dataLastName);
            tr.data("data-teamAbbr", dataTeam);
            tr.data("data-position", dataPosition);
            tr.append("<th scope='row'></th><td></td><td></td><td></td><td></td>");
            var th = tr.children("th");
            var td = tr.children("td");


            // Setting the inner text of each td in the first row
            th.eq(0).text(pickCount);

            td.eq(0).text($(this).data('data-firstName'));

            td.eq(1).text($(this).data('data-lastName'));

            td.eq(2).text($(this).attr('data-teamAbbr'));

            td.eq(3).text($(this).attr('data-position'));

        }




    });

    $("input").on("click", function() {
        var posFilter = '.' + $(this).attr('data-position');
        $(":hidden").show();
        $(posFilter).hide();


    });




})