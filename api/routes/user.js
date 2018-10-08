const express = require("express"); // like import to a variable
const router = express.Router();

const UserController = require('../controllers/user');
const UserProfile = require('../controllers/profile');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

// show developers-details and logs
router.get("/details",checkAuth, UserProfile.showDeveloperDetails);
router.get("/devloperlist",checkAuth, UserProfile.showDevelopers);
router.post("/showlogs",checkAuth, UserProfile.showLogs);
router.get("/showdevices",checkAuth, UserProfile.showDevices);

//To test stubs:
router.post("/addMessage", UserProfile.addMessage);

router.put("/profile/edit",checkAuth,UserProfile.editProfile);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
