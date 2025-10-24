import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage"

import ISessionService from "../../../service/expert/ISessionService";
import ISessionController from "../ISessionController";
import { ISessionFilters } from "../../../types/IExpert";
import { asyncHandler } from "../../../utils/asyncHandler";


class SessionController implements ISessionController {
    private _sessionService: ISessionService;

    constructor(sessionService: ISessionService) {
        this._sessionService = sessionService;
    }

    getSlots = asyncHandler(async (req: Request, res: Response) => {
        const expertId = req.userId;
        if (!expertId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.EXPERT_ID_MISSING, });
            return;
        }
        const slots = await this._sessionService.getSlots(expertId);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Session slot Fetched Successfully", slots });
    });

    addSlot = asyncHandler(async (req: Request, res: Response) => {
        const sessionData = { ...req.body, expertId: req.userId };
        const newSession = await this._sessionService.addSlot(sessionData);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot created Successfully", newSession })
    });

    editSlot = asyncHandler(async (req: Request, res: Response) => {
        const { _id, ...sessionData } = req.body;
        const updatedSlot = await this._sessionService.editSlot(_id, sessionData);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot edited Successfully", updatedSlot })
    });

    deleteSlot = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const deleted = await this._sessionService.deleteSlot(id);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot deleted Successfully", deleted })
    });


    getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
        const expertId = req.userId;
        if (!expertId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.EXPERT_ID_MISSING });
            return
        }
        const stats = await this._sessionService.getDashboardStats(expertId);
        res.status(STATUS_CODES.OK).json({ status: true, message: 'fetch dashboard stats', stats });
    });

    getSessionAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const expertId = req.userId;
        if (!expertId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.EXPERT_ID_MISSING });
            return
        }
        const { period = '30d' } = req.query;
        const analytics = await this._sessionService.getSessionAnalytics(expertId, period as '7d' | '30d' | '90d');
        res.status(STATUS_CODES.OK).json({ status: true, message: 'fetch session analytics', analytics });
    });

    getSessions = asyncHandler(async (req: Request, res: Response) => {
        const expertId = req.userId;
        const { status, date, startDate, endDate, search } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        if (!expertId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.EXPERT_ID_MISSING });
            return;
        }
        const filters: ISessionFilters = {
            status: status as string,
            date: date as string,
            startDate: startDate as string,
            endDate: endDate as string,
            search: search as string,
        };
        const result = await this._sessionService.getSessions(expertId, page, limit, filters);
        res.status(STATUS_CODES.OK).json({ status: true, ...result });
    });

}

export default SessionController;