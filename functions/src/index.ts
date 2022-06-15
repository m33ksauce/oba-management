import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import apiRouter from "./controllers/api/v1";
import * as multer from "multer";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var storage = multer.memoryStorage();
var upload = multer({storage: storage});
app.use(upload.any());
app.post("/thing", upload.single("check"), (req, res) => {
    console.log(req.file?.mimetype);
    console.log(req.file?.size)
    res.sendStatus(200)
});

app.use("/api/v1", apiRouter);

export const handler = functions.https.onRequest(app);
