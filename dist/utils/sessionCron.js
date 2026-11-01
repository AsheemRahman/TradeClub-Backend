"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const sessionSchema_1 = require("../model/expert/sessionSchema"); // adjust path
// Utility function to merge bookedAt date + time string into full Date
const getSessionEndDateTime = (bookedAt, endTime) => {
    const sessionDate = new Date(bookedAt);
    const [hours, minutes] = endTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    return sessionDate;
};
const markMissedSessions = async () => {
    const now = new Date();
    try {
        const sessions = await sessionSchema_1.Session.find({
            status: 'upcoming',
            endTime: { $exists: true, $ne: '' }
        });
        for (const session of sessions) {
            const endDateTime = getSessionEndDateTime(session.bookedAt, session.endTime);
            // If the end time is before the current time, mark as missed
            if (endDateTime < now) {
                await sessionSchema_1.Session.updateOne({ _id: session._id }, { $set: { status: 'missed' } });
                console.log(`🔸 Marked session ${session._id} as missed`);
            }
        }
        console.log(`✅ [${new Date().toISOString()}] Daily check completed`);
    }
    catch (error) {
        console.error('❌ Error updating missed sessions:', error);
    }
};
//  Runs once per day at midnight India time
node_cron_1.default.schedule('0 0 * * *', markMissedSessions, { timezone: 'Asia/Kolkata' });
//# sourceMappingURL=sessionCron.js.map