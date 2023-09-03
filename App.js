let express = require("express");
let server = express();
let routes = require("./routes");

server.use(express.urlencoded());
server.use(express.json());


server.use('/public', express.static('public'));
server.set('view engine', 'pug');
server.set("views", `./views`);

server.use("/", routes);
server.listen(3000, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", 3000);
});