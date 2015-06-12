(function(Hiof, undefined) {


    displayData = function(options) {
        var cn = window.Hiof.options.queuesystem.currentNumber;

        var templateSource, data;
        //debug('displayData options:');
        //debug(options);
        if (options.template === 'update') {
            templateSource = Hiof.Templates['queuesystem/update'];
            data = {
                "queuenumber": {

                },
                "authenticated": true
            };

        } else {
            templateSource = Hiof.Templates['queuesystem/view'];

            data = {
                "queuenumber": {}
            };
        }
        debug('View data: ');
        debug(data);


        var markup = templateSource(data);
        $('.queuesystem').html(markup);



        if ($('.queuesystem .view').length) {
            window.setInterval(function() {
                getCurrentQueueNumber();
            }, 1000);
        }
        if ($('.qs-view-update').length) {
            authenticate();

        }

    };

    postQueue = function() {
        var options = {};

        var settings = $.extend({
            // These are the defaults.
            campus: window.Hiof.options.queuesystem.campus,
            currentNumber: $('#queuenumber').val(),
            secret: $('#secret').val()
        }, options);


        // Get the current number
        var contentType = "application/x-www-form-urlencoded; charset=utf-8";

        if (window.XDomainRequest) { //for IE8,IE9
            contentType = "text/plain";
        }
        $.ajax({
            url: 'http://hiof.no/api/v1/queuesystem/',
            method: 'POST',
            async: true,
            dataType: 'json',
            data: settings,
            contentType: contentType,
            success: function(data) {
                //alert("Data from Server: "+JSON.stringify(data));
                //currentNumber = data;
                $('#queuenumber').val(data.number);


                return;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert("You can not send Cross Domain AJAX requests: " + errorThrown);
                alert("Noe feil har skjedd. Last inn siden på nytt og prøv igjen");
            }

        });

    };
    authenticate = function() {


        // Check if cookie exist
        if ($.cookie('HiofKoAuth')) {
            var secret = $.cookie('HiofKoAuth');
            $('#secret').val(secret);
            $('.qs-view-update fieldset').removeAttr("disabled");
        } else {
            setupLogin();
        }
        // If not



    };


    setupLogin = function() {

        var loginform = '<form id="login-form"> <div class="form-group"><label for="passord">Passord</label><input type="text" class="form-control" id="passord" placeholder="Ditt passord.." value=""></div><button type="submit" id="login" class="btn btn-default">Logg inn</button></form>';

        var options = {
            header: "Logg på",
            content: loginform,
            footer: ""
        };

        var modal = Hiof.createModal(options);
        //(console.log(modal);
        $('#body').append(modal);
        $('.modal').modal();

    };
    checkLogin = function() {
        // Check if the auth is valid
        var password = $('#passord').val();
        var settings = {
            "auth": password
        };

        var contentType = "application/x-www-form-urlencoded; charset=utf-8";

        if (window.XDomainRequest) { //for IE8,IE9
            contentType = "text/plain";
        }
        $.ajax({
            url: 'http://hiof.no/api/v1/queuesystem/',
            method: 'POST',
            async: true,
            dataType: 'json',
            data: settings,
            contentType: contentType,
            success: function(data) {
                //alert("Data from Server: "+JSON.stringify(data));
                //currentNumber = data;
                //$('#queuenumber').val(data.number);
                setLoginCookie(data.auth);

                //return;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert("You can not send Cross Domain AJAX requests: " + errorThrown);
                alert("Noe feil har skjedd. Last inn siden på nytt og prøv igjen");
            }

        });
    };
    addSecretToForm = function(value) {
        $('#secret').val(value);
    };

    setLoginCookie = function(value) {
        $.cookie('HiofKoAuth', value, {
            path: '/',
            expires: 7
        });
    };



    getCurrentQueueNumber = function(options) {

        var currentNumber, id;
        //debug('getCurrentQueueNumber is running');

        var settings = $.extend({
            // These are the defaults.
            campus: window.Hiof.options.queuesystem.campus,
            currentNumber: 0,
            secret: null
        }, options);
        //debug('Settings: ');
        //debug(settings);


        // Get the current number
        var contentType = "application/x-www-form-urlencoded; charset=utf-8";

        if (window.XDomainRequest) { //for IE8,IE9
            contentType = "text/plain";
        }
        $.ajax({
            url: 'http://hiof.no/api/v1/queuesystem/',
            method: 'GET',
            async: true,
            dataType: 'json',
            data: settings,
            contentType: contentType,
            success: function(data) {
                //alert("Data from Server: "+JSON.stringify(data));
                if (settings.campus === 'halden') {
                    id = 0;
                } else {
                    id = 1;
                }
                window.Hiof.options.queuesystem.currentNumber = data.currentnumber[id].number;


                if ($('.odometer').length) {
                    $('.odometer').html(data.currentnumber[id].number);
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert("You can not send Cross Domain AJAX requests: " + errorThrown);
            }
        });



    };


    initatePathQueue = function() {
        // Load root path if no path is active
        var view = $('.queuesystem').attr('data-view');
        if (view === 'update') {

            Path.root("#/update");
        } else {

            Path.root("#/view");
        }
    };


    // Paths


    Path.map("#/view").to(function() {
        var options = {};
        options.campus = window.Hiof.options.queuesystem.campus;
        options.template = 'view';
        options.currentNumber = window.Hiof.options.queuesystem.currentNumber;
        displayData(options);
        //setInterval(getCurrentQueueNumber(), 1000);
    });

    Path.map("#/update").to(function() {


        var options = {};
        options.campus = window.Hiof.options.queuesystem.campus;
        options.template = 'update';
        displayData(options);
    });


    // on document load
    $(function() {

        if ($('.queuesystem').length) {


            window.Hiof.options.queuesystem = {};
            var qs = window.Hiof.options.queuesystem;
            qs.campus = $('.queuesystem').attr('data-campus');

            getCurrentQueueNumber();




            //setInterval(function(){ alert("Hello"); }, 3000);


            initatePathQueue();
            Path.listen();





        }

        $(document).on('click', '#login', function(e) {
            debug('Loginform is submitted...');
            e.preventDefault();
            checkLogin();
        });
        $(document).on('click', '#logout', function(e) {
            e.preventDefault();
            $.removeCookie('HiofKoAuth');
            //debug('Remove cookie');
        });
       $(document).on('click', '#btn-show-hidden', function(e) {
            e.preventDefault();
            $('.qs-view-update .visuallyhidden').removeAttr('class');
            $('.qs-view-update #neste-nummer').addClass('visuallyhidden');
            //$.removeCookie('HiofKoAuth');
            //debug('Remove cookie');
        });



    });

    // Expose functions to the window
    //window.Hiof.queueauthenticate = authenticate;


})(window.Hiof = window.Hiof || {});
