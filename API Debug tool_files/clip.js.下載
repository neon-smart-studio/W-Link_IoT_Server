function getHTML(command) {
    if (window.XMLHttpRequest) {
        var http = new XMLHttpRequest();
        http.open(command, document.commandform.commandurl.value, true);
        http.onreadystatechange = function() {
            if(http.readyState == 4) {
                if(http.status==200) {
                    document.commandform.response.value="Bad JSON: "+http.responseText;
                    document.commandform.response.value=JSON.stringify(JSON.parse(http.responseText), null, '\t');
                } else {
                    document.commandform.response.value="Error "+http.status;
                }
            }
        }
        http.send(document.commandform.messagebody.value);
    }
    return false;
}

function main() {
    var btnGrp = document.querySelectorAll("button");
    Array.from(btnGrp).forEach(function(btn) {
        document.getElementById(btn.id).addEventListener("click", function () {
            getHTML(btn.value);
        });
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});