import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import ISessionService from "../../../service/expert/ISessionService";
import ISessionController from "../ISessionController";


class SessionController implements ISessionController {
    private sessionService: ISessionService;

    constructor(sessionService: ISessionService) {
        this.sessionService = sessionService;
    }

    async getSessions(req: Request, res: Response): Promise<void> {
        try {
            const expertId = req.userId;
            if (!expertId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Expert ID is missing in request.", });
                return;
            }
            const slots = await this.sessionService.getSessions(expertId);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Session slot Fetched Successfully", slots });
        } catch (error) {
            console.error("Failed to fetch Session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

    async addSession(req: Request, res: Response): Promise<void> {
        try {
            const sessionData = { ...req.body, expertId: req.userId };
            console.log("sample", sessionData)
            const newSession = await this.sessionService.addSession(sessionData);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot created Successfully", newSession })
        } catch (error) {
            console.error("Error adding session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

    async editSession(req: Request, res: Response): Promise<void> {
        try {
            const { _id, ...sessionData } = req.body;
            const updatedSlot = await this.sessionService.editSession(_id, sessionData);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot edited Successfully", updatedSlot })
        } catch (error) {
            console.error("Error adding session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to edited Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

    async deleteSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.sessionService.deleteSession(id);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session slot deleted Successfully", deleted })
        } catch (error) {
            console.error("Error deleted session slot", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to deleted Session slot", error: error instanceof Error ? error.message : String(error), });
        }
    }

}




export default SessionController;