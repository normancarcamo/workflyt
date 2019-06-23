import express from "express";
import cookieParser from "cookie-parser";
// import cors from "cors";
import compression from "compression";
import { middlewares } from '@playscode/fns';
import router from "src/router";

const app = express();

// Apply settings:
app.set("x-powered-by", false);

// Install "npm install standard" for better readabillity!
// npm install jsonwebtoken --save
// npm install repeatlimit --save

// Register middlewares:
app.use([ express.json(), express.urlencoded({ extended: true }) ]);
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(compression());
app.use(middlewares.logger);
app.use("/api/v1", router);
app.use(middlewares.notFound);
app.use(middlewares.errors);

// Export the app instance:
export default app;
