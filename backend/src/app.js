import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
dotenv.config();
import path from "path"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import feedRouter from "./routes/feed.routes.js"
import commentRouter from"./routes/comment.routes.js"
import likeRouter from"./routes/like.routes.js"
import notificationRouter from"./routes/notification.routes.js"
import messageRouter from"./routes/message.routes.js"
import reelRouter from"./routes/reel.routes.js"
import storyRouter from"./routes/story.routes.js"


const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.resolve("./public")));

//Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/feed", feedRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/reel", reelRouter);
app.use("/api/v1/story", storyRouter);



export {app}
