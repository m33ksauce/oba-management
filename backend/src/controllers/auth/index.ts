import * as express from "express";
import AWSStore from "../../store/s3.store";
import { AuthService } from "../../services/auth.service";
import { AuthUserDTO, CreateUserDTO } from "../../dto/user.dto";

const AuthRouter = express.Router();

const store = new AWSStore();
const authSvc = new AuthService(store);


AuthRouter.post('/register', async (req: express.Request, res: express.Response) => {
    const dto: CreateUserDTO = req.body;
    await authSvc.signUp(dto);
    res.sendStatus(200);
});

AuthRouter.post('/confirmUser', async (req: express.Request, res: express.Response) => {
    const email = req.body["email"]
    const code = req.body["code"]
    
    if (email == undefined || code  == undefined) {
        res.sendStatus(400);
    }

    try {
        await authSvc.confirmUser(email, code);
        res.status(200);
        res.send({status: "success", message: "user created"});
    } catch (e) {
        res.status(500);
        res.send({status: "failure", reason: e})
    }
})

AuthRouter.post('/authenticate', async (req: express.Request, res: express.Response) => {
    const dto: AuthUserDTO = req.body;
    try {
        const result = await authSvc.authenticateUser(dto);
        res.send({status: "success", "result": result});
    } catch (e) {
        res.status(500);
        res.send({status: "failure", reason: e});
    }
});

export default AuthRouter;
