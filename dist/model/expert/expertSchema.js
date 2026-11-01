"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expert = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const expertSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, 'First name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    isVerified: {
        type: String,
        enum: ["Approved", "Pending", "Declined"],
        default: "Pending",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    profilePicture: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    experience_level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
    },
    year_of_experience: {
        type: Number,
    },
    markets_Traded: {
        type: String,
        enum: ['Stock', 'Forex', 'Crypto', 'Commodities'],
    },
    trading_style: {
        type: String,
        enum: ['Scalping', 'Day Trading', 'Swing Trading', 'Position Trading'],
    },
    proof_of_experience: {
        type: String,
    },
    Introduction_video: {
        type: String,
    },
    Government_Id: {
        type: String,
    },
    selfie_Id: {
        type: String,
    },
    stripeAccountId: {
        type: String,
    },
}, { timestamps: true });
const Expert = mongoose_1.default.model("Expert", expertSchema);
exports.Expert = Expert;
//# sourceMappingURL=expertSchema.js.map