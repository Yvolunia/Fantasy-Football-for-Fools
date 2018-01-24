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

            // Firebase event for adding train to the database and a row in the html when a user adds an entry
            database.ref().on("value", function(childSnapshot, prevChildKey) {
                console.log(childSnapshot.val());});

                var picks = "";

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