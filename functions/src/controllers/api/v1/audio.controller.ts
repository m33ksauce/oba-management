import * as express from "express";
import AudioService from "../../../services/audio.service";
import * as multer from "multer";


const AudioController = express.Router();

const audioSvc = new AudioService();

AudioController.get("/:id", (req: express.Request, res: express.Response) => {
    const fileId = req.params.id;

    audioSvc.findOne(fileId).then((file) => {
        res.type("mp3");
        res.send(file);
    }).catch((err) => {
        res.status(500);
        res.json({Error: err});
    });
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

AudioController.use(upload.any())

AudioController.post("/single", upload.single('audio'), (req: express.Request, res: express.Response) => {
    console.log(req.file);
    res.sendStatus(200);
});

export default AudioController;
