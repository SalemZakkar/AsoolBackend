import mongoose, {ClientSession} from "mongoose";

export async function executeWithTransaction(fn: (session: ClientSession) => Promise<void>): Promise<void> {
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        await fn(session);
        await session.commitTransaction();
        await session.endSession();
    } catch (e) {
        await session.abortTransaction();
        await session.endSession();
        throw e;
    }
}