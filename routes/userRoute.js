const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/profile",authMiddleware,userController.profile);

router.get("/test",(req,res) => {
    return res.status(200).json({status:true, message:"testing api"});
});

module.exports = router;