let express = require("express");
let router = express.Router();


const {json} = require("express");

router.get("/", (req, res) => {
    res.render("index");
});
router.get("/main", (req, res) => {
    res.render("main");
});
router.get("/scores", (req, res) => {
    res.render("scores");
});
router.get("/loss", (req, res) => {
    res.render("loss");
});

module.exports = router;