import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import apiRouter from "./controllers/api/v1";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: true}));

app.use("/api/v1", apiRouter);

export const handler = functions.https.onRequest(app);
