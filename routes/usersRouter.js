const { Router } = require("express");
const usersController = require("../controllers/usersControllers");
const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.get("/membership", usersController.getMembership);
usersRouter.post("/membership", usersController.postMembership);
usersRouter.get("/home", usersController.getHome);
usersRouter.get("/new-post", usersController.getNewPost);
usersRouter.post("/new-post", usersController.postNewPost);
usersRouter.get("/admin", usersController.getAdmin);
usersRouter.post("/admin", usersController.postAdmin);

module.exports = usersRouter;