import * as express from "express";
import { LoggerService } from "../../../services/logger.service";
import { TranslationService } from "../../../services/translation.service";
import { SqlStore } from "../../../store/sql.store";
import { CreateTranslationInfoDTO } from "../../../dto/translation.dto";
import { UserService } from "../../../services/user.service";

const logger = new LoggerService();
const sqlStore = new SqlStore();
const userService = new UserService(logger, sqlStore);
const translationService = new TranslationService(logger, sqlStore);

async function CreateTranslationHandler(req: express.Request, res: express.Response) {
    const translation = res.locals.translation;

    const dto: CreateTranslationInfoDTO = req.body;

    try {
        let result = await translationService.create(translation, dto);
        await userService.grantTranslationAccess(result.id, res.locals.email);
        return res.json(result);
    } catch (e: any) {
        res.statusCode = e;
        if (e == 400) return res.json({status: "failure", msg: "language name already exists"});
        logger.Error("exception", e.message);
        return res.json({status: "failure", msg: "server error"});
    }
}

export default CreateTranslationHandler;