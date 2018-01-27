$(document).ready(function() {

    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyAyIAyWHVX4hO1C2sCNbTL03Vdd09dMq_U",
        authDomain: "fantasyfootballauthui.firebaseapp.com",
        databaseURL: "https://fantasyfootballauthui.firebaseio.com",
        projectId: "fantasyfootballauthui",
        storageBucket: "fantasyfootballauthui.appspot.com",
        messagingSenderId: "660825767375"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // Global Variables

    // Text Variables    
    var subscriptionKey = "b204be46c1494d69be425ea909a27795";

    // Number Variable
    var pickCount = 0;
    var count = 1;

    // Date Variables
    var today = new Date();
    var lastYear = today.getFullYear() - 1;

    // Array Variables
    var positions = ["K", "D/ST", "TE", "WR", "RB", "QB"];
    var positionCount = [15, 15, 25, 50, 50, 25];
    var savedPicks = [""];

    // jQuery Variables
    var tbody = $("#list")
        .children()
        .eq(1)
    var picks = $("#picks")
        .children()
        .eq(1)

    // Global Function

    function objectSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    // Runs on initialization

    // Creates buttons for all the positions in the positions array to pushes them to the top of the table
    // Assigns 2 data attributes to be used in the On Click event
    for (var i = 0; i < positions.length; i++) {
        var positionButton = $("<button>");
        positionButton.attr("class", "btn btn-danger m-1 positionButtons");
        positionButton.data("data-position", positions[i]);
        positionButton.data("data-count", positionCount[i]);
        positionButton.text(positions[i]);
        $("#topTable").prepend(positionButton);
    }

    // On Click Events

    // On click of one of the position buttons, the data attributes for that button are saved
    // They are used to update the table name and create the URL strings
    $(".positionButtons").on("click", function() {
        count = 1;
        var posFilter = $(this).data('data-position');
        var posCount = $(this).data('data-count');
        $("#tableLable").text('Top ' + posCount + ' ' + posFilter + 's');
        tbody.text("");

        // If D/ST is clicked, come through this code (D/ST needs a separate call to provide the necessary info)
        if (posFilter === "D/ST") {

            var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyDefenseBySeason/" + lastYear;

            // Ajax call with my subscription key to pull back D/ST data
            $.ajax({
                    headers: {
                        'Ocp-Apim-Subscription-Key': subscriptionKey,
                    },
                    url: myUrl
                })
                .done(function(response) {

                    // Once the call returns, sort object array in descending order of point scored
                    var DefSt = response.sort(objectSort("-FantasyPoints"));

                    // For 0 to posCount, append table elements to the table
                    for (var i = 0; i < posCount; i++) {

                        tbody.append("<tr></tr>");
                        var tr = tbody.children().eq(i);
                        tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
                        var th = tr.children("th");
                        var td = tr.children("td");


                        // Create Choose button
                        var button = $("<button>");
                        button.attr("class", "btn btn-danger playerButtons");
                        button.data("data-playerId", response[i].PlayerID);
                        button.data("data-position", posFilter);
                        button.data("data-rank", count);
                        button.data("data-team", response[i].Team);
                        button.data("data-points", response[i].FantasyPoints);
                        button.text("Choose");

                        // Appends Choose button to first row of table
                        th.eq(0).append(button);

                        // Puts the ranking in second row of table
                        th.eq(1).text(count);

                        // Place team name in fourth row of table, third row of table skipped since this represent team D/ST
                        td.eq(1).text(response[i].Team);

                        // Places fantasy points scored last season in sixth row of table, fifth row skipped since no team has a jersey number
                        td.eq(3).text(response[i].FantasyPoints);

                        // Add 1 to ranking count
                        count++;

                    }
                });

        } else {

            var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/SeasonLeagueLeaders/" + lastYear + "/" + posFilter + "/FantasyPoints";

            $.ajax({
                    headers: {
                        'Ocp-Apim-Subscription-Key': subscriptionKey,
                    },
                    url: myUrl
                })
                .done(function(response) {

                    for (var i = 0; i < posCount; i++) {

                        tbody.append("<tr></tr>");
                        var tr = tbody.children().eq(i);
                        tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
                        var th = tr.children("th");
                        var td = tr.children("td");

                        var button = $("<button>");
                        button.attr("class", "btn btn-danger playerButtons");
                        button.data("data-playerId", response[i].PlayerID);
                        button.data("data-position", posFilter);
                        button.data("data-rank", count);
                        button.data("data-name", response[i].Name);
                        button.data("data-team", response[i].Team);
                        button.data("data-number", response[i].Number);
                        button.data("data-points", response[i].FantasyPoints);
                        button.text("Choose");

                        th.eq(0).append(button);

                        th.eq(1).text(count);

                        td.eq(0).text(response[i].Name);

                        td.eq(1).text(response[i].Team);

                        td.eq(2).text(response[i].Number);

                        td.eq(3).text(response[i].FantasyPoints);

                        count++;

                    }

                });

        }

    });

    $(document).on("click", ".playerButtons", function() {

        var dataPlayerId = $(this).data('data-playerId');
        var dataRank = $(this).data('data-rank');
        var dataName = $(this).data('data-name');
        var dataNumber = $(this).data('data-number');
        var dataTeam = $(this).data('data-team');
        var dataPoints = $(this).data('data-points');
        var dataPosition = $(this).data('data-position');
        var savedItems = {
            playerID: dataPlayerId,
            position: dataPosition,
            team: dataTeam,
            points: dataPoints,
        };

        savedPicks.push(savedItems);

        if (pickCount < 10) {

            picks.append("<tr></tr>");
            var tr = picks.children().eq(pickCount);
            tr.data("data-playerId", dataPlayerId);
            tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
            var th = tr.children("th");
            var td = tr.children("td");
            pickCount++;


            // Setting the inner text of each td in the first row
            th.eq(0).text(pickCount);

            th.eq(1).text(dataRank);

            td.eq(0).text(dataName);

            td.eq(1).text(dataTeam);

            td.eq(2).text(dataNumber);

            td.eq(3).text(dataPoints);

        } else {
            $("#warning").text("Ten is the maximum number of players you can choose at once. Click Continue or clear your picks to add more players");
        }


    });


    // On click of the clear button, clear the picks out of the picks table
    $("#clear").on("click", function() {
        picks.text("");
        $("#warning").text("");
        pickCount = 0;
        savedPicks = [""];
    });
    // Sticky Saved players section

    // Sticky Saved players section
    $(document).ready(function() {
        var top = $('.sticky-scroll-box').offset().top;
        $(window).scroll(function(event) {
            var y = $(this).scrollTop();
            if (y >= top)
                $('.sticky-scroll-box').addClass('fixed');
            else
                $('.sticky-scroll-box').removeClass('fixed');
            $('.sticky-scroll-box').width($('.sticky-scroll-box').parent().width());
        });
    });

    // When Continue button is click, user selections updated to Firebase
    $("#continue").on("click", function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var sortedSavedPicks = savedPicks.sort(objectSort("-points"));
                event.preventDefault();
                database.ref("users/" + user.uid).push(sortedSavedPicks);
                console.log(sortedSavedPicks);
                window.open("FinalDraft.html", "_self");
                // ...
            } else {
                // User is signed out.
            $("#logout").text("You are logged out. Please login and try again.");
            $("#logout").attr("class","text-danger");
                // ...
            }
        });

    });

});