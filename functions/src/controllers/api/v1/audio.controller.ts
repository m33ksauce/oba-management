import * as express from "express";
import AudioService from "../../../services/audio.service";
import { fileWrapper } from "./fileWrapper";

const AudioController = express.Router();

const audioSvc = new AudioService();

AudioController.get("/:id", (req: express.Request, res: express.Response) => {
    const fileId = req.params.id;

    audioSvc.findOne(fileId).then((file) => {
        res.type("mp3");
        res.send(file);
    }).catch((err) => {
        res.status(500);
        res.json({ Error: err });
    });
});

AudioController.post("/single", fileWrapper, (req: express.Request, res: express.Response) => {
    console.log(req.body)
    if (req.files != undefined)
    {
        //@ts-ignore
        var file: Express.Multer.File = req.files[0];
        //@ts-ignore
        var buffer: Buffer = Buffer.from(file.buffer[0] as ArrayBuffer)
        
        audioSvc.create(file.filename, file.mimetype, buffer);
    }
    else {
        res.sendStatus(400);
    }
});

export default AudioController;
