import * as express from "express";
import AudioService from "../../../services/audio.service";
import { LoggerService } from "../../../services/logger.service";
import AWSStore from "../../../store/s3.store";
import multer from "multer";
import { NIL as uuidNIL } from 'uuid';
import { SqlStore } from "../../../store/sql.store";
const crypto = require('crypto');
const cors = require("cors");

const AudioController = express.Router();

const store = new AWSStore();
const logger = new LoggerService();
const sqlStore = new SqlStore();
const audioSvc = new AudioService(store, logger, sqlStore);

const corsConfig = process.env.ENV == "prod"
    ? {origin: "https://projects.oralbible.app"}
    : {origin: true}


AudioController.get("/:id", cors({origin: "*"}), (req: express.Request, res: express.Response) => {
    const translation = res.locals.translation;
    const fileId = req.params.id;
    audioSvc.findOne(translation, fileId).then((file) => {
        res.type("mp3");
        res.send(file);
    }).catch((err) => {
        res.status(500);
        res.json({ Error: err });
    });
});

AudioController
    .post("/single", cors(corsConfig), multer({storage: multer.memoryStorage()}).single("file"),
    (req: express.Request, res: express.Response) => 
    {
        const translation = res.locals.translation;
        if (req.file != undefined) {
            //@ts-ignore
            var file: Express.Multer.File = req.file;
            //@ts-ignore
            var buffer: Buffer = Buffer.from(file.buffer as ArrayBuffer)

            var fileId = crypto.createHash('md5').update(buffer).digest('hex')

            var parentId = req.body.parent_id != undefined
                ? req.body.parent_id.toString()
                : uuidNIL;

            var fileName = req.body.name;

            audioSvc
                .create(translation, fileId, fileName, parentId, buffer)
                .then((result) => res.send(result))
                .catch((reason) => res.status(500).send(reason));
        }
        else {
            res.sendStatus(400);
        }
    });

AudioController
    .put("/:id", cors(corsConfig),
    (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;

        if (req.params.id == undefined) res.sendStatus(400);
        
        audioSvc
            .update(translation,
                req.params.id,
                req.body.name,
                req.body.parent_id)
            .then(result => res.send(result))
            .catch(reason => res.status(500).send(reason));
    })

export default AudioController;
