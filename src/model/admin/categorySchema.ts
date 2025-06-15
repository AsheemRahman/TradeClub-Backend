import { Document, Schema, model } from 'mongoose';


export interface ICategory extends Document {
    categoryName: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


const categorySchema = new Schema<ICategory>({
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


const Category = model<ICategory>('Category', categorySchema);

export default Category;