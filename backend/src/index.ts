const express = require("express");
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

app.use("/api/v1", apiRouter);

// export const handler = functions.https.onRequest(app);
app.listen(8080, () => {
    console.log(`Example app listening on port ${8080}`)
  })
