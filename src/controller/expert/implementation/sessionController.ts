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


}




export default SessionController;