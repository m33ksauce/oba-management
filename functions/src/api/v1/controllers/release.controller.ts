import * as express from "express";
import ReleaseService from "../services/release.service";


const ReleaseController = express.Router();

const releaseSvc = new ReleaseService();

ReleaseController.get("/", (req: express.Request, res: express.Response) => {
    res.json(releaseSvc.findAll());
})

ReleaseController.get("/:id", (req: express.Request, res: express.Response) => {
    var version = req.params.id;

    releaseSvc.findOne(version).then(release => {
        res.json(release);
    });
});

ReleaseController.post("/", (req: express.Request, res: express.Response) => {
    var dto = req.body;
    releaseSvc.insert(dto);
    res.json({Status: "success"});
})

ReleaseController.put("/", (req: express.Request, res: express.Response) => {
    var dto = req.body;
    releaseSvc.update(dto);
    res.json({Status: "success"});
})

export default ReleaseController;