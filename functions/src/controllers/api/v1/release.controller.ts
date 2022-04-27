import * as express from "express";
import ReleaseService from "../../../services/release.service";


const releaseController = express.Router();

const releaseSvc = new ReleaseService();

releaseController.get("/", (req: express.Request, res: express.Response) => {
    res.json(releaseSvc.findAll());
});

releaseController.get("/:id", (req: express.Request, res: express.Response) => {
    const version = req.params.id;

    releaseSvc.findOne(version).then((release) => {
        res.json(release);
    });
});

releaseController.post("/", (req: express.Request, res: express.Response) => {
    const dto = req.body;
    releaseSvc.insert(dto);
    res.json({Status: "success"});
});

releaseController.put("/", (req: express.Request, res: express.Response) => {
    const dto = req.body;
    releaseSvc.update(dto);
    res.json({Status: "success"});
});

export default releaseController;
