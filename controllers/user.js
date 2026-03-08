const User = require("../models/user")

async function handleUserSignUp (req,res){
    const {fullName,email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
}

async function handleUserLogin (req,res) {
    const {email, password} = req.body;
    try {
        
     const token =  await User.matchPasswordAndGenerateToken(email, password)
 
     return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("login" ,{error:"Incorrect email or password"})
    }
     
}

module .exports = {
   handleUserSignUp,
   handleUserLogin,
}