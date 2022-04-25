import * as express from "express";
import ReleaseService from "../../../services/release.service";


const AudioController = express.Router();

const releaseSvc = new ReleaseService();

AudioController.get("/", (req: express.Request, res: express.Response) => {
    res.json(releaseSvc.findAll());
})

AudioController.get("/:id", (req: express.Request, res: express.Response) => {
    var version = req.params.id;

    releaseSvc.findOne(version).then(release => {
        res.json(release);
    });
});

AudioController.post("/", (req: express.Request, res: express.Response) => {
    var dto = req.body;
    releaseSvc.insert(dto);
    res.json({Status: "success"});
})

AudioController.put("/", (req: express.Request, res: express.Response) => {
    var dto = req.body;
    releaseSvc.update(dto);
    res.json({Status: "success"});
})

export default AudioController;