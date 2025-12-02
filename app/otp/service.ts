import mongoose, {ClientSession, ObjectId} from "mongoose";
import {AppErrorCodes, Exception, generateNumericString} from "../../core";
import {OtpModel} from "../models/otp-model";
import {OtpErrors} from "./errors";
import {OtpReason, OtpResult} from "./interface";

export class OtpService {
    createOtp = async ({
                           user,
                           reason,
                       }: {
        user: string | mongoose.ObjectId;
        reason: OtpReason;
    }): Promise<OtpResult> => {
        let otp = await OtpModel.findOne({
            reason: reason,
            user: user,
        });

        if (!otp) {
            return {
                sent: true,
                otp: await OtpModel.insertOne({
                    attempts: 1,
                    otp: process.env.env == "live" ? "123456" : generateNumericString(6),
                    reason: reason,
                    user: user,
                }),
            };
        }
        if (!otp.canSend()) {
            return {
                sent: false,
                otp: otp,
            };
        }
        if (otp.attempts >= 5) {
            otp.attempts = 1;
        } else {
            otp.attempts++;
        }
        otp.createdAt = new Date();
        otp.otp = process.env.env == "live" ? "123456" : generateNumericString(6);
        await otp.save();
        return {
            sent: true,
            otp: otp,
        };
    };

    getOtp = async ({
                        id,
                        otp,
                        reason,
                    }: {
        id: string | mongoose.ObjectId;
        otp: string;
        reason: OtpReason;
    }) => {
        let res = await OtpModel.findOne({
            _id: id,
            otp: otp,
            reason: reason,
        });
        if (!res) {
            throw Exception.get({
                feature: AppErrorCodes.otp,
                code: OtpErrors.WrongOtp,
            });
        }
        if (res?.isExpired() == true) {
            throw Exception.get({
                feature: AppErrorCodes.otp,
                code: OtpErrors.OtpExpired,
            });
        }
        return res;
    };

    deleteOtp = async (
        id: string | mongoose.ObjectId,
        session?: ClientSession
    ) => {
        await OtpModel.findOneAndDelete(
            {_id: id},
            {session: session ? session : null}
        );
    };

    deleteUserOtp = async (
        userId: string | mongoose.ObjectId,
        reason: OtpReason,
        session?: ClientSession
    ) => {
        await OtpModel.findOneAndDelete(
            {user: userId, reason: reason},
            {session: session ? session : null}
        );
    };
}
