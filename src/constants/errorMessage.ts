export const ERROR_MESSAGES = {

    INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
    BAD_REQUEST: "The request could not be understood or was missing required parameters.",
    UNAUTHORIZED: "You are not authorized to access this resource.",
    FORBIDDEN: "You are not allowed to perform this action.",
    NOT_FOUND: "The requested resource could not be found.",
    INVALID_CREDENTIALS: "Invalid email or password",

    INVALID_INPUT: "The request contains invalid data.",
    MISSING_REQUIRED_FIELDS: "Required fields are missing.",

    EMAIL_ALREADY_EXIST: "Email is already in use.",
    EMAIL_NOT_FOUND: "Email is not registered.",
    ERROR_SENDING_OTP: "Failed to send the verification mail",

    USER_NOT_FOUND: "User is not found.",
    EXPERT_NOT_FOUND: "Expert is not found.",
    EXPERT_ID_MISSING: "Expert ID is missing in request.",

    USER_BLOCKED: "User Is blocked by admin",

    INVALID_TOKEN: "Invalid or expired token, please log in again.",
    TOKEN_NOT_FOUND: "Access token not found, please log in",
    
    REFRESH_TOKEN_MISSING: "Refresh token missing",

} as const;
