import * as express from "express";
import { AuthService } from "../services/auth.service";
import AWSStore from "../store/s3.store";
import { SqlStore } from "../store/sql.store";
import { UserService } from "../services/user.service";
import { LoggerService } from "../services/logger.service";

const logger = new LoggerService();
const store = new AWSStore();
const sqlStore = new SqlStore();
const userSvc = new UserService(logger, sqlStore);
const authSvc = new AuthService(store, userSvc);

const getToken = (req: express.Request): string => {
    if (req.headers.authorization != undefined) {
        return req.headers.authorization.slice(7);
    }

    return "";
}

const CognitoGuards = {
    loggedInGuard: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const token = getToken(req);
        
            if (token === "") {
                res.sendStatus(401);
                return;
            }
        
            if (await authSvc.verifyToken(token)) {
                res.locals.email = authSvc.getEmailFromToken(token);
                console.log(res.locals.email);
                return next();
            }
        
            return res.sendStatus(401);
        } catch (e) {
            res.status(401);
            return res.send();
        }
    },
    canUseTranslationGuard: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = getToken(req);
    
        if (token === "") {
            res.sendStatus(401);
            return;
        }
    
        if (!(await authSvc.verifyToken(token))) {
            res.sendStatus(401);
            return;
        }
    
        
    }
}

export default CognitoGuards;