const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController.js");
const postController = require("./controllers/postController.js");
const followController = require("./controllers/followController.js");

//user routes
router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/doesUsernameExist", userController.doesUsernameExist);
router.post("/doesEmailExist", userController.doesEmailExist);

//profile routes
router.get(
  "/profile/:username",
  userController.ifUserExits, userController.sharedProfileData, 
  userController.profilePostsScreen
);
router.get(
  "/profile/:username/followers",
  userController.ifUserExits, userController.sharedProfileData, 
  userController.profileFollowersScreen
);
router.get(
  "/profile/:username/following",
  userController.ifUserExits, userController.sharedProfileData, 
  userController.profileFollowingScreen
);

//post routes
router.get(
  "/create-post",
  userController.mustBeloggedIn,
  postController.viewCreateScreen
);
router.post(
  "/create-post",
  userController.mustBeloggedIn,
  postController.create
);
router.get("/post/:id", postController.viewSingle);
router.get("/post/:id/edit", userController.mustBeloggedIn, postController.viewEditScreen);
router.post("/post/:id/edit", userController.mustBeloggedIn, postController.edit);
router.post("/post/:id/delete", userController.mustBeloggedIn, postController.delete);
router.post("/search", postController.search)

//follow routes
router.post("/addFollow/:username", userController.mustBeloggedIn, followController.addFollow);
router.post("/removeFollow/:username", userController.mustBeloggedIn, followController.removeFollow);



router.get("/about", function (req, res) {
  res.send("this is our about page");
});

module.exports = router;
