$('body').onload = function () {
    $('.top_nav .nav_icon.home').onclick = function () {
        window.location.assign("/lifelog/home/");
    }
    $('.top_nav .nav_icon.trash').onclick = function () {
        window.location.assign("/lifelog/trash/");
    }
    $('.top_nav .nav_icon.profile').onclick = function () {
        window.location.assign("/lifelog/profile-settings/");
    }
    $('.top_nav .nav_icon.signout').onclick = function () {
        window.location.assign("/lifelog/signout/");
    }
    $("#modal").onclick = function () {
        this.style.display = "none";
    }
    $(".box").onclick = function (event) {
        event.stopImmediatePropagation();
    }
    $forms("verify").onsubmit = function (event) {
        event.preventDefault();
        user_action_ajax();
    }
    $("#clear_tra").onclick = function () {
        verify("clear");
    }
    $("#del_acc").onclick = function () {
        verify("delete");
    }
    if ($('body').contains($("#welcome"))) {
        setTimeout(function () {
            $('#welcome').parentNode.removeChild($('#welcome'));
        }, 2500);
        setTimeout(function () {
            $('#welcome').classList.add('welcome_close');
        }, 2000);
    }
}
function verify(action) {
    var messages = { "delete": "This will delete your lifelog account permanently.", "clear": "This will delete all events in your trash." }
    $forms("verify", "action").value = action;
    $forms("verify", "password").value = "";
    $("#message").innerHTML = messages[action] + "<br/>This action cannot be undone!";
    $("#modal").style.display = "flex";
}

function user_action_ajax() {
    var action = $forms("verify", "action").value;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            $("#clear_tra").style.display = "block";
            $("#del_acc").style.display = "block";
            $("#wait").style.display = "none";

            if (this.status == 200) {
                response = JSON.parse(this.responseText);
                if (action == "delete" && response.success === true) {
                    window.location.replace("/lifelog/signin/");
                }
                msg_box_view(response.message);
            } else {
                msg_box_view('Sorry, an error occurred.');
            }
        }
    }
    $("#clear_tra").style.display = "none";
    $("#del_acc").style.display = "none";
    $("#wait").style.display = "block";

    xmlhttp.onerror = function () {
        msg_box_view('Failed to connect to the internet.');
    }

    var form_s = $forms('verify');
    var data = new FormData(form_s);
    xmlhttp.open("POST", "/lifelog/ajax/extra/", true);
    xmlhttp.send(data);
}
function msg_box_view(message) {
    if ($('body').contains($('div.msg_box'))) {
        clearTimeout(del_msg_box);
        $('div.msg_box p.text1').innerHTML = message;
        del_msg_box = setTimeout(function () {
            if ($('body').contains($('div.msg_box'))) {
                $('div.msg_box').parentNode.removeChild($('div.msg_box'));
            }
        }, 1000000)
        return;
    }
    var msg_box = document.createElement("div");
    var _class = document.createAttribute("class");
    _class.value = "msg_box";
    msg_box.attributes.setNamedItem(_class);
    var close = document.createElement("span");
    var _class = document.createAttribute("class");
    _class.value = 'close1';
    close.attributes.setNamedItem(_class);
    var click_fun = document.createAttribute("onclick");
    click_fun.value = "$('div.msg_box').parentNode.removeChild($('div.msg_box'));";
    close.attributes.setNamedItem(click_fun);
    var title = document.createAttribute("title");
    title.value = "Close.";
    close.attributes.setNamedItem(title);
    close.innerHTML = '&times;';
    msg_box.appendChild(close);
    document.body.insertBefore(msg_box, document.body.childNodes[0]);

    var text1 = document.createElement("p");
    var _class = document.createAttribute("class");
    _class.value = "text1";
    text1.attributes.setNamedItem(_class);
    var text = document.createTextNode(message);
    text1.appendChild(text);
    msg_box.appendChild(text1);
    del_msg_box = setTimeout(function () {
        if ($('body').contains($('div.msg_box'))) {
            $('div.msg_box').parentNode.removeChild($('div.msg_box'));
        }
    }, 1000000)
}
