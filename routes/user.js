const express = require("express")
const {handleUserSignUp,handleUserLogin} = require("../controllers/user")
const router = express.Router();

router.get("/login", (req,res) => {
     return res.render("login")
});

router.get("/signup",(req,res) => {
return res.render("signup")
});

router.post("/signup",handleUserSignUp)

router.post("/login",handleUserLogin)

router.get("/logout", (req,res) => {
     res.clearCookie("token").redirect("/")
})


module.exports = router;