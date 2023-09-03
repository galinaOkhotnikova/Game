function setData() {
    localStorage.setItem("cw.level", 1);
    localStorage.setItem("cw.score", 0);
    let name = document.getElementById("name");
    let username = localStorage.getItem("cw.username");
    console.log("Имя", localStorage.getItem("cw.username"));
    if (username == null || username === "") {
        document.location.href = "/";
    }
    name.textContent = username;
    
}


function updateData(coins, lv) {
    let score = document.getElementById("score");
    let level = document.getElementById("level");
    console.log("score", coins);
    score.textContent = coins;
    level.textContent = lv;
}

function saveData() {
    console.log("СОХРАНЕНИЕ ДАННЫХ");
    let username = localStorage.getItem("cw.username");
    let highscore = localStorage.getItem("cw.hightscores");
    let table;
    if (highscore) {
        table = JSON.parse(localStorage.getItem("cw.hightscores"));
    }
    else {
        table = [];
    }
    let score = Number(localStorage.getItem("cw.score"));
    for (let i = 0; i < table.length; i++) {
        if (table[i][0] === username) {
            if (table[i][1] === localStorage.getItem("cw.score")) {
                return;
            }
            else if (score >= Number(table[i][1])) {
                table[i][1] = localStorage.getItem("cw.score");
                localStorage.setItem("cw.hightscores", JSON.stringify(table));
                return;
            }
            else if (score < Number(table[i][1])) {
                return;
            }
        }
    }
    let element = [username, score];
    table.push(element);
    console.log(table);
    localStorage.setItem("cw.hightscores", JSON.stringify(table));
}
