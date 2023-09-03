function restart() {
    document.location.href = "/";
}

function showData() {
    let table = (JSON.parse(localStorage.getItem("cw.hightscores")));
    if (table) {
        table.sort(function (a, b) {
            return Number(b[1]) - Number(a[1]);
        });

        for (let i = 0; i < table.length; i++) {
            if (i >= 5) {
                return;
            }
            let line = document.getElementById(`line${i}`);
            let el = table[i][1];
            if (el) {
                line.textContent = table[i][0] + " . ".repeat(30 - table[i][0].length) + table[i][1];
            }
        }
    }
}