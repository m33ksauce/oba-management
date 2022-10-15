import * as express from "express";
import ReleaseService from "../../../services/release.service";
import S3Store from "../../../store/s3.store";


const releaseController = express.Router();

const store = new S3Store();

const releaseSvc = new ReleaseService(store);

releaseController.get("/", (req: express.Request, res: express.Response) => {
    releaseSvc.findAll()
        .then(data => res.json(data))
        .catch(() => res.sendStatus(500))
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
    releaseSvc.update("latest", dto);
    res.json({Status: "success"});
});

releaseController.put("/:id", async (req: express.Request, res: express.Response) => {
    const version = req.params.id;
    const dto = req.body;
    await releaseSvc.update(version, dto);
    res.json({Status: "success"});
});

releaseController.delete("/:id", async (req: express.Request, res: express.Response) => {
    const version = req.params.id;
    releaseSvc.delete(version);
    res.status(200);
})

export default releaseController;
