const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
import ApiV1Router from "./controllers/api/v1";
import HealthRouter from "./controllers/health";
import * as dotenv from 'dotenv'
import { LoggerService, RequestLogger } from "./services/logger.service";
import AuthRouter from "./controllers/auth";

dotenv.config();

const PORT = process.env.PORT;
const logger = new LoggerService();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: true}));

// Morgan Logger
app.use(morgan(RequestLogger.JSONFormatter));

app.use("/health", HealthRouter);
app.use("/api/v1", ApiV1Router);
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
    logger.Info(`Starting app on port ${PORT}`);
});
