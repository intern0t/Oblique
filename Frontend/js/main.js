$(document).ready(function(){
    const UserInput = $(".userInput");

    $("a.funcShorten").on('click', function(event){
        event.preventDefault();
        if(UserInput.val().length < 1){
            console.log("Well Shit!");
        }else{
            console.log("Nice");
        }
        return false;
    });

    $("a.funcClear").on('click', function(event){
        event.preventDefault();
        UserInput.val('');
        return false;
    });
});