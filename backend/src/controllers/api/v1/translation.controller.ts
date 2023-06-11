import * as express from "express";
import { SqlStore } from "../../../store/sql.store";
import { TranslationService } from "../../../services/translation.service";
import { LoggerService } from "../../../services/logger.service";
import { UpdateTranslationInfoDTO } from "../../../dto/translation.dto";

const TranslationController = express.Router();

const logger = new LoggerService();
const sqlStore = new SqlStore();
const translationService = new TranslationService(logger, sqlStore);

TranslationController.get("/settings", async (req: express.Request, res: express.Response) => {
    const translation = res.locals.translation;

    try {
        let result = await translationService.find(translation);
        return res.json(result);
    } catch (e) {
        res.statusCode = 500;
        return res.json({status: "failure", msg: "server error"});
    }
});

TranslationController.put("/settings", async (req: express.Request, res: express.Response) => {
    const translation = res.locals.translation;

    const dto: UpdateTranslationInfoDTO = req.body;

    try {
        let result = await translationService.update(translation, dto);
        return res.json(result);
    } catch (e) {
        res.statusCode = 500;
        return res.json({status: "failure", msg: "server error"});
    }
});

export default TranslationController;