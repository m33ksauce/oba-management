import * as express from "express";
import AudioService from "../../../services/audio.service";


const AudioController = express.Router();

const audioSvc = new AudioService();

AudioController.get("/:id", (req: express.Request, res: express.Response) => {
    var fileId = req.params.id;
    console.log(fileId)

    audioSvc.findOne(fileId).then(file => {
        res.type('mp3');
        res.send(file);
    }).catch((err) => {
        res.status(500);
        res.json({Error: err})
    });
});

AudioController.post("/", (req: express.Request, res: express.Response) => {
    var dto = req.body;
    audioSvc.insert(dto);
    res.json({Status: "success"});
});

export default AudioController;