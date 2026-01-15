import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getHomeFeed } from "../controllers/feed.controller.js";


const router = express.Router();


router.route("/").get(verifyJWT,getHomeFeed);

export default router;
