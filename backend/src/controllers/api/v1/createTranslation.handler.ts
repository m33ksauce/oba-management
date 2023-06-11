import * as express from "express";
import { LoggerService } from "../../../services/logger.service";
import { TranslationService } from "../../../services/translation.service";
import { SqlStore } from "../../../store/sql.store";
import { CreateTranslationInfoDTO } from "../../../dto/translation.dto";

const logger = new LoggerService();
const sqlStore = new SqlStore();
const translationService = new TranslationService(logger, sqlStore);

async function CreateTranslationHandler(req: express.Request, res: express.Response) {
    const translation = res.locals.translation;

    const dto: CreateTranslationInfoDTO = req.body;

    try {
        let result = await translationService.create(translation, dto);
        return res.json(result);
    } catch (e: any) {
        res.statusCode = e;
        if (e == 400) return res.json({status: "failure", msg: "language name already exists"});
        return res.json({status: "failure", msg: "server error"});
    }
}

export default CreateTranslationHandler;