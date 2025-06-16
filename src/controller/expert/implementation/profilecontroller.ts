import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import IProfileService from "../../../service/expert/IProfileService";
import IProfileController from "../IProfilecontroller";


class ProfileController implements IProfileController {
    private profileService: IProfileService;

    constructor(profileService: IProfileService) {
        this.profileService = profileService;
    }

    async getExpertData(req: Request, res: Response): Promise<void> {
        try {
            const id = req.userId
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const expertDetails = await this.profileService.getExpertById(id)
            if (!expertDetails) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            if (expertDetails.isActive) {
                res.status(STATUS_CODES.OK).json({ status: true, message: "Data retrieved successfully", expertDetails });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "User Is blocked by admin" });
            }
        } catch (error) {
            console.error("Profile error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "get Profile failed" });
            return
        }
    }

}




export default ProfileController;