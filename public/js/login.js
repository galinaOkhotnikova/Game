function store() {
    let username = document.getElementById("username").value;
    localStorage.setItem("cw.username", username);
    console.log(localStorage["cw.username"]);
}

function read() {
    let nameValue = localStorage["cw.username"];
    if (nameValue) {
        let name = document.getElementById("username");
        name.value = nameValue;
    }
}

function nextPage() {
    document.location.href = "/main";
    return false;
}