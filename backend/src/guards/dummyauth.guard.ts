import * as express from "express";

const DummyAuthGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers.authorization === "Bearer th1s1sn0t0ken") {
        return next();
    }
    return res.sendStatus(401);
}

export default DummyAuthGuard;