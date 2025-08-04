import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import ISessionService from "../../../service/expert/ISessionService";
import ISessionController from "../ISessionController";
import { ISessionFilters } from "../../../types/IExpert";


class SessionController implements ISessionController {
    private _sessionService: ISessionService;

    constructor(sessionService: ISessionService) {
        this._sessionService = sessionService;
    }

    async getSlots(req: Request, res: Response): Promise<void> {
        try {
            const expertId = req.userId;
            if (!expertId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Expert ID is missing in request.", });
                return;
            }
            const slots = await this._sessionService.getSlots(expertId);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Session slot Fetched Successfully", slots });
        } catch (error) {
            console.error("Failed to fetch Session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

    async addSlot(req: Request, res: Response): Promise<void> {
        try {
            const sessionData = { ...req.body, expertId: req.userId };
            const newSession = await this._sessionService.addSlot(sessionData);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot created Successfully", newSession })
        } catch (error) {
            console.error("Error adding session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

    async editSlot(req: Request, res: Response): Promise<void> {
        try {
            const { _id, ...sessionData } = req.body;
            const updatedSlot = await this._sessionService.editSlot(_id, sessionData);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot edited Successfully", updatedSlot })
        } catch (error) {
            console.error("Error adding session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to edited Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

    async deleteSlot(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this._sessionService.deleteSlot(id);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot deleted Successfully", deleted })
        } catch (error) {
            console.error("Error deleted session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to deleted Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }


    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const expertId = req.userId;
            if (!expertId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "Expert ID is missing in request." });
                return
            }
            const stats = await this._sessionService.getDashboardStats(expertId);
            res.status(STATUS_CODES.OK).json({ status: true, message: 'fetch dashboard stats', stats });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Failed to fetch dashboard stats' });
        }
    }

    async getSessionAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const expertId = req.userId;
            if (!expertId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "Expert ID is missing in request." });
                return
            }
            const { period = '30d' } = req.query;
            const analytics = await this._sessionService.getSessionAnalytics(expertId, period as '7d' | '30d' | '90d');
            res.status(STATUS_CODES.OK).json({ status: true, message: 'fetch session analytics', analytics });
        } catch (error) {
            console.error('Error fetching session analytics:', error);
            res.status(500).json({ message: 'Failed to fetch session analytics' });
        }
    }

    async getSessions(req: Request, res: Response): Promise<void> {
        try {
            const expertId = req.userId;
            const { status, date, startDate, endDate, search } = req.query;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            if (!expertId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Expert ID is missing in request.', });
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
        } catch (error) {
            console.error('Failed to fetch Session slot', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Failed to fetch Session slot', error: error instanceof Error ? error.message : String(error), });
        }
    }
}




export default SessionController;