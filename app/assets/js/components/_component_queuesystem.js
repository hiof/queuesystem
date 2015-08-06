(function(Hiof, undefined) {


    displayData = function(options) {
        var cn = window.Hiof.options.queuesystem.currentNumber;





        var templateSource, data, authenticated = false;
        //debug('displayData options:');
        //debug(options);
        if ($.cookie('HiofKoAuth')) {
            authenticated = true;
        }


        if (options.template === 'update') {
            templateSource = Hiof.Templates['queuesystem/update'];
            data = {
                "queuenumber": cn,
                "authenticated": authenticated
            };

        } else {
            templateSource = Hiof.Templates['queuesystem/view'];

            data = {
                "queuenumber": {}
            };
        }
        //debug('View data: ');
        //debug(data);


        var markup = templateSource(data);
        $('.queuesystem').html(markup);



        if ($('.queuesystem .view').length) {

        }
        if ($('.qs-view-update').length) {
            authenticate();

        }
        $('.' + window.Hiof.options.queuesystem.campus + '-qr').toggle();
        window.setInterval(function() {
            getCurrentQueueNumber();
        }, 1000);

    };

    postQueue = function(next) {
        var newNumber = $('#queuenumber').val();
        //debug('newNumber before next');
        //debug(newNumber);
        if (next) {
            newNumber = parseInt(newNumber, 10);
            ++newNumber;
            newNumber.toString();
        }
        //debug('newNumber after next');
        //debug(newNumber);

        var options = {};

        var settings = $.extend({
            // These are the defaults.
            campus: window.Hiof.options.queuesystem.campus,
            currentNumber: newNumber,
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
                //$('#queuenumber').val(data.number);
                //debug('This is the sucess data');
                //debug(data);
                //var type, message;
                //if (data.success) {
                //    type = 'alert-success';
                //    message = data.success;
                //} else if (data.warning) {
                //    type = 'alert-warning';
                //    message = data.warning;
                //}
                //if ($('.alert').length) {
                //  $('.alert').alert('close');
                //}
                //var feedback = '<div style="display:none;" class="alert fade in ' + type + ' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>';
                //$('.qs-view-update').append(feedback).fadeIn();
                ////return;
                //window.setTimeout(function(){
                //  $('.alert').alert('close');
                //}, 5000);
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
            //window.Hiof.options.queuesystem.authenticate = true;
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
        window.setTimeout(function() {
            $('#passord').focus();
        }, 1000);
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
        window.location.reload();
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
                if ($('#queuenumber').length) {
                    $('#queuenumber:not(".edit")').val(data.currentnumber[id].number);
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

            Path.root("#/oppdater");
        } else {

            Path.root("#/view");
        }
    };


    // Paths


    Path.map("#/view").to(function() {
        var options = {};
        options.campus = window.Hiof.options.queuesystem.campus;
        options.template = 'view';
        displayData(options);
        //setInterval(getCurrentQueueNumber(), 1000);
    });

    Path.map("#/oppdater").to(function() {


        var options = {};
        options.campus = window.Hiof.options.queuesystem.campus;
        options.template = 'update';
        options.currentNumber = window.Hiof.options.queuesystem.currentNumber;
        //debug(options);
        displayData(options);
    });


    // on document load
    $(function() {
        // Initiate
        if ($('.queuesystem').length) {


            window.Hiof.options.queuesystem = {};
            var qs = window.Hiof.options.queuesystem;
            qs.campus = $('.queuesystem').attr('data-campus');

            getCurrentQueueNumber();




            //setInterval(function(){ alert("Hello"); }, 3000);


            initatePathQueue();
            Path.listen();





        }
        // Authentication
        $(document).on('click', '#login', function(e) {
            //debug('Loginform is submitted...');
            e.preventDefault();
            checkLogin();
        });
        $(document).on('click', '#logout', function(e) {
            e.preventDefault();
            $.removeCookie('HiofKoAuth');
            window.location.reload();
            //debug('Remove cookie');
        });


        // Toggle edit functionality
        $(document).on('click', '#btn-show-hidden', function(e) {
            e.preventDefault();
            $('.qs-view-update .visuallyhidden').removeAttr('class');
            $('.qs-view-update #neste-nummer').addClass('visuallyhidden');
            $('#queuenumber').addClass('edit');
            //$.removeCookie('HiofKoAuth');
            //debug('Remove cookie');
        });


        // Next

        $(document).on('click', '#btn-next', function(e) {
            e.preventDefault();
            postQueue(true);
        });

        $(document).on('submit', '.qs-view-update-number', function(e) {
            //debug('on.submit initiated');
            e.preventDefault();
            postQueue();
        });

        $('#queuenumber').keypress(function(e) {
            if (e.which == 13) {
                //debug('input enter initiated');
                e.preventDefault();
                postQueue();
            }
        });



    });

    // Expose functions to the window
    //window.Hiof.queueauthenticate = authenticate;


})(window.Hiof = window.Hiof || {});
