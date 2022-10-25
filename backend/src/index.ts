const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
import ApiV1Router from "./controllers/api/v1";
import HealthRouter from "./controllers/health";
import * as dotenv from 'dotenv'

dotenv.config();


const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: true}));
app.use(morgan('combined'));

app.use("/health", HealthRouter);
app.use("/api/v1", ApiV1Router);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});
