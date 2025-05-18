const { Router } = require("express");
const usersController = require("../controllers/usersControllers");
const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.get("/membership", usersController.getMembership);
usersRouter.post("/membership", usersController.postMembership);

module.exports = usersRouter;