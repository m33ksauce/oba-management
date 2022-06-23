import {RequestHandler} from "express";
import * as Busboy from "busboy";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toArray = require("stream-to-array");

export const fileWrapper: RequestHandler = (req, res, next) => {
    // eslint-disable-next-line new-cap
    const busboy = Busboy({
        headers: req.headers,
        limits: {
            // Cloud functions impose this restriction anyway
            fileSize: 10 * 1024 * 1024,
        },
    });

    const fields: Record<string, any> = {};
    const files: Express.Multer.File[] = [];
    const fileWrites: Array<Promise<any>> = [];

    busboy.on("field", (name, val) => {
        fields[name] = val;
    });

    busboy.on("file", (fieldname, file, md) => {
        fileWrites.push(
            toArray(file)
                .then((buff: Buffer) => {
                    files.push({
                        fieldname: fieldname,
                        originalname: md.filename,
                        filename: md.filename,
                        mimetype: md.mimeType,
                        encoding: md.encoding,
                        buffer: buff,
                        size: buff.byteLength,
                        stream: file,
                        destination: "",
                        path: "",
                    });
                })
        );
    });

    busboy.on("finish", async () => {
        await Promise.all(fileWrites)
            .then(() => {
                req.body = fields;
                req.files = files;
                next();
            })
            .catch(next);
    });

    busboy.end(req.body);
};
