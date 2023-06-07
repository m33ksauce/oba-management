import * as express from "express";
import { AuthService } from "../services/auth.service";
import AWSStore from "../store/s3.store";

const store = new AWSStore();
const authSvc = new AuthService(store);

const CognitoAuthGuard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers.authorization == undefined) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.slice(7);

    if (token === "") {
        res.sendStatus(401);
        return;
    }

    console.log(token)

    if (await authSvc.verifyToken(token)) return next();


    return res.sendStatus(401);
}

export default CognitoAuthGuard;