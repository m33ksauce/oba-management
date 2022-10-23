const express = require("express");
import * as expressLib from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
import apiRouter from "./controllers/api/v1";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: true}));

app.get("/health", (req: expressLib.Request, res: expressLib.Response) => {
  res.sendStatus(200);
});
app.use("/api/v1", apiRouter);

// export const handler = functions.https.onRequest(app);
app.listen(80, () => {
    console.log(`Example app listening on port ${80}`)
});
