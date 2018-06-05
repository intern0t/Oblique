$(document).ready(function () {
    const UserInput = $(".userInput");
    const APIRoot = "http://109.236.83.48:1338/";
    const FrontRoot = "http://o.prashant.me/#!"

    function isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }

    var _payload;
    var getURLParamters = () => {
        const url = document.location.href;
        var payload;

        if (url.includes("#!")) {
            // Payload available.
            payload = url.split("#!")[1];
            _payload = payload;
            console.log("Payload => ", payload);
        } else {
            // No payload provided.
            payload = false;
        }

        return payload;
    }

    // Check for payload
    if (getURLParamters()) {
        $.ajax({
            url: APIRoot + "find",
            method: "POST",
            dataType: "json",
            data: { shortLink: _payload }
        }).done((msg) => {
            console.log(msg);
            if(!msg.error){
                window.location = msg.message.oLink;
            }

            if(msg.error){
                console.log(msg.shortened);
                if(msg.shortened && msg.link){
                    UserInput.val(msg.shortened);
                }else{
                    UserInput.val(msg.message);
                }
            }
        });
    }

    var TotalLinks = () => {
        $.ajax({
            url: APIRoot + "count",
            method: "GET"
        }).done((resp) => {
            console.log(resp);
        });
    };

    TotalLinks();

    $("a.funcShorten").on('click', function (event) {
        event.preventDefault();
        if (UserInput.val().length > 0 && isUrl(UserInput.val())) {
            $.ajax({
                url: APIRoot + "create",
                method: "POST",
                dataType: 'json',
                data: { auth: "pms", link: UserInput.val() }
            }).done((msg) => {
                console.log(msg);
                if (!msg.error) {
                    UserInput.val(msg.link.replace("https://", "http://"));
                } else {
                    UserInput.val(msg.shortened | msg.message);
                }
            });
        } else {
            console.log("Very Bad!");
        }
        return false;
    });

    $("a.funcClear").on('click', function (event) {
        event.preventDefault();
        UserInput.val('');
        return false;
    });
});