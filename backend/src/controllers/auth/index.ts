import * as express from "express";

const AuthRouter = express.Router();

AuthRouter.post('/register', (req: express.Request, res: express.Response) => {
    res.sendStatus(200);
});

AuthRouter.post('/login', (req: express.Request, res: express.Response) => {
    res.sendStatus(200);
});

export default AuthRouter;
