import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import path from "path";
import bluebird from "bluebird";
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

/**
 * API examples routes.
 */
app.get("/api1", apiController.getApi);

app.get("/info", apiController.getServiceInfo);
app.get("/get_url", apiController.callRequestFromUrl);
app.get("/call-to-b", apiController.callRequestToServiceB);
app.get("/call-to-c", apiController.callRequestToServiceC);


export default app;
