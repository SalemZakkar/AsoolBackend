import {Request, Response} from "express";
import {UserService} from "./service";
import {
    AppErrorCodes,
    Exception,
    executeWithTransaction,
    FileService,
    getFileByKey,
    getQueries,
    sendSuccessResponse,
} from "../../core";
import {UserUpdateFields} from "./interface";
import {OtpService} from "../otp/service";
import {OtpReason} from "../otp/interface";
import {UserErrors} from "./errors";
import {firebaseApp} from "../firebase";

export class UserController {
    private service = new UserService();
    private otpService = new OtpService();

    getMine = async (req: Request, res: Response) => {
        let userId = (req as any).userId;
        let user = await this.service.getUserById(userId);
        sendSuccessResponse({res: res, data: user});
    };
    sendEmailVerifyOtp = async (req: Request, res: Response) => {
        let user = await this.service.getUserById((req as any).userId);
        if (user?.isEmailVerified == true) {
            throw Exception.get({
                feature: AppErrorCodes.user,
                code: UserErrors.UserAlreadyVerified,
            });
        }
        let otp = await this.otpService.createOtp({
            user: (req as any).userId,
            reason: OtpReason.VerifyEmail,
        });
        sendSuccessResponse({
            res: res,
            sent: otp.sent,
            nextDate: otp.otp!.nextTime(),
            vid: otp.sent ? otp.otp._id : undefined,
        });
    };

    verifyEmail = async (req: Request, res: Response) => {
        let {vid, otp} = req.body;
        let userId = (req as any).userId;
        await executeWithTransaction(async (session) => {
            await this.otpService.getOtp({
                id: vid,
                otp: otp,
                reason: OtpReason.VerifyEmail,
            },);
            let user = await this.service.update(userId, {isEmailVerified: true}, session);
            await this.otpService.deleteOtp(userId, session);
            sendSuccessResponse({
                res: res,
                data: user,
            });
        });
    };

    forgetPassword = async (req: Request, res: Response) => {
        let {email} = req.body;
        let user = await this.service.getUserByEmail(email);
        if (!user) {
            throw Exception.get({
                feature: AppErrorCodes.user,
                code: UserErrors.UserNotFound,
            });
        }
        let otp = await this.otpService.createOtp({
            user: user._id,
            reason: OtpReason.ResetPassword,
        });
        sendSuccessResponse({
            res: res,
            sent: otp.sent,
            nextDate: otp.otp!.nextTime(),
            vid: otp.sent ? otp.otp._id : undefined,
        });
    };

    resetPassword = async (req: Request, res: Response) => {
        let {vid, otp, password} = req.body;
        let otpResult = await this.otpService.getOtp({
            id: vid,
            otp: otp,
            reason: OtpReason.ResetPassword,
        },);
        await executeWithTransaction(async (session) => {
            await this.service.setPassword(otpResult.user, password, session);
            await this.otpService.deleteOtp(otpResult.id, session);
            sendSuccessResponse({
                res: res,
            });
        });
    };

    changePassword = async (req: Request, res: Response) => {
        let {password} = req.body;
        let userId = (req as any).userId;
        await this.service.setPassword(userId, password);
        sendSuccessResponse({
            res: res,
        });
    };

    updateMine = async (req: Request, res: Response) => {
        let userId = (req as any).userId;
        let {name, phone} = req.body;
        let file = getFileByKey(req.files, "avatar");
        if (file.length == 0) {
            let user = await this.service.update(userId, {name: name, phone: phone});
            sendSuccessResponse({res: res, data: user});
            return;
        }
        let user = await this.service.getUserById(userId);
        let avatar = user?.avatar;
        await executeWithTransaction(async (session) => {
            let file = await (new FileService()).saveFile(getFileByKey(req.files, "avatar",).at(0), session,);
            let user = await this.service.update((req as any).userId, {
                avatar: file._id.toString(),
                name: name,
                phone: phone,
            }, session);
            if (avatar) {
                await (new FileService()).deleteFile(avatar || '', session);
            }
            await session.commitTransaction();
            sendSuccessResponse({res: res, data: user});
        });
    };

    deleteMinePhoto = async (req: Request, res: Response) => {
        let userId = (req as any).userId;
        let user = await this.service.getUserById(userId);
        let avatar = user?.avatar;
        if (!avatar) {
            sendSuccessResponse({res: res, data: user});
        }
        await executeWithTransaction(async (session) => {
            let user = await this.service.update(userId, {avatar: null}, session);
            await (new FileService()).deleteFile(avatar!, session);
            sendSuccessResponse({res: res, data: user});
        });
    }

    setGoogleAccount = async (req: Request, res: Response) => {
        let {token} = req.body;
        let decoded = await firebaseApp.auth().verifyIdToken(token)
        let userId = (req as any).userId;
        let user = await this.service.update(userId, {firebaseId: decoded.uid});
        sendSuccessResponse({res: res, data: user});
    }

    unlinkGoogleAccount = async (req: Request, res: Response) => {
        let userId = (req as any).userId;
        let user = await this.service.update(userId, {firebaseId: null});
        sendSuccessResponse({res: res, data: user});
    };

    changeUserEmail = async (req: Request, res: Response) => {
        await executeWithTransaction(async (session) => {
            let {email} = req.body;
            let userId = (req as any).userId;
            let user = await this.service.changeUserEmail(userId, email, session);
            await this.otpService.deleteUserOtp(userId, OtpReason.VerifyEmail, session);
            sendSuccessResponse({res: res, data: user});
        });
    }


    updateUser = async (req: Request, res: Response) => {
        let fields: UserUpdateFields = req.body;
        let files = getFileByKey(req.files, "avatar");
        let user = await this.service.getUserById(req.params!.id!);
        if (!user) {
            throw Exception.get({feature: AppErrorCodes.user, code: UserErrors.UserNotFound,},);
        }
        if (files.length == 0) {
            let user = await this.service.update(req.params!.id!, fields);
            sendSuccessResponse({res: res, data: user});
            return;
        }
        let avatar = user.avatar;
        await executeWithTransaction(async (session) => {
            let file = await (new FileService()).saveFile(files.at(0), session,);
            user = await this.service.update(req.params!.id!, {...fields, avatar: file._id.toString()}, session);
            if (avatar) {
                await (new FileService()).deleteFile(avatar, session);
            }
        });
        sendSuccessResponse({res: res, data: user});
    };

    getByCriteria = async (req: Request, res: Response) => {
        let query = getQueries(req.query);
        let result = await this.service.getUserByCriteria(query);
        sendSuccessResponse({res: res, ...result});
    };

    deleteUserPhoto = async (req: Request, res: Response) => {
        let user = await this.service.getUserById(req.params!.id!);
        if (!user) {
            throw Exception.get({feature: AppErrorCodes.user, code: UserErrors.UserNotFound,});
        }
        if (!user.avatar) {
            sendSuccessResponse({res: res, data: user});
            return;
        }
        await executeWithTransaction(async (session) => {
            let userNew = await this.service.update(req.params!.id!, {avatar: null}, session);
            await (new FileService()).deleteFile(user.avatar!, session);
            sendSuccessResponse({res: res, data: userNew});
        });
    }

    getUserById = async (req: Request, res: Response) => {
        let user = await this.service.getUserById(req.params!.id!);
        if (!user) {
            throw Exception.get({feature: AppErrorCodes.user, code: UserErrors.UserNotFound,});
        }
        sendSuccessResponse({res: res, data: user});
    };


}
