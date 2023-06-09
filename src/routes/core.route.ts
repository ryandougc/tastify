import * as express from "express";

import { checkTokenIsValid } from "../middleware/checkAccessTokenValid";

import * as coreController from "../controllers/core.controller";

const router = express.Router();

router.post('/user', coreController.createProfile)

router.get("/user/:profileId", checkTokenIsValid, coreController.getUserProfile);

router.put("/user/:profileId", checkTokenIsValid, coreController.updateUserProfile);

router.delete("/user/:profileId", checkTokenIsValid, coreController.deleteUserProfile);

router.get("/user/:profileId/analysis", checkTokenIsValid, coreController.generateAnalysis);

router.get("/user/:profileId/top50", checkTokenIsValid, coreController.getUsersTop50);

router.get("/user/:profileId/friends", checkTokenIsValid, coreController.getUsersFriends);

router.post("/comparison", checkTokenIsValid, coreController.createComparison);

router.get("/comparison/:user1.:user2", checkTokenIsValid, coreController.getComparison);

router.delete("/comparison/:user1.:user2", checkTokenIsValid, coreController.deleteComparison);

export { router };
