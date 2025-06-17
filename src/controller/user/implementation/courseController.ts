import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import ICourseController from "../ICourseController";
import ICourseService from "../../../service/user/ICourseService";


class CourseController implements ICourseController {
    private courseService: ICourseService;

    constructor(courseService: ICourseService) {
        this.courseService = courseService;
    }


}




export default CourseController;