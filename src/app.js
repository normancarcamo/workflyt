import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { middlewares } from '@playscode/fns';
import routes from "./routes";
import express from "express";

const app = express();

// Apply settings:
app.set("x-powered-by", false);

// Install "npm install standard" for better readabillity!

// Register middlewares:
app.use([ bodyParser.json(), bodyParser.urlencoded({ extended: true }) ]);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(compression());
app.use(middlewares.logger);
app.use("/api/v1", routes);
app.use(middlewares.notFound);
app.use(middlewares.errors);

// Export the app instance:
export default app;
