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
    //console.log(firebase.auth().X.currentUser);
    //console.log(firebase.auth().X.currentUser.uid);

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

    // Firebase event for adding train to the database and a row in the html when a user adds an entry
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            event.preventDefault();
            currUser = user.uid;
            return firebase.database().ref('users/').once('value').then(function(snapshot) {
                snapshot.forEach(function(userSnapshot) {
                    var username = userSnapshot.val();
                    var oneUser = username[currUser];
                    console.log(oneUser);
                    var lastArray = oneUser[Object.keys(oneUser)[Object.keys(oneUser).length - 1]];
                    console.log(lastArray);
                });
               // console.log(snapshot);
                //var users = snapshot.users;
                //console.log(users);
                //var oneUser = users[currUser];
                //console.log(oneUser);
                //var lastArray = oneUser[Object.keys(oneUser)[Object.keys(oneUser).length - 1]];
                //console.log(lastArray);
                // ...
            });
            // ...
        } else {
            // User is signed out.
            $("#logout").text("You are logged out. Please login and try again.");
            $("#logout").attr("class", "text-danger");
            // ...
        }
    });

    database.ref().on("value", function(childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());
        for (v in childSnapshot.val()) {
            for (var i = 0; i < v.length; i++) {
                if (v[i].playerID == '') {

                    var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyDefenseBySeason/" + lastYear;

                    // Ajax call with my subscription key to pull back D/ST data
                    $.ajax({
                            headers: {
                                'Ocp-Apim-Subscription-Key': subscriptionKey,
                            },
                            url: myUrl
                        })
                        .done(function(response) {

                            console.log(response);

                            for (var j = 0; i < response.length; i++) {
                                if (v[i].team === response[j].Team) {}

                                tbody.append("<tr></tr>");
                                var tr = tbody.children().eq(count);
                                tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                                var td = tr.children("td");
                                var touchdowns = parseInt(response[j].DefensiveTouchdowns) + parseInt(response[j].SpecialTeamsTouchdowns);

                                td.eq(0).text(response[j].Team);
                                td.eq(2).text("D/ST");
                                td.eq(3).text(response[j].Sacks);
                                td.eq(4).text(response[j].Interceptions);
                                td.eq(5).text(touchdowns);
                                td.eq(6).text(response[j].FumblesRecovered);
                                td.eq(7).text(response[j].FantasyPoints);

                                count++
                            }

                        });

                } else if (v[i].position == 'QB') {

                    var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/Player/" + v[i].playerID;

                    $.ajax({
                            headers: {
                                'Ocp-Apim-Subscription-Key': subscriptionKey,
                            },
                            url: myUrl
                        })
                        .done(function(response) {

                            console.log(response);



                            tbodyQb.append("<tr></tr>");
                            var tr = tbodyQb.children().eq(countQb);
                            tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                            var td = tr.children("td");

                            td.eq(0).text(response.FirstName + ' ' + response.LastName);
                            td.eq(1).text(response.Team)
                            td.eq(2).text(response.Position);
                            td.eq(3).text(response.PlayerSeason.PassingYards);
                            td.eq(4).text(response.PlayerSeason.PassingTouchdowns);
                            td.eq(5).text(parseInt(response.PlayerSeason.PassingTouchdowns) + parseInt(response.PlayerSeason.RushingTouchdowns));
                            td.eq(6).text(response.PlayerSeason.PassingInterceptions);
                            td.eq(7).text(response.PlayerSeason.FantasyPoints);

                            countQb++;



                        });

                } else if (v[i].position == 'RB' || v[i].position == 'WR' || v[i].position == 'TE') {

                    var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/Player/" + v[i].playerID;

                    $.ajax({
                            headers: {
                                'Ocp-Apim-Subscription-Key': subscriptionKey,
                            },
                            url: myUrl
                        })
                        .done(function(response) {

                            console.log(response);



                            tbodyBc.append("<tr></tr>");
                            var tr = tbodyBc.children().eq(countBc);
                            tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                            var td = tr.children("td");

                            td.eq(0).text(response.FirstName + ' ' + response.LastName);
                            td.eq(1).text(response.Team)
                            td.eq(2).text(response.Position);
                            td.eq(3).text(response.PlayerSeason.ReceivingYards);
                            td.eq(4).text(response.PlayerSeason.RushingYards);
                            td.eq(5).text(parseInt(response.PlayerSeason.RushingTouchdowns) + parseInt(response.PlayerSeason.ReceivingTouchdowns));
                            td.eq(6).text(response.PlayerSeason.Fumbles);
                            td.eq(7).text(response.PlayerSeason.FantasyPoints);

                            countBc++;



                        });


                } else {

                    var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/Player/" + v[i].playerID;

                    $.ajax({
                            headers: {
                                'Ocp-Apim-Subscription-Key': subscriptionKey,
                            },
                            url: myUrl
                        })
                        .done(function(response) {

                            console.log(response);



                            tbodyK.append("<tr></tr>");
                            var tr = tbodyK.children().eq(countK);
                            tr.append("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
                            var td = tr.children("td");

                            td.eq(0).text(response.FirstName + ' ' + response.LastName);
                            td.eq(1).text(response.Team)
                            td.eq(2).text(response.Position);
                            td.eq(3).text(parseInt(response.PlayerSeason.FieldGoalsMade0to19) + parseInt(response.PlayerSeason.FieldGoalsMade20to29) + parseInt(response.PlayerSeason.FieldGoalsMade30to39));
                            td.eq(4).text(parseInt(response.PlayerSeason.FieldGoalsMade40to49) + parseInt(response.PlayerSeason.FieldGoalsMade50Plus));
                            td.eq(5).text(response.PlayerSeason.ExtraPointsMade);
                            td.eq(6).text(parseInt(response.PlayerSeason.FieldGoalsAttempted) - parseInt(response.PlayerSeason.FieldGoalsMade));
                            td.eq(7).text(response.PlayerSeason.FantasyPoints);

                            countK++;



                        });

                }
            }


        }

    });
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