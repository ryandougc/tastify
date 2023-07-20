import * as express from "express";

import { extractAccessTokenFromHeader } from "../middleware/extractAccessTokenFromHeader";
import { getUserProfileFromAccessToken } from "../middleware/getUserProfileFromAccessToken";

import * as coreController from "../controllers/core.controller";

const router = express.Router();

router.get("/user", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getUserProfile);

router.delete("/user/:profileId", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.deleteUserProfile);

router.get("/user/analysis", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.generateAnalysis);

router.get("/user/top50", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getUsersTop50);

router.get("/user/friends", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getUsersFriends);

router.post("/comparison", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.createComparison);

router.get("/comparison/:friendsSpotifyUsername", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getComparison);

router.delete("/comparison/:friendsSpotifyUsername", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.deleteComparison);

export { router };
