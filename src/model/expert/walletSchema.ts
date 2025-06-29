import mongoose, { Schema, Document, Types } from 'mongoose';


interface IExpertWallet extends Document {
    expertId: Types.ObjectId;
    balance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    lastTransactionAt?: Date;
    transactions: {
        orderId: string;
        amount: number;
        type: 'credit' | 'debit';
        transactionDate: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}


const TransactionSchema = new Schema({
    orderId: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
}, { _id: false });


const ExpertWalletSchema = new Schema<IExpertWallet>({
    expertId: {
        type: Schema.Types.ObjectId,
        ref: 'Expert',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    totalEarnings: {
        type: Number,
        required: true,
        default: 0
    },
    totalWithdrawn: {
        type: Number,
        required: true,
        default: 0
    },
    lastTransactionAt: {
        type: Date
    },
    transactions: {
        type: [TransactionSchema],
        default: []
    }
}, { timestamps: true });


const ExpertWallet = mongoose.model<IExpertWallet>('ExpertWallet', ExpertWalletSchema);

export { ExpertWallet, IExpertWallet };