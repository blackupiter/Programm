
document.querySelector("#dobav").onclick = function(){
    document.querySelector(".two").style.display = 'flex';
    document.querySelector(".one").style.display = 'none';
};

window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('.phone'), function(input) {
    var keyCode;
    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});

function pointInput(input) {
    if(input) {
        input.style.border = "1px solid #ED4245";
    }
}

function get(input) {
   return document.getElementById(input);
}

function val(input) {
    return input.value;
}

function out(data){
    document.getElementById("contacts").innerHTML = "";

    let arr = [];
    let count = 0;

    if (data) {
        for (let i = 0; i < contacts.length; i++){            

            if(contacts[i][0].toLowerCase().search(data.toLowerCase()) != -1) {
                arr[count] = contacts[i];
                count++;
            }
        }

        if (!arr.length) {
            document.getElementById("contacts").innerHTML = "<span class='empty'>Результат не найден</span>";
        }
    }else {
        for (let i = 0; i < contacts.length; i++){
            arr[i] = contacts[i];
        }
    }

    arr.sort(
        function(a, b) {
          if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
          if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
          return 0;
        }
    );


    for (let i = 0; i < arr.length; i++){
        for (let j = 0; j < arr.length-1; j++){
            if (arr[j][2] < arr[j + 1][2]) {
                let q = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = q;
            }
        }
    }

    for (let i = 0; i < arr.length; i++){

        if(arr[i][2] > 0) {
            icon = 'fa-heart';
        }else {
            icon = 'fa-heart-o';
        }

        document.getElementById("contacts").innerHTML += `
        <div class="contact" id="${arr[i][1]}">
            <span class="avatar"></span>
            <div class="text">
                <h4>${arr[i][0]}</h4>
                <p>${arr[i][1]}</p>
            </div>
            <i class='fa fa-times fa-btn' aria-hidden='true' onclick="del('${arr[i][1]}')"></i>
            <i class="fa ${icon} fa-btn" aria-hidden="true" onclick="like('${arr[i][1]}')"></i>
        </div>`;
    }
}

function check(kategor) {

    get(kategor).style.border = "none";

    let inputValue = val(get(kategor));

    if(kategor == "name") {

        if(!inputValue ) {
            pointInput(get(kategor));
            return  true;
        }
        if (inputValue.length <= 2) {
            pointInput(get(kategor));
            return true;
        }
        if (inputValue.length >= 20) {
            pointInput(get(kategor));
            return true;
        }   

        if(!/^[A-ZА-ЯЁ]+$/i.test(inputValue )) {
            pointInput(get(kategor));
            return true;
        }  

        return false;

    }else if(kategor == "tel") {

        if(!inputValue ) {
            pointInput(get(kategor));
            return true;
        }

        if (inputValue.length < 17) {
            pointInput(get(kategor));
            return true;
        }

        for(let i = 0; contacts.length > i; i++) {
            if(contacts[i][1] == inputValue ){
                pointInput(get(kategor));
                return true;
            }
        } 

        return false;

    }else if(kategor == "search") {
        if (contacts.length) {
            if(!inputValue) {
                out();
                return false
            }
            if (inputValue.length >= 15) {
                pointInput(get(kategor));
                return true;
            }
            if (!/^[A-ZА-ЯЁ]+$/i.test(inputValue)) {
                pointInput(get(kategor));
                return true;
            }
        }

        return false;
    }else {
        alert('error check() - (kategor)');
        return true;
    }
}


let contacts = [];

document.querySelector("#sozd").onclick = function(){
    let checkedInput = document.getElementById('favor').checked;

    if(!check('name') && !check('tel')) {

        contacts.push([val(get('name')), val(get('tel')), checkedInput]);
        
        out();

        document.querySelector(".one").style.display = 'flex';
        document.querySelector(".two").style.display = 'none';

        document.getElementById('name').value = '';
        document.getElementById('tel').value = '';

        document.getElementById('favor').checked = false;
    }
};

document.querySelector("#poisk").onclick = function(){
    if(!check('search')) {
        out(val(get('search')));
    }
};


function del(id) {
    for(let i = 0; contacts.length > i; i++) {
        if(contacts[i][1] == id ){
            contacts.splice(i, 1); 
            document.getElementById(id).remove();
        }
    } 
}

function like(id) {

    for(let i = 0; contacts.length > i; i++) {
        if(contacts[i][1] == id ){
            contacts[i][2] = !contacts[i][2];
        }
    } 

    out();
}