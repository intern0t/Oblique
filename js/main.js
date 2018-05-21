$(document).ready(function () {
    const UserInput = $(".userInput");

    function isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }

    $("a.funcShorten").on('click', function (event) {
        event.preventDefault();
        if (UserInput.val().length > 0 && isUrl(UserInput.val())) {
            $.ajax({
                url: "http://obliquebackend.openode.io/create",
                method: "POST",
                dataType: 'json',
                data: { auth: "pms", link: UserInput.val() }
            }).done(function (msg) {
                console.log(msg);
                if(msg.error !== "false"){
                    UserInput.val(msg.link.replace("https://", "http://"));
                }else{
                    UserInput.val("Error..");
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