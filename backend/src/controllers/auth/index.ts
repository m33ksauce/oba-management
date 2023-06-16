import * as express from "express";
import AWSStore from "../../store/s3.store";
import { AuthService } from "../../services/auth.service";
import { AuthUserDTO, CreateUserDTO } from "../../dto/user.dto";
import { UserService } from "../../services/user.service";
import { LoggerService } from "../../services/logger.service";
import { SqlStore } from "../../store/sql.store";
import CognitoGuards from "../../guards/cognitoauth.guard";

const AuthRouter = express.Router();

const logger = new LoggerService();
const store = new AWSStore();
const sqlStore = new SqlStore();
const userSvc = new UserService(logger, sqlStore);
const authSvc = new AuthService(store, userSvc);


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

AuthRouter.get('/user_info', CognitoGuards.loggedInGuard, async (req: express.Request, res: express.Response) => {
    try {
        const userEmail = res.locals.email;
        if (userEmail == undefined || userEmail === "") {
            res.status(401);
            return res.send({status: "failure", reason: "failed to get email"});
        }

        const result = await userSvc.find(userEmail);
        return res.send({status: "success", "result": result});
    } catch (e) {
        res.status(500);
        return res.send({status: "failure", reason: e});
    }
});

export default AuthRouter;
