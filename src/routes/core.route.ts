import * as express from "express";

import { extractAccessTokenFromHeader } from "../middleware/extractAccessTokenFromHeader";
import { checkTokenIsValid } from "../middleware/checkAccessTokenValid";

import * as coreController from "../controllers/core.controller";

const router = express.Router();

router.post('/user', coreController.createProfile)

router.get("/user/:profileId", extractAccessTokenFromHeader, checkTokenIsValid,  coreController.getUserProfile);

router.put("/user/:profileId", extractAccessTokenFromHeader, checkTokenIsValid, coreController.updateUserProfile);

router.delete("/user/:profileId", extractAccessTokenFromHeader, checkTokenIsValid, coreController.deleteUserProfile);

router.get("/user/:profileId/analysis", extractAccessTokenFromHeader, checkTokenIsValid, coreController.generateAnalysis);

router.get("/user/:profileId/top50", extractAccessTokenFromHeader, checkTokenIsValid, coreController.getUsersTop50);

router.get("/user/:profileId/friends", extractAccessTokenFromHeader, checkTokenIsValid, coreController.getUsersFriends);

router.post("/comparison", extractAccessTokenFromHeader, checkTokenIsValid, coreController.createComparison);

router.get("/comparison/:user1.:user2", extractAccessTokenFromHeader, checkTokenIsValid, coreController.getComparison);

router.delete("/comparison/:user1.:user2", extractAccessTokenFromHeader, checkTokenIsValid, coreController.deleteComparison);

export { router };
