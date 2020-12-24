const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.get("/refresh_token", userCtrl.refreshTokenFunc);

router.get("/info", auth, userCtrl.getUser);

router.get("/history", auth, userCtrl.history);

router.patch("/add_cart", auth, userCtrl.addCart);

module.exports = router;
