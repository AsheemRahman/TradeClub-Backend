import ICourseService from "../ICourseService";
import ICourseRepository from "../../../repository/user/ICourseRepository";


class CourseService implements ICourseService {
    private courseRepository: ICourseRepository;

    constructor(courseRepository: ICourseRepository) {
        this.courseRepository = courseRepository;
    };


}


export default CourseService;