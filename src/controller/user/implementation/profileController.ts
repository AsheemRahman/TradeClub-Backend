import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import IUserService from "../../../service/user/IUserService";
import PasswordUtils from "../../../utils/passwordUtils";
import IProfileController from "../IProfileController";



class ProfileController implements IProfileController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = req.userId
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const userDetails = await this.userService.getUserById(id)
            console.log(userDetails)
            if (!userDetails) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            if (userDetails.isActive) {
                res.status(STATUS_CODES.OK).json({ status: true, message: "Data retrieved successfully", userDetails });
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