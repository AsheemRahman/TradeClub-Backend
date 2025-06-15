import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import IUserService from "../../../service/user/IUserService";
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

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id, fullName, phoneNumber, newPassword, profilePicture } = req.body;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User ID is required', });
                return;
            }

            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND || 'User not found', });
                return;
            }

            if (!user.isActive) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: 'User is blocked by admin', });
                return;
            }

            const updateData: any = {};
            if (fullName) updateData.fullName = fullName;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (newPassword) updateData.password = newPassword;
            if (profilePicture) updateData.profilePicture = profilePicture;
            const updatedUser = await this.userService.updateUserById(id, updateData);
            res.status(STATUS_CODES.OK).json({ status: true, message: 'Profile updated successfully', userDetails: updatedUser, });
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Failed to update profile', });
        }
    }
}




export default ProfileController;