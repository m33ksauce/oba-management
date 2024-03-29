import { AuthUserDTO, CreateUserDTO, UserTokenDTO } from "../dto/user.dto";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import AWSStore from "../store/s3.store";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { CognitoJwtVerifier } from "aws-jwt-verify";



export class AuthService {
    public userPool: CognitoUserPool;

    constructor(aws: AWSStore) {
        this.userPool = aws.getCognitoPool();
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
                console.log(result);
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
            const verifier = CognitoJwtVerifier.create({
                userPoolId: this.userPool.getUserPoolId(),
                tokenUse: "id",
                clientId: this.userPool.getClientId(),
            });

            verifier.verify(token).then((result) => {
                console.log(result);
                resolve(true);
            }).catch(reject);
        });
    }

}