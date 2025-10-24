"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    categoryName: {
        type: String,
        required: true,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, });
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Category;
