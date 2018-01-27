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
    var currUser = '';

    // Number Variable
    var countQb = 0;
    var countBc = 0;
    var count = 0;
    var countK = 0;

    // Date Variables
    var today = new Date();
    var lastYear = today.getFullYear() - 1;

    // jQuery Variables
    var tbodyQb = $("#qb-table")
        .children()
        .eq(1);
    var tbodyBc = $("#bc-table")
        .children()
        .eq(1);
    var tbody = $("#df-table")
        .children()
        .eq(1);
    var tbodyK = $("#k-table")
        .children()
        .eq(1);

    // Global Functions
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

    // Firebase event for adding train to the database and a row in the html when a user adds an entry
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            event.preventDefault();
            // Save the user id for the current user signed in
            currUser = user.uid;
            // Call to pull back the data pushed to Firebase
            database.ref().on("value", function(childSnapshot, prevChildKey) {
                // Pulls back the full database
                var fullDatabase = childSnapshot.val();
                // Pulls back the users for Firebase
                var users = fullDatabase["users"];
                // Pulls the full history of picks for the current user
                var allPicks = users[currUser];
                // Pulls the key for the most recent picks submitted by the current user
                var currentPickKey = Object.keys(allPicks)[Object.keys(allPicks).length - 1];
                // Pulls the most recent picks submitted by the current user
                var preSortPicks = allPicks[currentPickKey];
                // Sorts the object array by Fantasy points in order from highest to lowest
                var currentPicks = preSortPicks.sort(objectSort("-points"));
                console.log(currentPicks);
                // Processes the currentPicks object array
                for (var i = 1; i < currentPicks.length; i++) {
                    // If current player is a Defense
                    if (currentPicks[i].position === 'D/ST') {
                        var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyDefenseBySeason/" + lastYear;

                        // Ajax call with my subscription key to pull back D/ST data
                        $.ajax({
                                headers: {
                                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                                },
                                url: myUrl
                            })
                            .done(function(response) {

                                // Interates through all 32 defenses and pulls the information for the one that matches the current play
                                // Then it pushes the information to the appropriate table
                                for (var j = 0; j < response.length; j++) {
                                    console.log(currentPicks[i]);
                                    if (currentPicks[i].team === response[j].Team) {
                                        tbody.append("<tr></tr>");
                                        var tr = tbody.children().eq(count);
                                        tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                                        var td = tr.children("td");
                                        var touchdowns = parseInt(response[j].DefensiveTouchdowns) + parseInt(response[j].SpecialTeamsTouchdowns);

                                        td.eq(0).text(response[j].Team);
                                        td.eq(1).text("D/ST");
                                        td.eq(2).text(response[j].Sacks);
                                        td.eq(3).text(response[j].Interceptions);
                                        td.eq(4).text(response[j].FumblesRecovered);
                                        td.eq(5).text(response[j].BlockedKicks);
                                        td.eq(6).text(touchdowns);
                                        td.eq(7).text(response[j].FantasyPoints);

                                        count++
                                    }
                                }

                            });

                    } else if (currentPicks[i].position === 'QB') {
                        var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/Player/" + currentPicks[i].playerID;

                        $.ajax({
                                headers: {
                                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                                },
                                url: myUrl
                            })
                            .done(function(response) {

                                tbodyQb.append("<tr></tr>");
                                var tr = tbodyQb.children().eq(countQb);
                                tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                                var td = tr.children("td");

                                td.eq(0).html("<img src='" + response.PhotoUrl + "'></img>");
                                td.eq(1).text(response.FirstName + ' ' + response.LastName);
                                td.eq(2).text(response.Team)
                                td.eq(3).text(response.Position);
                                td.eq(4).text(response.PlayerSeason.PassingYards);
                                td.eq(5).text(response.PlayerSeason.PassingTouchdowns);
                                td.eq(6).text(parseInt(response.PlayerSeason.PassingTouchdowns) + parseInt(response.PlayerSeason.RushingTouchdowns));
                                td.eq(7).text(response.PlayerSeason.PassingInterceptions);
                                td.eq(8).text(response.PlayerSeason.FantasyPoints);

                                countQb++;

                            });

                    } else if (currentPicks[i].position == 'RB' || currentPicks[i].position == 'WR' || currentPicks[i].position == 'TE') {

                        var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/Player/" + currentPicks[i].playerID;

                        $.ajax({
                                headers: {
                                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                                },
                                url: myUrl
                            })
                            .done(function(response) {

                                tbodyBc.append("<tr></tr>");
                                var tr = tbodyBc.children().eq(countBc);
                                tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                                var td = tr.children("td");

                                td.eq(0).html("<img src='" + response.PhotoUrl + "'></img>");
                                td.eq(1).text(response.FirstName + ' ' + response.LastName);
                                td.eq(2).text(response.Team)
                                td.eq(3).text(response.Position);
                                td.eq(4).text(response.PlayerSeason.ReceivingYards);
                                td.eq(5).text(response.PlayerSeason.RushingYards);
                                td.eq(6).text(parseInt(response.PlayerSeason.RushingTouchdowns) + parseInt(response.PlayerSeason.ReceivingTouchdowns));
                                td.eq(7).text(response.PlayerSeason.Fumbles);
                                td.eq(8).text(response.PlayerSeason.FantasyPoints);

                                countBc++;

                            });

                    } else if (currentPicks[i].position == 'K') {
                        var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/Player/" + currentPicks[i].playerID;

                        $.ajax({
                                headers: {
                                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                                },
                                url: myUrl
                            })
                            .done(function(response) {

                                tbodyK.append("<tr></tr>");
                                var tr = tbodyK.children().eq(countK);
                                tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                                var td = tr.children("td");

                                td.eq(0).html("<img src='" + response.PhotoUrl + "'></img>");
                                td.eq(1).text(response.FirstName + ' ' + response.LastName);
                                td.eq(2).text(response.Team)
                                td.eq(3).text(response.Position);
                                td.eq(4).text(parseInt(response.PlayerSeason.FieldGoalsMade0to19) + parseInt(response.PlayerSeason.FieldGoalsMade20to29) + parseInt(response.PlayerSeason.FieldGoalsMade30to39));
                                td.eq(5).text(parseInt(response.PlayerSeason.FieldGoalsMade40to49) + parseInt(response.PlayerSeason.FieldGoalsMade50Plus));
                                td.eq(6).text(response.PlayerSeason.ExtraPointsMade);
                                td.eq(7).text(parseInt(response.PlayerSeason.FieldGoalsAttempted) - parseInt(response.PlayerSeason.FieldGoalsMade));
                                td.eq(8).text(response.PlayerSeason.FantasyPoints);

                                countK++;

                            });

                    } else {
                        console.log('This should never fire');
                    }
                }
            });
            // ...
        } else {
            // User is signed out.
            $("#logout").text("You are logged out. Please login and try again.");
            $("#logout").attr("class", "text-danger");
            // ...
        }
    });

    // Code to run on initialization of the page
    window.onscroll = function() { scrollFunction() };

    // Global Variables

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

});