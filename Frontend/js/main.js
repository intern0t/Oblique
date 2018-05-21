$(document).ready(function () {
    const UserInput = $(".userInput");

    // https://stackoverflow.com/a/5717133
    function ValidURL(str) {
        var pattern = new RegExp('^(https?:\/\/)?' + // protocol
            '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
            '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
            '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
            '(\?[;&a-z\d%_.~+=-]*)?' + // query string
            '(\#[-a-z\d_]*)?$', 'i'); // fragment locater
        if (!pattern.test(str)) {
            // alert("Please enter a valid URL.");
            return false;
        } else {
            return true;
        }
    }

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