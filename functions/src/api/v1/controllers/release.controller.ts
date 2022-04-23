import * as express from "express";
import ReleaseService from "../services/release.service";


const ReleaseController = express.Router();

const releaseSvc = new ReleaseService();

ReleaseController.get("/", (req: express.Request, res: express.Response) => {
    var version = req.query.version as string;

    releaseSvc.findOne(version).then(release => {
        res.json(release);
    });
})

export default ReleaseController;