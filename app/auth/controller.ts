import {Request, Response} from "express";
import {UserRole, UserService} from "../user";
import {
    AppErrorCodes,
    comparePassword,
    decodeToken,
    Exception,
    hashPassword,
    sendSuccessResponse,
    signToken,
} from "../../core";
import {AuthErrors} from "./errors";
import {AuthSignUpInput} from "./interface";
import {firebaseApp} from "../firebase";

export class AuthController {
    private userService = new UserService();
    signIn = async (req: Request, res: Response) => {
        let {email, password} = req.body;
        let user = await this.userService.getUserByEmail(email);
        if (!user || !(await comparePassword(user?.password || "", password))) {
            throw Exception.get({
                feature: AppErrorCodes.auth,
                code: AuthErrors.InvalidCredentials,
            });
        }

        let token = signToken({params: {userId: user._id}, expires: "1d"});
        let refreshToken = signToken({
            params: {userId: user._id},
            key: process.env.JWTREFRESH!,
            expires: "30d",
        });
        sendSuccessResponse({
            res: res,
            accessToken: token,
            refreshToken: refreshToken,
            data: user,
        });
    };
    signUp = async (req: Request, res: Response) => {
        let input: AuthSignUpInput = req.body;
        if (input.confirmPassword != input.password) {
            throw Exception.get({
                feature: AppErrorCodes.auth,
                code: AuthErrors.PasswordMismatch,
            });
        }
        input.password = await hashPassword(input.password, 10);
        let user = await this.userService.createAccount({
            email: input.email,
            name: input.name,
            role: UserRole.user,
            password: input.password,
            phone: input.phone,
        });
        let token = signToken({params: {userId: user._id}, expires: "1d"});
        let refreshToken = signToken({
            params: {userId: user._id},
            key: process.env.JWTREFRESH!,
            expires: "30d",
        });
        sendSuccessResponse({
            res: res,
            accessToken: token,
            refreshToken: refreshToken,
            data: user,
        });
    };
    refreshToken = async (req: Request, res: Response) => {
        let {refreshToken} = req.body;
        let result = decodeToken(refreshToken, process.env.JWTREFRESH!);
        if (result.isExpired) {
            throw Exception.get({
                feature: AppErrorCodes.auth,
                code: AuthErrors.RefreshTokenExpired,
            });
        }
        if (result.isWrong) {
            throw Exception.get({
                feature: AppErrorCodes.auth,
                code: AuthErrors.RefreshTokenWrong,
            });
        }
        let userId = result.data.userId;

        let token = signToken({params: {userId: userId}, expires: "1d"});
        let refresh = signToken({
            params: {userId: userId},
            key: process.env.JWTREFRESH!,
            expires: "30d",
        });
        let user = await this.userService.getUserById(userId);
        sendSuccessResponse({
            res: res,
            accessToken: token,
            refreshToken: refresh,
            data: user,
        });
    };

    signInFirebase = async (req: Request, res: Response) => {
        let {token} = req.body;
        let decoded = await firebaseApp().auth().verifyIdToken(token)

        let user = await this.userService.getUserByFirebaseId(decoded.uid);
        if (!user) {
            let googleAccount = await firebaseApp().auth().getUser(decoded.uid);
            let email = googleAccount.email;
            user = await this.userService.createAccount({
                email: email!,
                firebaseId: decoded.uid,
                name: googleAccount.displayName || 'User',
                role: UserRole.user,
            });
        }
        let accessToken = signToken({params: {userId: user._id}, expires: "1d"});
        let refreshToken = signToken({
            params: {userId: user._id},
            key: process.env.JWTREFRESH!,
            expires: "30d",
        });
        sendSuccessResponse({
            res: res,
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: user,
        });
    }

}
