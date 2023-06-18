import { AuthUserDTO, CreateUserDTO, UserTokenDTO } from "../dto/user.dto";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import AWSStore from "../store/s3.store";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { decode as jwtdecode } from 'jsonwebtoken';
import { JwtPayload } from "aws-jwt-verify/jwt-model";
import { UserService } from "./user.service";



export class AuthService {
    private userPool: CognitoUserPool;
    private userService: UserService;

    constructor(aws: AWSStore, userSvc: UserService) {
        this.userPool = aws.getCognitoPool();
        this.userService = userSvc;
    }

    public signUp(user: CreateUserDTO): Promise<void> {
        return new Promise((res, rej) => {
            const attributes: CognitoUserAttribute[] = [];

            const nameAttr = new CognitoUserAttribute({ Name: "name", Value: user.name})
            const emailAttr = new CognitoUserAttribute({ Name: "email", Value: user.email });
            const phoneAttr = new CognitoUserAttribute({ Name: "phone_number", Value: user.phone});
            const zoneAttr = new CognitoUserAttribute({ Name: "zoneinfo", Value: user.zone});
            const localeInfo = new CognitoUserAttribute({ Name: "locale", Value: user.locale});
            
            attributes.push(nameAttr);
            attributes.push(emailAttr);
            attributes.push(phoneAttr);
            attributes.push(zoneAttr);
            attributes.push(localeInfo);
            

            this.userPool.signUp(user.email, user.password, attributes, [], (err, result) => {
                if (err) {
                    rej(err)
                    return
                }
                this.userService.create(user).then((success) => {
                    if (!success) {
                        rej();
                    }
                    
                    return res();

                })
                res()
        })
        })
    }

    public confirmUser(email: string, code: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user: CognitoUser = new CognitoUser({
                Username: email,
                Pool: this.userPool,
            })
    
            user.confirmRegistration(code, true, (err, result) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve()
            })
        });
    }

    public authenticateUser(userDto: AuthUserDTO): Promise<UserTokenDTO> {
        return new Promise((resolve, reject) => {
            const user: CognitoUser = new CognitoUser({
                Username: userDto.email,
                Pool: this.userPool,
            });

            const details: AuthenticationDetails = new AuthenticationDetails({
                Username: userDto.email,
                Password: userDto.password
            });

            user.authenticateUser(details, {
                onSuccess: (result) => {
                    resolve({
                        email: userDto.email,
                        token: result.getIdToken().getJwtToken(),
                    })
                },
                onFailure: (err) => {
                    reject(err);
                }
                })
        })
    }

    public verifyToken(token: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const verifier = CognitoJwtVerifier.create({
                    userPoolId: this.userPool.getUserPoolId(),
                    tokenUse: "id",
                    clientId: this.userPool.getClientId(),
                });

                verifier.verify(token).then(() => {
                    resolve(true);
                }).catch(reject);
            } catch (e) {
                reject(e)
            }
        });
    }

    public getEmailFromToken(token: string): string {
        const decodedToken = jwtdecode(token);

        if (decodedToken == undefined) return "";

        const payload: JwtPayload = decodedToken as JwtPayload;
        console.log(payload);

        return payload.email as string;
    }

}