import * as express from "express";
import AudioService from "../../../services/audio.service";
import { LoggerService } from "../../../services/logger.service";
import S3Store from "../../../store/s3.store";

const AudioController = express.Router();

const store = new S3Store();
const logger = new LoggerService();
const audioSvc = new AudioService(store, logger);

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

// AudioController
//     .post("/single", fileWrapper, (req: express.Request, res: express.Response) => 
//     {
//         console.log(req.body)
//         if (req.files != undefined) {
//             //@ts-ignore
//             var file: Express.Multer.File = req.files[0];
//             //@ts-ignore
//             var buffer: Buffer = Buffer.from(file.buffer[0] as ArrayBuffer)

//             var fileId = `${uuidv4()}`

//             audioSvc
//                 .create(fileId, buffer)
//                 .then(() => res.sendStatus(200))
//                 .catch((reason) => res.status(500).send(reason));
//         }
//         else {
//             res.sendStatus(400);
//         }
//     });

export default AudioController;
