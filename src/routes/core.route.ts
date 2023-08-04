import * as express from "express";

import { checkErrors } from "../validators/checkErrors";
import { validateHeaderAccessToken } from "../validators/validator";

import { extractAccessTokenFromHeader } from "../middleware/extractAccessTokenFromHeader";
import { getUserProfileFromAccessToken } from "../middleware/getUserProfileFromAccessToken";
import { setupAxiosDefaults } from "../middleware/setupAxiosDefaults";

import * as coreController from "../controllers/core.controller";

const router = express.Router();

router.get("/user", validateHeaderAccessToken, checkErrors, extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getUserProfile);

router.delete("/user", validateHeaderAccessToken, checkErrors, extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.deleteUserProfile);

router.get("/user/analysis", validateHeaderAccessToken, checkErrors, extractAccessTokenFromHeader, getUserProfileFromAccessToken, setupAxiosDefaults, coreController.generateAnalysis);

router.get("/user/top50", validateHeaderAccessToken, checkErrors, extractAccessTokenFromHeader, getUserProfileFromAccessToken, setupAxiosDefaults, coreController.getUsersTop50);

router.get("/user/friends", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getUsersFriends);

router.post("/comparison", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.createComparison);

router.get("/comparison/:friendsSpotifyUsername", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.getComparison);

router.delete("/comparison/:friendsSpotifyUsername", extractAccessTokenFromHeader, getUserProfileFromAccessToken, coreController.deleteComparison);

export { router };
