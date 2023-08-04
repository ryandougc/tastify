import { body, param, header } from "express-validator";

export const validateUserDetails = [
    body('spotifyUsername', "Invalid spotifyUsername").trim().escape().notEmpty()
];

export const validateUserIdParameter = [
    param('profileId', "Invalid profileId was inputted").trim().escape().notEmpty()
];

export const validateComparisonDetails = [
    body('user1', "Invalid user1 profileId").trim().escape().notEmpty(),
    body('user2', "Invalid user2 profileId").trim().escape().notEmpty()
];

export const validateTwoUserIdParameters = [
    param('user1', "Invalid user1 profileId").trim().escape().notEmpty(),
    param('user2', "Invalid user2 profileId").trim().escape().notEmpty()
];

export const validateHeaderAccessToken = [
    header('authorization', "A valid acces token must be passed with your request").trim().matches(/^Bearer\s[a-zA-Z0-9_-]{48,256}$/)
]