import * as express from "express";

import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.get("/login", authController.login);

router.get("/callback", authController.callback);

router.get("/refresh", authController.refreshToken);

export { router };
