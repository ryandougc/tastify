import { query } from "express-validator";

export const validateQueryString = [
    query("userid", "You must input a userid").trim().escape().notEmpty(),
];
