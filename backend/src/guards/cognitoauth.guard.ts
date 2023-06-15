import * as express from "express";
import { AuthService } from "../services/auth.service";
import AWSStore from "../store/s3.store";

const store = new AWSStore();
const authSvc = new AuthService(store);

const getToken = (req: express.Request): string => {
    if (req.headers.authorization != undefined) {
        return req.headers.authorization.slice(7);
    }

    return "";
}

const CognitoGuards = {
    loggedInGuard: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = getToken(req);
    
        if (token === "") {
            res.sendStatus(401);
            return;
        }
    
        if (await authSvc.verifyToken(token)) return next();
    
        return res.sendStatus(401);
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