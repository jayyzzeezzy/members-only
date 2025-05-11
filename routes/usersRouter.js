const { Router } = require("express");
const usersController = require("../controllers/usersControllers");
const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.post("/sign-up", usersController.postSignUp);
usersRouter.get("/sign-up", usersController.getSignUp);
usersRouter.get("/log-out", usersController.getLogOut);

module.exports = usersRouter;